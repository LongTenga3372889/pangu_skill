/**
 * 初始化目标：拉取脚本（sync-local-scripts）
 *
 * 为「拉取脚本」skill 准备运行环境：依赖、数据库配置、输出目录、连通性体检。
 */
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { execFileSync } = require('child_process');

const { ok, warn, info, hasModule, requireFrom, askHidden, checkGitignore } = require('../util');

const ROOT = path.resolve(__dirname, '..', '..');
const SKILL_DIR = path.join(ROOT, '拉取脚本');
const DB_CONFIG_FILE = path.join(SKILL_DIR, 'db-config.json');
const EXAMPLE_FILE = path.join(SKILL_DIR, 'db-config.example.json');

/** 输出目录解析复用该 skill 自己的模块，保证与 sync_scripts.js 完全一致 */
function paths() {
  return require(path.join(SKILL_DIR, 'lib', 'paths'));
}

function readConfig() {
  try {
    return JSON.parse(fs.readFileSync(DB_CONFIG_FILE, 'utf-8'));
  } catch (e) {
    warn(`解析 db-config.json 失败: ${e.message}`);
    return null;
  }
}

/** [1] Node 版本 */
function stepNode() {
  const major = Number(process.versions.node.split('.')[0]);
  if (major >= 18) ok(`Node ${process.versions.node}`);
  else warn(`Node ${process.versions.node} 偏低（建议 >= 18），可能不支持 ?? 等新语法`);
}

/** [2] 依赖 */
function stepDeps(ctx) {
  if (hasModule('mysql2/promise', SKILL_DIR)) {
    ok('mysql2 已安装');
    ctx.depsReady = true;
    return;
  }
  warn(`未找到 mysql2（查找位置: ${SKILL_DIR}）`);
  if (ctx.options.check) {
    info('检查模式，跳过安装');
    return;
  }
  info('正在执行 npm install ...');
  try {
    execFileSync('npm', ['install'], {
      cwd: SKILL_DIR,
      stdio: 'inherit',
      shell: process.platform === 'win32',
    });
    if (hasModule('mysql2/promise', SKILL_DIR)) {
      ok('依赖安装完成');
      ctx.depsReady = true;
    } else {
      warn('安装命令已执行，但仍解析不到 mysql2');
    }
  } catch (e) {
    warn(`自动安装失败: ${e.message}`);
    info('请手动执行:');
    info(`  cd "${SKILL_DIR}" && npm install`);
  }
}

/** [3] 数据库配置 */
async function stepConfig(ctx) {
  if (fs.existsSync(DB_CONFIG_FILE) && !ctx.options.force) {
    ok(`已存在 ${path.relative(ROOT, DB_CONFIG_FILE)}（重填请加 --force）`);
    checkGitignore(DB_CONFIG_FILE, ROOT);
    ctx.cfg = readConfig();
    return;
  }

  if (ctx.options.check) {
    warn('缺少 db-config.json（检查模式不生成）');
    return;
  }

  if (!process.stdin.isTTY) {
    warn('当前不是交互式终端，无法输入配置');
    info(`请复制 ${path.basename(EXAMPLE_FILE)} 为 ${path.basename(DB_CONFIG_FILE)} 并填写`);
    return;
  }

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const ask = (q, dflt) =>
    new Promise((res) =>
      rl.question(dflt ? `${q} (${dflt}): ` : `${q}: `, (a) => res((a || '').trim() || dflt || '')),
    );

  const host = await ask('  数据库地址 host');
  const port = await ask('  端口 port', '3306');
  const user = await ask('  用户名 user');
  const database = await ask('  库名 database');
  rl.close();

  const password = await askHidden('  密码 password（不回显）: ');

  const cfg = { host, port: Number(port) || 3306, user, password, database };
  const missing = ['host', 'user', 'password', 'database'].filter((k) => !cfg[k]);
  if (missing.length > 0) {
    warn(`缺少必填项: ${missing.join(', ')}，未写入配置`);
    return;
  }

  fs.writeFileSync(DB_CONFIG_FILE, `${JSON.stringify(cfg, null, 2)}\n`, 'utf-8');
  ok(`已写入 ${path.relative(ROOT, DB_CONFIG_FILE)}`);
  checkGitignore(DB_CONFIG_FILE, ROOT);
  ctx.cfg = cfg;
}

