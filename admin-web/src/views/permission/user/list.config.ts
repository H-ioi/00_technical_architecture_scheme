import type { UniFormConfig, UniOption, UniTableColumn } from 'uni-ui-lib'

import type { Translate } from '@/types/i18n'

export const lockOpts = (t: Translate): UniOption[] => [
  { label: t('permission.user.statusActive'), value: '0', type: 'success' },
  { label: t('permission.user.statusLocked'), value: '9', type: 'danger' }
]

export const searchForm = (t: Translate): UniFormConfig => ({
  schema: [
    {
      field: 'username',
      label: '',
      component: 'ElInput',
      componentProps: { placeholder: t('permission.user.columns.username'), clearable: true },
      colProps: { span: 8 }
    },
    {
      field: 'nickname',
      label: '',
      component: 'ElInput',
      componentProps: { placeholder: t('permission.user.columns.nickname'), clearable: true },
      colProps: { span: 8 }
    }
  ],
  rowProps: { gutter: 16 },
  colProps: { span: 8 }
})

export const tableCols = (
  t: Translate,
  lockOptsList: UniOption[]
): UniTableColumn[] => [
  { prop: 'username', label: t('permission.user.columns.username'), minWidth: 120 },
  { prop: 'nickname', label: t('permission.user.columns.nickname'), minWidth: 120 },
  { prop: 'email', label: t('permission.user.columns.email'), minWidth: 160, showOverflowTooltip: true },
  { prop: 'phone', label: t('permission.user.columns.phone'), width: 120 },
  { prop: 'deptName', label: t('permission.user.columns.dept'), minWidth: 120 },
  { prop: 'rolesLabel', label: t('permission.user.columns.roles'), minWidth: 160, showOverflowTooltip: true },
  {
    prop: 'lockFlag',
    label: t('permission.user.columns.status'),
    width: 100,
    type: 'tag',
    dict: lockOptsList
  },
  { prop: 'createTime', label: t('permission.user.columns.created'), width: 168, type: 'datetime' }
]
