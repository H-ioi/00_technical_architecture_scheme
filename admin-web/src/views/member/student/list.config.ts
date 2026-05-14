import type { UniFormConfig, UniOption, UniTableColumn } from 'uni-ui-lib'

import type { Translate } from '@/types/i18n'

export const dormOpts = (t: Translate): UniOption[] => [
  { label: t('member.yes'), value: '1', type: 'success' },
  { label: t('member.no'), value: '0', type: 'info' }
]

export const busOpts = (t: Translate): UniOption[] => [
  { label: t('member.yes'), value: '1', type: 'success' },
  { label: t('member.no'), value: '0', type: 'info' }
]

export const ynDispOpts = (t: Translate): UniOption[] => [
  { label: t('member.yes'), value: '1', type: 'success' },
  { label: t('member.yes'), value: 'Yes', type: 'success' },
  { label: t('member.no'), value: '0', type: 'info' },
  { label: t('member.no'), value: 'No', type: 'info' }
]

export const statusOpts = (t: Translate): UniOption[] => [
  { label: t('member.student.enrolled'), value: '1', type: 'success' },
  { label: t('member.student.leaving'), value: '2', type: 'warning' }
]

export const stDispOpts = (t: Translate): UniOption[] => [
  { label: t('member.student.enrolled'), value: '1', type: 'success' },
  { label: t('member.student.enrolled'), value: 'Enrolled', type: 'success' },
  { label: t('member.student.leaving'), value: '2', type: 'warning' },
  { label: t('member.student.leaving'), value: 'Leaving', type: 'warning' }
]

export const searchForm = (
  t: Translate,
  schoolOptions: UniOption[],
  yearGroupOptions: UniOption[],
  formOptions: UniOption[],
  dormitoryOptions: UniOption[],
  busOptions: UniOption[],
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
      field: 'yearGroupName',
      label: '',
      component: 'ElSelect',
      options: yearGroupOptions,
      componentProps: {
        placeholder: t('member.student.phYearGroup'),
        clearable: true,
        multiple: true,
        collapseTags: true
      },
      colProps: { span: 6 }
    },
    {
      field: 'form',
      label: '',
      component: 'ElSelect',
      options: formOptions,
      componentProps: {
        placeholder: t('member.student.phForm'),
        clearable: true,
        multiple: true,
        collapseTags: true
      },
      colProps: { span: 6 }
    },
    {
      field: 'dormitoryStatus',
      label: '',
      component: 'ElSelect',
      options: dormitoryOptions,
      componentProps: { placeholder: t('member.student.phDormitory'), clearable: true },
      colProps: { span: 6 }
    },
    {
      field: 'busStatus',
      label: '',
      component: 'ElSelect',
      options: busOptions,
      componentProps: { placeholder: t('member.student.phBus'), clearable: true },
      colProps: { span: 6 }
    },
    {
      field: 'studentStatus',
      label: '',
      component: 'ElSelect',
      options: statusOptions,
      componentProps: { placeholder: t('member.phStatus'), clearable: true },
      colProps: { span: 6 }
    }
  ],
  rowProps: { gutter: 16 },
  colProps: { span: 6 }
})

export const tableCols = (
  t: Translate,
  schoolOptions: UniOption[],
  ynDispOptions: UniOption[],
  statusDispOptions: UniOption[]
): UniTableColumn[] => [
  { prop: 'id', label: 'ID', type: 'text', width: 90, fixed: 'left' },
  {
    prop: 'schoolIds',
    label: t('member.fieldSchool'),
    type: 'array',
    options: schoolOptions,
    lookup: { splitValues: true },
    minWidth: 240,
    showOverflowTooltip: true
  },
  {
    prop: 'admissonNo',
    label: t('member.student.fieldAdmissionNo'),
    type: 'text',
    minWidth: 120,
    showOverflowTooltip: true
  },
  {
    prop: 'cnFullName',
    label: t('member.student.fieldCnFullName'),
    type: 'text',
    minWidth: 120,
    showOverflowTooltip: true
  },
  {
    prop: 'fullName',
    label: t('member.student.fieldFullName'),
    type: 'text',
    minWidth: 140,
    showOverflowTooltip: true
  },
  { prop: 'grade', label: t('member.student.fieldGrade'), type: 'text', width: 110 },
  { prop: 'formCode', label: t('member.student.fieldForm'), type: 'text', width: 110 },
  {
    prop: 'busStatus',
    label: t('member.student.fieldBus'),
    type: 'tag',
    options: ynDispOptions,
    width: 90
  },
  {
    prop: 'dormitoryStatus',
    label: t('member.student.fieldDormitory'),
    type: 'tag',
    options: ynDispOptions,
    width: 90
  },
  {
    prop: 'studentStatus',
    label: t('member.fieldStatus'),
    type: 'tag',
    options: statusDispOptions,
    width: 110
  }
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
    { field: 'admissonNo', label: t('member.student.fieldAdmissionNo'), component: 'ElInput' },
    { field: 'cnFullName', label: t('member.student.fieldCnFullName'), component: 'ElInput' },
    { field: 'fullName', label: t('member.student.fieldFullName'), component: 'ElInput' },
    { field: 'grade', label: t('member.student.fieldGrade'), component: 'ElInput' },
    { field: 'formCode', label: t('member.student.fieldForm'), component: 'ElInput' },
    {
      field: 'busStatus',
      label: t('member.student.fieldBus'),
      component: 'ElInput',
      options: ynDispOpts(t),
      viewType: 'enum'
    },
    {
      field: 'dormitoryStatus',
      label: t('member.student.fieldDormitory'),
      component: 'ElInput',
      options: ynDispOpts(t),
      viewType: 'enum'
    },
    {
      field: 'studentStatus',
      label: t('member.fieldStatus'),
      component: 'ElInput',
      options: stDispOpts(t),
      viewType: 'enum'
    }
  ]
})
