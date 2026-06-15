/**
 * 发布流程：同步模版 → 构建 CLI → 产物校验 → 递增版本 → npm publish。
 *
 * 用法：
 *   npm run release              # 默认 patch（0.1.3 → 0.1.4）
 *   npm run release -- minor
 *   npm run release -- major
 *
 * 使用 `npm publish --ignore-scripts`，避免与 prepublishOnly 重复构建；
 * 同步与构建已由本脚本完整执行。
 *
 * 版本递增不会自动 git commit/tag（--no-git-tag-version）；发布后可自行提交并打标签。
 */

import { execSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

const TEMPLATE_MARKERS = [
  'templates/admin-web/package.json',
  'templates/customer-web/package.json',
  'templates/customer-mobile/package.json',
  'templates/native-app/pubspec.yaml'
]

let stepIndex = 0

/** @param {string} title */
function step(title) {
  stepIndex += 1
  console.log(`\n\u001b[1m\u001b[36m[${stepIndex}] ${title}\u001b[0m\n`)
}

/**
 * @param {string} cmd
 * @param {{ hint?: string }} [opts]
 */
function run(cmd, opts = {}) {
  console.log(`\u001b[36m>\u001b[0m ${cmd}\n`)
  try {
    execSync(cmd, { cwd: root, stdio: 'inherit', shell: true })
  } catch {
    if (opts.hint) {
      console.error(`\n\u001b[31m${opts.hint}\u001b[0m\n`)
    }
    process.exit(1)
  }
}

/** @param {string} relativePath */
function assertFile(relativePath) {
  const abs = join(root, relativePath)
  if (!existsSync(abs)) {
    console.error(`\n\u001b[31m发布校验失败：缺少文件 ${relativePath}\u001b[0m\n`)
    process.exit(1)
  }
}

function verifyCliArtifacts() {
  assertFile('dist/index.js')
  for (const rel of TEMPLATE_MARKERS) {
    assertFile(rel)
  }
}

const bump = process.argv[2] ?? 'patch'

if (!['patch', 'minor', 'major'].includes(bump)) {
  console.error(
    `无效的版本策略 "${bump}"，请使用 patch | minor | major。\n示例：npm run release -- minor`
  )
  process.exit(1)
}

step('同步模版（sync:templates）')
run('npm run sync:templates', {
  hint: '模版同步失败：请确认 monorepo 内 admin-web 等源工程存在且可访问。'
})

step('构建 CLI（tsc）')
run('npm run build', {
  hint: '构建失败：请先修复 TypeScript 报错后再发布。'
})
verifyCliArtifacts()

step(`递增版本（npm version ${bump}）`)
run(`npm version ${bump} --no-git-tag-version`)

step('正式发布（npm publish）')
run('npm publish --ignore-scripts', {
  hint: '发布失败：若网络或 registry 异常可重试；若版本已存在需先提升版本号。'
})

console.log(
  `\n\u001b[32m发布流程已全部完成。\u001b[0m 建议执行 git add package.json package-lock.json templates && git commit 并打 tag。\n`
)
