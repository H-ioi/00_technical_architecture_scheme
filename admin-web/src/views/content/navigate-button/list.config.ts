import type { FormRules } from 'element-plus'
import type { UniFormConfig, UniOption, UniTableColumn } from 'uni-ui-lib'

import type { Translate } from '@/types/i18n'
import type { ContentNavigateButtonFormModel } from '@/types/modules/content-navigate-button'

export const activeRadioOpts = (t: Translate): UniOption[] => [
  { label: t('content.yes'), value: '1' },
  { label: t('content.no'), value: '0' }
]

export const activeTagOpts = (t: Translate): UniOption[] => [
  { label: t('content.yes'), value: true, type: 'success' },
  { label: t('content.no'), value: false, type: 'info' }
]

export const tableCols = (t: Translate, activeOptions: UniOption[]): UniTableColumn[] => [
  { prop: 'id', label: 'ID', type: 'text', width: 88, fixed: 'left' },
  {
    prop: 'cnName',
    label: t('content.navigateButton.fieldCnName'),
    type: 'text',
    minWidth: 160,
    showOverflowTooltip: true
  },
  {
    prop: 'enName',
    label: t('content.navigateButton.fieldEnName'),
    type: 'text',
    minWidth: 160,
    showOverflowTooltip: true
  },
  { prop: 'index', label: t('content.navigateButton.fieldSort'), type: 'text', width: 88 },
  {
    prop: 'active',
    label: t('content.navigateButton.fieldActive'),
    type: 'tag',
    options: activeOptions,
    width: 100
  }
]

export const dialogFormConfig = (t: Translate, activeOptions: UniOption[]): UniFormConfig => ({
  formProps: { labelPosition: 'top' },
  rowProps: { gutter: 20 },
  colProps: { span: 12 },
  schema: [
    {
      field: 'cnName',
      label: t('content.navigateButton.fieldCnName'),
      component: 'ElInput',
      componentProps: { maxlength: 100, clearable: true },
      colProps: { span: 6 }
    },
    {
      field: 'enName',
      label: t('content.navigateButton.fieldEnName'),
      component: 'ElInput',
      componentProps: { maxlength: 100, clearable: true },
      colProps: { span: 6 }
    },
    {
      field: 'index',
      label: t('content.navigateButton.fieldSort'),
      component: 'ElInputNumber',
      componentProps: { min: 0, step: 1, precision: 0, style: { width: '100%' } },
      colProps: { span: 6 }
    },
    {
      field: 'active',
      label: t('content.navigateButton.fieldActive'),
      component: 'ElRadioGroup',
      options: activeOptions,
      colProps: { span: 6 }
    },
    {
      field: 'icon',
      label: t('content.navigateButton.fieldIcon'),
      component: 'ElInput',
      colProps: { span: 24 }
    },
    {
      field: 'chosenArticleId',
      label: t('content.navigateButton.fieldArticles'),
      component: 'ElInput',
      colProps: { span: 24 }
    }
  ]
})

export const dialogFormRules = (t: Translate): FormRules => ({
  cnName: [{ required: true, message: t('content.navigateButton.ruleCnName'), trigger: 'blur' }],
  enName: [{ required: true, message: t('content.navigateButton.ruleEnName'), trigger: 'blur' }],
  index: [{ required: true, message: t('content.navigateButton.ruleSort'), trigger: 'change' }],
  active: [{ required: true, message: t('content.navigateButton.ruleActive'), trigger: 'change' }],
  icon: [{ required: true, message: t('content.navigateButton.ruleIcon'), trigger: 'change' }]
})

export const emptyFormModel = (): ContentNavigateButtonFormModel => ({
  cnName: '',
  enName: '',
  icon: '',
  index: 0,
  active: '0',
  chosenArticleId: []
})
