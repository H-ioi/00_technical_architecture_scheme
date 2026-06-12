import type { UniFormConfig, UniTableAction, UniTableColumn } from 'uni-ui-lib'

import type { BaseDictItemRecord } from '@/types/modules/base-dict'
import type { Translate } from '@/types/i18n'

/** 与成员/协议列表页一致的紧凑检索条：单行关键字（前端过滤类型名称）。 */
export const dictSearchForm = (t: Translate): UniFormConfig => ({
  schema: [
    {
      field: 'keyword',
      label: '',
      component: 'ElInput',
      componentProps: {
        placeholder: t('base.phKeyword'),
        clearable: true
      },
      colProps: { span: 6 }
    }
  ],
  rowProps: { gutter: 8 },
  colProps: { span: 6 }
})

export const dictItemColumns = (t: Translate): UniTableColumn[] => [
  {
    prop: 'label',
    label: t('base.label'),
    type: 'text',
    minWidth: 200,
    showOverflowTooltip: true
  },
  { prop: 'sort', label: t('base.sort'), type: 'number', width: 96 },
  {
    prop: 'status',
    label: t('base.status'),
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
  t: Translate,
  handlers: {
    onEdit: (row: BaseDictItemRecord) => void
    onAttrs: (row: BaseDictItemRecord) => void
    onDelete: (row: BaseDictItemRecord) => void
  }
): UniTableAction<BaseDictItemRecord>[] => [
  { label: t('base.edit'), type: 'primary', onClick: (row) => handlers.onEdit(row) },
  { label: t('base.extraAttrs'), type: 'primary', onClick: (row) => handlers.onAttrs(row) },
  { label: t('base.delete'), type: 'danger', onClick: (row) => handlers.onDelete(row) }
]

export const dictItemFormConfig = (t: Translate): UniFormConfig => ({
  formProps: { labelPosition: 'top' },
  rowProps: { gutter: 16 },
  colProps: { span: 24 },
  schema: [
    {
      field: 'label',
      label: t('base.formName'),
      component: 'ElInput',
      componentProps: { clearable: true }
    },
    {
      field: 'sort',
      label: t('base.formSort'),
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

export const dictAttrColumns = (t: Translate): UniTableColumn[] => [
  {
    prop: 'dictItemLabel',
    label: t('base.attrName'),
    type: 'text',
    minWidth: 120
  },
  { prop: 'dictItemType', label: t('base.attrKey'), type: 'text', width: 100 },
  {
    prop: 'dictItemValue',
    label: t('base.attrValue'),
    type: 'text',
    minWidth: 140,
    showOverflowTooltip: true
  }
]
