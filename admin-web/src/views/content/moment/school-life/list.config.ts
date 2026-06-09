import type { FormRules } from 'element-plus'
import type { UniFormConfig, UniOption, UniTableColumn } from 'uni-ui-lib'

import type { Translate } from '@/types/i18n'
import type { ContentMomentFormModel } from '@/types/modules/content-moment'

export const boolTagOpts = (t: Translate): UniOption[] => [
  { label: t('content.yes'), value: true, type: 'success' },
  { label: t('content.no'), value: false, type: 'info' }
]

export const boolFilterOpts = (t: Translate): UniOption[] => [
  { label: t('content.yes'), value: true },
  { label: t('content.no'), value: false }
]

export const visibleRadioOpts = (t: Translate): UniOption[] => [
  { label: t('content.yes'), value: '1' },
  { label: t('content.no'), value: '0' }
]

export const searchForm = (
  t: Translate,
  schoolOptions: UniOption[],
  typeOptions: UniOption[],
  boolOptions: UniOption[],
  defaultSchoolId?: string | number | null
): UniFormConfig => ({
  schema: [
    {
      field: 'title',
      label: '',
      component: 'ElInput',
      componentProps: { placeholder: t('content.schoolLife.phTitle'), clearable: true },
      colProps: { span: 6 }
    },
    {
      field: 'schoolId',
      label: '',
      component: 'ElSelect',
      options: schoolOptions,
      ...(defaultSchoolId != null ? { defaultValue: defaultSchoolId } : {}),
      componentProps: {
        placeholder: t('content.schoolLife.fieldSchool'),
        clearable: true,
        filterable: true
      },
      colProps: { span: 6 }
    },
    {
      field: 'type',
      label: '',
      component: 'ElSelect',
      options: typeOptions,
      componentProps: {
        placeholder: t('content.schoolLife.fieldType'),
        clearable: true,
        filterable: true
      },
      colProps: { span: 6 }
    },
    {
      field: 'visible',
      label: '',
      component: 'ElSelect',
      options: boolOptions,
      componentProps: {
        placeholder: t('content.schoolLife.fieldVisible'),
        clearable: true
      },
      colProps: { span: 6 }
    }
  ],
  rowProps: { gutter: 8 },
  colProps: { span: 6 }
})

export const tableCols = (t: Translate, boolOptions: UniOption[]): UniTableColumn[] => [
  { prop: 'id', label: 'ID', type: 'text', width: 72, fixed: 'left' },
  {
    prop: 'schoolNames',
    label: t('content.schoolLife.fieldSchool'),
    type: 'text',
    minWidth: 120,
    showOverflowTooltip: true
  },
  {
    prop: 'title',
    label: t('content.schoolLife.fieldTitle'),
    type: 'text',
    minWidth: 160,
    showOverflowTooltip: true
  },
  {
    prop: 'content',
    label: t('content.schoolLife.fieldContent'),
    type: 'text',
    minWidth: 180,
    showOverflowTooltip: true
  },
  {
    prop: 'typeName',
    label: t('content.schoolLife.fieldType'),
    type: 'text',
    minWidth: 100,
    showOverflowTooltip: true
  },
  {
    prop: 'publisherUsername',
    label: t('content.schoolLife.fieldPublisher'),
    type: 'text',
    width: 110,
    showOverflowTooltip: true
  },
  {
    prop: 'visible',
    label: t('content.schoolLife.fieldVisible'),
    type: 'tag',
    options: boolOptions,
    width: 96
  },
  {
    prop: 'createdAt',
    label: t('content.schoolLife.fieldCreatedAt'),
    type: 'text',
    width: 168
  },
  {
    prop: 'updatedAt',
    label: t('content.schoolLife.fieldUpdatedAt'),
    type: 'text',
    width: 168
  }
]

export const dialogFormConfig = (
  t: Translate,
  schoolOptions: UniOption[],
  typeOptions: UniOption[],
  visibleOptions: UniOption[],
  boolOptions: UniOption[]
): UniFormConfig => ({
  formProps: { labelPosition: 'top' },
  rowProps: { gutter: 20 },
  colProps: { span: 12 },
  schema: [
    {
      field: 'schoolId',
      label: t('content.schoolLife.fieldSchool'),
      component: 'ElSelect',
      options: schoolOptions,
      componentProps: {
        placeholder: t('content.schoolLife.phSelect'),
        clearable: true,
        filterable: true
      },
      colProps: { span: 12 }
    },
    {
      field: 'type',
      label: t('content.schoolLife.fieldType'),
      component: 'ElSelect',
      options: typeOptions,
      componentProps: {
        placeholder: t('content.schoolLife.phSelect'),
        clearable: true,
        filterable: true
      },
      colProps: { span: 12 }
    },
    {
      field: 'title',
      label: t('content.schoolLife.fieldTitle'),
      component: 'ElInput',
      componentProps: { maxlength: 100, clearable: true },
      colProps: { span: 24 }
    },
    {
      field: 'content',
      label: t('content.schoolLife.fieldContent'),
      component: 'ElInput',
      componentProps: { type: 'textarea', rows: 5, maxlength: 500, showWordLimit: true },
      colProps: { span: 24 }
    },
    {
      field: 'visible',
      label: t('content.schoolLife.fieldVisible'),
      component: 'ElRadioGroup',
      options: visibleOptions,
      colProps: { span: 12 }
    },
    {
      field: 'push',
      label: t('content.schoolLife.fieldPush'),
      component: 'ElRadioGroup',
      options: boolOptions,
      colProps: { span: 12 }
    },
    {
      field: 'images',
      label: t('content.schoolLife.fieldImages'),
      component: 'ElInput',
      componentProps: { style: { display: 'none' } },
      colProps: { span: 24 }
    },
    {
      field: 'pdfs',
      label: t('content.schoolLife.fieldPdfs'),
      component: 'ElInput',
      componentProps: { style: { display: 'none' } },
      colProps: { span: 24 }
    }
  ]
})

export const dialogFormRules = (t: Translate): FormRules => ({
  schoolId: [{ required: true, message: t('content.schoolLife.ruleSchool'), trigger: 'change' }],
  type: [{ required: true, message: t('content.schoolLife.ruleType'), trigger: 'change' }],
  title: [{ required: true, message: t('content.schoolLife.ruleTitle'), trigger: 'blur' }],
  content: [{ required: true, message: t('content.schoolLife.ruleContent'), trigger: 'blur' }],
  visible: [{ required: true, message: t('content.schoolLife.ruleVisible'), trigger: 'change' }],
  push: [{ required: true, message: t('content.schoolLife.rulePush'), trigger: 'change' }]
})

export const emptyFormModel = (): ContentMomentFormModel => ({
  push: true,
  sendSms: false,
  visible: '1',
  images: [],
  pdfs: []
})
