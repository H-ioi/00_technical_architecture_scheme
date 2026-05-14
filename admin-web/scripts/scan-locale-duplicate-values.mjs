/**
 * 扫描 locales/lang 下各 modules 目录内 .ts 中 export default 对象：相同文案对应多个键。
 * 用法：node scripts/scan-locale-duplicate-values.mjs [--lang zh-CN|en|--all]
 */
import fs from 'fs'
import path from 'path'
import ts from 'typescript'

const root = path.resolve(import.meta.dirname, '..')
const modulesDir = (lang) => path.join(root, 'src', 'locales', 'lang', lang, 'modules')

function propKey(nameNode, sf) {
  if (ts.isIdentifier(nameNode)) return nameNode.text
  if (ts.isStringLiteral(nameNode)) return nameNode.text
  return nameNode.getText(sf)
}

/** @param {[string, string][]} out */
function collectFromObject(obj, prefix, sf, out) {
  if (!ts.isObjectLiteralExpression(obj)) return
  for (const prop of obj.properties) {
    if (!ts.isPropertyAssignment(prop)) continue
    const key = propKey(prop.name, sf)
    const fullKey = prefix ? `${prefix}.${key}` : key
    const init = prop.initializer
    if (!init) continue
    if (ts.isStringLiteral(init)) {
      out.push([fullKey, init.text])
    } else if (ts.isNoSubstitutionTemplateLiteral(init)) {
      out.push([fullKey, init.text])
    } else if (ts.isTemplateExpression(init)) {
      out.push([fullKey, init.getText(sf)])
    } else if (ts.isObjectLiteralExpression(init)) {
      collectFromObject(init, fullKey, sf, out)
    }
  }
}

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8')
  const sf = ts.createSourceFile(filePath, content, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS)
  /** @type {[string, string][]} */
  const pairs = []
  function visit(node) {
    if (ts.isExportAssignment(node)) {
      const e = node.expression
      if (ts.isObjectLiteralExpression(e)) {
        collectFromObject(e, '', sf, pairs)
      }
    }
    ts.forEachChild(node, visit)
  }
  visit(sf)
  return pairs
}

function duplicatesByValue(pairs, minKeys = 2) {
  /** @type {Map<string, string[]>} */
  const map = new Map()
  for (const [k, v] of pairs) {
    if (!map.has(v)) map.set(v, [])
    map.get(v).push(k)
  }
  const dup = []
  for (const [value, keys] of map) {
    const uniq = [...new Set(keys)].sort()
    if (uniq.length < minKeys) continue
    dup.push({ value, keys: uniq })
  }
  dup.sort((a, b) => b.keys.length - a.keys.length || a.value.localeCompare(b.value))
  return dup
}

function main() {
  const args = process.argv.slice(2)
  const langs =
    args.includes('--all') ? ['zh-CN', 'en'] : args.includes('--lang') ? [args[args.indexOf('--lang') + 1]] : ['zh-CN']

  for (const lang of langs) {
    const dir = modulesDir(lang)
    if (!fs.existsSync(dir)) {
      console.error('missing dir:', dir)
      continue
    }
    const files = fs.readdirSync(dir).filter((f) => f.endsWith('.ts'))
    console.log(`\n=== ${lang} (${files.length} files) ===\n`)
    for (const f of files.sort()) {
      const fp = path.join(dir, f)
      const pairs = scanFile(fp)
      const dups = duplicatesByValue(pairs)
      if (dups.length === 0) continue
      console.log(`--- ${f} (${dups.length} duplicate values) ---`)
      for (const { value, keys } of dups) {
        const short =
          value.length > 48 ? `${value.slice(0, 48)}…` : value
        console.log(`  "${short}"`)
        console.log(`    ×${keys.length} → ${keys.join(', ')}`)
      }
      console.log('')
    }
  }
}

main()
