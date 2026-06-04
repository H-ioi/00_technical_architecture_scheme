import type { Loose, StudentSuggest } from './bus-order-form-types'

/** 从接口响应中取出数组 */
export const pickArray = (payload: unknown): Record<string, unknown>[] => {
  if (Array.isArray(payload)) {
    return payload as Record<string, unknown>[]
  }
  if (payload && typeof payload === 'object') {
    const data = (payload as Loose).data
    if (Array.isArray(data)) {
      return data as Record<string, unknown>[]
    }
  }
  return []
}

export const suggestLine = (raw: unknown) => {
  const item = raw as StudentSuggest
  const adm = item.admissonNo ?? item.value ?? ''
  return `${adm} — ${item.fullName ?? ''}`
}
