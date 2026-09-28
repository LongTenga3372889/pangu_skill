const fs = require('fs');
const path = require('path');

/**
 * 输出路径解析（init 与 sync 共用，保证两者报告的是同一个目录）
 *
 * 规则：输出到 <当前项目根>/js/marmot/
 *   项目根 = 从 startDir 向上找第一个含 .git 的目录；找不到则回退为 startDir
 *   可用环境变量 PANGU_JS_DIR 覆盖（绝对路径）
 */

/** 从 startDir 向上查找第一个含 .git 的目录 */
function resolveProjectRoot(startDir) {
  const start = path.resolve(startDir);
  let current = start;
  while (true) {
    if (fs.existsSync(path.join(current, '.git'))) return current;
    const parent = path.dirname(current);
    if (parent === current) return start;
    current = parent;
  }
}

const PROJECT_ROOT = resolveProjectRoot(process.cwd());
const BASE_DIR = process.env.PANGU_JS_DIR
  ? path.resolve(process.env.PANGU_JS_DIR)
  : path.join(PROJECT_ROOT, 'js', 'marmot');
const MAIDIAN_DIR = path.join(BASE_DIR, '埋点脚本');
const DULI_DIR = path.join(BASE_DIR, '独立脚本');

module.exports = {
  resolveProjectRoot,
  PROJECT_ROOT,
  BASE_DIR,
  MAIDIAN_DIR,
  DULI_DIR,
};
