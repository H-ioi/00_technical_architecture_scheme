import { execSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import pc from 'picocolors'

import { printError } from './utils/logger.js'

const PACKAGE_NAME = 'uni-lib-cli'

/** 从 npm 拉取最新版并更新全局安装的脚手架 */
export function runUpdate(): void {
  const pkgPath = join(dirname(fileURLToPath(import.meta.url)), '..', 'package.json')
  const { version: currentVersion } = JSON.parse(readFileSync(pkgPath, 'utf8')) as {
    version: string
  }

  console.log('')
  console.log(pc.bold(pc.cyan('  uni-lib-cli update')))
  console.log(pc.dim(`  当前版本 v${currentVersion}，正在从 npm 拉取最新版...`))
  console.log('')

  try {
    execSync(`npm install -g ${PACKAGE_NAME}@latest`, {
      stdio: 'inherit',
      shell: process.platform === 'win32' ? (process.env.COMSPEC ?? 'cmd.exe') : '/bin/sh'
    })
    console.log('')
    console.log(pc.green('  ✔ 全局脚手架已更新'))
    console.log(pc.dim('  执行 uni-lib-cli --version 可查看当前版本'))
    console.log('')
  } catch {
    printError('更新失败，请确认已全局安装且具备 npm 权限（Windows 可能需要管理员终端）')
    process.exitCode = 1
  }
}
