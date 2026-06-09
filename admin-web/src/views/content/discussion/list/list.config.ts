import type { FormRules } from 'element-plus'
import type { UniFormConfig, UniOption, UniTableColumn } from 'uni-ui-lib'

import type { Translate } from '@/types/i18n'
import type { ContentDiscussionFormModel } from '@/types/modules/content-discussion'

export const boolFilterOpts = (t: Translate): UniOption[] => [
  { label: t('content.yes'), value: true },
  { label: t('content.no'), value: false }
]

export const boolTagOpts = (t: Translate): UniOption[] => [
  { label: t('content.yes'), value: true, type: 'success' },
  { label: t('content.no'), value: false, type: 'info' }
]

export const boolRadioOpts = (t: Translate): UniOption[] => [
  { label: t('content.yes'), value: true },
  { label: t('content.no'), value: false }
]

export const scopeOpts = (t: Translate): UniOption[] => [
  { label: t('content.discussion.scopePublic'), value: 1 },
  { label: t('content.discussion.scopeSchool'), value: 2 }
]

export const searchForm = (
  t: Translate,
  schoolOptions: UniOption[],
  tagOptions: UniOption[],
  boolOptions: UniOption[],
  defaultSchoolId?: string | number
): UniFormConfig => ({
  rowProps: { gutter: 8 },
  schema: [
    {
      field: 'keyword',
      label: '',
      component: 'ElInput',
      componentProps: { clearable: true, placeholder: t('content.discussion.phKeyword') },
      colProps: { span: 4 }
    },
    {
      field: 'schoolId',
      label: '',
      component: 'ElSelect',
      options: schoolOptions,
      componentProps: { clearable: true, filterable: true, placeholder: t('content.discussion.fieldSchool') },
      defaultValue: defaultSchoolId,
      colProps: { span: 4 }
    },
    {
      field: 'tagId',
      label: '',
      component: 'ElSelect',
      options: tagOptions,
      componentProps: { clearable: true, filterable: true, placeholder: t('content.discussion.fieldTag') },
      colProps: { span: 4 }
    },
    {
      field: 'active',
      label: '',
      component: 'ElSelect',
      options: boolOptions,
      componentProps: { clearable: true, placeholder: t('content.discussion.fieldVisible') },
      colProps: { span: 4 }
    },
    {
      field: 'top',
      label: '',
      component: 'ElSelect',
      options: boolOptions,
      componentProps: { clearable: true, placeholder: t('content.discussion.fieldTop') },
      colProps: { span: 4 }
    },
    {
      field: 'recommended',
      label: '',
      component: 'ElSelect',
      options: boolOptions,
      componentProps: { clearable: true, placeholder: t('content.discussion.fieldRecommended') },
      colProps: { span: 4 }
    }
  ]
})

export const tableCols = (
  t: Translate,
  boolOptions: UniOption[],
  scopeOptions: UniOption[]
): UniTableColumn[] => [
  { prop: 'id', label: 'ID', type: 'text', width: 88, fixed: 'left' },
  {
    prop: 'schoolNames',
    label: t('content.discussion.fieldSchool'),
    type: 'text',
    minWidth: 120,
    showOverflowTooltip: true
  },
  {
    prop: 'cnContent',
    label: t('content.discussion.fieldCnContent'),
    type: 'text',
    minWidth: 160,
    showOverflowTooltip: true
  },
  {
    prop: 'enContent',
    label: t('content.discussion.fieldEnContent'),
    type: 'text',
    minWidth: 160,
    showOverflowTooltip: true
  },
  {
    prop: 'tagName',
    label: t('content.discussion.fieldTag'),
    type: 'text',
    minWidth: 120,
    showOverflowTooltip: true
  },
  {
    prop: 'scope',
    label: t('content.discussion.fieldScope'),
    type: 'tag',
    options: scopeOptions,
    width: 100
  },
  {
    prop: 'recommended',
    label: t('content.discussion.fieldRecommended'),
    type: 'tag',
    options: boolOptions,
    width: 100
  },
  {
    prop: 'active',
    label: t('content.discussion.fieldVisible'),
    type: 'tag',
    options: boolOptions,
    width: 100
  },
  {
    prop: 'top',
    label: t('content.discussion.fieldTop'),
    type: 'tag',
    options: boolOptions,
    width: 100
  },
  {
    prop: 'createdAt',
    label: t('content.discussion.fieldCreatedAt'),
    type: 'text',
    width: 168
  },
  {
    prop: 'updatedAt',
    label: t('content.discussion.fieldUpdatedAt'),
    type: 'text',
    width: 168
  }
]

