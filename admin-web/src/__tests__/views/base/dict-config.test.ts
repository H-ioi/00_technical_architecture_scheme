import { describe, it, expect, vi } from 'vitest'

import {
  dictSearchForm,
  dictItemColumns,
  dictItemActions,
  dictItemFormConfig,
  dictAttrColumns,
  type DictMsg
} from '../../../views/base/components/dict.config'

const mt: DictMsg = (key: string) => key

describe('dict.config.ts', () => {
  describe('dictSearchForm', () => {
    const form = dictSearchForm(mt)

    it('应返回 UniFormConfig 结构', () => {
      expect(form).toHaveProperty('schema')
      expect(form).toHaveProperty('rowProps')
      expect(form).toHaveProperty('colProps')
    })

    it('schema 包含一个 keyword 输入框', () => {
      expect(form.schema).toHaveLength(1)
      const field = form.schema[0]
      expect(field.field).toBe('keyword')
      expect(field.component).toBe('ElInput')
      expect(field.label).toBe('')
    })

    it('keyword 输入框应有 placeholder 且可清空', () => {
      const field = form.schema[0]
      expect(field.componentProps).toMatchObject({
        placeholder: 'search.keywordPlaceholder',
        clearable: true
      })
    })

    it('keyword colProps 为 span=6', () => {
      expect(form.schema[0].colProps).toEqual({ span: 6 })
    })

    it('rowProps gutter=8', () => {
      expect(form.rowProps).toEqual({ gutter: 8 })
    })
  })

  describe('dictItemColumns', () => {
    const columns = dictItemColumns(mt)

    it('应返回 3 列', () => {
      expect(columns).toHaveLength(3)
    })

    it('第一列为 label', () => {
      expect(columns[0].prop).toBe('label')
      expect(columns[0].label).toBe('fields.label')
      expect(columns[0].type).toBe('text')
      expect(columns[0].minWidth).toBe(200)
    })

    it('第二列为 sort', () => {
      expect(columns[1].prop).toBe('sort')
      expect(columns[1].type).toBe('number')
      expect(columns[1].width).toBe(96)
    })

    it('第三列为 status switch', () => {
      expect(columns[2].prop).toBe('status')
      expect(columns[2].type).toBe('switch')
      expect(columns[2].switch).toEqual({
        activeValue: true,
        inactiveValue: false
      })
    })
  })

  describe('dictItemActions', () => {
    const onEdit = vi.fn()
    const onAttrs = vi.fn()
    const onDelete = vi.fn()
    const actions = dictItemActions(mt, { onEdit, onAttrs, onDelete })

    it('应返回 3 个操作', () => {
      expect(actions).toHaveLength(3)
    })

    it('第一个操作为编辑（primary）', () => {
      expect(actions[0].label).toBe('actions.edit')
      expect(actions[0].type).toBe('primary')
    })

    it('第二个操作为额外属性（primary）', () => {
      expect(actions[1].label).toBe('actions.extraAttrs')
      expect(actions[1].type).toBe('primary')
    })

    it('第三个操作为删除（danger）', () => {
      expect(actions[2].label).toBe('actions.delete')
      expect(actions[2].type).toBe('danger')
    })

    it('点击编辑应调用 onEdit', () => {
      const mockRow = { label: 'test', sort: 1, status: true }
      actions[0].onClick?.(mockRow, 0, undefined as never)
      expect(onEdit).toHaveBeenCalledWith(mockRow)
    })

    it('点击属性应调用 onAttrs', () => {
      const mockRow = { label: 'test', sort: 1, status: true }
      actions[1].onClick?.(mockRow, 0, undefined as never)
      expect(onAttrs).toHaveBeenCalledWith(mockRow)
    })

    it('点击删除应调用 onDelete', () => {
      const mockRow = { label: 'test', sort: 1, status: true }
      actions[2].onClick?.(mockRow, 0, undefined as never)
      expect(onDelete).toHaveBeenCalledWith(mockRow)
    })
  })

  describe('dictItemFormConfig', () => {
    const formConfig = dictItemFormConfig(mt)

    it('formProps 应有 labelPosition=top', () => {
      expect(formConfig.formProps).toEqual({ labelPosition: 'top' })
    })

    it('rowProps 应有 gutter=16', () => {
      expect(formConfig.rowProps).toEqual({ gutter: 16 })
    })

    it('schema 包含 2 个字段', () => {
      expect(formConfig.schema).toHaveLength(2)
    })

    it('第一个字段为 label 输入框', () => {
      const field = formConfig.schema[0]
      expect(field.field).toBe('label')
      expect(field.component).toBe('ElInput')
      expect(field.componentProps).toMatchObject({ clearable: true })
    })

    it('第二个字段为 sort 数字输入', () => {
      const field = formConfig.schema[1]
      expect(field.field).toBe('sort')
      expect(field.component).toBe('ElInputNumber')
      expect(field.componentProps).toMatchObject({
        min: 0,
        step: 1,
        stepStrictly: true,
        precision: 0,
        controlsPosition: 'right'
      })
    })
  })

  describe('dictAttrColumns', () => {
    const columns = dictAttrColumns(mt)

    it('应返回 3 列', () => {
      expect(columns).toHaveLength(3)
    })

    it('第一列为 dictItemLabel', () => {
      expect(columns[0].prop).toBe('dictItemLabel')
      expect(columns[0].type).toBe('text')
    })

    it('第二列为 dictItemType', () => {
      expect(columns[1].prop).toBe('dictItemType')
      expect(columns[1].type).toBe('text')
    })

    it('第三列为 dictItemValue 且支持溢出提示', () => {
      expect(columns[2].prop).toBe('dictItemValue')
      expect(columns[2].showOverflowTooltip).toBe(true)
    })
  })
})
