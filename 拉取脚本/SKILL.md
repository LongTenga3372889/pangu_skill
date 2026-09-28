---
name: sync-local-scripts
description: 从 dev 数据库同步 Marmot 脚本到本地。触发词：同步、同步脚本、更新脚本、拉取脚本、sync scripts。
---

# 本地脚本库同步

将 dev 数据库中的 Marmot 脚本同步到**当前项目**的 `js/marmot/` 目录（不存在时自动创建）。

## 输出位置

| 项 | 值 |
|----|-----|
| 默认目录 | `<项目根>/js/marmot/` |
| 项目根判定 | 从当前工作目录向上找第一个含 `.git` 的目录；找不到则回退为当前工作目录 |
| 覆盖方式 | 环境变量 `PANGU_JS_DIR`（绝对路径）|

同步后的目录结构：

```
<项目根>/js/marmot/
├── 埋点脚本/<租户名>(<租户号>)/<脚本编码>.js
└── 独立脚本/<租户名>(<租户号>)/<脚本编码>.js
```

> **脚本启动时会打印实际解析出的输出目录**，执行前请先核对，避免写错项目。

## 初始化（首次使用）

初始化入口在**项目根目录**（不放在本 skill 下，便于后续扩展其他初始化项）：

```bash
# 在目标项目根目录下执行
node init.js sync-local-scripts    # 只初始化本项
node init.js                       # 运行全部初始化项
```

本项依次完成六步：

| # | 步骤 | 说明 |
|---|------|------|
| 1 | 检查 Node 版本 | 建议 >= 18 |
| 2 | 检查 / 安装依赖 | 缺 `mysql2` 时自动执行 `npm install` |
| 3 | 生成数据库配置 | 交互式输入，**密码不回显**；已存在则跳过 |
| 4 | 创建输出目录 | `<项目根>/js/marmot/{埋点脚本,独立脚本}` |
| 5 | 连通性体检 | 实测连接 + 读 `hpfm_tenant` + 两张脚本表计数 |
| 6 | 迁移同步状态 | 仅在指定 `--migrate-from` 时执行 |

常用选项：

```bash
node init.js --list                                        # 列出所有初始化项
node init.js sync-local-scripts --check                    # 只体检，不写任何文件
node init.js sync-local-scripts --force                    # 重填 db-config.json
node init.js sync-local-scripts --migrate-from "D:\旧目录"  # 迁移旧 .sync_state.json
```

> 从 `D:\work\pangu-js` 这类旧位置迁过来时，**务必带 `--migrate-from`**；否则新目录状态为空，下次同步会全量重拉几万条脚本。

## 数据库配置

> **凭据不写在本文件、也不写在脚本源码里。** 以下两种方式任选其一。

**方式一：本地配置文件（推荐）**

复制 `db-config.example.json` 为 `db-config.json`，填入真实连接信息：

```json
{
  "host": "数据库地址",
  "port": 3306,
  "user": "用户名",
  "password": "密码",
  "database": "库名"
}
```

`db-config.json` 已在 `.gitignore` 中，**禁止提交**。

**方式二：环境变量**（优先级高于配置文件）

| 环境变量 | 对应字段 |
|---------|---------|
| `PANGU_DB_HOST` | host |
| `PANGU_DB_PORT` | port（默认 3306）|
| `PANGU_DB_USER` | user |
| `PANGU_DB_PASSWORD` | password |
| `PANGU_DB_NAME` | database |

缺少必填项时脚本会**直接报错退出**，不会静默连到错误的库。

租户名称来源：`hpfm_tenant` 表。

## 脚本表

| 类型 | 表 | 内容字段 | 编码字段 | 租户字段 | 本地目录 |
|------|-----|---------|---------|---------|---------|
| 埋点脚本 | `spfm_rel_table_record WHERE table_code='sada_buried_point'` | `longValue1` | `value1` | `value3` | `js/marmot/埋点脚本/` |
| 独立脚本 | `spfm_rel_table_record WHERE table_code='marmot_script_library'` | `longValue5` | `value3` | `value2` | `js/marmot/独立脚本/` |

## 同步命令

```bash
# 在目标项目根目录下执行
node 拉取脚本/sync_scripts.js           # 日常增量
node 拉取脚本/sync_scripts.js --force   # 强制全量覆盖

# 或在技能目录下用 npm 脚本
cd 拉取脚本 && npm run sync             # 等价于上面的增量
cd 拉取脚本 && npm run sync:force       # 等价于上面的全量
```

> 路径相对**仓库根目录**；**输出位置取决于执行时的工作目录**，必须在目标项目根目录下执行。
> 首次使用请先跑「初始化」，它会装好依赖并生成配置。

## 同步逻辑

- 默认增量，基于 `.sync_state.json` 中 `_meta.lastSyncTime` 只查询新变更
- 版本比较：`object_version_number` 更高的才写盘
- 每月/季度可跑一次 `--force` 确保一致性

## 同步状态

每个脚本目录下有 `.sync_state.json`：
- `_meta.lastSyncTime` — 上次同步时间
- `{tenantNum}_{scriptCode}` — 每条记录的 `{ ver, path }`

> 状态文件**跟随输出目录**：换项目或换目录后会从头全量同步一次。
