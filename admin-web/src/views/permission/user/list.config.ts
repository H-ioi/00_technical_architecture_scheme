import type { FormRules } from 'element-plus'
import type { UniFormConfig, UniOption, UniTableColumn } from 'uni-ui-lib'

import type { Translate } from '@/types/i18n'
import type { PermissionUserFormModel } from '@/types/modules/permission-user'

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

export const permissionUserStatusRadios = (t: Translate): UniOption[] => [
  { label: t('permission.user.statusActive'), value: '0' },
  { label: t('permission.user.statusLocked'), value: '9' }
]

export const permissionUserFormRules = (t: Translate): FormRules<PermissionUserFormModel> => ({
  username: [{ required: true, message: t('permission.user.columns.username'), trigger: 'blur' }],
  deptId: [{ required: true, message: t('permission.user.placeholders.dept'), trigger: 'change' }],
  role: [
    {
      validator: (_rule, value, callback) => {
        if (Array.isArray(value) && value.length > 0) {
          callback()
        } else {
          callback(new Error(t('permission.user.placeholders.role')))
        }
      },
      trigger: 'change'
    }
  ]
})

export const permissionUserDialogForm = (
  t: Translate,
  deptOptions: UniOption[],
  roleOptions: UniOption[],
  mode: 'add' | 'edit'
): UniFormConfig => ({
  formProps: { labelPosition: 'top' },
  rowProps: { gutter: 16 },
  colProps: { span: 24 },
  rules: permissionUserFormRules(t) as UniFormConfig['rules'],
  schema: [
    {
      field: 'username',
      label: t('permission.user.columns.username'),
      component: 'ElInput',
      componentProps: {
        maxlength: 50,
        disabled: mode === 'edit',
        autocomplete: 'username'
      }
    },
    {
      field: 'nickname',
      label: t('permission.user.columns.nickname'),
      component: 'ElInput',
      componentProps: { maxlength: 20, autocomplete: 'off', clearable: true }
    },
    {
      field: 'password',
      label: t('permission.user.placeholders.password'),
      component: 'ElInput',
      componentProps: {
        type: 'password',
        maxlength: 40,
        showPassword: true,
        autocomplete: 'new-password',
        clearable: true
      }
    },
    {
      field: 'email',
      label: t('permission.user.columns.email'),
      component: 'ElInput',
      componentProps: { maxlength: 80, autocomplete: 'email', clearable: true }
    },
    {
      field: 'phone',
      label: t('permission.user.columns.phone'),
      component: 'ElInput',
      componentProps: { maxlength: 11, clearable: true }
    },
    {
      field: 'deptId',
      label: t('permission.user.columns.dept'),
      component: 'ElSelect',
      options: deptOptions,
      componentProps: {
        filterable: true,
        clearable: true,
        placeholder: t('permission.user.placeholders.dept'),
        style: { width: '100%' }
      }
    },
    {
      field: 'role',
      label: t('permission.user.columns.roles'),
      component: 'ElSelect',
      options: roleOptions,
      componentProps: {
        multiple: true,
        filterable: true,
        collapseTags: true,
        collapseTagsTooltip: true,
        placeholder: t('permission.user.placeholders.role'),
        style: { width: '100%' }
      }
    },
    {
      field: 'lockFlag',
      label: t('permission.user.columns.status'),
      component: 'ElRadioGroup',
      options: permissionUserStatusRadios(t)
    }
  ]
})
