type NameRow = Record<string, unknown>

/** 按语言从 row 取展示名，默认 enName/cnName/name 优先级 */
export function pickLocaleName(
  row: NameRow,
  locale: string,
  enKeys: string[] = ['enName', 'name'],
  cnKeys: string[] = ['cnName', 'name', 'enName']
): string {
  const keys = locale === 'en' ? enKeys : cnKeys
  for (const k of keys) {
    const v = row[k]
    if (v != null && v !== '') {
      return String(v)
    }
  }
  return ''
}
