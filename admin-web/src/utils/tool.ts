/* 日期格式化（兼容常见 yyyy / MM / dd / hh / mm / ss / q / S 占位符） */
export function dateFormat(date: string | number | Date, fmt = 'yyyy-MM-dd hh:mm:ss'): string {
  const d = date instanceof Date ? date : new Date(date)

  if (Number.isNaN(d.getTime())) {
    return ''
  }

  const o: Record<string, number> = {
    'M+': d.getMonth() + 1,
    'd+': d.getDate(),
    'h+': d.getHours(),
    'm+': d.getMinutes(),
    's+': d.getSeconds(),
    'q+': Math.floor((d.getMonth() + 3) / 3),
    S: d.getMilliseconds()
  }

  let result = fmt
  if (/(y+)/.test(result)) {
    const y = RegExp.$1
    result = result.replace(y, String(d.getFullYear()).slice(4 - y.length))
  }

  for (const k of Object.keys(o)) {
    const reg = new RegExp(`(${k})`)
    if (!reg.test(result)) {
      continue
    }
    const matched = RegExp.$1
    const value = o[k]
    result = result.replace(
      matched,
      matched.length === 1 ? String(value) : String(value).padStart(matched.length, '0')
    )
  }

  return result
}

/** 千分位；无法解析为数字时原样返回 */
export function groupSeparator(value: number | string): string {
  const n = typeof value === 'number' ? value : Number(String(value).replace(/,/g, '').trim())

  if (!Number.isFinite(n)) {
    return String(value)
  }

  return n.toLocaleString('en-US', { maximumFractionDigits: 20 })
}
