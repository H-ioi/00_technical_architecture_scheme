import type { Translate } from '@/types/i18n'
import type {
  DesignerField,
  DesignerFieldKnown,
  DesignerFieldRaw,
  DesignerOption
} from '@/types/modules/activity-questionnaire'

/** 左侧题型面板可选类型 */
export const BUILDER_PALETTE_TYPES = [
  'input',
  'textarea',
  'radio',
  'checkbox',
  'select',
  'datetimepicker'
] as const

export type PaletteType = (typeof BUILDER_PALETTE_TYPES)[number]

/** 生成设计器行唯一 fontId */
export function createFontId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `f_${crypto.randomUUID()}`
  }
  return `f_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}

/** 生成模板字段 id（负数字符串） */
export function newTemplateFieldId(): string {
  return `-${Math.random().toString(36).slice(2, 11)}`
}

function nextSeqOptionId(opts: DesignerOption[]): number {
  const nums = opts.map((o) => Number(o.id)).filter((n) => Number.isFinite(n))
  let m = nums.length ? Math.max(...nums, 0) : 0
  m++
  while (nums.includes(m)) {
    m++
  }
  return m
}

/** 选项类题型默认选项 */
export function defaultOptions(kind: 'radio' | 'checkbox' | 'select'): DesignerOption[] {
  return [
    { label: kind === 'select' ? '选项一' : '选项1', id: 1, value: '', isHide: 0 },
    { label: kind === 'select' ? '选项二' : '选项2', id: 2, value: '', isHide: 0 }
  ]
}

function radioProps(): DesignerFieldKnown['properties'] {
  const option = defaultOptions('radio')
  return {
    option,
    option_default: String(option[0].id),
    searchable: false
  }
}

/** 按题型生成预设字段 */
export function presetField(type: PaletteType): DesignerFieldKnown {
  const id = newTemplateFieldId()
  switch (type) {
    case 'input':
      return {
        kind: 'known',
        fontId: createFontId(),
        id,
        type: 'input',
        label: '单行文本',
        required: false,
        readonly: false,
        disabled: false,
        isHide: false,
        regex: '',
        regexHint: '',
        datetimeTypeKey: '',
        properties: { placeholder: '' }
      }
    case 'textarea':
      return {
        kind: 'known',
        fontId: createFontId(),
        id,
        type: 'textarea',
        label: '多行文本',
        required: false,
        readonly: false,
        disabled: false,
        isHide: false,
        regex: '',
        regexHint: '',
        datetimeTypeKey: '',
        properties: {
          placeholder: '',
          text_num_line: 3,
          text_num_column: 40
        }
      }
    case 'radio':
      return {
        kind: 'known',
        fontId: createFontId(),
        id,
        type: 'radio',
        label: '单选题',
        required: false,
        readonly: false,
        disabled: false,
        isHide: false,
        regex: '',
        regexHint: '',
        datetimeTypeKey: '',
        properties: radioProps()
      }
    case 'checkbox':
      return {
        kind: 'known',
        fontId: createFontId(),
        id,
        type: 'checkbox',
        label: '多选题',
        required: false,
        readonly: false,
        disabled: false,
        isHide: false,
        regex: '',
        regexHint: '',
        datetimeTypeKey: '',
        properties: {
          option: defaultOptions('checkbox'),
          option_default: [],
          searchable: false
        }
      }
    case 'select':
      return {
        kind: 'known',
        fontId: createFontId(),
        id,
        type: 'select',
        label: '下拉',
        required: false,
        readonly: false,
        disabled: false,
        isHide: false,
        regex: '',
        regexHint: '',
        datetimeTypeKey: '',
        properties: {
          option: defaultOptions('select'),
          option_default: [],
          option_multi: false,
          searchable: true
        }
      }
    case 'datetimepicker':
      return {
        kind: 'known',
        fontId: createFontId(),
        id,
        type: 'datetimepicker',
        label: '日期时间',
        required: false,
        readonly: false,
        disabled: false,
        isHide: false,
        regex: '',
        regexHint: '',
        datetimeTypeKey: 'date',
        properties: {
          datetime_type: 'date',
          datetime_pattern: 'yyyy-MM-dd'
        }
      }
    default: {
      const _x: never = type
      throw new Error(`unknown palette type ${_x}`)
    }
  }
}

/** 为选项类字段追加一行选项 */
export function builderAddOptionRow(f: DesignerFieldKnown): DesignerFieldKnown {
  const p = { ...f.properties }
  const list = [...(Array.isArray(p.option) ? p.option : [])]
  const nid = nextSeqOptionId(list)
  list.push({ label: `选项${nid}`, id: nid, value: '', isHide: 0 })
  p.option = list
  return { ...f, properties: p }
}

/** 深拷贝 known 字段 */
export function cloneKnown(row: DesignerFieldKnown): DesignerFieldKnown {
  return JSON.parse(JSON.stringify(row)) as DesignerFieldKnown
}

/** 原始后端字段 type 展示 */
export function rawType(row: DesignerFieldRaw): string {
  return String(row.backendRow.type ?? '?')
}

/** 列表行类型标签 */
export function rowBadge(row: DesignerField, tr: Translate): string {
  return row.kind === 'raw'
    ? `${tr('activity.qbRawPrefix')} (${rawType(row as DesignerFieldRaw)})`
    : tr(`activity.qbTypes.${(row as DesignerFieldKnown).type}`)
}

/** 中间预览：选中行用 draft，其它行用列表快照 */
export function effectiveKnown(
  row: DesignerField,
  draft: DesignerFieldKnown | null
): DesignerFieldKnown | null {
  if (row.kind !== 'known') {
    return null
  }
  if (draft?.fontId === row.fontId) {
    return draft
  }
  return row
}

/** 预览切片：仅 known 行返回单元素数组 */
export function previewSlice(
  row: DesignerField,
  draft: DesignerFieldKnown | null
): DesignerFieldKnown[] {
  const k = effectiveKnown(row, draft)
  return k ? [k] : []
}

/** 中间栏预览区：一次算出模板所需展示字段，避免多个单步 getter */
export type KnownFieldPreview = {
  label: string
  options: DesignerOption[]
  selectMulti: boolean
  multiVals: number[]
  radioVal: string
  dateType: 'date' | 'datetime' | 'month'
  textareaRows: number
}

export function buildKnownFieldPreview(k: DesignerFieldKnown): KnownFieldPreview {
  const list = Array.isArray(k.properties.option) ? k.properties.option : []
  const dt = String(k.datetimeTypeKey || k.properties.datetime_type || 'date')
  let dateType: 'date' | 'datetime' | 'month' = 'date'
  if (dt === 'datetime') {
    dateType = 'datetime'
  } else if (dt === 'month') {
    dateType = 'month'
  }
  const lineNum = Number(k.properties.text_num_line)
  let textareaRows = 3
  if (Number.isFinite(lineNum) && lineNum > 0) {
    textareaRows = Math.min(8, Math.max(2, lineNum))
  }
  const rawDefault = k.properties.option_default
  return {
    label: k.required ? `${k.label} *` : k.label,
    options: list.filter((o) => !o.isHide),
    selectMulti: k.properties.option_multi === true || k.properties.option_multi === 'true',
    multiVals: Array.isArray(rawDefault) ? rawDefault.map((x) => Number(x)) : [],
    radioVal: String(k.properties.option_default ?? ''),
    dateType,
    textareaRows
  }
}
