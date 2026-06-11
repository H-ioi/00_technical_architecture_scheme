import type { FormRules } from 'element-plus'
import type { UniFormConfig, UniOption, UniTableColumn } from 'uni-ui-lib'

import type { Translate } from '@/types/i18n'
import type { ContentCategoryFormModel } from '@/types/modules/content-category'

export const visibleRadioOpts = (t: Translate): UniOption[] => [
  { label: t('content.yes'), value: '1' },
  { label: t('content.no'), value: '0' }
]

export const visibleTagOpts = (t: Translate): UniOption[] => [
  { label: t('content.yes'), value: true, type: 'success' },
  { label: t('content.no'), value: false, type: 'info' }
]

export const tableCols = (t: Translate, visibleOptions: UniOption[]): UniTableColumn[] => [
  { prop: 'id', label: 'ID', type: 'text', width: 88, fixed: 'left' },
  {
    prop: 'cnName',
    label: t('content.category.fieldCnName'),
    type: 'text',
    minWidth: 160,
    showOverflowTooltip: true
  },
  {
    prop: 'enName',
    label: t('content.category.fieldEnName'),
    type: 'text',
    minWidth: 160,
    showOverflowTooltip: true
  },
  { prop: 'index', label: t('content.category.fieldSort'), type: 'text', width: 88 },
  {
    prop: 'visible',
    label: t('content.category.fieldVisible'),
    type: 'tag',
    options: visibleOptions,
    width: 100
  }
]

export const dialogFormConfig = (t: Translate, visibleOptions: UniOption[]): UniFormConfig => ({
  formProps: { labelPosition: 'top' },
  rowProps: { gutter: 20 },
  colProps: { span: 12 },
  schema: [
    {
      field: 'cnName',
      label: t('content.category.fieldCnName'),
      component: 'ElInput',
      componentProps: { maxlength: 100, clearable: true },
      colProps: { span: 12 }
    },
    {
      field: 'enName',
      label: t('content.category.fieldEnName'),
      component: 'ElInput',
      componentProps: { maxlength: 100, clearable: true },
      colProps: { span: 12 }
    },
    {
      field: 'index',
      label: t('content.category.fieldSort'),
      component: 'ElInputNumber',
      componentProps: { min: 0, step: 1, precision: 0, style: { width: '100%' } },
      colProps: { span: 12 }
    },
    {
      field: 'visible',
      label: t('content.category.fieldVisible'),
      component: 'ElRadioGroup',
      options: visibleOptions,
      colProps: { span: 12 }
    }
  ]
})

export const dialogFormRules = (t: Translate): FormRules => ({
  cnName: [{ required: true, message: t('content.category.ruleCnName'), trigger: 'blur' }],
  enName: [{ required: true, message: t('content.category.ruleEnName'), trigger: 'blur' }],
  index: [{ required: true, message: t('content.category.ruleSort'), trigger: 'change' }],
  visible: [{ required: true, message: t('content.category.ruleVisible'), trigger: 'change' }]
})

export const emptyFormModel = (): ContentCategoryFormModel => ({
  index: 0,
  visible: '0'
})
