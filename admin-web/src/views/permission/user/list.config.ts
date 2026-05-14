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
      componentProps: { placeholder: t('permission.user.colUsername'), clearable: true },
      colProps: { span: 8 }
    },
    {
      field: 'nickname',
      label: '',
      component: 'ElInput',
      componentProps: { placeholder: t('permission.user.colNickname'), clearable: true },
      colProps: { span: 8 }
    }
  ],
  rowProps: { gutter: 8 },
  colProps: { span: 8 }
})

export const tableCols = (t: Translate, lockOptsList: UniOption[]): UniTableColumn[] => [
  { prop: 'username', label: t('permission.user.colUsername'), minWidth: 120 },
  { prop: 'nickname', label: t('permission.user.colNickname'), minWidth: 120 },
  {
    prop: 'email',
    label: t('permission.user.colEmail'),
    minWidth: 160,
    showOverflowTooltip: true
  },
  { prop: 'phone', label: t('permission.user.colPhone'), width: 120 },
  { prop: 'deptName', label: t('permission.user.colDept'), minWidth: 120 },
  {
    prop: 'rolesLabel',
    label: t('permission.user.colRoles'),
    minWidth: 160,
    showOverflowTooltip: true
  },
  {
    prop: 'lockFlag',
    label: t('permission.user.colStatus'),
    width: 100,
    type: 'tag',
    options: lockOptsList
  },
  { prop: 'createTime', label: t('permission.user.colCreated'), width: 168, type: 'datetime' }
]

export const permissionUserStatusRadios = (t: Translate): UniOption[] => [
  { label: t('permission.user.statusActive'), value: '0' },
  { label: t('permission.user.statusLocked'), value: '9' }
]

export const permissionUserFormRules = (t: Translate): FormRules<PermissionUserFormModel> => ({
  username: [{ required: true, message: t('permission.user.colUsername'), trigger: 'blur' }],
  deptId: [{ required: true, message: t('permission.user.phDept'), trigger: 'change' }],
  role: [
    {
      validator: (_rule, value, callback) => {
        if (Array.isArray(value) && value.length > 0) {
          callback()
        } else {
          callback(new Error(t('permission.user.phRole')))
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
      label: t('permission.user.colUsername'),
      component: 'ElInput',
      componentProps: {
        maxlength: 50,
        disabled: mode === 'edit',
        autocomplete: 'username'
      }
    },
    {
      field: 'nickname',
      label: t('permission.user.colNickname'),
      component: 'ElInput',
      componentProps: { maxlength: 20, autocomplete: 'off', clearable: true }
    },
    {
      field: 'password',
      label: t('permission.user.phPassword'),
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
      label: t('permission.user.colEmail'),
      component: 'ElInput',
      componentProps: { maxlength: 80, autocomplete: 'email', clearable: true }
    },
    {
      field: 'phone',
      label: t('permission.user.colPhone'),
      component: 'ElInput',
      componentProps: { maxlength: 11, clearable: true }
    },
    {
      field: 'deptId',
      label: t('permission.user.colDept'),
      component: 'ElSelect',
      options: deptOptions,
      componentProps: {
        filterable: true,
        clearable: true,
        placeholder: t('permission.user.phDept'),
        style: { width: '100%' }
      }
    },
    {
      field: 'role',
      label: t('permission.user.colRoles'),
      component: 'ElSelect',
      options: roleOptions,
      componentProps: {
        multiple: true,
        filterable: true,
        collapseTags: true,
        collapseTagsTooltip: true,
        placeholder: t('permission.user.phRole'),
        style: { width: '100%' }
      }
    },
    {
      field: 'lockFlag',
      label: t('permission.user.colStatus'),
      component: 'ElRadioGroup',
      options: permissionUserStatusRadios(t)
    }
  ]
})