/** [4] 输出目录 */
function stepDirs(ctx) {
  const p = paths();

  info(`工作目录: ${process.cwd()}`);
  info(`解析来源: ${p.BASE_DIR_SOURCE}`);
  info(`输出目录: ${p.BASE_DIR}`);

  if (ctx.options.check) {
    info('检查模式，不创建目录');
    return;
  }
  for (const dir of [p.MAIDIAN_DIR, p.DULI_DIR]) {
    const existed = fs.existsSync(dir);
    fs.mkdirSync(dir, { recursive: true });
    ok(`${dir}${existed ? '  (已存在)' : '  (已创建)'}`);
  }
}

/** [5] 数据库连通性 */
async function stepConn(ctx) {
  if (!ctx.cfg) {
    warn('无可用配置，跳过');
    return;
  }
  if (!hasModule('mysql2/promise', SKILL_DIR)) {
    warn('mysql2 未安装，跳过');
    return;
  }

  let conn;
  try {
    const mysql = requireFrom('mysql2/promise', SKILL_DIR);
    conn = await mysql.createConnection({ ...ctx.cfg, charset: 'utf8mb4', connectTimeout: 10000 });
    ok('连接成功');

    const [tenants] = await conn.query('SELECT COUNT(*) AS c FROM hpfm_tenant');
    ok(`hpfm_tenant 可读，共 ${tenants[0].c} 个租户`);

    const [rows] = await conn.query(
      `SELECT table_code, COUNT(*) AS c
         FROM spfm_rel_table_record
        WHERE table_code IN ('sada_buried_point', 'marmot_script_library')
        GROUP BY table_code`,
    );
    const seen = Object.fromEntries(rows.map((r) => [r.table_code, r.c]));
    for (const code of ['sada_buried_point', 'marmot_script_library']) {
      if (seen[code] === undefined) warn(`${code} 无记录（空表或权限不足）`);
      else ok(`${code}: ${seen[code]} 条`);
    }
    ctx.connOk = true;
  } catch (e) {
    warn(`失败: ${e.message}`);
  } finally {
    if (conn) await conn.end().catch(() => {});
  }
}

/** [6] 同步状态迁移 */
function stepMigrate(ctx) {
  const from = ctx.options.migrateFrom;
  if (!from) {
    info('未指定 --migrate-from，跳过');
    return;
  }
  if (!fs.existsSync(from)) {
    warn(`源目录不存在: ${from}`);
    return;
  }

  const { MAIDIAN_DIR, DULI_DIR } = paths();
  const pairs = [
    ['埋点脚本', path.join(from, '埋点脚本'), MAIDIAN_DIR],
    ['独立脚本', path.join(from, '独立脚本'), DULI_DIR],
  ];
  for (const [label, src, dst] of pairs) {
    const srcFile = path.join(src, '.sync_state.json');
    const dstFile = path.join(dst, '.sync_state.json');
    if (!fs.existsSync(srcFile)) {
      warn(`${label}: 源状态文件不存在 ${srcFile}`);
      continue;
    }
    if (fs.existsSync(dstFile) && !ctx.options.force) {
      warn(`${label}: 目标已存在，跳过（覆盖请加 --force）`);
      continue;
    }
    fs.mkdirSync(dst, { recursive: true });
    fs.copyFileSync(srcFile, dstFile);
    ok(`${label}: 已迁移 -> ${dstFile}`);
  }
  info('迁移后下次同步按增量；不加 --migrate-from 则从头全量拉取');
}

module.exports = {
  id: 'sync-local-scripts',
  title: '拉取脚本（Marmot 脚本同步）',
  description: '安装 mysql2、生成数据库配置、创建 js/marmot 输出目录',
  steps: [
    { title: 'Node 版本', run: stepNode },
    { title: '依赖', run: stepDeps },
    { title: '数据库配置', run: stepConfig },
    { title: '输出目录', run: stepDirs },
    { title: '数据库连通性', run: stepConn },
    { title: '同步状态迁移', run: stepMigrate },
  ],
  result(ctx) {
    const { BASE_DIR, BASE_DIR_SOURCE } = paths();
    const ready = ctx.depsReady && !!ctx.cfg && ctx.connOk;
    const lines = [
      `依赖:     ${ctx.depsReady ? '就绪' : '未就绪'}`,
      `配置:     ${ctx.cfg ? '就绪' : '未就绪'}`,
      `数据库:   ${ctx.connOk ? '连通' : '未验证'}`,
      `输出目录: ${BASE_DIR}`,
      `解析来源: ${BASE_DIR_SOURCE}`,
    ];
    if (ready) lines.push('', '下一步: node 拉取脚本/sync_scripts.js');
    return { ready, lines };
  },
};
