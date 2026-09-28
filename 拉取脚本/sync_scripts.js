const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

const FORCE_FULL = process.argv.includes('--force');

// 输出目录解析集中在 lib/paths.js，保证 init 与 sync 报告的是同一个目录
const { PROJECT_ROOT, BASE_DIR, MAIDIAN_DIR, DULI_DIR } = require('./lib/paths');

const DB_CONFIG_FILE = path.join(__dirname, 'db-config.json');

// 凭据来源优先级：环境变量 > db-config.json（已在 .gitignore 中，不入库）
// 环境变量：PANGU_DB_HOST / PANGU_DB_PORT / PANGU_DB_USER / PANGU_DB_PASSWORD / PANGU_DB_NAME
function loadDbConfig() {
  let fileCfg = {};
  if (fs.existsSync(DB_CONFIG_FILE)) {
    try {
      fileCfg = JSON.parse(fs.readFileSync(DB_CONFIG_FILE, 'utf-8'));
    } catch (e) {
      console.error(`[错误] 解析 ${DB_CONFIG_FILE} 失败: ${e.message}`);
      process.exit(1);
    }
  }

  const cfg = {
    host: process.env.PANGU_DB_HOST || fileCfg.host,
    port: Number(process.env.PANGU_DB_PORT || fileCfg.port || 3306),
    user: process.env.PANGU_DB_USER || fileCfg.user,
    password: process.env.PANGU_DB_PASSWORD ?? fileCfg.password,
    database: process.env.PANGU_DB_NAME || fileCfg.database,
    charset: 'utf8mb4',
  };

  const missing = ['host', 'user', 'password', 'database'].filter((k) => !cfg[k]);
  if (missing.length > 0) {
    console.error(`[错误] 缺少数据库配置: ${missing.join(', ')}`);
    console.error(`  请复制 db-config.example.json 为 db-config.json 并填写，`);
    console.error(`  或设置环境变量 PANGU_DB_HOST / PANGU_DB_USER / PANGU_DB_PASSWORD / PANGU_DB_NAME`);
    process.exit(1);
  }
  return cfg;
}

const WRITE_BATCH = 100;

function loadSyncState(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      const raw = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      const meta = raw._meta || { lastSyncTime: null };
      delete raw._meta;
      return { state: raw, meta };
    }
  } catch (e) {
    console.error(`  [警告] 加载同步状态失败: ${e.message}`);
  }
  return { state: {}, meta: { lastSyncTime: null } };
}

function saveSyncState(filePath, state, meta) {
  const output = { _meta: meta, ...state };
  fs.writeFileSync(filePath, JSON.stringify(output), 'utf-8');
}

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
}

