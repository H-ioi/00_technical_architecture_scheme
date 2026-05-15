/**
 * 将 Vue SFC 中「扁平 BEM」改为以根块嵌套的 scss（.block__x -> .block { &__x }）
 * 仅处理：scoped + lang="scss"、单一 BEM 根、且未使用 &__ 的旧写法。
 */
import fs from 'node:fs'
import path from 'node:path'

const VIEWS_ROOT = path.resolve('src/views')

function walkVue(dir, out = []) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name)
    const st = fs.statSync(p)
    if (st.isDirectory()) walkVue(p, out)
    else if (name.endsWith('.vue')) out.push(p)
  }
  return out
}

function skipWs(text, i) {
  while (i < text.length && /\s/.test(text[i])) i++
  return i
}

function skipComment(text, i) {
  if (text.slice(i, i + 2) !== '/*') return i
  i += 2
  while (i < text.length - 1 && !(text[i] === '*' && text[i + 1] === '/')) i++
  return i + 2
}

function parseTopLevelRules(text) {
  const rules = []
  let i = 0
  const n = text.length

  while (i < n) {
    i = skipWs(text, i)
    if (i >= n) break
    if (text.slice(i, i + 2) === '/*') {
      i = skipComment(text, i)
      continue
    }

    const selStart = i
    while (i < n) {
      if (text.slice(i, i + 2) === '/*') {
        i = skipComment(text, i)
        continue
      }
      if (text[i] === '{') break
      if (text[i] === '"' || text[i] === "'") {
        const q = text[i]
        i++
        while (i < n) {
          if (text[i] === '\\') {
            i += 2
            continue
          }
          if (text[i] === q) {
            i++
            break
          }
          i++
        }
        continue
      }
      i++
    }
    if (i >= n || text[i] !== '{') break

    const selector = text.slice(selStart, i).trim()
    i++
    let depth = 1
    const bodyStart = i
    while (i < n && depth > 0) {
      if (text.slice(i, i + 2) === '/*') {
        i = skipComment(text, i)
        continue
      }
      const ch = text[i]
      if (ch === '"' || ch === "'") {
        const q = ch
        i++
        while (i < n) {
          if (text[i] === '\\') {
            i += 2
            continue
          }
          if (text[i] === q) {
            i++
            break
          }
          i++
        }
        continue
      }
      if (ch === '{') depth++
      else if (ch === '}') depth--
      i++
    }
    const body = text.slice(bodyStart, i - 1)
    rules.push({ selector, body })
    i = skipWs(text, i)
  }
  return rules
}

function splitSelectors(sel) {
  const parts = []
  let cur = ''
  let depth = 0
  for (let j = 0; j < sel.length; j++) {
    const ch = sel[j]
    if (ch === '(') depth++
    else if (ch === ')' && depth > 0) depth--
    else if (ch === ',' && depth === 0) {
      parts.push(cur.trim())
      cur = ''
      continue
    }
    cur += ch
  }
  if (cur.trim()) parts.push(cur.trim())
  return parts
}

function transformSelectorList(sel, prefix) {
  const dotPref = `.${prefix}__`
  const parts = splitSelectors(sel).map((part) => {
    if (part === `.${prefix}`) return '&'
    if (part.startsWith(dotPref)) return `&__${part.slice(dotPref.length)}`
    return null
  })
  if (parts.some((p) => p === null)) return null
  return parts.join(', ')
}

function indentLines(body, spaces) {
  const pad = ' '.repeat(spaces)
  return body
    .split('\n')
    .map((line) => (line.trim() ? pad + line : ''))
    .join('\n')
}

function nestMediaInner(innerBody, prefix) {
  const innerRules = parseTopLevelRules(innerBody)
  const chunks = []
  for (const r of innerRules) {
    const ts = transformSelectorList(r.selector, prefix)
    if (!ts) return null
    chunks.push(`${ts} {\n${indentLines(r.body, 2)}\n}`)
  }
  return chunks.join('\n\n')
}

