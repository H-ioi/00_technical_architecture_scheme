import type { FormRules } from 'element-plus'
import type { UniFormConfig, UniOption, UniTableColumn } from 'uni-ui-lib'

import type { Translate } from '@/types/i18n'
import type { FoodWeeklyFormModel } from '@/types/modules/content-food-weekly'

export const statusOpts = (t: Translate): UniOption[] => [
  { label: t('content.foodWeekly.statusActive'), value: '0', type: 'success' },
  { label: t('content.foodWeekly.statusArchived'), value: '1', type: 'info' }
]

export const searchForm = (
  t: Translate,
  schoolOptions: UniOption[],
  defaultSchoolId?: string | number | null
): UniFormConfig => ({
  schema: [
    {
      field: 'schoolId',
      label: '',
      component: 'ElSelect',
      options: schoolOptions,
      ...(defaultSchoolId != null ? { defaultValue: defaultSchoolId } : {}),
      componentProps: {
        placeholder: t('content.foodWeekly.fieldSchool'),
        clearable: true,
        filterable: true
      },
      colProps: { span: 6 }
    }
  ],
  rowProps: { gutter: 8 },
  colProps: { span: 6 }
})

export const tableCols = (t: Translate, statusOptions: UniOption[]): UniTableColumn[] => [
  { prop: 'id', label: 'ID', type: 'text', width: 88, fixed: 'left' },
  {
    prop: 'schoolNames',
    label: t('content.foodWeekly.fieldSchool'),
    type: 'text',
    minWidth: 140,
    showOverflowTooltip: true
  },
  {
    prop: 'wechatUrl',
    label: t('content.foodWeekly.fieldWechatUrl'),
    type: 'text',
    minWidth: 200,
    showOverflowTooltip: true
  },
  {
    prop: 'status',
    label: t('content.foodWeekly.fieldStatus'),
    type: 'tag',
    options: statusOptions,
    width: 100
  },
  {
    prop: 'createdAt',
    label: t('content.foodWeekly.fieldCreatedAt'),
    type: 'text',
    width: 168
  },
  {
    prop: 'updatedAt',
    label: t('content.foodWeekly.fieldUpdatedAt'),
    type: 'text',
    width: 168
  }
]

export const dialogFormConfig = (
  t: Translate,
  schoolOptions: UniOption[]
): UniFormConfig => ({
  formProps: { labelPosition: 'top' },
  rowProps: { gutter: 0 },
  colProps: { span: 24 },
  schema: [
    {
      field: 'schoolId',
      label: t('content.foodWeekly.fieldSchool'),
      component: 'ElSelect',
      options: schoolOptions,
      componentProps: {
        placeholder: t('content.foodWeekly.phSelect'),
        clearable: true,
        filterable: true,
        style: { width: '100%' }
      }
    },
    {
      field: 'wechatUrl',
      label: t('content.foodWeekly.fieldWechatUrl'),
      component: 'ElInput',
      componentProps: { maxlength: 100, clearable: true }
    },
    {
      field: 'cnContent',
      label: t('content.foodWeekly.fieldContent'),
      component: 'ElInput',
      componentProps: { style: { display: 'none' } }
    }
  ]
})

export const dialogFormRules = (t: Translate): FormRules => ({
  schoolId: [{ required: true, message: t('content.foodWeekly.ruleSchool'), trigger: 'change' }]
})

export const emptyFormModel = (): FoodWeeklyFormModel => ({})
