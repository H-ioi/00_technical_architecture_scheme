import path from 'node:path'
import { fileURLToPath } from 'node:url'

/** CLI 包根目录（编译后在 dist/ 下，需向上一级） */
export const CLI_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

/** monorepo 根目录（CLI 包的上级） */
export const REPO_ROOT = path.resolve(CLI_ROOT, '..')
