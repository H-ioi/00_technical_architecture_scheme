import type { FormRules } from 'element-plus'
import type { UniFormConfig, UniOption, UniTableColumn } from 'uni-ui-lib'

import type { Translate } from '@/types/i18n'
import type { ContentArticleFormModel } from '@/types/modules/content-article'

export const boolTagOpts = (t: Translate): UniOption[] => [
  { label: t('content.yes'), value: true, type: 'success' },
  { label: t('content.no'), value: false, type: 'info' }
]

export const boolFilterOpts = (t: Translate): UniOption[] => [
  { label: t('content.yes'), value: true },
  { label: t('content.no'), value: false }
]

export const importanceLevelOpts = (t: Translate): UniOption[] => [
  { label: t('content.article.importanceGeneral'), value: 1 },
  { label: t('content.article.importanceImportant'), value: 2, type: 'warning' }
]

export const wechatOptionOpts = (t: Translate): UniOption[] => [
  { label: t('content.article.wechatNone'), value: 0 },
  { label: t('content.article.wechatDraft'), value: 1 }
]

export const searchForm = (
  t: Translate,
  schoolOptions: UniOption[],
  categoryOptions: UniOption[],
  importanceOptions: UniOption[],
  boolOptions: UniOption[],
  defaultSchoolId?: string | number | null
): UniFormConfig => ({
  schema: [
    {
      field: 'title',
      label: '',
      component: 'ElInput',
      componentProps: { placeholder: t('content.article.phTitle'), clearable: true },
      colProps: { span: 6 }
    },
    {
      field: 'schoolId',
      label: '',
      component: 'ElSelect',
      options: schoolOptions,
      ...(defaultSchoolId != null ? { defaultValue: defaultSchoolId } : {}),
      componentProps: {
        placeholder: t('content.article.fieldSchool'),
        clearable: true,
        filterable: true
      },
      colProps: { span: 6 }
    },
    {
      field: 'categoryId',
      label: '',
      component: 'ElSelect',
      options: categoryOptions,
      componentProps: {
        placeholder: t('content.article.fieldCategory'),
        clearable: true,
        filterable: true
      },
      colProps: { span: 6 }
    },
    {
      field: 'importanceLevel',
      label: '',
      component: 'ElSelect',
      options: importanceOptions,
      componentProps: {
        placeholder: t('content.article.fieldImportance'),
        clearable: true
      },
      colProps: { span: 6 }
    },
    {
      field: 'visible',
      label: '',
      component: 'ElSelect',
      options: boolOptions,
      componentProps: {
        placeholder: t('content.article.fieldVisible'),
        clearable: true
      },
      colProps: { span: 6 }
    },
    {
      field: 'isBanner',
      label: '',
      component: 'ElSelect',
      options: boolOptions,
      componentProps: {
        placeholder: t('content.article.fieldBanner'),
        clearable: true
      },
      colProps: { span: 6 }
    },
    {
      field: 'recommended',
      label: '',
      component: 'ElSelect',
      options: boolOptions,
      componentProps: {
        placeholder: t('content.article.fieldRecommended'),
        clearable: true
      },
      colProps: { span: 6 }
    }
  ],
  rowProps: { gutter: 8 },
  colProps: { span: 6 }
})

export const tableCols = (
  t: Translate,
  importanceOptions: UniOption[],
  boolOptions: UniOption[]
): UniTableColumn[] => [
  { prop: 'id', label: 'ID', type: 'text', width: 72, fixed: 'left' },
  {
    prop: 'schoolName',
    label: t('content.article.fieldSchool'),
    type: 'text',
    minWidth: 120,
    showOverflowTooltip: true
  },
  {
    prop: 'cnTitle',
    label: t('content.article.fieldCnTitle'),
    type: 'text',
    minWidth: 160,
    showOverflowTooltip: true
  },
  {
    prop: 'enTitle',
    label: t('content.article.fieldEnTitle'),
    type: 'text',
    minWidth: 160,
    showOverflowTooltip: true
  },
  {
    prop: 'categoryName',
    label: t('content.article.fieldCategory'),
    type: 'text',
    minWidth: 120,
    showOverflowTooltip: true
  },
  {
    prop: 'importanceLevel',
    label: t('content.article.fieldImportance'),
    type: 'tag',
    options: importanceOptions,
    width: 100
  },
  {
    prop: 'publishStatus',
    label: t('content.article.fieldPublishStatus'),
    type: 'tag',
    options: boolOptions,
    width: 100
  },
  {
    prop: 'visible',
    label: t('content.article.fieldVisible'),
    type: 'tag',
    options: boolOptions,
    width: 96
  },
  {
    prop: 'isBanner',
    label: t('content.article.fieldBanner'),
    type: 'tag',
    options: boolOptions,
    width: 110
  },
  {
    prop: 'recommended',
    label: t('content.article.fieldRecommended'),
    type: 'tag',
    options: boolOptions,
    width: 96
  },
  {
    prop: 'isWechatPushed',
    label: t('content.article.fieldWechatPushed'),
    type: 'tag',
    options: boolOptions,
    width: 130
  },
  {
    prop: 'wechatUrl',
    label: t('content.article.fieldWechatUrl'),
    type: 'text',
    minWidth: 140,
    showOverflowTooltip: true
  },
  {
    prop: 'updatedAt',
    label: t('content.article.fieldUpdatedAt'),
    type: 'text',
    width: 168
  }
]

