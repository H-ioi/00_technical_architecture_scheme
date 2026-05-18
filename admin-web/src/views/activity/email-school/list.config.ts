import type { UniFormConfig, UniOption, UniTableColumn } from 'uni-ui-lib'

import type { Translate } from '@/types/i18n'

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
      componentProps: { placeholder: t('activity.emailAddress'), clearable: true },
      colProps: { span: 6 }
    }
  ],
  rowProps: { gutter: 8 },
  colProps: { span: 6 }
})

export const tableCols = (
  t: Translate,
  schoolOptions: UniOption[],
  appModuleOptions: UniOption[]
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
    prop: 'email',
    label: t('activity.emailAddress'),
    minWidth: 220,
    showOverflowTooltip: true
  },
  {
    prop: 'appModule',
    label: t('activity.appModule'),
    options: appModuleOptions,
    minWidth: 140,
    showOverflowTooltip: true
  },
  { prop: 'createdAt', label: t('activity.colCreateTime'), minWidth: 156 },
  { prop: 'updatedAt', label: t('activity.colUpdateTime'), minWidth: 156 }
]
