import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock crypto.randomUUID for deterministic createFontId tests
const mockUuid = '550e8400-e29b-41d4-a716-446655440000'
vi.stubGlobal('crypto', {
  randomUUID: vi.fn(() => mockUuid)
})

import type { Translate } from '@/types/i18n'
import type {
  DesignerField,
  DesignerFieldKnown,
  DesignerFieldRaw
} from '@/types/modules/activity-questionnaire'
import {
  BUILDER_PALETTE_TYPES,
  createFontId,
  newTemplateFieldId,
  defaultOptions,
  presetField,
  builderAddOptionRow,
  cloneKnown,
  rawType,
  rowBadge,
  effectiveKnown,
  previewSlice,
  buildKnownFieldPreview
} from '../../../../views/activity/questionnaire/components/questionnaire-builder-utils'

const t = ((key: string) => key) as Translate

describe('questionnaire-builder-utils.ts', () => {
  describe('BUILDER_PALETTE_TYPES', () => {
    it('应包含 6 种题型', () => {
      expect(BUILDER_PALETTE_TYPES).toEqual([
        'input', 'textarea', 'radio', 'checkbox', 'select', 'datetimepicker'
      ])
    })
  })

  describe('createFontId', () => {
    it('crypto 可用时应使用 randomUUID', () => {
      const result = createFontId()
      expect(result).toBe(`f_${mockUuid}`)
    })

    it('crypto 不可用时使用 Date + Math.random 降级', () => {
      // remove crypto mock temporarily
      vi.unstubAllGlobals()
      // no crypto available
      vi.stubGlobal('crypto', undefined)
      const result = createFontId()
      expect(result).toMatch(/^f_\d+_[a-z0-9]+$/)
      // restore crypto
      vi.stubGlobal('crypto', { randomUUID: vi.fn(() => mockUuid) })
    })
  })

  describe('newTemplateFieldId', () => {
    it('应返回负数字符串', () => {
      const id = newTemplateFieldId()
      expect(id).toMatch(/^-\w+/)
    })
  })

  describe('defaultOptions', () => {
    it('radio/checkbox 应返回选项1、选项2', () => {
      const opts = defaultOptions('radio')
      expect(opts).toHaveLength(2)
      expect(opts[0]).toMatchObject({ label: '选项1', id: 1, value: '', isHide: 0 })
      expect(opts[1]).toMatchObject({ label: '选项2', id: 2, value: '', isHide: 0 })
    })

    it('select 应返回选项一、选项二', () => {
      const opts = defaultOptions('select')
      expect(opts[0]).toMatchObject({ label: '选项一' })
      expect(opts[1]).toMatchObject({ label: '选项二' })
    })
  })

  describe('presetField', () => {
    it('input 类型预设应正确', () => {
      const f = presetField('input')
      expect(f.type).toBe('input')
      expect(f.label).toBe('单行文本')
      expect(f.kind).toBe('known')
      expect(f.properties).toHaveProperty('placeholder', '')
    })

    it('textarea 类型预设应正确', () => {
      const f = presetField('textarea')
      expect(f.type).toBe('textarea')
      expect(f.label).toBe('多行文本')
      expect(f.properties).toMatchObject({ text_num_line: 3, text_num_column: 40 })
    })

    it('radio 类型预设应正确', () => {
      const f = presetField('radio')
      expect(f.type).toBe('radio')
      expect(f.label).toBe('单选题')
      expect(Array.isArray(f.properties.option)).toBe(true)
      expect(f.properties.option).toHaveLength(2)
      expect(f.properties.option_default).toBe('1')
    })

    it('checkbox 类型预设应正确', () => {
      const f = presetField('checkbox')
      expect(f.type).toBe('checkbox')
      expect(f.label).toBe('多选题')
      expect(f.properties.option_default).toEqual([])
    })

    it('select 类型预设应正确', () => {
      const f = presetField('select')
      expect(f.type).toBe('select')
      expect(f.label).toBe('下拉')
      expect(f.properties.option_multi).toBe(false)
      expect(f.properties.searchable).toBe(true)
    })

    it('datetimepicker 类型预设应正确', () => {
      const f = presetField('datetimepicker')
      expect(f.type).toBe('datetimepicker')
      expect(f.label).toBe('日期时间')
      expect(f.datetimeTypeKey).toBe('date')
      expect(f.properties.datetime_type).toBe('date')
    })
  })

  describe('builderAddOptionRow', () => {
    it('为 radio 字段追加一行选项', () => {
      const f = presetField('radio')
      const updated = builderAddOptionRow(f)
      expect(updated.properties.option).toHaveLength(3)
      expect(updated.properties.option[2]).toMatchObject({
        label: '选项3',
        id: 3,
        value: '',
        isHide: 0
      })
    })

    it('追加后的选项应保持不可变性', () => {
      const f = presetField('radio')
      const updated = builderAddOptionRow(f)
      expect(f.properties.option).toHaveLength(2) // 原始未变
      expect(updated.properties.option).toHaveLength(3)
    })
  })

  describe('cloneKnown', () => {
    it('应深拷贝 known 字段', () => {
      const f = presetField('input')
      const cloned = cloneKnown(f)
      expect(cloned).toEqual(f)
      expect(cloned).not.toBe(f)
      expect(cloned.properties).not.toBe(f.properties)
    })
  })

  describe('rawType', () => {
    it('返回 backendRow.type 字符串', () => {
      const row: DesignerFieldRaw = {
        kind: 'raw',
        fontId: 'f1',
        backendRow: { type: 'text', key: 'k1' }
      } as DesignerFieldRaw
      expect(rawType(row)).toBe('text')
    })

    it('type 缺失时返回 ?', () => {
      const row: DesignerFieldRaw = {
        kind: 'raw',
        fontId: 'f2',
        backendRow: { key: 'k2' }
      } as DesignerFieldRaw
      expect(rawType(row)).toBe('?')
    })
  })

  describe('rowBadge', () => {
    it('raw 行返回原始类型标签', () => {
      const row: DesignerField = {
        kind: 'raw',
        fontId: 'f1',
        backendRow: { type: 'number' }
      } as DesignerFieldRaw
      expect(rowBadge(row, t)).toBe('activity.qbRawPrefix (number)')
    })

    it('known 行返回翻译后的类型名', () => {
      const row = presetField('input') as DesignerField
      expect(rowBadge(row, t)).toBe('activity.qbTypes.input')
    })
  })

  describe('effectiveKnown', () => {
    it('非 known 行返回 null', () => {
      const row: DesignerField = {
        kind: 'raw',
        fontId: 'f_raw',
        backendRow: { type: 'text' }
      } as DesignerFieldRaw
      expect(effectiveKnown(row, null)).toBeNull()
    })

    it('draft fontId 匹配时返回 draft', () => {
      const row = presetField('input')
      const draft: DesignerFieldKnown = {
        ...row,
        label: '修改后的标签'
      }
      const result = effectiveKnown(row, draft)
      expect(result?.label).toBe('修改后的标签')
    })

    it('draft 不匹配时返回原始行', () => {
      const row = presetField('input')
      // 手动创建不同 fontId 的 draft（因为 crypto stub 会使两次 presetField 的 fontId 相同）
      const draft: DesignerFieldKnown = {
        ...presetField('textarea'),
        fontId: 'f_different_id',
        id: '-other'
      }
      const result = effectiveKnown(row, draft)
      expect(result?.label).toBe('单行文本')
    })
  })

  describe('previewSlice', () => {
    it('known 行应返回单元素数组', () => {
      const row = presetField('radio')
      const slice = previewSlice(row, null)
      expect(slice).toHaveLength(1)
      expect(slice[0].type).toBe('radio')
    })

    it('raw 行应返回空数组', () => {
      const row: DesignerField = {
        kind: 'raw',
        fontId: 'f_r',
        backendRow: { type: 'text' }
      } as DesignerFieldRaw
      expect(previewSlice(row, null)).toEqual([])
    })
  })

  describe('buildKnownFieldPreview', () => {
    it('必填字段 label 带 *', () => {
      const f = presetField('input')
      f.required = true
      const preview = buildKnownFieldPreview(f)
      expect(preview.label).toBe('单行文本 *')
    })

    it('非必填不带 *', () => {
      const f = presetField('input')
      const preview = buildKnownFieldPreview(f)
      expect(preview.label).toBe('单行文本')
    })

    it('options 应过滤隐藏选项', () => {
      const f = presetField('radio')
      f.properties.option.push({ label: '隐藏项', id: 3, value: '', isHide: 1 })
      const preview = buildKnownFieldPreview(f)
      expect(preview.options).toHaveLength(2)
    })

    it('datetime 类型应正确映射', () => {
      const f = presetField('datetimepicker')
      f.datetimeTypeKey = 'datetime'
      const preview = buildKnownFieldPreview(f)
      expect(preview.dateType).toBe('datetime')
    })

    it('month 类型应正确映射', () => {
      const f = presetField('datetimepicker')
      f.datetimeTypeKey = 'month'
      const preview = buildKnownFieldPreview(f)
      expect(preview.dateType).toBe('month')
    })

    it('textarea rows 应在 2-8 范围', () => {
      const f = presetField('textarea')
      f.properties.text_num_line = 10
      const preview = buildKnownFieldPreview(f)
      expect(preview.textareaRows).toBe(8)

      f.properties.text_num_line = 1
      const preview2 = buildKnownFieldPreview(f)
      expect(preview2.textareaRows).toBe(2)
    })

    it('multiVals 应从 option_default 数组转数字', () => {
      const f = presetField('checkbox')
      f.properties.option_default = ['1', '3']
      const preview = buildKnownFieldPreview(f)
      expect(preview.multiVals).toEqual([1, 3])
    })

    it('radioVal 应为字符串', () => {
      const f = presetField('radio')
      f.properties.option_default = '2'
      const preview = buildKnownFieldPreview(f)
      expect(preview.radioVal).toBe('2')
    })
  })
})
