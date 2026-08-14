# 拉取需求技能

从需求平台（Choerodon Agile）拉取客户需求（issue），供需求分析使用。

## 触发方式

用户需要拉取需求、获取 issue 列表、同步客户诉求时使用。

## 用法

```
# 拉取需求列表
python pull_requirement.py

# 拉取指定需求完整详情（含描述、评论、子任务）
python pull_requirement.py <issueNum>
```

## 工作机制

1. **账号密码**：首次运行询问账号密码，保存到 `requirement-config.json`，后续复用
2. **登录**：账号密码通过 Playwright 自动化登录，获取 `access_token`
3. **Token 缓存**：token 有效期约 24 小时，缓存在配置中，过期自动重新登录
4. **拉取**：用 token 直接调 API 拉取 issue 列表或详情
5. **输出**：打印到标准输出，**不落盘**（供 AI 直接读取）

## 配置

`requirement-config.json`：

```json
{
  "username": "账号",
  "password": "密码",
  "token": "缓存的 access_token",
  "project_id": "项目 ID"
}
```

## 输出格式

打印到标准输出，列表模式每条需求：

```
issueNum	typeCode	status	summary
```

详情模式包含：编号、标题、类型、状态、优先级、报告人、负责人、时间、需求描述（description）、评论、子任务。

## 约束红线

- `requirement-config.json` 含明文密码，**禁止提交到 git**
- 拉取的需求数据供「需求分析」阶段使用，需结合五阶段流程处理