export const dialogFormConfig = (
  t: Translate,
  schoolOptions: UniOption[],
  categoryOptions: UniOption[],
  importanceOptions: UniOption[],
  boolOptions: UniOption[],
  wechatOptions: UniOption[]
): UniFormConfig => ({
  formProps: { labelPosition: 'top' },
  rowProps: { gutter: 20 },
  colProps: { span: 12 },
  schema: [
    {
      field: 'cnTitle',
      label: t('content.article.fieldCnTitle'),
      component: 'ElInput',
      componentProps: { maxlength: 100, clearable: true },
      colProps: { span: 12 }
    },
    {
      field: 'enTitle',
      label: t('content.article.fieldEnTitle'),
      component: 'ElInput',
      componentProps: { maxlength: 100, clearable: true },
      colProps: { span: 12 }
    },
    {
      field: 'schoolId',
      label: t('content.article.fieldSchool'),
      component: 'ElSelect',
      options: schoolOptions,
      componentProps: {
        placeholder: t('content.article.phSelect'),
        clearable: true,
        filterable: true
      },
      colProps: { span: 12 }
    },
    {
      field: 'categoryId',
      label: t('content.article.fieldCategory'),
      component: 'ElSelect',
      options: categoryOptions,
      componentProps: {
        placeholder: t('content.article.phSelect'),
        clearable: true,
        filterable: true
      },
      colProps: { span: 12 }
    },
    {
      field: 'importanceLevel',
      label: t('content.article.fieldImportance'),
      component: 'ElSelect',
      options: importanceOptions,
      componentProps: { placeholder: t('content.article.phSelect') },
      colProps: { span: 12 }
    },
    {
      field: 'mainImage',
      label: t('content.article.fieldMainImage'),
      component: 'ElInput',
      componentProps: { style: { display: 'none' } },
      colProps: { span: 24 }
    },
    {
      field: 'visible',
      label: t('content.article.fieldVisible'),
      component: 'ElRadioGroup',
      options: boolOptions,
      colProps: { span: 8 }
    },
    {
      field: 'isBanner',
      label: t('content.article.fieldBanner'),
      component: 'ElRadioGroup',
      options: boolOptions,
      colProps: { span: 8 }
    },
    {
      field: 'recommended',
      label: t('content.article.fieldRecommended'),
      component: 'ElRadioGroup',
      options: boolOptions,
      colProps: { span: 8 }
    },
    {
      field: 'wechatOption',
      label: t('content.article.fieldWechatOption'),
      component: 'ElSelect',
      options: wechatOptions,
      componentProps: { placeholder: t('content.article.phSelect'), clearable: true },
      colProps: { span: 12 }
    },
    {
      field: 'wechatUrl',
      label: t('content.article.fieldWechatUrl'),
      component: 'ElInput',
      componentProps: { maxlength: 100, clearable: true },
      colProps: { span: 12 }
    },
    {
      field: 'content',
      label: t('content.article.fieldContent'),
      component: 'ElInput',
      componentProps: { style: { display: 'none' } },
      colProps: { span: 24 }
    }
  ]
})

export const dialogFormRules = (t: Translate): FormRules => ({
  cnTitle: [{ required: true, message: t('content.article.ruleCnTitle'), trigger: 'blur' }],
  enTitle: [{ required: true, message: t('content.article.ruleEnTitle'), trigger: 'blur' }],
  schoolId: [{ required: true, message: t('content.article.ruleSchool'), trigger: 'change' }],
  categoryId: [{ required: true, message: t('content.article.ruleCategory'), trigger: 'change' }],
  importanceLevel: [
    { required: true, message: t('content.article.ruleImportance'), trigger: 'change' }
  ],
  visible: [{ required: true, message: t('content.article.ruleVisible'), trigger: 'change' }],
  isBanner: [{ required: true, message: t('content.article.ruleBanner'), trigger: 'change' }],
  recommended: [
    { required: true, message: t('content.article.ruleRecommended'), trigger: 'change' }
  ]
})

export const emptyFormModel = (): ContentArticleFormModel => ({
  importanceLevel: 1,
  visible: true,
  isBanner: false,
  recommended: false,
  wechatOption: 0,
  content: ''
})
