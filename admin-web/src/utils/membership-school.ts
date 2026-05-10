import type { SchoolOptionRecord } from '@/types/modules/membership'
import { toUniOptions, type UniOption } from 'uni-ui-lib'

/** 与司机/校车筛选一致：校区下拉 options（中/英 label 优先级）。 */
export const membershipSchoolToOptions = (
  records: SchoolOptionRecord[],
  locale: string
): UniOption[] =>
  toUniOptions(records, {
    labelKeys: locale === 'en' ? ['enName', 'name'] : ['name', 'cnName', 'enName'],
    valueKey: 'id'
  })

/** 与校区下拉同一套优先级，用于列表/详情展示。 */
export const membershipSchoolLabel = (
  records: SchoolOptionRecord[],
  id: unknown,
  locale: string
): string => {
  if (id === undefined || id === null || id === '') {
    return '--'
  }
  const hit = records.find((s) => String(s.id) === String(id))
  if (!hit) {
    return '--'
  }
  if (locale === 'en') {
    const v = hit.enName ?? hit.name ?? hit.cnName
    return v != null && String(v) !== '' ? String(v) : '--'
  }
  const v = hit.name ?? hit.cnName ?? hit.enName
  return v != null && String(v) !== '' ? String(v) : '--'
}

/** 多校区：拼接展示；字典命不中时用 fallback（多为接口回填文案）。 */
export const membershipSchoolLabelsJoined = (
  records: SchoolOptionRecord[],
  ids: unknown,
  locale: string,
  fallback?: string
): string => {
  if (!Array.isArray(ids) || ids.length === 0) {
    return fallback != null && String(fallback) !== '' ? String(fallback) : '--'
  }
  const parts = ids.map((id) => membershipSchoolLabel(records, id, locale))
  const nonDash = parts.filter((s) => s !== '--')
  if (nonDash.length === 0) {
    return fallback != null && String(fallback) !== '' ? String(fallback) : '--'
  }
  return nonDash.join('、')
}