export const dialogFormConfig = (
  t: Translate,
  schoolOptions: UniOption[],
  tagOptions: UniOption[],
  scopeOptions: UniOption[],
  boolOptions: UniOption[]
): UniFormConfig => ({
  formProps: { labelPosition: 'top' },
  rowProps: { gutter: 20 },
  colProps: { span: 12 },
  schema: [
    {
      field: 'schoolId',
      label: t('content.discussion.fieldSchool'),
      component: 'ElSelect',
      options: schoolOptions,
      componentProps: { clearable: true, filterable: true, placeholder: t('content.discussion.phSelect') },
      colProps: { span: 12 }
    },
    {
      field: 'tagId',
      label: t('content.discussion.fieldTag'),
      component: 'ElSelect',
      options: tagOptions,
      componentProps: { clearable: true, filterable: true, placeholder: t('content.discussion.phSelect') },
      colProps: { span: 12 }
    },
    {
      field: 'scope',
      label: t('content.discussion.fieldScope'),
      component: 'ElRadioGroup',
      options: scopeOptions,
      colProps: { span: 8 }
    },
    {
      field: 'active',
      label: t('content.discussion.fieldVisible'),
      component: 'ElRadioGroup',
      options: boolOptions,
      colProps: { span: 8 }
    },
    {
      field: 'recommended',
      label: t('content.discussion.fieldRecommended'),
      component: 'ElRadioGroup',
      options: boolOptions,
      colProps: { span: 8 }
    },
    {
      field: 'top',
      label: t('content.discussion.fieldTop'),
      component: 'ElRadioGroup',
      options: boolOptions,
      colProps: { span: 8 }
    },
    {
      field: 'cnContent',
      label: t('content.discussion.fieldCnContent'),
      component: 'ElInput',
      componentProps: { type: 'textarea', rows: 5, maxlength: 200, showWordLimit: true },
      colProps: { span: 24 }
    },
    {
      field: 'enContent',
      label: t('content.discussion.fieldEnContent'),
      component: 'ElInput',
      componentProps: { type: 'textarea', rows: 5, maxlength: 200, showWordLimit: true },
      colProps: { span: 24 }
    },
    {
      field: 'images',
      label: t('content.discussion.fieldImages'),
      component: 'ElInput',
      componentProps: { style: { display: 'none' } },
      colProps: { span: 24 }
    },
    {
      field: 'pdfs',
      label: 'PDF',
      component: 'ElInput',
      componentProps: { style: { display: 'none' } },
      colProps: { span: 24 }
    }
  ]
})

export const dialogFormRules = (t: Translate): FormRules => ({
  schoolId: [{ required: true, message: t('content.discussion.ruleSchool'), trigger: 'change' }],
  tagId: [{ required: true, message: t('content.discussion.ruleTag'), trigger: 'change' }],
  scope: [{ required: true, message: t('content.discussion.ruleScope'), trigger: 'change' }],
  active: [{ required: true, message: t('content.discussion.ruleVisible'), trigger: 'change' }],
  recommended: [{ required: true, message: t('content.discussion.ruleRecommended'), trigger: 'change' }],
  top: [{ required: true, message: t('content.discussion.ruleTop'), trigger: 'change' }],
  cnContent: [{ required: true, message: t('content.discussion.ruleCnContent'), trigger: 'blur' }],
  enContent: [{ required: true, message: t('content.discussion.ruleEnContent'), trigger: 'blur' }]
})

export const emptyFormModel = (): ContentDiscussionFormModel => ({
  scope: 1,
  active: false,
  recommended: false,
  top: false,
  cnContent: '',
  enContent: '',
  mainImg: '',
  secondImg: '',
  thirdImg: '',
  fourthImage: '',
  fifthImage: '',
  sixthImage: '',
  seventhImage: '',
  eighthImage: '',
  ninthImage: '',
  pdfList: []
})
