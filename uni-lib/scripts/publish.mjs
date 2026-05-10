/**
 * 发布流程：格式 → 类型检查 → 构建库 → 构建文档 → 产物校验 → 递增版本 → dry-run → npm publish。
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
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

let stepIndex = 0;

/** @param {string} title */
function step(title) {
  stepIndex += 1;
  console.log(`\n\u001b[1m\u001b[36m[${stepIndex}] ${title}\u001b[0m\n`);
}

/**
 * @param {string} cmd
 * @param {{ hint?: string }} [opts]
 */
function run(cmd, opts = {}) {
  console.log(`\u001b[36m>\u001b[0m ${cmd}\n`);
  try {
    execSync(cmd, { cwd: root, stdio: "inherit", shell: true });
  } catch {
    if (opts.hint) {
      console.error(`\n\u001b[31m${opts.hint}\u001b[0m\n`);
    }
    process.exit(1);
  }
}

/** @param {string} relativePath */
function assertFile(relativePath) {
  const abs = join(root, relativePath);
  if (!existsSync(abs)) {
    console.error(
      `\n\u001b[31m发布校验失败：缺少文件 ${relativePath}\u001b[0m\n`,
    );
    process.exit(1);
  }
}

function verifyLibraryArtifacts() {
  const raw = readFileSync(join(root, "package.json"), "utf8");
  const pkg = JSON.parse(raw);
  const candidates = new Set(
    [pkg.main, pkg.module, pkg.types, pkg.style].filter(
      (x) => typeof x === "string" && x.length > 0,
    ),
  );
  for (const rel of candidates) {
    assertFile(rel);
  }
}

function verifyDocsSite() {
  assertFile("docs/.vitepress/dist/index.html");
}

const bump = process.argv[2] ?? "patch";

if (!["patch", "minor", "major"].includes(bump)) {
  console.error(
    `无效的版本策略 "${bump}"，请使用 patch | minor | major。\n示例：npm run release -- minor`,
  );
  process.exit(1);
}

step("Prettier（format:check）");
run("npm run format:check", {
  hint: "代码格式未通过。请在本目录执行: npm run format  （再提交变更后重试 release）",
});

step("TypeScript（type-check）");
run("npm run type-check", {
  hint: "类型检查未通过。请先修复 vue-tsc 报错后再发布。",
});

step("构建组件库（vite build）");
run("npm run build");
verifyLibraryArtifacts();

step("构建文档站点（docs:build）");
run("npm run docs:build");
verifyDocsSite();

step(`递增版本（npm version ${bump}）`);
run(`npm version ${bump} --no-git-tag-version`);

step("发布预演（npm publish --dry-run）");
run("npm publish --ignore-scripts --dry-run", {
  hint: "dry-run 失败：请检查 package.json 的 files、exports 与 npm 登录状态（npm whoami）。",
});

step("正式发布（npm publish）");
run("npm publish --ignore-scripts", {
  hint: "发布失败：若网络或 registry 异常可重试；若版本已存在需先提升版本号。",
});

console.log(
  `\n\u001b[32m发布流程已全部完成。\u001b[0m 建议执行 git add package.json package-lock.json && git commit 并打 tag。\n`,
);
