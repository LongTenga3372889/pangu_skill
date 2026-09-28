# 脚本帮助文档 · 文档清单

> **MarmotScript（盘古脚本引擎）帮助文档全集**
> 共 **127 篇 Markdown**（126 篇 MarmotScript 文档 + 1 篇附录）+ **76 张配图**（`../images/`）
>
> 本文件是**本目录的索引与导航**。
> 引擎源码工程的模块 README 清单（`src/main/java/...`）是另一回事，见 `附录-引擎源码README清单.md`。

---

## 一、怎么读

| 你的目的 | 从这里开始 |
|---|---|
| 第一次接触，搞懂这是什么 | `0 Abstract/` → `1 快速入门/` |
| **要开始写脚本** | **`2 MarmotScript/2.14 编码经验/2.14.0 编码经验总览.md`** ← 强烈建议先读 |
| 查某个 `@M` 插件怎么用 | `2 MarmotScript/2.8 @M插件/`（64 个插件逐个文档） |
| 查某个三方 NPM 包 | `2 MarmotScript/2.9 NPM插件/` |
| 搞清资源/超时/并发限制 | `2 MarmotScript/2.4 整体性限制.md` |
| 排查线上问题 | `FAQ.md` → `2 MarmotScript/2.5 异常处理&错误通知.md` |
| 用配置表（Rel-Table） | `3 Rel-Table/` |
| 用 MarmotHub | `4 MarmotHub/` |
| 了解版本变更 | `Release Notes.md` |

> **查 API 用 2.8，查写法用 2.14** —— 两者互补，不重复。

---

## 二、板块总览

| 板块 | 篇数 | 说明 |
|---|---:|---|
| `0 Abstract` | 2 | 概念总览：Marmot 工作台、埋点脚本管理 |
| `1 快速入门` | 2 | 生态范围、MarmotScript 简介 |
| `2 MarmotScript` | **101** | 语言与运行时、@M 插件、NPM 插件、旧时代插件、编码经验库 |
| `3 Rel-Table` | 9 | 配置表：权限、历史、数据操作、动作、回调、前端组件、菜单 |
| `4 MarmotHub` | 7 | 数据导入、文件下载、API、API 挂载、RTF 填充、调度、topic 队列 |
| `5 其他工作台功能` | 1 | OutBound 白名单 |
| `6 相关工具` | 1 | Marmot WebHook |
| 根目录 | 4 | `FAQ.md`、`Release Notes.md`、本文件、附录 |
| **合计** | **127** | |

---

## 三、详细清单

### 0 Abstract（2 篇）

| 文档 | 内容 |
|---|---|
| `0.1 Marmot工作台.md` | SRM 内置开发平台，服务于定制化开发与外部集成 |
| `0.2 埋点脚本管理.md` | 埋点/挂载点概念，埋点脚本的编辑与启用 |

### 1 快速入门（2 篇）

| 文档 | 内容 |
|---|---|
| `1.1 Marmot生态.md` | 生态范围：MarmotScript / 埋点脚本 / 独立脚本 / 配置表 / Hub / 脚本日志 / 案例库 / CodeBlock / QueryBlock / OutBound / 常量 / WebHook |
| `1.2 MarmotScript简介.md` | 语言定位与基本说明 |

### 2 MarmotScript（101 篇）

#### 2.x 语言与运行时（11 篇）

| 文档 | 内容 |
|---|---|
| `2.0 关于为什么是JavaScript.md` | 语言选型说明 |
| `2.1 CommonJS & 组件体系.md` | require 机制与组件体系 |
| `2.2 关于JSON.md` | JSON 处理（含大整数精度问题） |
| `2.3 ECMAScript Enhancement.md` | ES 增强：数组 distinct / collectors 等 |
| **`2.4 整体性限制.md`** | **资源沙盒限额、执行并发、脚本资源级别** ← 必读 |
| `2.5 异常处理&错误通知.md` | SimpleException / BusinessException 与 WebHook 通知规则 |
| `2.6 异步.md` | 无异步回调机制说明 |
| `2.7 Debugger.md` | 在线调试（`//DEBUG-登录名`）⚠️ 含 1 张失效配图 |
| `2.11 开发事件监听(Developing Changelog).md` | 开发事件监听 |
| `2.12 封装的业务插件.md` | 业务级封装插件 |
| `2.13 跨租户CodeBlock调用.md` | `_code_block.execute("租户:代码块")` |

#### 2.8 @M 插件（64 篇）

引入方式：`require("@M/v1/<名称>")`。文档编号 `2.8.0` ~ `2.8.63`。

