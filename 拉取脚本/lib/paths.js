const fs = require('fs');
const path = require('path');

/**
 * 输出路径解析（init 与 sync 共用，保证两者报告的是同一个目录）
 *
 * 默认输出到 <技能仓库根>/js/marmot：
 *   - 与技能同仓库，仓库克隆到哪、输出就跟到哪，任何地方都不写绝对路径
 *   - 由 __dirname 推导，不依赖执行时的工作目录，从任何目录执行结果都一致
 *
 * 优先级：
 *   1. 环境变量 PANGU_JS_DIR   —— 临时把输出指到别处
 *   2. sync-config.json        —— 可选的长期覆盖（机器相关，已 gitignore）
 *   3. 默认：<技能仓库根>/js/marmot
 */

const SKILL_DIR = path.resolve(__dirname, '..');
const REPO_ROOT = path.resolve(SKILL_DIR, '..');
const SYNC_CONFIG_FILE = path.join(SKILL_DIR, 'sync-config.json');

/** 读取可选覆盖配置；不存在或格式不对时返回 null */
function readSyncConfig() {
  try {
    if (!fs.existsSync(SYNC_CONFIG_FILE)) return null;
    const cfg = JSON.parse(fs.readFileSync(SYNC_CONFIG_FILE, 'utf-8'));
    if (cfg && typeof cfg.projectRoot === 'string' && cfg.projectRoot.trim()) {
      return { projectRoot: path.resolve(cfg.projectRoot.trim()) };
    }
    return null;
  } catch {
    return null;
  }
}

/** 按优先级解析输出位置，并给出解析来源（便于排查） */
function resolveOutput() {
  if (process.env.PANGU_JS_DIR) {
    return {
      projectRoot: path.dirname(path.resolve(process.env.PANGU_JS_DIR)),
      baseDir: path.resolve(process.env.PANGU_JS_DIR),
      source: 'PANGU_JS_DIR 环境变量',
    };
  }

  const cfg = readSyncConfig();
  if (cfg) {
    return {
      projectRoot: cfg.projectRoot,
      baseDir: path.join(cfg.projectRoot, 'js', 'marmot'),
      source: `sync-config.json（projectRoot=${cfg.projectRoot}）`,
    };
  }

  return {
    projectRoot: REPO_ROOT,
    baseDir: path.join(REPO_ROOT, 'js', 'marmot'),
    source: '默认：技能仓库根',
  };
}

const RESOLVED = resolveOutput();
const PROJECT_ROOT = RESOLVED.projectRoot;
const BASE_DIR = RESOLVED.baseDir;
const BASE_DIR_SOURCE = RESOLVED.source;
const MAIDIAN_DIR = path.join(BASE_DIR, '埋点脚本');
const DULI_DIR = path.join(BASE_DIR, '独立脚本');

module.exports = {
  SKILL_DIR,
  REPO_ROOT,
  SYNC_CONFIG_FILE,
  readSyncConfig,
  resolveOutput,
  PROJECT_ROOT,
  BASE_DIR,
  BASE_DIR_SOURCE,
  MAIDIAN_DIR,
  DULI_DIR,
};
