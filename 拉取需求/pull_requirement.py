import json
import os
import getpass
import sys
import re
import html as html_mod
from urllib.parse import quote

import cv2
import numpy as np
import requests
from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding='utf-8')

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
CONFIG_FILE = os.path.join(SCRIPT_DIR, "requirement-config.json")

GATEWAY = "https://open-gateway.going-link.com"
LOGIN_URL = GATEWAY + "/oauth/choerodon/login"


def load_config():
    if os.path.exists(CONFIG_FILE):
        try:
            with open(CONFIG_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception:
            pass
    return {}


def save_config(cfg):
    with open(CONFIG_FILE, 'w', encoding='utf-8') as f:
        json.dump(cfg, f, ensure_ascii=False, indent=2)


def login(username, password):
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto(LOGIN_URL, wait_until="domcontentloaded", timeout=60000)
        page.wait_for_timeout(5000)
        page.fill("#usernameInput", username)
        page.fill("#pswinput", password)
        page.wait_for_timeout(1000)
        page.evaluate("document.querySelector('#login-button').click()")
        page.wait_for_timeout(12000)
        token = page.evaluate("localStorage.getItem('accessToken')")
        browser.close()
        return token


def token_valid(token, project_id):
    try:
        r = requests.post(
            f"{GATEWAY}/agile/v2/projects/{project_id}/issues/work_list?page=0&size=1",
            headers={"Authorization": "bearer " + token, "Content-Type": "application/json"},
            json={}, timeout=15)
        return r.status_code == 200
    except Exception:
        return False


def pull_issue_list(token, project_id):
    issues = []
    page = 0
    size = 100
    while True:
        r = requests.post(
            f"{GATEWAY}/agile/v2/projects/{project_id}/issues/work_list?page={page}&size={size}",
            headers={"Authorization": "bearer " + token, "Content-Type": "application/json"},
            json={}, timeout=30)
        if r.status_code != 200:
            break
        data = r.json()
        content = data.get("content", [])
        issues.extend(content)
        total_pages = data.get("totalPages", 0)
        if total_pages <= page + 1:
            break
        page += 1
    return issues


def pull_issue_detail(token, project_id, issue_id):
    eid = quote(issue_id, safe='')
    r = requests.get(
        f"{GATEWAY}/agile/v1/projects/{project_id}/issues/{eid}?organizationId=1",
        headers={"Authorization": "bearer " + token}, timeout=30)
    if r.status_code == 200:
        return r.json()
    return None


def html_to_text(desc):
    if not desc:
        return ""
    text = re.sub(r'<br\s*/?>', '\n', desc)
    text = re.sub(r'</p>', '\n', text)
    text = re.sub(r'<[^>]+>', '', text)
    text = html_mod.unescape(text)
    return text.strip()


def extract_images(desc):
    return re.findall(r'<img[^>]*src="([^"]+)"', desc or "")


_ocr_engine = None


def get_ocr_engine():
    global _ocr_engine
    if _ocr_engine is None:
        from rapidocr_onnxruntime import RapidOCR
        _ocr_engine = RapidOCR()
    return _ocr_engine


def ocr_image(url):
    try:
        r = requests.get(url, timeout=60)
        img = cv2.imdecode(np.frombuffer(r.content, np.uint8), cv2.IMREAD_COLOR)
        result, _ = get_ocr_engine()(img)
        if result:
            return [text for _, text, _ in result]
    except Exception:
        pass
    return []


def print_list(issues):
    print(f"共 {len(issues)} 条需求\n")
    for iss in issues:
        status = iss.get("statusVO", {}).get("name") if isinstance(iss.get("statusVO"), dict) else ""
        print(f"{iss.get('issueNum')}\t{iss.get('typeCode')}\t{status}\t{iss.get('summary')}")


def print_detail(d):
    print(f"需求编号: {d.get('issueNum')}")
    print(f"标题: {d.get('summary')}")
    print(f"类型: {d.get('issueTypeVO', {}).get('name') if isinstance(d.get('issueTypeVO'), dict) else d.get('typeCode')}")
    print(f"状态: {d.get('statusVO', {}).get('name') if isinstance(d.get('statusVO'), dict) else ''}")
    print(f"优先级: {d.get('priorityVO', {}).get('name') if isinstance(d.get('priorityVO'), dict) else ''}")
    print(f"报告人: {d.get('reporterRealName') or d.get('reporterName')}")
    print(f"负责人: {d.get('assigneeRealName') or d.get('assigneeName')}")
    print(f"创建时间: {d.get('creationDate')}")
    print(f"最后更新: {d.get('lastUpdateDate')}")
    desc = d.get("description") or ""
    print(f"\n=== 需求描述 ===\n{html_to_text(desc)}")

    images = extract_images(desc)
    if images:
        print(f"\n=== 截图 OCR 识别 ({len(images)} 张) ===")
        for i, url in enumerate(images, 1):
            print(f"\n【图 {i}】{url}")
            for t in ocr_image(url):
                print(f"  {t}")

    comments = d.get("issueCommentVOList") or []
    if comments:
        print(f"\n=== 评论 ({len(comments)} 条) ===")
        for c in comments:
            print(f"  [{c.get('creationDate')}] {c.get('userName')}: {html_to_text(c.get('commentContent'))}")

    subs = d.get("subIssueVOList") or []
    if subs:
        print(f"\n=== 子任务 ({len(subs)} 个) ===")
        for s in subs:
            print(f"  {s.get('issueNum')} {s.get('summary')}")


def main():
    cfg = load_config()

    # 账号密码
    username = cfg.get("username")
    password = cfg.get("password")
    if not username or not password:
        print("首次使用，请输入需求平台账号密码（将保存到本地配置）", file=sys.stderr)
        username = input("账号: ").strip()
        password = getpass.getpass("密码: ")
        if not username or not password:
            print("账号或密码不能为空", file=sys.stderr)
            return
        cfg["username"] = username
        cfg["password"] = password
        save_config(cfg)

    # 项目 ID
    project_id = cfg.get("project_id")
    if not project_id:
        project_id = input("项目 ID: ").strip()
        cfg["project_id"] = project_id
        save_config(cfg)

    # token
    token = cfg.get("token")
    if not token or not token_valid(token, project_id):
        print("正在登录...", file=sys.stderr)
        token = login(username, password)
        if not token:
            print("登录失败", file=sys.stderr)
            return
        cfg["token"] = token
        save_config(cfg)

    # 拉取：无参数拉列表，有参数拉详情
    target_num = sys.argv[1] if len(sys.argv) > 1 else None

    if target_num:
        # 先找 issueId
        issues = pull_issue_list(token, project_id)
        issue_id = None
        for iss in issues:
            if iss.get("issueNum") == target_num:
                issue_id = iss.get("issueId")
                break
        if not issue_id:
            print(f"未找到需求 {target_num}", file=sys.stderr)
            return
        detail = pull_issue_detail(token, project_id, issue_id)
        if detail:
            print_detail(detail)
        else:
            print(f"拉取详情失败 {target_num}", file=sys.stderr)
    else:
        issues = pull_issue_list(token, project_id)
        print_list(issues)


if __name__ == '__main__':
    main()