| 编号 | 插件 | 编号 | 插件 |
|---|---|---|---|
| 2.8.0 | `context` | 2.8.1 | `object` |
| 2.8.2 | `attachment` | 2.8.3 | `messenger` |
| 2.8.4 | `hub` | 2.8.5 | `xlsx-support` |
| 2.8.6 | `sftp` | 2.8.7 | `user` |
| 2.8.8 | `business-rule` | 2.8.9 | `customize` |
| 2.8.10 | `sso` | 2.8.11 | `key-format` |
| 2.8.12 | `supplier-kpi-tool` | 2.8.13 | `workflow` |
| 2.8.14 | `region` | 2.8.15 | `serial-generator` |
| 2.8.16 | `constants` | 2.8.17 | `logger` |
| 2.8.18 | `language` | 2.8.19 | `object-global` |
| 2.8.20 | `cache` | 2.8.21 | `query-block` |
| 2.8.22 | `code-block` | 2.8.23 | `feign` |
| 2.8.24 | `employee` | 2.8.25 | `queue` |
| 2.8.26 | `doc-authority` | 2.8.27 | `pdf-helper` |
| 2.8.28 | `options` | 2.8.29 | `email` |
| 2.8.30 | `external-database-querier` | 2.8.31 | `localization` |
| 2.8.32 | `link` | 2.8.33 | `srm-crypt` |
| 2.8.34 | `text` | 2.8.35 | `image` |
| 2.8.36 | `uom-tool` | 2.8.37 | `alipay-client` |
| 2.8.38 | `crypt` | 2.8.39 | `net` |
| 2.8.40 | `ding-tool` | 2.8.41 | `csv-helper` |
| 2.8.42 | `simplified-conversion` | 2.8.43 | `ext-itf-convert` |
| 2.8.44 | `jneon-client` | 2.8.45 | `request-utils` |
| 2.8.46 | `seal-generator` | 2.8.47 | `amount-calculation` |
| 2.8.48 | `sql-tool` | 2.8.49 | `math` |
| 2.8.50 | `axios` | 2.8.51 | `feign-client2` |
| 2.8.52 | `exception` | 2.8.53 | `ftp` |
| 2.8.54 | `safe-login` | 2.8.55 | `auto-fill` |
| 2.8.56 | `console` | 2.8.57 | `http` |
| 2.8.58 | `mdm` | 2.8.59 | `safe-json` |
| 2.8.60 | `signature` | 2.8.61 | `small` |
| 2.8.62 | `system` | 2.8.63 | `amkt` |

> ⚠️ `2.8.50 axios` 与 `2.9.0 目录` 中列出的三方包 `axios` 同名，注意区分（前者是 `@M/v1/axios` 插件，后者是原样引入的 NPM 包）。

#### 2.9 NPM 插件（11 篇）

| 文档 | 内容 |
|---|---|
| `2.9.0 目录.md` | 三方包全集清单（26 个，⚠️ 与实际有详情文档的 10 个不一致，且漏列 `buffer`、`JSSheet`） |
| `2.9.1 moment.md` | 重型日期库（含时区扩展） |
| `2.9.2 buffer.md` | Buffer 支持 |
| `2.9.3 underscore.md` | 常用工具包 |
| `2.9.4 xml2js.md` | XML ↔ JS 对象 |
| `2.9.5 JSSheet-Excel快速开发.md` | Excel 快速开发 |
| `2.9.6 keypair.md` | RSA 秘钥生成 |
| `2.9.7 querystringify.md` | qs 代替品 |
| `2.9.8 string.md` | 字符串包 |
| `2.9.9 JSSheet-Excel进阶开发.md` | Excel 进阶开发 |
| `2.9.10 pinyin.md` | 中文拼音转换 |

#### 2.10 旧时代的插件（3 篇）

| 文档 | 内容 |
|---|---|
| `2.10.1 ElMath.md` | 高精度运算（旧） |
| `2.10.2 旧文档参考.md` | 历史文档汇总（13.2 KB） |
| `2.10.3 JWT工具.md` | JWT 工具 |

#### 2.14 编码经验（12 篇）—— **本套文档价值最高的部分**

来源：**5284 个一年内生产脚本**的模式提取与陷阱归纳。写脚本前的质量基线。

| 文档 | 内容 |
|---|---|
| `2.14.0 编码经验总览.md` | 知识域入口 + 导航 + Bot 写脚本流程 |
| **`2.14.1 编码模式库.md`** | **22 类模式（P01–P22）**，40.0 KB |
| **`2.14.2 编码陷阱库.md`** | **25 条陷阱（T01–T25，P0/P1/P2 分级）**，36.8 KB |
| `2.14.3 模板库.md` | 8 个可复用模板索引 |
| `2.14.4 模板 01 · 外部系统导出适配器.md` | 模板明细 |
| `2.14.5 模板 02 · 字段覆盖数据转换.md` | 模板明细 |
| `2.14.6 模板 03 · 事件钩子.md` | 模板明细 |
| `2.14.7 模板 04 · 工作流触发.md` | 模板明细 |
| `2.14.8 模板 05 · 提交前校验.md` | 模板明细 |
| `2.14.9 模板 06 · 附件上传下载.md` | 模板明细 |
| `2.14.10 模板 07 · 编码规则生成.md` | 模板明细 |
| `2.14.11 模板 08 · 批量插入数据转换.md` | 模板明细 |

