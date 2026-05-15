/** 答卷表格：按旧 templateresult.vue 的规则把单元格格式化为可读字符串 */

type LooseArr = Record<string, unknown>[]

export type SubmissionColumnMeta = {
  prop: string

  label: string
  /** 题库字段原始 type */
  kind: string
  /** `/template/dynamic/form/get/:id` 里的 `properties` 数组形态 */
  properties: LooseArr

}

/** 跳过关联题列（表格不展示）。 */
export function submissionColumnsFromFields(
  fields: Record<string, unknown>[],

  t: {
    submissionColCreateTime: string
    submissionColHiddenSuffix: string
    studentBirth: string
    studentGender: string
    studentSchool: string
    studentName: string
  },

  opts: {
    /** needStudentInfo === '1' */

    appendStudentCols: boolean

  }
): SubmissionColumnMeta[] {

  const rows = [...fields]
    .filter((f) => String(f.type ?? '') !== 'association')
    .sort((a, b) => Number(a.sort ?? 0) - Number(b.sort ?? 0))

  const base: SubmissionColumnMeta[] = rows.map((item) => {
    const hid = Boolean(item.isHide)
    const label = `${String(item.label ?? '')}${hid ? t.submissionColHiddenSuffix : ''}`

    const propsRaw = Array.isArray(item.properties) ? (item.properties as LooseArr) : []

    return {

      prop: String(item.id ?? ''),
      label,

      kind: String(item.type ?? ''),
      properties: propsRaw
    }
  })

  const studentLeading: SubmissionColumnMeta[] = opts.appendStudentCols

    ? [

        {

          prop: 'studentBirthDate',
          label: t.studentBirth,

          kind: '__student__',
          properties: []
        },
        {
          prop: 'studentGender',

          label: t.studentGender,
          kind: '__student__',

          properties: []

        },
        {
          prop: 'studentSchool',
          label: t.studentSchool,

          kind: '__student__',
          properties: []
        },
        {
          prop: 'studentName',
          label: t.studentName,
          kind: '__student__',

          properties: []

        }

      ]

    : []

  return [
    ...studentLeading,

    ...base,

    {
      prop: 'createTime',

      label: t.submissionColCreateTime,
      kind: '__meta__',

      properties: []

    }
  ].filter((c) => c.prop)
}

function parseJsonMaybe(v: unknown): unknown {

  if (v == null || v === '') {

    return null

  }

  if (typeof v !== 'string') {

    return v

  }

  try {
    return JSON.parse(v)
  } catch {
    return v
  }

}

function propsOptions(meta: SubmissionColumnMeta): { id: number; label?: string; value?: unknown }[] {
  const out: { id: number; label?: string; value?: unknown }[] = []

  for (const p of meta.properties) {
    if (String(p.key ?? '') !== 'option') {
      continue
    }

    out.push({
      id: typeof p.id === 'number' ? p.id : Number(p.id),
      label: p.label !== undefined ? String(p.label) : undefined,

      value: p.value
    })
  }

  return out
}

/** 把学生性别列转成文案（与旧页一致）。 */

export function fmtStudentGender(raw: unknown, tMale: string, tFemale: string): string {

  if (raw === true || raw === 'true' || raw === 1 || raw === '1') {
    return tMale
  }

  if (raw === false || raw === 'false' || raw === 0 || raw === '0') {
    return tFemale
  }

  return raw == null || raw === '' ? '—' : String(raw)
}

export function fmtSubmissionCell(meta: SubmissionColumnMeta, raw: unknown, uploadIds?: number[]): unknown {

  const v = raw

  switch (meta.kind) {
    case '__student__': {

      return v == null || v === '' ? '—' : `${v}`

    }

    case 'input':

    case 'textarea':

      return v == null || `${v}` === '' ? '—' : `${v}`

    case 'radio': {

      const props = propsOptions(meta)

      const idNum = typeof v === 'number' ? v : Number(v)

      const hit =

        props.find((o) => o.id === idNum || String(o.id) === String(v)) ?? null

      if (hit?.value !== undefined && hit.value !== '') {
        return String(hit.value)
      }

      if (hit?.label) {
        return hit.label
      }

      return v == null || v === '' ? '—' : String(v)
    }

    case 'checkbox':

    case 'select': {

      const props = propsOptions(meta)

      const parsed = parseJsonMaybe(v)
      let ids: number[] = []

      if (Array.isArray(parsed)) {
        ids = parsed.map((x) => Number(x))
      } else if (typeof parsed === 'number') {
        ids = [parsed]

      }

      const arr: string[] = []

      props.forEach((o) => {

        if (ids.includes(Number(o.id))) {
          arr.push(

            meta.kind === 'checkbox'
              ? String(o.value ?? o.label ?? o.id)
              : String(o.label ?? o.value ?? o.id)
          )
        }
      })

      return arr.length ? arr.join(',') : '—'

    }

    case 'datetimepicker': {

      const parsed = parseJsonMaybe(v)

      if (Array.isArray(parsed) && parsed.length) {

        const first = parsed[0]

        return first == null || first === '' ? '—' : `${first}`

      }

      return v == null || v === '' ? '—' : String(v)
    }

    case 'upload': {

      if (uploadIds && uploadIds.length) {

        return { __upload__: true as const, ids: uploadIds }

      }

      return '—'

    }

    default:

      return v == null || v === '' ? '—' : `${v}`

  }

}

/** 从上传控件原始值中提取文件数字 id（容错多种历史格式）。 */
export function collectUploadNumericIds(raw: unknown): number[] {

  const parsed = parseJsonMaybe(raw)

  if (Array.isArray(parsed)) {
    return parsed.map((x) => Number(x)).filter((n) => Number.isFinite(n))
  }

  if (typeof raw === 'string') {
    const m = raw.match(/\d+/gu)

    if (m?.length) {

      return m.map((s) => Number(s)).filter((n) => Number.isFinite(n))
    }
  }

  if (typeof raw === 'number' && Number.isFinite(raw)) {
    return [raw]
  }

  return []

}
