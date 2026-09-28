# FAQ
>建议开发者必读   
>各类常见问题和答案


## 1.关于数据库事务
```text
脚本执行仅支持数据库事务，无其他事务性支持
数据库事务包括:
1.Database
2.QueryBlock
3.require('@M/v1/object')

关于事务的范围:
1.如果是独立脚本，则该脚本范围内 数据库操作合并为一个事务
2.如果是埋点脚本，则每个脚本都加入标准流程事务，事务由标准流程控制

关于页面执行:
1.页面执行是具有事务的，独立的事务，但必定会回滚
(这是合理的，我们不希望页面操作可以更改重要的数据)
2.如果有使用脚本刷数据，修正数据的需求，请提出需求并获得需求号，建立调度任务执行

```
***
## 2.为什么我的updateOptional没生效也没报错
```text
该情况仅出现在页面执行上，请参照第一个问题
```

***
## 3.为什么我在页面执行带有数据库事务的操作的埋点脚本和在JAVA代码中执行得到的结果不一致?
```text
埋点脚本里,每个脚本都加入标准流程事务，事务由标准流程控制
在同一个事务中,如果事先在JAVA代码(或者前置的其他脚本)对某条数据进行了操作,那么后续脚本中的值自然是操作过后的值
所以在写脚本时务必注意事务带来的影响
```

***
## 4.脚本中更新数据出现Lock wait timeout exceeded
```text
原因：在事务A里对某条数据进行更新，然后又去另外的事务B中更新相同数据，导致事务B一直在等待事务A提交，等到超时就报错了。

出现可能：

1）埋点脚本中对数据A进行更新，该埋点带有事务。更新后在另外的类（注：同一个类下的Propagation.REQUIRES_NEW会失效）开启新事务，就会导致这种情况。

2）在脚本中更新了数据A，又feign调用了另外的接口，这个接口也更新了数据A，此时相当于新开了一个事务，同样会导致锁。
```


***
## 5.报错信息tenant check failed, you have no permission to operate tenant [xxxx] data by tenant[xxxx]
```text
原因：操作的数据不属于当前脚本所属租户,请仔细核对
```

***
## 6.STD.PlatformMessage/@Require("@M/v1/messenger)消息发送，站内信或者邮箱无法接收
```text
可能原因：
1）参数不规范。
    解决方法：参照案例库《标准案例-发送消息》中发送的消息对象
    注意:
    ①缺少参数（比如args）可能导致消息无法发送，请务必先检查自己发送的数据格式。
    ②发送站内信（WEB）时，需同时保证userId和targetUserTenantId。
2）邮箱未配置白名单。
    解决方法：登陆admin账号 -> 打开云平台管理>邮箱账户 -> 找到对应邮箱(一般是SRM邮箱) -> 设置黑白名单
3）使用sendMessage()时未设置消息接受组。
    解决方法：
    ①: 使用STD.PlatformMessage.sendMessageNoReceiverGroup()
    ②: 云平台管理>消息管理>消息接收者类型设置 -> 禁用对应接收者类型
```
## 7.功能API挂载中新增API编码找不到
```text
可能原因：
1）Controller未继承Baseontroller
    解决方法：将需要挂载的Controller继承Baseontroller即可
2）ApiCode编码冲突
    可能原因： apiCode需保证全局唯一，报错信息如下
        - 与其他服务编码重复 ： `marmot api code of marmot api rewrite can not repeated apiCode：{重复的编码}`。 
        - 本服务下编码重复 ： `apiCode can not repeat apiCode：{重复的编码}`
    解决方法：修改ApiCode
3）`@MarmotApiPoint`禁止与`@ExcelExport`同一个接口共同使用。报错信息如下
    - `ExcelExport与MarmotApiPoint禁止用于同一个接口，apiCode:test`  
    解决方法：请使用MarmotHub功能数据导入
4）服务重启由于环境原因导致ApiCode注册失败
    解决方法：闲时再进行重新部署即可
5）二开的Controller直接继承了标准的Controller
    解决方法：二开的Controller修正
```

## 8.关于配置表

- 组件类型为lov时不允许使用id做为数据字段  
    ```text
    这边建议不要以id做为数据字段，不同环境id不一致，若有强烈需求，请使用越权账号操作
    ```
  
- 字段为值集视图选择框类型，界面字段没正常展示  
   ```text
    此类型字段依赖其值集的翻译sql，请检查翻译sql
   ```

- 导入时报数据错误  
    ```text
    请检查Excel数据行下方单元格是否未删除，可能是选中了一批数据清除了单元格内容但未删除单元格导致  
    也可导出模板，重新维护数据后导入
   ```

- 导入后值集视图选择框类型字段未正常展示
   ```text
    此类型字段的导入请维护对应的值字段，若维护了显示字段不支持反向翻译
     ```
- json serialization/parsing error
    ```text
    配置表数据为全String化的，Java或是MarmotScript中操作配置表时若碰到此错误，检查下参数中是否有value为数组或是其他复杂结构的情况
  ```
  如下参数就会报错
  ```javascript
    {
     sum:["1","2"],
     age:18
    }
  ```
## 9.Marmot控制台脚本日志没有日志的原因
如果脚本在控制台没有日志，请先确认不是以下原因再来找客服。
- 脚本没执行成功
  ```text
  确定自己脚本有没有执行,确认方法为脚本的input和output日志有无打印
  ```
- 消息条数限制
  ```text
  更新时间7天内的脚本，每天的日志条数限制为300条；
  更新时间30天内的脚本，每天的日志条数限制为50条；
  ```
- 距离上次执行时间太久
  ```text
  日志保留时间目前为72小时
  ```
## 10.脚本生成的excel出的问题
- 泛微无法预览
  ```text
  1.字体问题
  默认字体无法预览，替换font为{"name":"微软雅黑"}可解决
  ```

## 11.部分功能业务调用有数据，使用脚本插件在界面debug时查不到数据
  ```text
   功能提供方有存在是否为供应商校验，若为供应商则返回空，如：
   require("@M/v1/workflow").historyApproval
   require("@M/v1/workflow").batchListHistoryApproval
   界面debug携带的organizationId和tenantId肯定不一致，请结合具体功能测试。
  ```

## 12.【土拨鼠模版填充】模版上传了多个附件，未自动替换前一个附件
  ```text
   该情况为用户分别在平台级/租户级上传了附件，切换到对应租户删除附件即可
   该功能服务于租户级，请在租户级下操作。
  ```

## 13.脚本超出资源被kill问题定位
报错`java.lang.ThreadDeath`或`[killed by resource sandbox]`  
```text
   (1)超内存
     ①[killed by resource sandbox] Script killed for memory usage exceeded XXX bytes
     ②thread {threadName} {traceId} has memory issue
   (2)超CPU
     ①[killed by resource sandbox] Script killed for cpu time exceeded XXX ms
     ②thread {threadName} {traceId} has cpu issue
   (3)超总时间
     ①[killed by resource sandbox] Script killed for total time exceeded XXX ms
     ②thread {threadName} {traceId} has deadline issue
  ```