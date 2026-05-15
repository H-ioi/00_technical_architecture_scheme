import type { DesignerFieldKnown, DesignerOption } from '@/views/activity/questionnaire/builder/types'

import { createFontId, newTemplateFieldId } from '@/views/activity/questionnaire/builder/template-codec'

export const BUILDER_PALETTE_TYPES = [
  'input',
  'textarea',
  'radio',
  'checkbox',
  'select',
  'datetimepicker'
] as const

export type PaletteType = (typeof BUILDER_PALETTE_TYPES)[number]

function nextSeqOptionId(opts: DesignerOption[]): number {
  const nums = opts.map((o) => Number(o.id)).filter((n) => Number.isFinite(n))
  let m = nums.length ? Math.max(...nums, 0) : 0
  m++

  while (nums.includes(m)) {
    m++
  }

  return m
}

function defaultOptions(kind: 'radio' | 'checkbox' | 'select'): DesignerOption[] {
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

/** 题库侧新增题目的默认骨架（题干 id 仍为负号占位，后端可接受）。 */
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

/** 为多选类题目追加选项行。 */

export function builderAddOptionRow(f: DesignerFieldKnown): DesignerFieldKnown {

  const p = { ...f.properties }
  const list = [...(Array.isArray(p.option) ? p.option : [])]
  const nid = nextSeqOptionId(list)

  list.push({ label: `选项${nid}`, id: nid, value: '', isHide: 0 })

  p.option = list

  return { ...f, properties: p }

}
