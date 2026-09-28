/**
 * panguSkill 项目初始化目标注册表
 *
 * 新增一项初始化时，在 targets/ 下实现模块并在此登记即可，
 * 入口 init.js、--list、编号输出都会自动生效。
 *
 * 一个 target 模块需导出：
 *   id          string          命令行中使用的标识
 *   title       string          展示名称
 *   description string          一句话说明
 *   steps       Array<{ title, run(ctx) }>
 *   result?(ctx) -> { ready: boolean, lines: string[] }   可选的结果汇总
 */
module.exports = [
  {
    id: 'sync-local-scripts',
    title: '拉取脚本（Marmot 脚本同步）',
    description: '安装 mysql2、生成数据库配置、创建 js/marmot 输出目录',
    load: () => require('./targets/sync-local-scripts'),
  },
];
