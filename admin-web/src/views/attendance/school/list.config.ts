import type { UniFormConfig, UniOption, UniTableColumn } from 'uni-ui-lib'

import type { Translate } from '@/types/i18n'

/** 开门类型（对齐旧 `consts.attendanceOpenType`）。 */
export const attendanceOpenTypeOpts = (t: Translate): UniOption[] => [
  { label: t('attendance.school.options.openCard'), value: '51' },
  { label: t('attendance.school.options.openIllegalCard'), value: '52' },
  { label: t('attendance.school.options.openFace'), value: '61' },
  { label: t('attendance.school.options.openIllegalFace'), value: '62' }
]

export const attendanceSchoolSearchForm = (
  t: Translate,
  schoolOptions: UniOption[],
  deptOptions: UniOption[],
  statusOptions: UniOption[]
): UniFormConfig => ({
  schema: [
    {
      field: 'schoolId',
      label: '',
      component: 'ElSelect',
      options: schoolOptions,
      componentProps: {
        placeholder: t('attendance.school.placeholders.school'),
        clearable: true,
        filterable: true
      },
      colProps: { span: 6 }
    },
    {
      field: 'deptName',
      label: '',
      component: 'ElSelect',
      options: deptOptions,
      componentProps: {
        placeholder: t('attendance.school.placeholders.dept'),
        clearable: true,
        filterable: true
      },
      colProps: { span: 6 }
    },
    {
      field: 'personName',
      label: '',
      component: 'ElInput',
      componentProps: {
        placeholder: t('attendance.school.placeholders.personName'),
        clearable: true
      },
      colProps: { span: 6 }
    },
    {
      field: 'personCode',
      label: '',
      component: 'ElInput',
      componentProps: {
        placeholder: t('attendance.school.placeholders.personCode'),
        clearable: true
      },
      colProps: { span: 6 }
    },
    {
      field: 'schoolStatus',
      label: '',
      component: 'ElSelect',
      options: statusOptions,
      componentProps: {
        placeholder: t('attendance.school.placeholders.schoolStatus'),
        clearable: true
      },
      colProps: { span: 6 }
    },
    {
      field: 'cardNumber',
      label: '',
      component: 'ElInput',
      componentProps: {
        placeholder: t('attendance.school.placeholders.cardNumber'),
        clearable: true
      },
      colProps: { span: 6 }
    },
    {
      field: 'entryAcsChannel',
      label: '',
      component: 'ElInput',
      componentProps: {
        placeholder: t('attendance.school.placeholders.entryChannel'),
        clearable: true
      },
      colProps: { span: 6 }
    },
    {
      field: 'leavingAcsChannel',
      label: '',
      component: 'ElInput',
      componentProps: {
        placeholder: t('attendance.school.placeholders.leavingChannel'),
        clearable: true
      },
      colProps: { span: 6 }
    },
    {
      field: 'beginDate',
      label: '',
      component: 'ElDatePicker',
      componentProps: {
        type: 'date',
        placeholder: t('attendance.school.placeholders.beginDate'),
        valueFormat: 'YYYY-MM-DD',
        clearable: true
      },
      colProps: { span: 6 }
    },
    {
      field: 'endDate',
      label: '',
      component: 'ElDatePicker',
      componentProps: {
        type: 'date',
        placeholder: t('attendance.school.placeholders.endDate'),
        valueFormat: 'YYYY-MM-DD',
        clearable: true
      },
      colProps: { span: 6 }
    }
  ],
  rowProps: { gutter: 16 },
  colProps: { span: 6 }
})

