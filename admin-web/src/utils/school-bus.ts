type Loose = Record<string, unknown>

/** 列表行 schoolIds：兼容 schoolId、逗号分隔串、单值 */
export function normalizeSchoolIdsOnRow(row: Loose): void {
  if (row.schoolIds == null && row.schoolId != null) {
    row.schoolIds = [row.schoolId as string | number]
  }

  const raw = row.schoolIds

  if (Array.isArray(raw)) {
    row.schoolIds = raw.filter((x) => x !== '' && x != null) as Array<string | number>
    return
  }

  if (raw == null || raw === '') {
    row.schoolIds = []
    return
  }

  if (typeof raw === 'string' && raw.includes(',')) {
    row.schoolIds = raw
      .split(',')
      .map((s) => s.trim())
      .filter((x) => x !== '')
    return
  }

  row.schoolIds = [raw as string | number]
}

/** 请求参数去掉空串 / 空数组 */
export function stripEmptyQueryParams(p: Record<string, unknown>): Record<string, unknown> {
  const o: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(p)) {
    if (v === '' || v === undefined || v === null) {
      continue
    }
    if (Array.isArray(v) && v.length === 0) {
      continue
    }
    o[k] = v
  }
  return o
}

/** 校车级联接口 schoolIds：表单 school 字段 + 单校默认 id */
export function schoolIdsForCascadeApi(
  schoolField: unknown,
  options: { multiSchool: boolean; defaultSchoolId?: string | number | null }
): Array<string | number> {
  if (Array.isArray(schoolField)) {
    return schoolField as Array<string | number>
  }
  if (schoolField != null && schoolField !== '') {
    return [schoolField as string | number]
  }
  if (!options.multiSchool && options.defaultSchoolId != null) {
    return [options.defaultSchoolId]
  }
  return []
}