function detectPrefix(rules) {
  const candidates = new Set()
  for (const r of rules) {
    const s = r.selector.trim()
    if (s.startsWith('@')) continue
    const single = /^\.([a-zA-Z0-9_-]+)$/.exec(s)
    // BEM 元素形如 .qb__foo，也会被 [\w-]+ 整块匹配，必须排除含 __ 的「伪单类」
    if (single && !single[1].includes('__')) candidates.add(single[1])
    const bem = /^\.([a-zA-Z0-9_-]+)__/.exec(s)
    if (bem) candidates.add(bem[1])
  }
  if (candidates.size !== 1) return null
  return [...candidates][0]
}

function validateAllRulesMatchPrefix(rules, prefix) {
  for (const r of rules) {
    const s = r.selector.trim()
    if (s.startsWith('@')) {
      const inner = parseTopLevelRules(r.body)
      if (!validateAllRulesMatchPrefix(inner, prefix)) return false
      continue
    }
    if (transformSelectorList(s, prefix) === null) return false
  }
  return true
}

/** 是否存在扁平 BEM 元素选择器（否则已是单块根或无转换必要） */
function hasFlatBemElementSelector(rules) {
  for (const r of rules) {
    const s = r.selector.trim()
    if (s.startsWith('@')) {
      if (hasFlatBemElementSelector(parseTopLevelRules(r.body))) return true
      continue
    }
    if (/^\.[a-zA-Z0-9_-]+__/.test(s)) return true
  }
  return false
}

function buildNestedScss(prefix, rules) {
  const lines = []
  lines.push(`.${prefix} {`)

  for (const r of rules) {
    const s = r.selector.trim()
    if (s.startsWith('@')) {
      const nestedInner = nestMediaInner(r.body, prefix)
      if (!nestedInner) return null
      lines.push(`  ${s} {`)
      nestedInner.split('\n').forEach((line) => {
        lines.push(line.trim() ? `    ${line}` : '')
      })
      lines.push('  }')
      continue
    }

    if (s === `.${prefix}`) {
      r.body
        .split('\n')
        .forEach((line) => lines.push(line.trim() ? `  ${line}` : ''))
      continue
    }

    const ts = transformSelectorList(s, prefix)
    if (!ts) return null
    lines.push(`  ${ts} {`)
    lines.push(indentLines(r.body, 4))
    lines.push('  }')
  }

  lines.push('}')
  return lines.join('\n')
}

function transformStyleBody(body) {
  const trimmed = body.trim()
  if (!trimmed) return null
  if (/&__/.test(trimmed)) return null

  const rules = parseTopLevelRules(trimmed)
  if (!rules.length) return null
  if (!hasFlatBemElementSelector(rules)) return null

  const prefix = detectPrefix(rules)
  if (!prefix) return null
  if (!validateAllRulesMatchPrefix(rules, prefix)) return null

  const nested = buildNestedScss(prefix, rules)
  return nested ? `${nested}\n` : null
}

function transformVue(content) {
  const re = /<style([^>]*lang="scss"[^>]*)>([\s\S]*?)<\/style>/gi
  let replaced = false
  const next = content.replace(re, (full, attrs, inner) => {
    if (!/\bscoped\b/.test(attrs)) return full
    const out = transformStyleBody(inner)
    if (!out || out.trim() === inner.trim()) return full
    replaced = true
    return `<style${attrs}>\n${out}</style>`
  })
  return replaced ? next : null
}

function main() {
  const files = walkVue(VIEWS_ROOT)
  let n = 0
  for (const file of files) {
    const raw = fs.readFileSync(file, 'utf8')
    if (!/<style[^>]*lang="scss"/i.test(raw)) continue
    const next = transformVue(raw)
    if (next) {
      fs.writeFileSync(file, next, 'utf8')
      n++
      console.log('nested:', path.relative(process.cwd(), file))
    }
  }
  console.log(`Done. Updated ${n} files.`)
}

main()
