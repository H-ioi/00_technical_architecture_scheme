import type { UniFormConfig, UniOption, UniTableColumn } from 'uni-ui-lib'

import type { Translate } from '@/types/i18n'

export const activeOptions = (t: Translate): UniOption[] => [
  { label: t('activity.yes'), value: '1', type: 'success' },
  { label: t('activity.no'), value: '0', type: 'info' }
]

export const searchForm = (t: Translate, schoolOptions: UniOption[]): UniFormConfig => ({
  schema: [
    {
      field: 'schoolId',
      component: 'ElSelect',
      label: '',
      options: schoolOptions,
      componentProps: {
        placeholder: t('activity.colSchool'),
        clearable: true,
        filterable: true
      },
      colProps: { span: 6 }
    },
    {
      field: 'keyword',
      component: 'ElInput',
      label: '',
      componentProps: { placeholder: t('activity.wechatAppid'), clearable: true },
      colProps: { span: 6 }
    }
  ],
  rowProps: { gutter: 8 },
  colProps: { span: 6 }
})

export const tableCols = (
  t: Translate,
  schoolOptions: UniOption[],
  ynOptions: UniOption[]
): UniTableColumn[] => [
  { prop: 'id', label: 'ID', width: 88 },
  {
    prop: 'schoolId',
    label: t('activity.colSchool'),
    options: schoolOptions,
    minWidth: 160,
    showOverflowTooltip: true
  },
  {
    prop: 'wechatAppid',
    label: t('activity.wechatAppid'),
    minWidth: 180,
    showOverflowTooltip: true
  },
  {
    prop: 'msgTemplateId',
    label: t('activity.wechatTemplateId'),
    minWidth: 180,
    showOverflowTooltip: true
  },
  {
    prop: 'verifyToken',
    label: t('activity.wechatVerifyToken'),
    minWidth: 180,
    showOverflowTooltip: true
  },
  {
    prop: 'active',
    label: t('activity.activeStatus'),
    type: 'tag',
    options: ynOptions,
    width: 110
  },
  { prop: 'createdAt', label: t('activity.colCreateTime'), minWidth: 156 },
  { prop: 'updatedAt', label: t('activity.colUpdateTime'), minWidth: 156 }
]
