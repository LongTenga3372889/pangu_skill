# Release Notes

***

## 1.52(2024.11.02)

### 优化和修正
* require("@M/v1/doc-authority") 支持按当前语言查询用户单据权限

***

## 1.51(2024.09.27)

### 功能
* 功能数据导入: 批量验证脚本入参增加batch参数

### MarmotScript
* moment-timezone: 扩展功能并完善文档，详见文档2.9.1[时区的扩展]
* require("@M/v1/ext-itf-convert") 支持引入对象变量、取值处理的常用函数功能以及新增转换全局变量方法，详见文档2.8.43

### 优化和修正
* Rel-Table: 配置表数据CSV的导入导出，脚本默认高资源，如因脚本超资源被kill抛出明显异常，并且需将数据分批处理
* Rel-Table: 配置表动作脚本执行外层加事务，避免内层报错抛不到最外层
* 内置脚本执行: eval执行脚本中间添加\n用于分割脚本与执行语句，避免因最后一行注释导致执行语句失效问题

***

## 1.50(2024.08.24)

### MarmotScript
* BIZ.CompanyHelper 新增查询字段registeredCapital和buildDate

### 优化和修正
* Rel-Table: 配置表EXCEL导入，纯数字除double的转换外保留转换后的所有整数及小数部分
* 安全性-支付场景:
  * 脚本内禁止QueryBlock、外部数据库查询器、@M/v1/object和STD.Database查询以sdat_bank_payment_为前缀的三张表
  * 脚本内禁止feign调用sdat/v1/*/bank-pmt/**

***

## 1.49(2024.07.20)

### MarmotScript
* 新增 require("@M/v1/ext-itf-convert") 外部接口报文转换插件，详见文档2.8.43
* 新增 require("@M/v1/axios") 同步的axios插件
* 新增 require('@M/v1/code-block/tqly') 增加天齐的des加密工具

### 优化和修正
* 稳定性: 文件操作限制单个最大200MB

***

## 1.48(2024.06.15)

### 优化和修正
* @M/v1/queue: mq消息发送失败支持企微告警
* @M/v1/query-block: 解决包含longtext类型字段CONCAT出来的数据base64加密

***

## 1.47(2024.05.11)

### 功能
* Rel-Table: 新配置表数据导入导出换成csv

### MarmotScript
* require("@M/v1/csv-helper") 支持解析csv文件，详见文档2.8.41

### 优化和修正
* moment: 获取当前时间方式调整以及修正format年份和小时不正确的问题
  * 获取当前时间采用Java的时间
  * 版本从2.29.1升级到2.30.1
  * format格式化参数强制替换yyyy为YYYY
  * utcOffset每次都重设默认
* @M/v1/attachment: bytes转换成MultipartFile再上传
* Rel-Table: 配置表及其数据的增删改查操作添加srm前缀

***

## 1.46(2024.03.30)

### MarmotScript
* 新增 OTHER.TENCENT_CLOUD_TOOL.postObject 腾讯云的表单上传，详见文档2.10.2

***

## 1.45(2024.02.24)

### MarmotScript
* require("@M/v1/messenger") sendMessage方法支持saga消息，详见文档2.8.3

***

## 1.44(2024.01.13)

### MarmotScript
* require("@M/v1/pdf-helper") 新增获取PDF文件的页数，详见文档2.8.27


***

## 1.43(2023.12.09)

### 功能
* 

### MarmotScript
* STD.Crypt.SRM.dataFieldDecrypt 忽略异常，返回原值
* 新增 require("@M/v1/simplified-conversion") 中文简体繁体转换工具-区分大陆中文和台湾中文，详见文档2.8.42
* 新增 require("@M/v1/feign-client2") 替换feign-client抛出异常，详见文档2.8.23
* STD.LovHelper.getIdpLov/getIdpLovMeaning 新增ignoreEnabledOrNot参数，支持忽略启用禁用

### 优化和修正
* 

***


## 1.42(2023.11.04)

### 功能
* Rel-Table: 配置表菜单新增数据行【编辑】【删除】按钮显隐配置项

### MarmotScript
* require("@M/v1/crypt") 支持SM4加解密，详见文档2.8.38
* 新增 require("@M/v1/csv-helper") csv文件插件，详见文档2.8.41
* require("@M/v1/region") query方法增加regionId的返回
* require("@M/v1/amount-calculation") 新增计算双单位的方法

### 优化和修正
* 优化DNS解析缓存逻辑
  * 优先使用实时dns，失败时，会使用6小时内的成功dns结果
***

## 1.41(2023.09.23)

### 功能
* 

### MarmotScript
* require("@M/v1/crypt") 新增文件加解密工具，详见文档2.8.38
* STD.HttpClient 新增支持NTLM鉴权方式, 详见文档2.10.2
* 新增 require('cipher.js') 三方包
* 新增 require("@M/v1/ding-tool") 钉钉工具类，详见文档2.8.40
* STD.HttpClient 新增doPatchForAll方法, 详见文档2.10.2
### 优化和修正
* jsrsasign.KJUR.crypto.Signature: SHA256withRSA 返回值兼容性修正;
  * 返回值调整为hex String
* 稳定性
  * 优化执行池在并发突增情况下的表现，降低短时大量执行带来的无响应时长





***

## 1.40(2023.08.19)

### 功能
* RTF填充 支持打印word文件，详见文档4.5

### MarmotScript
* require("@M/v1/uom-tool") 新增单位工具，详见文档2.8.36
* require("@M/v1/alipay-client") 新增支付宝服务端SDK工具，详见文档2.8.37
* STD.Logger 当参数为数组，且数组数量>200时，仅打印前200条数据
    * 为缓和日志打印矛盾设定

### 优化和修正
* 修正一个潜在的,moment.locale串位问题
* jsrsasign.KJUR.crypto.Signature: SHA256withRSA 算法替换为JVM实现
  * 显著提高性能，并降低该场景资源占用
* 日志打印进行了一定程度优化，降低内存占用
* 调整整体流控为
  * 旧:客户端整体8并发，服务端按脚本编码2并发
  * 新:客户端按脚本编码3并发，服务端按脚本编码2并发
* Rel-Table: create调整优化性能，当不存在唯一校验的列时不加锁。

***


## 1.39(2023.07.15)

### MarmotScript
* STD.ElMath.eval: Round方法支持自定义精度取舍策略，详见文档2.10.1

### 优化和修正
* require("@M/v1/sso").UniLink 解密后值与变量参数不等的兼容性调整，根据数量丢弃多余的值或者多余的变量不解析
* STD.QueryBlock.selectOne 修复查询超内存的bug，追加LIMIT 1
* HumphreyCache 修复并发情况下较低概率丢失缓存失效消息的bug

***

## 1.38(2023.06.10)

### 功能
* Marmot-Webhook: 新增有关MarmotWebHook的API，供feign调用使用，详见文档6.1
* Rel-Table: 新增配置表定义中字段名称的中英文必输且合法的校验
* Marmot Script:脚本调试增加资源报告的返回

### MarmotScript
* require("@M/v1/safe-json") 支持反序列化小数超10位的数值，详见文档2.2
* require("@M/v1/employee") 支持忽略员工状态查询
* require("@M/v1/object") 调整update、updateOptional方法去掉10s时间限制，增加单次最多更新10000行数据限制
* require("@M/v1/object") 调整query方法去单次最多查询100000行数据超过则报错
* require("@M/v1/image") 支持图片缩放功能，详见文档2.8.35

### 优化和修正
* require("@M/v1/sso").UniLink 支持参数中带空格

***

## 1.37(2023.05.06)

### 功能
* Rel-Table: 新增前端查询前触发点，支持自定义Page查询条件，详见文档3.5

### MarmotScript
* 新增 require("@M/v1/srm-crypt"): SRM主键加解密工具 详见文档2.8.33
* STD.ElMath.eval: DIV方法支持传入精度取舍策略 详见文档2.10.1
* require("@M/v1/query-block").selectPage 支持配置自定义countSql
* require('@M/v1/exception')中SimpleException自定义异常提示支持占位符
* 新增 require('pinyin'): 拼音转换工具 详见文档2.9.10
* 新增 require("@M/v1/text"): 富文本清洗工具 详见文档2.8.34

### 优化和修正
* @M/v1/object Rel-Table新增改为批量，提升性能
* @M/v1/object 非查询接口解除内存保护，即插件内存申请数计入脚本内存总申请量

***

## 1.36(2023.04.01)

### 功能
* MarmotScript: require('@M/v1/messenger').sendMessageInAttachments方法支持抄送功能
* Rel-Table:新增是否同步多云标识
* Rel-Table:字段名称以及生成的菜单名称支持多语言

### MarmotScript
* 开启EcmaScript Intl-402支持,用于支持localCompare，默认区域跟随部署，公有云为(zh-CN)

### 优化和修正
* 修正引擎层健康检查逻辑，提升稳定性
* 优化执行编译布局，提升执行稳定性
* 提升整体执行吞吐量上限至单个节点512并发
* 脚本引擎内日志大小控制，丢弃单条10MB以上日志
* 功能API挂载 入参根据配置进行主键加密传入脚本
* Rel-Table:优化异常信息的抛出，提升执行效率
***



## 1.35(2023.02.25)

### 功能
* 

### MarmotScript
* @M/v1/email: 增加additionProps参数，可以使用oauth2验证

### 优化和修正
* @M/v1/object 补充判空逻辑
* @M/2021/* 修正异常捕获逻辑
* 优化引擎整体序列化/反序列化性能，提升各类数据拉取性能
* Rel-Table: 触发器执行优化为内部循环，有效提升执行性能
* bugfix: @M/v1/feign-client checkFeignResponse 空返回判定修正
* Rel-Table: 系统、通用级表默认启用混合索引
* @M/v1/object 修正sql session引用，当为fakeTx场景时直接使用调用方session，而非拟构后openSession的session，用以保mybatis一级缓存的刷新行为一致。
***

## 1.34(2023.01.14)

### 功能
* MarmotScript: 新增外部数据库查询功能
* MarmotHub API: 新增form-data请求类型支持,详见4.3  
* 功能数据导入: 新增新增批量验证返回对应行错误的方法,详见4.1  
* Rel-Table: 新增通用级缓存支持(org.srm.boot.platform.reltable.CachedRelTableHelper.selectByCondition(java.lang.Long, java.lang.String, T))
* Rel-Table: 租户级支持一键生成对应菜单
* Marmot httpClient: put请求支持表单提交

### MarmotScript
* 新增 @M/* 的源代码查看功能
* 新增 require('@M/v1/math'): 基于BigNumber的math工具
* 新增 require('@M/v1/localization'): 本地化工具 详见文档2.8.31
* require('@M/v1/attachment'): 增加复制多个uuid到其它uuid的api batchCloneAttachment 详见文档2.8.2
* require('@M/v1/options'): 增加查询环境变量api getMarmotEnvVar

### 优化和修正
* 资源沙盒: 增加资源消耗日志
* 资源沙盒：增加插件层资源控制，应用于QueryBlock.list
* QueryBlock: 超时时间收紧
* Rel-Table: 内部集成了全局COUNT缓存，提升了COUNT效率


***

## 1.33(2022.12.17)

### 功能
* Rel-Table: 增加表定义 导出+导入功能
* Marmot QueryBlock：最大表数量控制为3
* Marmot Script: 增加资源控制，独立脚本由marmot管理员进行设定，适配器默认中
* Rel-Table: 动作设定为低资源运行

### MarmotScript
* require('@M/v1/object')：增加QL方法，详见2.8.1
* require('@M/v1/attachment')：增加文件服务生成uuid的方法，详见2.8.2
* require('@M/v1/workflow'): 增加用于批量查询单据历史审批记录方法：batchListHistoryApproval，详见文档2.8.13.
* require('@M/v1/workflow'): 增加用于工作流查询组合业务对象的树形结构数据方法：businessObjectTree，详见文档2.8.13.
* require('@M/v1/workflow'): 增加用于工作流查询获取主模型数据方法：generateModelMasterData，详见文档2.8.13.
* require('@M/v1/workflow'): 增加用于工作流查询主模型关系数据方法：generateModelRelationData，详见文档2.8.13.
* require("@M/v1/attachment"):增加可选参数用于直接返回文件base64：fetchBufferByFile，详见文档2.8.2.
* require("@M/v1/attachment"):增加用于获取文件授权URL方法：getSignedUrl，详见文档2.8.2.
* require("@M/v1/attachment"):增加批量上传至外部url方法：uploadAttachmentByUrl，详见文档2.8.2.
* require("@M/v1/attachment"):增加生成文件服务uuid方法：getAttachmentUUID，详见文档2.8.2.
* require("@M/v1/user"):增加用于获取外部用户ID方法：getEsUserId，详见文档2.8.7.
* require("@M/v1/customize"):增加获取个性化字段的方法，详见文档2.8.9
* require("@M/v1/doc-authority"):增加平铺查询用户单据权限方法：selectFlatUserAuthority，详见文档2.8.26
* require("@M/v1/xlsx-support")：增加表格转回数组的api,详见2.8.5
* 新增require("@M/v1/signature"):用于生成固定格式的签章图片
* 新增require('@M/v1/email')：用于邮箱操作，详见2.8.29
* 新增require('@M/v1/code-block/esign')：增加e签宝获取md5工具类
* 新增require('md5')：引入npm的md5工具包,用于获取字符串或文件的md5值


### 优化和修正
* Marmot生态完成全量缓存改造，所有执行期数据基于内存加载
* Rel-Table: 增加单个字段内容最大量限制, 4MB
* Rel-Table: 页面查询值集视图&下拉选框优化了执行性能
* 资源沙盒:  进一步降低资源占率率
* require("@M/v1/xlsx-support"): 修复数字类型导致自动列宽报错的问题,同时导入单元格时不会自动转换数字类型
* 功能API挂载功能入参根据是否开启主键加密情况进行主键加密
***


## 1.32(2022.11.12)

### 功能
* Rel-Table: 提供 *混合索引(Miexed Indexing)* 功能,加速等值与范围匹配
* QueryBlock：增加QueryBlock SQL复杂度保存时检测

### MarmotScript

* 新增 require('querystringify'); 用于url参数处理，详见文档2.9.7
* 新增 require('string'): 用于各类字符串处理 详见文档2.9.8
* 新增 require('base62.io'): 用于base62编解码 参考 https://www.npmjs.com/package/base62.io
* require('@M/v1/workflow'): 增加用于查询单据历史审批记录方法：historyApproval，详见文档2.8.13.
* 新增require('@sheet/core')：用于实现生成excel的高级操作，详见2.9.9
* 新增require('@M/v1/xlsx-support/pro')：用于支持生成excel的高级操作
* 新增require('@M/v1/options')：用于查询当前环境marmot配置

### 优化和修正
* 新增文档目录：Abstract
* 文档目录调整：新增Rel-Table文档
* Rel-Table：优化插入性能,优化动作脚本执行性能
* STD.ElMath：修正了数字等值比较BUG
* @M/v1/ftp： 修正超时问题
* @M/v1/feign-client: 增加marmot与srm-adaptor同义词支持

***

## 1.31(2022.10.01)

### 功能
* Rel-Table: 按租户基表隔离

### MarmotScript
* Promise兼容: 支持编写async process 入口函数，以兼容各类插件的Promise行为


* 新增 require('axios'): axios支持，需配合async process使用
* 新增 require('@M/v1/pdf-helper'): PDF工具，支持word转pdf、pdf多页合并



* require('xlsx-style'): 完善公式支持，分组支持
* require("@M/v1/object"): 增加对象拷贝方法：objectCopy
* require("@M/v1/queue""): 增加顺序消费支持(需配合消费者设定启用按顺序消费)
* require('@M/v1/cache'): 优化存取逻辑、新增withLock方法，用于锁操作


* STD.ElMath 增加函数: DIVIDE(1,3,7),支持自定义除法保留精度值(第三参数)

### 优化和修正
* 执行资源沙盒：优化并降低了资源占用
* 对象操作器: 优化了元数据缓存(表变更不再需要申请重启，等待1小时即可)
* REL-Table: 优化了定义缓存，支持定义修改实时生效
* REL-Table: 优化了页面体验
* REL-Table: 客户端提高了访问稳定性(流量控制+回环检测)

***

## 1.30(2022.08.27)

### 功能
* Hub: 正式开放独立脚本调度任务
* REL-Table: 支持供应商隔离

### MarmotScript
* add-三方包 require('express-useragent') 用于UA(User-Agent)判定
* add-三方包 require('dingtalk-decrypt') 钉钉开放平台消息推送加解密
* add-自研包 require("@M/v1/doc-authority") 增加用户单据权限查询工具
* improvement-自研包 require('@M/v1/context') 增加request() 方法，用于获取请求上下文信息
* improvement-自研包 require("@M/v1/context").basic() 增加变量env用于获取当前环境的ENV信息
* improvement-自研包 require("@M/v1/employee") 增加返回字段employeeNum

### 优化和修正
* 对象操作器: 支持在配置表global_cross_schema_rule中配置 表对应的schema名称
* QueryBlock,白名单,CodeBlock,常量: 改动无需再等待缓存刷新，可即时生效
* API发布: 优化了加载性能
* 脚本日志: 优化了查询性能


***


## 1.29(2022.07.23)

### 功能
* (测试中) 独立脚本调度任务

### MarmotScript
* improvement-自研包: require('@M/v1/context') 执行上下文
* improvement-自研包: require('@M/v1/sso') 单点登录工具包
* improvement-自研包: require('@M/v1/object') 完整支持配置表操作
* improvement-自研包: require('@M/v1/attachment') 增加zip压缩支持
* improvement-自研包: require('@M/v1/user') std的UserHelper功能转移
* improvement-三方包 require('xlsx-style'') 增加对于列隐藏、行高和分组的支持
* add-自研包: require('@M/v1/supplier-kpi-tool') 供应商指标工具
* add-自研包: require('@M/v1/workflow') 工作流客户端
* add-自研包: require('@M/v1/region') 地区查询工具
* add-自研包: require('@M/v1/serial-generator') std转移，序列号生成工具
* add-自研包: require('@M/v1/constants') std转移，常量获得工具
* add-自研包: require('@M/v1/logger') std转移，日志生成工具
* add-自研包: require('@M/v1/language') std转移，多语言工具
* add-自研包: require('@M/v1/queue') std转移，队列工具
* add-自研包: require('@M/v1/cache') std转移，缓存工具工具
* add-自研包: require('@M/v1/query-block') std转移，queryblock工具
* add-自研包: require('@M/v1/code-block') std转移，代码块工具
* add-自研包: require('@M/v1/feign-client') std转移，feign服务间调用工具

* add-三方包 require('jsrsasign') 用于RSA based签名

### 优化和修正
* 修正文档错误
* 多个个NPE修正
* JavaScript异常栈展示优化
* 修复对象操作器的update校验bug

***

## 1.28(2022.06.18)

### 功能
* Marmot帮助手册: 也就是现在你看到的东西
* 配置表：新增Header自定义按钮功能(可关联一个MarmotScript)
* 
### MarmotScript
* 功能增强: 基于Chrome DevTools 的在线Debugger: 公有云DEV环境开放
* 自研包新增: 对象操作器 require('@M/v1/object') 更优秀的Database,RelTableHelper代替品
* 自研包新增: RSA秘钥转换器: require('@M/v1/key-format')
* 三方包引入: @wecom/crypto: 企业微信集成工具包，用于验签，消息封装等等
* 三方包引入: keypair RSA秘钥生成器 
* 
### 优化和修正
* 引擎容器切换至JDK11构建，插件切换至全量基于CommonJS结构
* HttpClient将会在DNS异常时重试
* 部分插件报错信息修正
* 

***

## 1.27(2022.05.14)
### 功能
* 功能API前置回调脚本支持:用于改写标准功能的请求参数
* 脚本内允许生成PDF文件: require('@M/v1/hub')
* 模板库: 案例与教程分享
* HttpClient白名单新增测通功能: 非DEV环境准确且有效
### 优化和修正
* 埋点脚本客户端性能优化:降低了序列化次数
***
