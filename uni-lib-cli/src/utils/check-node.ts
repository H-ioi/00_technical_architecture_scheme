/** 脚手架最低 Node 版本要求 */
const MIN_NODE_VERSION = '18.12.0'

/** 启动前校验 Node 版本，避免依赖库报 cryptic 错误 */
export function assertNodeVersion(): void {
  const current = process.versions.node
  if (compareNodeVersion(current, MIN_NODE_VERSION) >= 0) {
    return
  }

  console.error('')
  console.error(`  ✖ uni-lib-cli 需要 Node.js >= ${MIN_NODE_VERSION}`)
  console.error(`    当前版本: ${current}`)
  console.error('')
  console.error('  请升级 Node 后重试: https://nodejs.org/')
  console.error('')
  process.exit(1)
}

function compareNodeVersion(current: string, required: string): number {
  const currentParts = current.split('.').map((part) => Number(part))
  const requiredParts = required.split('.').map((part) => Number(part))
  const length = Math.max(currentParts.length, requiredParts.length)

  for (let index = 0; index < length; index += 1) {
    const left = currentParts[index] ?? 0
    const right = requiredParts[index] ?? 0
    if (left > right) {
      return 1
    }
    if (left < right) {
      return -1
    }
  }

  return 0
}
