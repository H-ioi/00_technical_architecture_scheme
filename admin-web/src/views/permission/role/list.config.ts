import type { UniFormConfig, UniOption, UniTableColumn } from 'uni-ui-lib'

import type { Translate } from '@/types/i18n'

export const dpTypeOptions = (t: Translate): UniOption[] => [
  { label: t('permission.role.dpAll'), value: 1 },
  { label: t('permission.role.dpSelf'), value: 2 },
  { label: t('permission.role.dpSelfBranch'), value: 3 },
  { label: t('permission.role.dpDept'), value: 4 },
  { label: t('permission.role.dpDeptBranch'), value: 5 },
  { label: t('permission.role.dpCustom'), value: 6 }
]

export const searchForm = (t: Translate, dpOptions: UniOption[]): UniFormConfig => ({
  schema: [
    {
      field: 'roleName',
      label: '',
      component: 'ElInput',
      componentProps: { placeholder: t('permission.role.columns.name'), clearable: true },
      colProps: { span: 8 }
    },
    {
      field: 'roleCode',
      label: '',
      component: 'ElInput',
      componentProps: { placeholder: t('permission.role.columns.code'), clearable: true },
      colProps: { span: 8 }
    },
    {
      field: 'dpType',
      label: '',
      component: 'ElSelect',
      options: dpOptions,
      componentProps: { placeholder: t('permission.role.columns.dpType'), clearable: true, filterable: true },
      colProps: { span: 8 }
    }
  ],
  rowProps: { gutter: 16 },
  colProps: { span: 8 }
})

export const tableCols = (t: Translate): UniTableColumn[] => [
  { prop: 'roleName', label: t('permission.role.columns.name'), minWidth: 140, type: 'text' },
  { prop: 'roleCode', label: t('permission.role.columns.code'), minWidth: 120, type: 'text' },
  { prop: 'roleDesc', label: t('permission.role.columns.desc'), minWidth: 160, type: 'text', showOverflowTooltip: true },
  { prop: 'dpType', label: t('permission.role.columns.dpType'), width: 140, type: 'number' },
  { prop: 'createTime', label: t('permission.role.columns.created'), width: 168, type: 'datetime' }
]
