/**
 * 发布流程：格式 → 类型检查 → 构建库 → 构建文档 → 递增版本 → npm publish。
 *
 * 用法：
 *   npm run release              # 默认 patch（0.1.0 → 0.1.1）
 *   npm run release -- minor
 *   npm run release -- major
 *
 * 使用 `npm publish --ignore-scripts`，避免与当前脚本重复执行 prepublishOnly；
 * 发布前校验已由本脚本完整执行。
 *
 * 版本递增不会自动 git commit/tag（--no-git-tag-version）；发布后可自行提交并打标签。
 */

import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

/** @param {string} cmd */
function run(cmd) {
  console.log(`\n\u001b[36m>\u001b[0m ${cmd}\n`);
  execSync(cmd, { cwd: root, stdio: "inherit", shell: true });
}

const bump = process.argv[2] ?? "patch";

if (!["patch", "minor", "major"].includes(bump)) {
  console.error(
    `无效的版本策略 "${bump}"，请使用 patch | minor | major。\n示例：npm run release -- minor`,
  );
  process.exit(1);
}

run("npm run format:check");
run("npm run type-check");
run("npm run build");
run("npm run docs:build");
run(`npm version ${bump} --no-git-tag-version`);
run("npm publish --ignore-scripts");
