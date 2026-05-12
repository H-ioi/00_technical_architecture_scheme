import type { UniFormConfig, UniOption, UniTableColumn } from 'uni-ui-lib'

import type { Translate } from '@/types/i18n'

/** 进校离校状态（对齐旧 `consts.enterOrExit`）。 */
export const accessEnterExitOpts = (t: Translate): UniOption[] => [
  { label: t('attendance.access.options.enter'), value: '1' },
  { label: t('attendance.access.options.exit'), value: '2' },
  { label: t('attendance.access.options.leave'), value: '3' },
  { label: t('attendance.access.options.absent'), value: '4' }
]

/** 开门结果（对齐旧 `consts.successOrfail`）。 */
export const accessOpenResultOpts = (t: Translate): UniOption[] => [
  { label: t('attendance.access.options.resultFail'), value: '0' },
  { label: t('attendance.access.options.resultSuccess'), value: '1' }
]

export const attendanceAccessSearchForm = (
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
        placeholder: t('attendance.access.placeholders.school'),
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
        placeholder: t('attendance.access.placeholders.dept'),
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
        placeholder: t('attendance.access.placeholders.personName'),
        clearable: true
      },
      colProps: { span: 6 }
    },
    {
      field: 'personCode',
      label: '',
      component: 'ElInput',
      componentProps: {
        placeholder: t('attendance.access.placeholders.personCode'),
        clearable: true
      },
      colProps: { span: 6 }
    },
    {
      field: 'cardNumber',
      label: '',
      component: 'ElInput',
      componentProps: {
        placeholder: t('attendance.access.placeholders.cardNumber'),
        clearable: true
      },
      colProps: { span: 6 }
    },
    {
      field: 'acsChannelName',
      label: '',
      component: 'ElInput',
      componentProps: {
        placeholder: t('attendance.access.placeholders.channel'),
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
        placeholder: t('attendance.access.placeholders.beginDate'),
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
        placeholder: t('attendance.access.placeholders.endDate'),
        valueFormat: 'YYYY-MM-DD',
        clearable: true
      },
      colProps: { span: 6 }
    }
  ],
  rowProps: { gutter: 16 },
  colProps: { span: 6 }
})

export const attendanceAccessColumns = (
  t: Translate,
  schoolOptions: UniOption[]
): UniTableColumn[] => [
  { prop: 'id', label: t('attendance.access.columns.id'), type: 'text', width: 90, fixed: 'left' },
  {
    prop: 'schoolId',
    label: t('attendance.access.columns.schoolName'),
    type: 'text',
    options: schoolOptions,
    minWidth: 120,
    showOverflowTooltip: true
  },
  {
    prop: 'deptName',
    label: t('attendance.access.columns.deptName'),
    type: 'text',
    minWidth: 120,
    showOverflowTooltip: true
  },
  {
    prop: 'personCode',
    label: t('attendance.access.columns.personCode'),
    type: 'text',
    minWidth: 100,
    showOverflowTooltip: true
  },
  {
    prop: 'personName',
    label: t('attendance.access.columns.personName'),
    type: 'text',
    minWidth: 100,
    showOverflowTooltip: true
  },
  {
    prop: 'acsChannelName',
    label: t('attendance.access.columns.acsChannelName'),
    type: 'text',
    minWidth: 120,
    showOverflowTooltip: true
  },
  {
    prop: 'attendanceDate',
    label: t('attendance.access.columns.attendanceDate'),
    type: 'text',
    width: 120
  },
  {
    prop: 'enterOrExit',
    label: t('attendance.access.columns.enterOrExit'),
    type: 'text',
    width: 90
  },
  { prop: 'openType', label: t('attendance.access.columns.openType'), type: 'text', width: 110 },
  { prop: 'openResult', label: t('attendance.access.columns.openResult'), type: 'text', width: 90 },
  {
    prop: 'cardNumber',
    label: t('attendance.access.columns.cardNumber'),
    type: 'text',
    minWidth: 110,
    showOverflowTooltip: true
  },
  {
    prop: 'deviceName',
    label: t('attendance.access.columns.deviceName'),
    type: 'text',
    minWidth: 120,
    showOverflowTooltip: true
  },
  {
    prop: 'swingTime',
    label: t('attendance.access.columns.swingTime'),
    type: 'text',
    minWidth: 160,
    showOverflowTooltip: true
  },
  {
    prop: 'createTime',
    label: t('attendance.access.columns.createTime'),
    type: 'text',
    minWidth: 160,
    showOverflowTooltip: true
  }
]

export const attendanceAccessDetailForm = (
  t: Translate,
  schoolOptions: UniOption[]
): UniFormConfig => ({
  mode: 'view',
  formProps: { labelWidth: '110px' },
  rowProps: { gutter: 16 },
  colProps: { span: 12 },
  view: { emptyText: '-' },
  schema: [
    { field: 'id', label: t('attendance.access.columns.id'), component: 'ElInput' },
    {
      field: 'schoolId',
      label: t('attendance.access.columns.schoolName'),
      component: 'ElInput',
      viewType: 'enum',
      options: schoolOptions
    },
    { field: 'deptName', label: t('attendance.access.columns.deptName'), component: 'ElInput' },
    { field: 'personCode', label: t('attendance.access.columns.personCode'), component: 'ElInput' },
    { field: 'personName', label: t('attendance.access.columns.personName'), component: 'ElInput' },
    {
      field: 'acsChannelName',
      label: t('attendance.access.columns.acsChannelName'),
      component: 'ElInput'
    },
    {
      field: 'attendanceDate',
      label: t('attendance.access.columns.attendanceDate'),
      component: 'ElInput'
    },
    {
      field: 'enterOrExit',
      label: t('attendance.access.columns.enterOrExit'),
      component: 'ElInput'
    },
    { field: 'openType', label: t('attendance.access.columns.openType'), component: 'ElInput' },
    { field: 'openResult', label: t('attendance.access.columns.openResult'), component: 'ElInput' },
    { field: 'cardNumber', label: t('attendance.access.columns.cardNumber'), component: 'ElInput' },
    { field: 'deviceName', label: t('attendance.access.columns.deviceName'), component: 'ElInput' },
    { field: 'swingTime', label: t('attendance.access.columns.swingTime'), component: 'ElInput' },
    { field: 'createTime', label: t('attendance.access.columns.createTime'), component: 'ElInput' }
  ]
})
