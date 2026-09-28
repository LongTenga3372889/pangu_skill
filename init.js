#!/usr/bin/env node
/**
 * panguSkill 项目初始化入口
 *
 * 用法:
 *   node init.js                          运行全部初始化项
 *   node init.js sync-local-scripts       只运行指定项
 *   node init.js --list                   列出可用的初始化项
 *   node init.js --check                  只体检，不写任何文件
 *   node init.js --force                  覆盖已生成的配置
 *   node init.js --migrate-from <目录>    迁移旧目录的同步状态
 *
 * 新增初始化项：在 init/targets/ 下实现模块，并在 init/registry.js 登记。
 */
const path = require('path');
const registry = require('./init/registry');
const { warn, info } = require('./init/util');

function printHelp() {
  console.log(`
panguSkill 项目初始化

用法:
  node init.js [初始化项...] [选项]

选项:
  --list                 列出可用的初始化项
  --check                只体检，不写入任何文件
  --force                覆盖已生成的配置
  --migrate-from <目录>  迁移旧目录的 .sync_state.json
  -h, --help             显示本帮助

示例:
  node init.js
  node init.js sync-local-scripts
  node init.js sync-local-scripts --migrate-from "D:\\work\\pangu-js"
`);
}

function printList() {
  console.log('可用的初始化项:\n');
  for (const t of registry) {
    console.log(`  ${t.id}`);
    console.log(`      ${t.title}`);
    console.log(`      ${t.description}\n`);
  }
  console.log('用法: node init.js [初始化项...]   不给参数则运行全部');
}

function parseArgs(argv) {
  const options = { check: false, force: false, migrateFrom: null, list: false, help: false, ids: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--check') options.check = true;
    else if (a === '--force') options.force = true;
    else if (a === '--list') options.list = true;
    else if (a === '--help' || a === '-h') options.help = true;
    else if (a === '--migrate-from') {
      const v = argv[i + 1];
      if (v && !v.startsWith('--')) {
        options.migrateFrom = path.resolve(v);
        i++;
      } else {
        warn('--migrate-from 缺少目录参数');
      }
    } else if (a.startsWith('--')) {
      warn(`未知选项被忽略: ${a}`);
    } else {
      options.ids.push(a);
    }
  }
  return options;
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) return printHelp();
  if (options.list) return printList();

  let targets = registry;
  if (options.ids.length > 0) {
    targets = [];
    for (const id of options.ids) {
      const found = registry.find((t) => t.id === id);
      if (!found) {
        warn(`未知初始化项: ${id}`);
        info(`可用: ${registry.map((t) => t.id).join(', ')}`);
        process.exitCode = 1;
      } else {
        targets.push(found);
      }
    }
    if (targets.length === 0) return;
  }

  console.log('===== panguSkill 项目初始化 =====');
  if (options.check) console.log('(检查模式：只体检，不写入任何文件)');

  let allReady = true;
  for (const entry of targets) {
    const target = entry.load();
    const ctx = { options, depsReady: false, cfg: null, connOk: false };

    console.log(`\n──────── ${target.title} ────────`);
    for (let i = 0; i < target.steps.length; i++) {
      const s = target.steps[i];
      console.log(`\n[${i + 1}/${target.steps.length}] ${s.title}`);
      await s.run(ctx);
    }

    const r = target.result ? target.result(ctx) : { ready: true, lines: [] };
    if (r.lines.length > 0) {
      console.log('\n  ---- 结果 ----');
      for (const line of r.lines) console.log(`  ${line}`);
    }
    if (!r.ready) {
      allReady = false;
      console.log('');
      warn(`${target.title}: 未完全就绪`);
    }
  }

  console.log('\n===== 汇总 =====');
  if (allReady) {
    console.log('  全部初始化项已就绪。');
  } else {
    console.log('  部分初始化项未就绪，请查看上面带 [!] 的提示。');
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error('\n初始化失败:', err);
  process.exit(1);
});
