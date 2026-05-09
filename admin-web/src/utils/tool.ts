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

/** 生成短随机编号（非 UUID 标准，仅用于展示类场景） */
export function getUUID(name = '', num = 16): string {
  if (num < 1) {
    throw new Error('Length must be at least 1')
  }

  const randomSegment = () => Math.random().toString(36).slice(2)
  let uuid = ''
  while (uuid.length < num) {
    uuid += randomSegment()
  }
  uuid = uuid.slice(0, num).toUpperCase()
  return name ? `${name}-${uuid}` : uuid
}

/** 简易画布指纹（仅浏览器环境；失败时返回空串） */
export function getCustomerUuid(): string {
  if (typeof document === 'undefined') {
    return ''
  }

  const canvas = document.createElement('canvas')
  canvas.width = 200
  canvas.height = 200
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    return ''
  }

  ctx.fillStyle = 'red'
  ctx.fillRect(25, 25, 100, 100)
  let fingerprint = canvas.toDataURL()
  fingerprint = fingerprint.replace(/[^0-9]/g, '')
  return fingerprint.slice(0, 11)
}
