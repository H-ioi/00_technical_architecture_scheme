import type { UniFormConfig, UniTableAction, UniTableColumn } from 'uni-ui-lib'

import type { BaseDictItemRecord } from '@/types/modules/base-dict'

export type DictMsg = (key: string) => string

/** 与成员/协议列表页一致的紧凑检索条：单行关键字（前端过滤类型名称）。 */
export const dictSearchForm = (mt: DictMsg): UniFormConfig => ({
  schema: [
    {
      field: 'keyword',
      label: '',
      component: 'ElInput',
      componentProps: {
        placeholder: mt('search.keywordPlaceholder'),
        clearable: true
      },
      colProps: { span: 6 }
    }
  ],
  rowProps: { gutter: 8 },
  colProps: { span: 6 }
})

export const dictItemColumns = (mt: DictMsg): UniTableColumn[] => [
  {
    prop: 'label',
    label: mt('fields.label'),
    type: 'text',
    minWidth: 200,
    showOverflowTooltip: true
  },
  { prop: 'sort', label: mt('fields.sort'), type: 'number', width: 96 },
  {
    prop: 'status',
    label: mt('fields.status'),
    type: 'switch',
    width: 88,
    align: 'center',
    switch: {
      activeValue: true,
      inactiveValue: false
    }
  }
]

export const dictItemActions = (
  mt: DictMsg,
  handlers: {
    onEdit: (row: BaseDictItemRecord) => void
    onAttrs: (row: BaseDictItemRecord) => void
    onDelete: (row: BaseDictItemRecord) => void
  }
): UniTableAction<BaseDictItemRecord>[] => [
  { label: mt('actions.edit'), type: 'primary', onClick: (row) => handlers.onEdit(row) },
  { label: mt('actions.extraAttrs'), type: 'primary', onClick: (row) => handlers.onAttrs(row) },
  { label: mt('actions.delete'), type: 'danger', onClick: (row) => handlers.onDelete(row) }
]

export const dictItemFormConfig = (mt: DictMsg): UniFormConfig => ({
  formProps: { labelPosition: 'top' },
  rowProps: { gutter: 16 },
  colProps: { span: 24 },
  schema: [
    {
      field: 'label',
      label: mt('form.name'),
      component: 'ElInput',
      componentProps: { clearable: true }
    },
    {
      field: 'sort',
      label: mt('form.sort'),
      component: 'ElInputNumber',
      componentProps: {
        min: 0,
        step: 1,
        stepStrictly: true,
        precision: 0,
        controlsPosition: 'right'
      }
    }
  ]
})

export const dictAttrColumns = (mt: DictMsg): UniTableColumn[] => [
  {
    prop: 'dictItemLabel',
    label: mt('fields.attrName'),
    type: 'text',
    minWidth: 120
  },
  { prop: 'dictItemType', label: mt('fields.attrKey'), type: 'text', width: 100 },
  {
    prop: 'dictItemValue',
    label: mt('fields.attrValue'),
    type: 'text',
    minWidth: 140,
    showOverflowTooltip: true
  }
]