async function syncScripts(conn, label, tableCode, opts, dir, tenantNameMap) {
  const { contentField, codeField, tenantField } = opts;
  const syncFile = path.join(dir, '.sync_state.json');
  ensureDir(dir);

  // --force 模式: 扔掉旧状态，全量拉取
  let state, meta;
  if (FORCE_FULL) {
    state = {};
    meta = { lastSyncTime: null };
  } else {
    const loaded = loadSyncState(syncFile);
    state = loaded.state;
    meta = loaded.meta;
  }

  const isFull = !meta.lastSyncTime;
  const localCount = Object.keys(state).length;
  console.log(`  [${label}] ${isFull ? '全量同步' : '增量同步'} (上次: ${meta.lastSyncTime || '无'}) 本地已追踪 ${localCount}`);

  const [records] = isFull
    ? await conn.query(
        `SELECT id, ${codeField} AS code, ${tenantField} AS tenant,
                object_version_number AS ver, ${contentField} AS content,
                last_update_date AS updated
         FROM spfm_rel_table_record WHERE table_code = ? ORDER BY id`,
        [tableCode])
    : await conn.query(
        `SELECT id, ${codeField} AS code, ${tenantField} AS tenant,
                object_version_number AS ver, ${contentField} AS content,
                last_update_date AS updated
         FROM spfm_rel_table_record
         WHERE table_code = ? AND last_update_date >= ? ORDER BY id`,
        [tableCode, meta.lastSyncTime]);

  console.log(`  [${label}] 数据库待处理 ${records.length} 条`);

  if (records.length === 0) return { new: 0, updated: 0, skipped: 0, writes: 0 };

  let newCount = 0, updatedCount = 0, skippedCount = 0;
  const writes = [];

  for (const rec of records) {
    const key = `${rec.tenant}_${rec.code}`;
    const existing = state[key];

    if (!rec.content) {
      if (!existing) state[key] = { ver: rec.ver, path: null };
      skippedCount++;
      continue;
    }

    // 增量: 版本未变则跳过
    if (!isFull && existing && existing.ver >= rec.ver) {
      skippedCount++;
      continue;
    }

    const tenantName = tenantNameMap[rec.tenant] || rec.tenant;
    const companyDir = `${tenantName}(${rec.tenant})`;
    const companyPath = path.join(dir, companyDir);
    const filePath = path.join(companyPath, `${rec.code}.js`);
    const relPath = path.relative(BASE_DIR, filePath);

    state[key] = { ver: rec.ver, path: relPath };

    // 全量 + 文件已在磁盘: 检查是否要强制覆盖
    if (isFull && fs.existsSync(filePath)) {
      if (!FORCE_FULL) {
        skippedCount++;
        continue;
      }
      // --force 模式: 继续往下写
    }

    if (!existing) newCount++;
    else updatedCount++;

    writes.push({ companyPath, filePath, content: rec.content });
  }

  for (let i = 0; i < writes.length; i += WRITE_BATCH) {
    await Promise.all(writes.slice(i, i + WRITE_BATCH).map(t => {
      ensureDir(t.companyPath);
      return fs.promises.writeFile(t.filePath, t.content, 'utf-8');
    }));
  }

  // 数据库 last_update_date 为北京时间，不能存 UTC（否则下次增量会漏掉 +8 小时内更新的记录）
  const now = new Date(Date.now() + 8 * 3600 * 1000).toISOString().slice(0, 19).replace('T', ' ');
  console.log(`  [${label}] 完成: 新增 ${newCount}, 更新 ${updatedCount}, 跳过 ${skippedCount}, 写盘 ${writes.length}`);

  saveSyncState(syncFile, state, { lastSyncTime: now });
  console.log(`  [${label}] 同步状态已保存 (${Object.keys(state).length} 条)`);

  return { new: newCount, updated: updatedCount, skipped: skippedCount, writes: writes.length };
}

async function main() {
  console.log(`脚本输出目录: ${BASE_DIR}`);
  console.log(`  项目根: ${PROJECT_ROOT}${process.env.PANGU_JS_DIR ? '  (PANGU_JS_DIR 覆盖已生效)' : ''}`);
  const conn = await mysql.createConnection(loadDbConfig());
  console.log('已连接 dev 数据库');

  try {
    console.log('\n加载租户名称映射...');
    const [tenants] = await conn.query('SELECT tenant_num, tenant_name FROM hpfm_tenant');
    const tenantNameMap = {};
    for (const t of tenants) tenantNameMap[t.tenant_num] = t.tenant_name;
    console.log(`  已加载 ${tenants.length} 个租户`);

    console.log('\n========== 埋点脚本 (sada_buried_point) ==========');
    const r1 = await syncScripts(conn, '埋点', 'sada_buried_point',
      { contentField: 'longValue1', codeField: 'value1', tenantField: 'value3' },
      MAIDIAN_DIR, tenantNameMap);

    console.log('\n========== 独立脚本 (marmot_script_library) ==========');
    const r2 = await syncScripts(conn, '独立', 'marmot_script_library',
      { contentField: 'longValue5', codeField: 'value3', tenantField: 'value2' },
      DULI_DIR, tenantNameMap);

    console.log('\n========== 同步汇总 ==========');
    console.log(`  埋点: 新增 ${r1.new}, 更新 ${r1.updated}, 跳过 ${r1.skipped}, 写盘 ${r1.writes}`);
    console.log(`  独立: 新增 ${r2.new}, 更新 ${r2.updated}, 跳过 ${r2.skipped}, 写盘 ${r2.writes}`);
    console.log(`  合计: 新增 ${r1.new + r2.new}, 更新 ${r1.updated + r2.updated}, 跳过 ${r1.skipped + r2.skipped}`);

  } finally {
    await conn.end();
    console.log('\n数据库连接已关闭');
  }
}

main().catch(err => {
  console.error('同步失败:', err);
  process.exit(1);
});