### 3 Rel-Table（9 篇）

| 文档 | 内容 |
|---|---|
| `3.1 关于Rel-Table.md` | 配置表能力概览 |
| `3.2 权限.md` | 权限控制 |
| `3.3 历史记录.md` | 变更历史 |
| `3.4 数据操作.md` | 增删查改 |
| `3.5 动作.md` | 动作脚本 |
| `3.6 供应商隔离.md` | 供应商数据隔离 |
| `3.7 回调.md` | 回调机制 |
| `3.8 前端组件.md` | 可配置前端组件 |
| `3.9 生成菜单.md` | 菜单生成 |

### 4 MarmotHub（7 篇）

| 文档 | 内容 |
|---|---|
| `4.1 功能数据导入.md` | 功能数据导入 |
| `4.2 通用文件下载按钮.md` | 文件下载按钮 |
| `4.3 API.md` | Hub API |
| `4.4 功能API挂载.md` | 功能 API 挂载 |
| `4.5 RTF填充.md` | RTF 模板填充 |
| `4.6 调度.md` | 调度任务 |
| `4.7 topic队列消费.md` | topic 队列消费 |

### 5 其他工作台功能（1 篇）

| 文档 | 内容 |
|---|---|
| `5.1 OutBound 白名单.md` | 租户级外部调用白名单 |

### 6 相关工具（1 篇）

| 文档 | 内容 |
|---|---|
| `6.1 Marmot WebHook 使用.md` | 标准 WebHook 逻辑 |

### 根目录（4 篇）

| 文档 | 内容 |
|---|---|
| `FAQ.md` | 常见问题（13 类，含事务、锁等待、超资源定位等） |
| `Release Notes.md` | 版本变更记录（最新条目 **1.52 / 2024.11.02**） |
| `README_INVENTORY.md` | 本文件 |
| `附录-引擎源码README清单.md` | 引擎源码工程（`src/main/java/...`）的模块 README 清单，供引擎维护者参考；**不是本目录的索引** |

---

## 四、已知问题

维护本文档集时留意以下几点：

| # | 问题 | 影响面 |
|---|---|---|
| 1 | **文档间零内部链接** —— 所有交叉引用都是纯文本，无法点击跳转 | 126 篇 MarmotScript 文档 |
| 2 | `2.7 Debugger.md` 引用配图 `企业微信截图_16541537206317_oKxBYvDm82.png` **文件不存在** | 1 处 |
| 3 | `2.9.0 目录.md` 列 26 个包，只有 10 个有详情文档；漏列 `buffer`、`JSSheet`；第 30 行 `> sha.js` 缺行尾换行导致与下一行粘连 | 1 篇 |
| 4 | **标题结构异常**：6 篇无 H1（`2.0`、`2.10.2`、`2.9.4`、`3.7`、`4.6`、`4.7`），8 篇多 H1（`1.1`、`2.8.3`、`2.8.6`、`2.8.16`、`2.8.19`、`4.3`、`4.4`、`4.5`） | 14 篇 |
| 5 | **无 YAML frontmatter** | 126 篇 MarmotScript 文档 |
| 6 | **版本时效不齐**：核心语言/插件文档对应 Release 1.52（2024.11），而 `2.14 编码经验库` 明显更新 | 跨板块 |

---

## 五、目录结构

```
脚本帮助文档/
└── _helper/                        ← 沿用引擎源码工程的目录名
    ├── images/                     76 张配图
    └── md/                         126 篇文档（本目录）
        ├── 0 Abstract/
        ├── 1 快速入门/
        ├── 2 MarmotScript/
        │   ├── 2.8 @M插件/         64 篇
        │   ├── 2.9 NPM插件/        11 篇
        │   ├── 2.10 旧时代的插件/   3 篇
        │   └── 2.14 编码经验/      12 篇
        ├── 3 Rel-Table/
        ├── 4 MarmotHub/
        ├── 5 其他工作台功能/
        ├── 6 相关工具/
        ├── FAQ.md
        ├── Release Notes.md
        ├── README_INVENTORY.md     本文件
        └── 附录-引擎源码README清单.md
```

> `_helper` 是原工程 `src/main/resources/_helper/` 的目录名。对本独立文档集而言这层嵌套并非必需，但保留可便于与源码工程对照。
