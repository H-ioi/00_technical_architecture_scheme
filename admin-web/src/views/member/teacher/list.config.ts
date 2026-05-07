import type { UniFormConfig, UniOption, UniTableColumn } from 'uni-ui-lib'

type Translate = (key: string) => string

export const createRoleOptions = (roles: string[]): UniOption[] =>
  roles.map((item) => ({ label: item, value: item }))

export const createStatusOptions = (t: Translate): UniOption[] => [
  { label: t('member.teacher.options.unarchived'), value: '0', type: 'success' },
  { label: t('member.teacher.options.archived'), value: '1', type: 'info' }
]

export const createSearchConfig = (
  t: Translate,
  schoolOptions: UniOption[],
  roleOptions: UniOption[],
  statusOptions: UniOption[]
): UniFormConfig => ({
  schema: [
    {
      field: 'keywordssearch',
      label: '',
      component: 'ElInput',
      componentProps: { placeholder: t('member.placeholders.keywordInput'), clearable: true },
      colProps: { span: 6 }
    },
    {
      field: 'schoolIds',
      label: '',
      component: 'ElSelect',
      options: schoolOptions,
      componentProps: {
        placeholder: t('member.placeholders.school'),
        clearable: true,
        filterable: true
      },
      colProps: { span: 6 }
    },
    {
      field: 'role',
      label: '',
      component: 'ElSelect',
      options: roleOptions,
      componentProps: { placeholder: t('member.teacher.placeholders.role'), clearable: true },
      colProps: { span: 6 }
    },
    {
      field: 'archived',
      label: '',
      component: 'ElSelect',
      options: statusOptions,
      componentProps: { placeholder: t('member.placeholders.status'), clearable: true },
      colProps: { span: 6 }
    }
  ],
  rowProps: { gutter: 16 },
  colProps: { span: 6 }
})

export const createColumns = (t: Translate): UniTableColumn[] => [
  { prop: 'id', label: 'ID', type: 'text', width: 90, fixed: 'left' },
  { prop: 'schoolName', label: t('member.fields.school'), type: 'text', minWidth: 140 },
  {
    prop: 'isaTeacherCode',
    label: t('member.teacher.fields.teacherCode'),
    type: 'text',
    minWidth: 120
  },
  { prop: 'fullName', label: t('member.teacher.fields.fullName'), type: 'text', minWidth: 140 },
  { prop: 'gender', label: t('member.teacher.fields.gender'), type: 'text', width: 90 },
  {
    prop: 'nationalities',
    label: t('member.teacher.fields.nationalities'),
    type: 'text',
    minWidth: 120
  },
  { prop: 'phoneNumber', label: t('member.fields.phone'), type: 'copy', minWidth: 130 },
  { prop: 'email', label: t('member.fields.email'), type: 'copy', minWidth: 190 },
  { prop: 'role', label: t('member.teacher.fields.role'), type: 'text', minWidth: 120 },
  { prop: 'archived', label: t('member.fields.status'), type: 'tag', width: 110 },
  { prop: 'createTime', label: t('member.fields.createTime'), type: 'datetime', minWidth: 170 }
]

export const createDetailConfig = (t: Translate): UniFormConfig => ({
  mode: 'view',
  formProps: { labelWidth: '96px' },
  rowProps: { gutter: 16 },
  colProps: { span: 12 },
  view: { emptyText: '-' },
  schema: [
    { field: 'id', label: 'ID', component: 'ElInput' },
    { field: 'schoolName', label: t('member.fields.school'), component: 'ElInput' },
    {
      field: 'isaTeacherCode',
      label: t('member.teacher.fields.teacherCode'),
      component: 'ElInput'
    },
    { field: 'fullName', label: t('member.teacher.fields.fullName'), component: 'ElInput' },
    { field: 'gender', label: t('member.teacher.fields.gender'), component: 'ElInput' },
    {
      field: 'nationalities',
      label: t('member.teacher.fields.nationalities'),
      component: 'ElInput'
    },
    { field: 'phoneNumber', label: t('member.fields.phone'), component: 'ElInput' },
    { field: 'email', label: t('member.fields.email'), component: 'ElInput' },
    { field: 'role', label: t('member.teacher.fields.role'), component: 'ElInput' },
    { field: 'archived', label: t('member.fields.status'), component: 'ElInput', viewType: 'tag' },
    { field: 'createTime', label: t('member.fields.createTime'), component: 'ElInput' }
  ]
})