export const attendanceSchoolColumns = (t: Translate, schoolOptions: UniOption[]): UniTableColumn[] => [
  { prop: 'id', label: t('attendance.school.columns.id'), type: 'text', width: 90, fixed: 'left' },
  {
    prop: 'schoolId',
    label: t('attendance.school.columns.schoolName'),
    type: 'text',
    options: schoolOptions,
    minWidth: 120,
    showOverflowTooltip: true
  },
  {
    prop: 'personCode',
    label: t('attendance.school.columns.personCode'),
    type: 'text',
    minWidth: 110,
    showOverflowTooltip: true
  },
  {
    prop: 'personName',
    label: t('attendance.school.columns.personName'),
    type: 'text',
    minWidth: 100,
    showOverflowTooltip: true
  },
  {
    prop: 'deptName',
    label: t('attendance.school.columns.deptName'),
    type: 'text',
    minWidth: 120,
    showOverflowTooltip: true
  },
  {
    prop: 'cardNumber',
    label: t('attendance.school.columns.cardNumber'),
    type: 'text',
    minWidth: 110,
    showOverflowTooltip: true
  },
  { prop: 'schoolStatus', label: t('attendance.school.columns.schoolStatus'), type: 'text', width: 100 },
  { prop: 'entryOpenType', label: t('attendance.school.columns.entryOpenType'), type: 'text', width: 110 },
  {
    prop: 'entryTime',
    label: t('attendance.school.columns.entryTime'),
    type: 'text',
    minWidth: 160,
    showOverflowTooltip: true
  },
  {
    prop: 'entryAcsChannel',
    label: t('attendance.school.columns.entryChannel'),
    type: 'text',
    minWidth: 110,
    showOverflowTooltip: true
  },
  {
    prop: 'leavingOpenType',
    label: t('attendance.school.columns.leavingOpenType'),
    type: 'text',
    width: 110
  },
  {
    prop: 'leavingTime',
    label: t('attendance.school.columns.leavingTime'),
    type: 'text',
    minWidth: 160,
    showOverflowTooltip: true
  },
  {
    prop: 'leavingAcsChannel',
    label: t('attendance.school.columns.leavingChannel'),
    type: 'text',
    minWidth: 110,
    showOverflowTooltip: true
  },
  { prop: 'attendanceDate', label: t('attendance.school.columns.attendanceDate'), type: 'text', width: 120 },
  {
    prop: 'createdAt',
    label: t('attendance.school.columns.createdAt'),
    type: 'text',
    minWidth: 160,
    showOverflowTooltip: true
  }
]

export const attendanceSchoolDetailForm = (t: Translate, schoolOptions: UniOption[]): UniFormConfig => ({
  mode: 'view',
  formProps: { labelWidth: '110px' },
  rowProps: { gutter: 16 },
  colProps: { span: 12 },
  view: { emptyText: '-' },
  schema: [
    { field: 'id', label: t('attendance.school.columns.id'), component: 'ElInput' },
    {
      field: 'schoolId',
      label: t('attendance.school.columns.schoolName'),
      component: 'ElInput',
      viewType: 'enum',
      options: schoolOptions
    },
    { field: 'personCode', label: t('attendance.school.columns.personCode'), component: 'ElInput' },
    { field: 'personName', label: t('attendance.school.columns.personName'), component: 'ElInput' },
    { field: 'deptName', label: t('attendance.school.columns.deptName'), component: 'ElInput' },
    { field: 'cardNumber', label: t('attendance.school.columns.cardNumber'), component: 'ElInput' },
    { field: 'schoolStatus', label: t('attendance.school.columns.schoolStatus'), component: 'ElInput' },
    { field: 'entryOpenType', label: t('attendance.school.columns.entryOpenType'), component: 'ElInput' },
    { field: 'entryTime', label: t('attendance.school.columns.entryTime'), component: 'ElInput' },
    { field: 'entryAcsChannel', label: t('attendance.school.columns.entryChannel'), component: 'ElInput' },
    { field: 'leavingOpenType', label: t('attendance.school.columns.leavingOpenType'), component: 'ElInput' },
    { field: 'leavingTime', label: t('attendance.school.columns.leavingTime'), component: 'ElInput' },
    {
      field: 'leavingAcsChannel',
      label: t('attendance.school.columns.leavingChannel'),
      component: 'ElInput'
    },
    { field: 'attendanceDate', label: t('attendance.school.columns.attendanceDate'), component: 'ElInput' },
    { field: 'createdAt', label: t('attendance.school.columns.createdAt'), component: 'ElInput' }
  ]
})
