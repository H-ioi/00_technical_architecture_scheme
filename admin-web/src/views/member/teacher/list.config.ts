import type { UniFormConfig, UniOption, UniTableColumn } from 'uni-ui-lib'

import type { Translate } from '@/types/i18n'

export const roleOpts = (roles: string[]): UniOption[] =>
  roles.map((item) => ({ label: item, value: item }))

export const statusOpts = (t: Translate): UniOption[] => [
  { label: t('member.teacher.unarchived'), value: '0', type: 'success' },
  { label: t('member.teacher.archived'), value: '1', type: 'info' }
]

export const searchForm = (
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
      componentProps: { placeholder: t('member.phKeywordInput'), clearable: true },
      colProps: { span: 6 }
    },
    {
      field: 'schoolIds',
      label: '',
      component: 'ElSelect',
      options: schoolOptions,
      componentProps: {
        placeholder: t('member.phSchool'),
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
      componentProps: { placeholder: t('member.teacher.phRole'), clearable: true },
      colProps: { span: 6 }
    },
    {
      field: 'archived',
      label: '',
      component: 'ElSelect',
      options: statusOptions,
      componentProps: { placeholder: t('member.phStatus'), clearable: true },
      colProps: { span: 6 }
    }
  ],
  rowProps: { gutter: 8 },
  colProps: { span: 6 }
})

export const tableCols = (
  t: Translate,
  schoolOptions: UniOption[],
  archivedStatusOptions: UniOption[]
): UniTableColumn[] => [
  { prop: 'id', label: 'ID', type: 'text', width: 90, fixed: 'left' },
  {
    prop: 'schoolIds',
    label: t('member.fieldSchool'),
    type: 'array',
    options: schoolOptions,
    lookup: { splitValues: true },
    minWidth: 200,
    showOverflowTooltip: true
  },
  {
    prop: 'isaTeacherCode',
    label: t('member.teacher.fieldTeacherCode'),
    type: 'text',
    width: 120,
    showOverflowTooltip: true
  },
  {
    prop: 'fullName',
    label: t('member.teacher.fieldFullName'),
    type: 'text',
    minWidth: 140,
    showOverflowTooltip: true
  },
  { prop: 'gender', label: t('member.teacher.fieldGender'), type: 'text', width: 90 },
  {
    prop: 'nationalities',
    label: t('member.teacher.fieldNationalities'),
    type: 'text',
    minWidth: 120,
    showOverflowTooltip: true
  },
  {
    prop: 'phoneNumber',
    label: t('member.fieldPhone'),
    type: 'copy',
    minWidth: 130,
    showOverflowTooltip: true
  },
  {
    prop: 'email',
    label: t('member.fieldEmail'),
    type: 'copy',
    minWidth: 190,
    showOverflowTooltip: true
  },
  {
    prop: 'role',
    label: t('member.teacher.fieldRole'),
    type: 'text',
    minWidth: 120,
    showOverflowTooltip: true
  },
  {
    prop: 'archived',
    label: t('member.fieldStatus'),
    type: 'tag',
    options: archivedStatusOptions,
    width: 110
  },
  { prop: 'createTime', label: t('member.fieldCreateTime'), type: 'datetime', minWidth: 170 }
]

export const detailForm = (t: Translate): UniFormConfig => ({
  mode: 'view',
  formProps: { labelWidth: '96px' },
  rowProps: { gutter: 16 },
  colProps: { span: 12 },
  view: { emptyText: '-' },
  schema: [
    { field: 'id', label: 'ID', component: 'ElInput' },
    { field: 'schoolName', label: t('member.fieldSchool'), component: 'ElInput' },
    {
      field: 'isaTeacherCode',
      label: t('member.teacher.fieldTeacherCode'),
      component: 'ElInput'
    },
    { field: 'fullName', label: t('member.teacher.fieldFullName'), component: 'ElInput' },
    { field: 'gender', label: t('member.teacher.fieldGender'), component: 'ElInput' },
    {
      field: 'nationalities',
      label: t('member.teacher.fieldNationalities'),
      component: 'ElInput'
    },
    { field: 'phoneNumber', label: t('member.fieldPhone'), component: 'ElInput' },
    { field: 'email', label: t('member.fieldEmail'), component: 'ElInput' },
    { field: 'role', label: t('member.teacher.fieldRole'), component: 'ElInput' },
    { field: 'archived', label: t('member.fieldStatus'), component: 'ElInput', viewType: 'tag' },
    { field: 'createTime', label: t('member.fieldCreateTime'), component: 'ElInput' }
  ]
})
