import type { UniFormConfig, UniOption, UniTableColumn } from 'uni-ui-lib'

import type { Translate } from '@/types/i18n'

/** 进校离校状态（对齐旧 `consts.enterOrExit`）。 */
export const accessEnterExitOpts = (t: Translate): UniOption[] => [
  { label: t('attendance.enterSchool'), value: '1' },
  { label: t('attendance.leaveSchool'), value: '2' },
  { label: t('attendance.leaveAsk'), value: '3' },
  { label: t('attendance.absent'), value: '4' }
]

/** 开门结果（对齐旧 `consts.successOrfail`）。 */
export const accessOpenResultOpts = (t: Translate): UniOption[] => [
  { label: t('attendance.access.resultFail'), value: '0' },
  { label: t('attendance.access.resultSuccess'), value: '1' }
]

export const searchForm = (
  t: Translate,
  schoolOptions: UniOption[],
  deptOptions: UniOption[]
): UniFormConfig => ({
  schema: [
    {
      field: 'schoolId',
      label: '',
      component: 'ElSelect',
      options: schoolOptions,
      componentProps: {
        placeholder: t('attendance.phSchool'),
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
        placeholder: t('attendance.phDept'),
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
        placeholder: t('attendance.phStaffName'),
        clearable: true
      },
      colProps: { span: 6 }
    },
    {
      field: 'personCode',
      label: '',
      component: 'ElInput',
      componentProps: {
        placeholder: t('attendance.phPersonCode'),
        clearable: true
      },
      colProps: { span: 6 }
    },
    {
      field: 'cardNumber',
      label: '',
      component: 'ElInput',
      componentProps: {
        placeholder: t('attendance.phCardNumber'),
        clearable: true
      },
      colProps: { span: 6 }
    },
    {
      field: 'acsChannelName',
      label: '',
      component: 'ElInput',
      componentProps: {
        placeholder: t('attendance.phChannel'),
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
        placeholder: t('attendance.beginAttendance'),
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
        placeholder: t('attendance.endAttendance'),
        valueFormat: 'YYYY-MM-DD',
        clearable: true
      },
      colProps: { span: 6 }
    }
  ],
  rowProps: { gutter: 16 },
  colProps: { span: 6 }
})

export const tableCols = (
  t: Translate,
  schoolOptions: UniOption[]
): UniTableColumn[] => [
  { prop: 'id', label: t('attendance.id'), type: 'text', width: 90, fixed: 'left' },
  {
    prop: 'schoolId',
    label: t('attendance.campus'),
    type: 'text',
    options: schoolOptions,
    minWidth: 120,
    showOverflowTooltip: true
  },
  {
    prop: 'deptName',
    label: t('attendance.dept'),
    type: 'text',
    minWidth: 120,
    showOverflowTooltip: true
  },
  {
    prop: 'personCode',
    label: t('attendance.personCode'),
    type: 'text',
    minWidth: 100,
    showOverflowTooltip: true
  },
  {
    prop: 'personName',
    label: t('attendance.staffName'),
    type: 'text',
    minWidth: 100,
    showOverflowTooltip: true
  },
  {
    prop: 'acsChannelName',
    label: t('attendance.channel'),
    type: 'text',
    minWidth: 120,
    showOverflowTooltip: true
  },
  {
    prop: 'attendanceDate',
    label: t('attendance.attendanceDate'),
    type: 'text',
    width: 120
  },
  {
    prop: 'enterOrExit',
    label: t('attendance.access.enterOrExit'),
    type: 'text',
    width: 90
  },
  { prop: 'openType', label: t('attendance.access.openType'), type: 'text', width: 110 },
  { prop: 'openResult', label: t('attendance.access.openResult'), type: 'text', width: 90 },
  {
    prop: 'cardNumber',
    label: t('attendance.cardNumber'),
    type: 'text',
    minWidth: 110,
    showOverflowTooltip: true
  },
  {
    prop: 'deviceName',
    label: t('attendance.access.deviceName'),
    type: 'text',
    minWidth: 120,
    showOverflowTooltip: true
  },
  {
    prop: 'swingTime',
    label: t('attendance.access.swingTime'),
    type: 'text',
    minWidth: 160,
    showOverflowTooltip: true
  },
  {
    prop: 'createTime',
    label: t('attendance.createTime'),
    type: 'text',
    minWidth: 160,
    showOverflowTooltip: true
  }
]

export const detailForm = (
  t: Translate,
  schoolOptions: UniOption[]
): UniFormConfig => ({
  mode: 'view',
  formProps: { labelWidth: '110px' },
  rowProps: { gutter: 16 },
  colProps: { span: 12 },
  view: { emptyText: '-' },
  schema: [
    { field: 'id', label: t('attendance.id'), component: 'ElInput' },
    {
      field: 'schoolId',
      label: t('attendance.campus'),
      component: 'ElInput',
      viewType: 'enum',
      options: schoolOptions
    },
    { field: 'deptName', label: t('attendance.dept'), component: 'ElInput' },
    { field: 'personCode', label: t('attendance.personCode'), component: 'ElInput' },
    { field: 'personName', label: t('attendance.staffName'), component: 'ElInput' },
    {
      field: 'acsChannelName',
      label: t('attendance.channel'),
      component: 'ElInput'
    },
    {
      field: 'attendanceDate',
      label: t('attendance.attendanceDate'),
      component: 'ElInput'
    },
    {
      field: 'enterOrExit',
      label: t('attendance.access.enterOrExit'),
      component: 'ElInput'
    },
    { field: 'openType', label: t('attendance.access.openType'), component: 'ElInput' },
    { field: 'openResult', label: t('attendance.access.openResult'), component: 'ElInput' },
    { field: 'cardNumber', label: t('attendance.cardNumber'), component: 'ElInput' },
    { field: 'deviceName', label: t('attendance.access.deviceName'), component: 'ElInput' },
    { field: 'swingTime', label: t('attendance.access.swingTime'), component: 'ElInput' },
    { field: 'createTime', label: t('attendance.createTime'), component: 'ElInput' }
  ]
})
