/** 群发邮件列表接口解包（兼容 `{ data, total }` / 嵌套 `data.records`）。 */

type Loose = Record<string, unknown>

export const unwrapMailPage = (raw: unknown): { list: Loose[]; total: number } => {
  if (!raw || typeof raw !== 'object') {
    return { list: [], total: 0 }
  }
  const r = raw as Loose
  const totalTop = Number(r.total ?? r.totalCount ?? 0)
  const inner = r.data
  if (Array.isArray(inner)) {
    return { list: inner as Loose[], total: totalTop }
  }
  if (inner && typeof inner === 'object') {
    const d = inner as Loose
    if (Array.isArray(d.data)) {
      return { list: d.data as Loose[], total: Number(d.total ?? d.totalCount ?? r.total ?? 0) }
    }
    if (Array.isArray(d.records)) {
      return { list: d.records as Loose[], total: Number(d.total ?? d.totalCount ?? totalTop) }
    }
  }
  if (Array.isArray(r.records)) {
    return { list: r.records as Loose[], total: Number(r.total ?? 0) }
  }
  return { list: [], total: 0 }
}

export const unwrapMailEnvelope = (raw: unknown): Loose => {
  if (!raw || typeof raw !== 'object') {
    return {}
  }
  const r = raw as Loose
  if (r.data && typeof r.data === 'object' && !Array.isArray(r.data)) {
    return r.data as Loose
  }
  return r
}

/** 群组 `scopes` 单行编码转可读文案（对齐旧 `group.vue` `convertGroup`）。 */
export const formatMailGroupScopeDisplay = (str: string): string => {
  if (!str) {
    return '—'
  }
  const parts = str.split(',')
  const result: string[] = []
  if (parts[0] && parts[0] !== 'All') {
    result.push(parts[0])
  }
  if (parts[1] && parts[1] !== 'All') {
    result.push(parts[1])
  }
  if (parts[2] && parts[2] !== 'All') {
    result.push(parts[2])
  }
  if (parts[3] && parts[3] !== 'All') {
    result.push(parts[3])
  }
  if (parts[4] && parts[4] !== 'All') {
    if (parts[4] === 'true' || parts[4] === '是') {
      result.push('乘坐校巴(是)')
    } else {
      result.push('乘坐校巴(否)')
    }
  }
  if (parts[5] && parts[5] !== 'All') {
    if (parts[5] === 'true' || parts[5] === '是') {
      result.push('住宿(是)')
    } else {
      result.push('住宿(否)')
    }
  }
  if (parts[6] && parts[6] !== 'All') {
    result.push(parts[6])
  }
  if (parts[7] && parts[7] !== 'All') {
    result.push(parts[7])
  }
  if (parts[8] && parts[8] !== 'All') {
    result.push(parts[8])
  }
  return result.join('，') || '—'
}
