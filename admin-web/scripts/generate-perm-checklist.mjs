import fs from 'fs'
import path from 'path'

const ROOT = path.resolve(import.meta.dirname, '..')
const compare = JSON.parse(fs.readFileSync(path.join(ROOT, '.tmp-perm-compare.json'), 'utf8'))
const raw = JSON.parse(fs.readFileSync(path.join(ROOT, '.tmp-menu-tree.json'), 'utf8'))
const tree = raw.data

const apiSet = new Set(compare.apiPerms)
const localSet = new Set(compare.localCodes)
const localPerms = compare.localPerms

function status(perm) {
  const inApi = apiSet.has(perm)
  const inCode = localSet.has(perm)
  if (inApi && inCode) return '✅'
  if (inApi && !inCode) return '⚠️ API有/代码无'
  if (!inApi && inCode) return '❌ 代码有/API无'
  return '—'
}

function codeRef(perm) {
  const refs = localPerms[perm]
  if (!refs?.length) return ''
  const r = refs[0]
  return `\`${r.file}:${r.line}\``
}

function walkTree(nodes, parentMenuPath = '', lines = []) {
  const menus = (nodes || []).filter((n) => String(n.type) === '0')
  for (const menu of menus) {
    const menuPath = menu.path || parentMenuPath
    if (!menuPath.includes('isacommunity')) {
      if (menu.children?.length) walkTree(menu.children, menuPath, lines)
      continue
    }
    const buttons = (menu.children || []).filter((n) => String(n.type) === '1')
    if (!buttons.length) {
      lines.push(`- **${menu.name}** \`${menuPath}\``)
      lines.push(`  - （无按钮权限子节点）`)
      if (menu.children?.length) walkTree(menu.children, menuPath, lines)
      continue
    }
    lines.push(`- **${menu.name}** \`${menuPath}\``)
    for (const btn of buttons) {
      const perm = (btn.permission || '').trim()
      const st = status(perm)
      const ref = codeRef(perm)
      lines.push(`  - ${st} \`${perm}\` — ${btn.name}${ref ? ` → ${ref}` : ''}`)
    }
    const childMenus = (menu.children || []).filter((n) => String(n.type) === '0')
    if (childMenus.length) walkTree(childMenus, menuPath, lines)
  }
  return lines
}

const treeLines = walkTree(tree)
const date = '2026-06-11'

const md = `# isacommunity 权限核对清单

> 生成时间：${date}
> 数据来源：\`GET http://192.168.123.23/admin/menu/tree?lazy=false\`
> 对照范围：admin-web 业务代码（排除 \`views/permission/*\` 后台权限管理）

## 汇总

| 指标 | 数量 |
| --- | ---: |
| API 按钮节点（isacommunity） | ${compare.summary.apiButtonCount} |
| API 唯一权限码 | ${compare.summary.apiUniquePerms} |
| 代码唯一权限码 | ${compare.summary.localUniquePerms} |
| 双方一致 | ${compare.summary.matched} |
| 仅 API 有（代码未引用） | ${compare.summary.onlyApi} |
| 仅代码有（API 无，已/待移除） | ${compare.summary.onlyLocal} |

## 图例

| 标记 | 含义 |
| --- | --- |
| ✅ | API 与代码均已使用该权限码 |
| ⚠️ API有/代码无 | 菜单已配置，重构代码尚未接入 \`v-uni-permission\` / \`hasPermission\` |
| ❌ 代码有/API无 | 代码引用了菜单树中不存在的权限码，应移除或改码 |

## 菜单树（按钮权限）

${treeLines.join('\n')}

## 仅 API 有、代码未引用（${compare.onlyApi.length}）

${compare.onlyApi.map((p) => `- ⚠️ \`${p}\``).join('\n')}

## 仅代码有、API 无（${compare.onlyLocal.length}）

${compare.onlyLocal.map((p) => {
  const ref = codeRef(p)
  return `- ❌ \`${p}\`${ref ? ` → ${ref}` : ''}`
}).join('\n')}

## 同步动作（本轮）

| 权限码 | 动作 | 文件 |
| --- | --- | --- |
| \`mailgroup-view\` | 改为 API 码 \`mailgroup-vieew\`（后端拼写） | \`views/email/group/list.vue\` |
| \`activity_ticket_del\` | 移除（API 无此码，删除能力回退 \`busdriver_del\`） | 活动详情多个 Tab |
| \`busline_batchCopy\` 等 | 改为 API 码 \`busline_batch_copy\` | \`views/school-bus/route/plan/tab.vue\` |

## 备注

- **导航按钮**（\`/isacommunity/content/navbutton\`）：菜单存在，但 API 树中**未配置任何按钮权限子节点**；\`navigate-button/list.vue\` 当前无权限控制。
- **\`mailgroup-vieew\`**：API 菜单拼写为 \`vieew\`（非 \`view\`），代码须与后端一致方可鉴权通过。
- **活动模块**：多处复用 \`busdriver_edit\` / \`busdriver_del\` 作为活动操作码（与旧系统一致）；非码表错误。
- **未迁移模块**：若菜单/API 有而 admin-web 尚无对应页面，记为 ⚠️，待页面落地时补权限。
`

const outPath = path.join(ROOT, 'doc/qa/权限核对清单.md')
fs.writeFileSync(outPath, md)
console.log('Wrote', outPath)
