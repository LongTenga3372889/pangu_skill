const fs = require('fs');
const path = require('path');

/** 统一的输出前缀 */
const ok = (m) => console.log(`  [OK] ${m}`);
const warn = (m) => console.log(`  [!]  ${m}`);
const info = (m) => console.log(`       ${m}`);

/** 判断模块能否从指定目录解析到（用于检查某个 skill 自己的依赖） */
function hasModule(name, fromDir) {
  try {
    require.resolve(name, { paths: [fromDir] });
    return true;
  } catch {
    return false;
  }
}

/** 从 fromDir 解析并加载模块（避免错误地使用项目根目录的依赖） */
function requireFrom(name, fromDir) {
  return require(require.resolve(name, { paths: [fromDir] }));
}

/** 密码输入不回显 */
function askHidden(query) {
  return new Promise((resolve) => {
    process.stdout.write(query);
    const stdin = process.stdin;
    const wasRaw = stdin.isRaw;
    stdin.resume();
    if (stdin.isTTY) stdin.setRawMode(true);
    stdin.setEncoding('utf8');
    let buf = '';
    const onData = (ch) => {
      if (ch === '\r' || ch === '\n' || ch === '\u0004') {
        stdin.removeListener('data', onData);
        if (stdin.isTTY) stdin.setRawMode(!!wasRaw);
        stdin.pause();
        process.stdout.write('\n');
        resolve(buf);
        return;
      }
      if (ch === '\u0003') {
        process.stdout.write('\n');
        process.exit(130);
      }
      if (ch === '\u007f' || ch === '\b') {
        buf = buf.slice(0, -1);
        return;
      }
      buf += ch;
    };
    stdin.on('data', onData);
  });
}

/** 校验某个文件是否被仓库的 .gitignore 覆盖 */
function checkGitignore(file, gitRoot) {
  const rel = path.relative(gitRoot, file).split(path.sep).join('/');
  const gi = path.join(gitRoot, '.gitignore');
  if (!fs.existsSync(gi)) {
    warn(`${rel} 未被任何 .gitignore 覆盖，务必不要提交该文件`);
    return false;
  }
  const rules = fs
    .readFileSync(gi, 'utf-8')
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('#'));
  const covered = rules.some((r) => rel === r || path.basename(rel) === r);
  if (covered) ok(`${path.basename(rel)} 已被 .gitignore 覆盖`);
  else warn(`${rel} 未被 .gitignore 覆盖，请勿提交到版本库！`);
  return covered;
}

module.exports = { ok, warn, info, hasModule, requireFrom, askHidden, checkGitignore };
