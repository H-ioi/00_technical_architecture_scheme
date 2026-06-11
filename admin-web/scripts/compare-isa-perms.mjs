import fs from 'fs'
import path from 'path'

const ROOT = path.resolve(import.meta.dirname, '..')
const raw = JSON.parse(fs.readFileSync(path.join(ROOT, '.tmp-menu-tree.json'), 'utf8'))
const tree = raw.data

function normPath(p) {
  if (!p) return ''
  let s = String(p).replace(/\\/g, '/')
  if (!s.startsWith('/')) s = '/' + s
  return s.replace(/\/+/g, '/').replace(/\/index$/, '').replace(/\/$/, '') || s
}

function walk(nodes, parentMenuPath = '', parentMenu = null, results = []) {
  for (const n of nodes || []) {
    const isMenu = String(n.type) === '0'
    const menuPath = isMenu ? normPath(n.path) : parentMenuPath
    const entry = {
      id: n.id,
      parentId: n.parentId,
      name: n.name || n.label,
      path: n.path,
      menuPath,
      type: String(n.type),
      permission: (n.permission || '').trim(),
      isIsa: menuPath.includes('isacommunity'),
      parentMenu
    }
    results.push(entry)
    const nextMenuPath = isMenu ? menuPath : parentMenuPath
    const nextParent = isMenu ? entry : parentMenu
    if (n.children?.length) walk(n.children, nextMenuPath, nextParent, results)
  }
  return results
}

const allNodes = walk(tree)
const isaButtons = allNodes.filter((n) => n.isIsa && n.type === '1')
const isaMenus = allNodes.filter((n) => n.isIsa && n.type === '0')

const buttonsByMenu = new Map()
for (const b of isaButtons) {
  const parentPath = b.parentMenu ? normPath(b.parentMenu.path) : 'unknown'
  if (!buttonsByMenu.has(parentPath)) buttonsByMenu.set(parentPath, [])
  buttonsByMenu.get(parentPath).push(b)
}

const apiPerms = [...new Set(isaButtons.map((b) => b.permission).filter(Boolean))].sort()

function walkDir(dir, files = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const fp = path.join(dir, ent.name)
    if (ent.isDirectory()) walkDir(fp, files)
    else if (/\.(vue|ts)$/.test(ent.name)) files.push(fp)
  }
  return files
}

const permRegexes = [
  /v-uni-permission="'([^']+)'/g,
  /v-uni-permission="([A-Za-z0-9_\-]+)"/g,
  /hasPermission\(\s*'([^']+)'\s*\)/g,
  /hasPermission\(\s*"([^"]+)"\s*\)/g
]

function extractQuotedCodes(text) {
  return (text.match(/'([^']+)'/g) || []).map((p) => p.replace(/'/g, ''))
}

function collectPermArrays(content) {
  const arrays = new Map()
  const re = /const\s+([A-Za-z0-9_]+)\s*=\s*\[([^\]]*)\]/g
  let m
  while ((m = re.exec(content))) {
    const codes = extractQuotedCodes(m[2])
    if (codes.length) arrays.set(m[1], codes)
  }
  return arrays
}

function addPermRef(localPerms, code, ref) {
  if (!code) return
  if (!localPerms.has(code)) localPerms.set(code, [])
  localPerms.get(code).push(ref)
}

const localPerms = new Map()
const srcDir = path.join(ROOT, 'src')
for (const file of walkDir(srcDir)) {
  const rel = path.relative(ROOT, file).replace(/\\/g, '/')
  if (rel.startsWith('src/views/permission/')) continue
  const content = fs.readFileSync(file, 'utf8')
  const permArrays = collectPermArrays(content)
  const lines = content.split('\n')
  lines.forEach((line, idx) => {
    for (const re of permRegexes) {
      re.lastIndex = 0
      let m
      while ((m = re.exec(line))) {
        const perm = m[1].trim()
        const ref = { file: rel, line: idx + 1 }
        if (permArrays.has(perm)) {
          permArrays.get(perm).forEach((code) => addPermRef(localPerms, code, ref))
          continue
        }
        if (perm.startsWith('[')) {
          extractQuotedCodes(perm).forEach((code) => addPermRef(localPerms, code, ref))
          continue
        }
        addPermRef(localPerms, perm, ref)
      }
    }
    for (const [name, codes] of permArrays) {
      if (line.includes(name) && /(?:v-uni-permission|:v-uni-permission)/.test(line)) {
        codes.forEach((code) => addPermRef(localPerms, code, { file: rel, line: idx + 1 }))
      }
    }
  })
}

const localCodes = [...localPerms.keys()].sort()
const apiSet = new Set(apiPerms)
const localSet = new Set(localCodes)
const onlyApi = apiPerms.filter((p) => !localSet.has(p))
const onlyLocal = localCodes.filter((p) => !apiSet.has(p))
const both = apiPerms.filter((p) => localSet.has(p))

const out = {
  summary: {
    apiButtonCount: isaButtons.length,
    apiUniquePerms: apiPerms.length,
    localUniquePerms: localCodes.length,
    matched: both.length,
    onlyApi: onlyApi.length,
    onlyLocal: onlyLocal.length
  },
  apiPerms,
  localCodes,
  onlyApi,
  onlyLocal,
  both,
  buttonsByMenu: Object.fromEntries(
    [...buttonsByMenu.entries()].map(([k, v]) => [
      k,
      v.map((b) => ({ name: b.name, permission: b.permission, path: b.path }))
    ])
  ),
  isaButtons: isaButtons.map((b) => ({
    name: b.name,
    permission: b.permission,
    menuPath: b.parentMenu ? normPath(b.parentMenu.path) : normPath(b.path),
    path: b.path
  })),
  isaMenus: isaMenus.map((m) => ({ name: m.name, path: m.path, menuPath: m.menuPath })),
  localPerms: Object.fromEntries([...localPerms.entries()])
}

fs.writeFileSync(path.join(ROOT, '.tmp-perm-compare.json'), JSON.stringify(out, null, 2))
console.log(JSON.stringify(out.summary, null, 2))
console.log('\nONLY LOCAL:')
onlyLocal.forEach((p) => console.log(`  ${p} -> ${out.localPerms[p][0].file}`))
