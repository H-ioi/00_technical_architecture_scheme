import type { UniFormConfig, UniOption, UniTableColumn } from 'uni-ui-lib'

import type { Translate } from '@/types/i18n'

export const dormOpts = (t: Translate): UniOption[] => [
  { label: t('member.student.options.yes'), value: '1', type: 'success' },
  { label: t('member.student.options.no'), value: '0', type: 'info' }
]

export const busOpts = (t: Translate): UniOption[] => [
  { label: t('member.student.options.yes'), value: '1', type: 'success' },
  { label: t('member.student.options.no'), value: '0', type: 'info' }
]

export const ynDispOpts = (t: Translate): UniOption[] => [
  { label: t('member.student.options.yes'), value: '1', type: 'success' },
  { label: t('member.student.options.yes'), value: 'Yes', type: 'success' },
  { label: t('member.student.options.no'), value: '0', type: 'info' },
  { label: t('member.student.options.no'), value: 'No', type: 'info' }
]

export const statusOpts = (t: Translate): UniOption[] => [
  { label: t('member.student.options.enrolled'), value: '1', type: 'success' },
  { label: t('member.student.options.leaving'), value: '2', type: 'warning' }
]

export const stDispOpts = (t: Translate): UniOption[] => [
  { label: t('member.student.options.enrolled'), value: '1', type: 'success' },
  { label: t('member.student.options.enrolled'), value: 'Enrolled', type: 'success' },
  { label: t('member.student.options.leaving'), value: '2', type: 'warning' },
  { label: t('member.student.options.leaving'), value: 'Leaving', type: 'warning' }
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
      field: 'yearGroupName',
      label: '',
      component: 'ElSelect',
      options: yearGroupOptions,
      componentProps: {
        placeholder: t('member.student.placeholders.yearGroup'),
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
        placeholder: t('member.student.placeholders.form'),
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
      componentProps: { placeholder: t('member.student.placeholders.dormitory'), clearable: true },
      colProps: { span: 6 }
    },
    {
      field: 'busStatus',
      label: '',
      component: 'ElSelect',
      options: busOptions,
      componentProps: { placeholder: t('member.student.placeholders.bus'), clearable: true },
      colProps: { span: 6 }
    },
    {
      field: 'studentStatus',
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

export const tableCols = (t: Translate): UniTableColumn[] => [
  { prop: 'id', label: 'ID', type: 'text', width: 90, fixed: 'left' },
  {
    prop: 'schoolName',
    label: t('member.fields.school'),
    type: 'text',
    minWidth: 240,
    showOverflowTooltip: true
  },
  {
    prop: 'admissonNo',
    label: t('member.student.fields.admissionNo'),
    type: 'text',
    minWidth: 120,
    showOverflowTooltip: true
  },
  {
    prop: 'cnFullName',
    label: t('member.student.fields.cnFullName'),
    type: 'text',
    minWidth: 120,
    showOverflowTooltip: true
  },
  {
    prop: 'fullName',
    label: t('member.student.fields.fullName'),
    type: 'text',
    minWidth: 140,
    showOverflowTooltip: true
  },
  { prop: 'grade', label: t('member.student.fields.grade'), type: 'text', width: 110 },
  { prop: 'formCode', label: t('member.student.fields.form'), type: 'text', width: 110 },
  { prop: 'busStatus', label: t('member.student.fields.bus'), type: 'tag', width: 90 },
  { prop: 'dormitoryStatus', label: t('member.student.fields.dormitory'), type: 'tag', width: 90 },
  { prop: 'studentStatus', label: t('member.fields.status'), type: 'tag', width: 110 }
]

export const detailForm = (t: Translate): UniFormConfig => ({
  mode: 'view',
  formProps: { labelWidth: '96px' },
  rowProps: { gutter: 16 },
  colProps: { span: 12 },
  view: { emptyText: '-' },
  schema: [
    { field: 'id', label: 'ID', component: 'ElInput' },
    { field: 'schoolName', label: t('member.fields.school'), component: 'ElInput' },
    { field: 'admissonNo', label: t('member.student.fields.admissionNo'), component: 'ElInput' },
    { field: 'cnFullName', label: t('member.student.fields.cnFullName'), component: 'ElInput' },
    { field: 'fullName', label: t('member.student.fields.fullName'), component: 'ElInput' },
    { field: 'grade', label: t('member.student.fields.grade'), component: 'ElInput' },
    { field: 'formCode', label: t('member.student.fields.form'), component: 'ElInput' },
    {
      field: 'busStatus',
      label: t('member.student.fields.bus'),
      component: 'ElInput',
      options: ynDispOpts(t),
      viewType: 'enum'
    },
    {
      field: 'dormitoryStatus',
      label: t('member.student.fields.dormitory'),
      component: 'ElInput',
      options: ynDispOpts(t),
      viewType: 'enum'
    },
    {
      field: 'studentStatus',
      label: t('member.fields.status'),
      component: 'ElInput',
      options: stDispOpts(t),
      viewType: 'enum'
    }
  ]
})
