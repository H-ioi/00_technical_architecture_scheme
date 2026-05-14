import type { UniFormConfig, UniOption, UniTableColumn } from 'uni-ui-lib'

import type { Translate } from '@/types/i18n'

/** 开门类型（对齐旧 `consts.attendanceOpenType`）。 */
export const attendanceOpenTypeOpts = (t: Translate): UniOption[] => [
  { label: t('attendance.schoolAtt.openCard'), value: '51' },
  { label: t('attendance.schoolAtt.openIllegalCard'), value: '52' },
  { label: t('attendance.schoolAtt.openFace'), value: '61' },
  { label: t('attendance.schoolAtt.openIllegalFace'), value: '62' }
]

export const searchForm = (
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
      field: 'schoolStatus',
      label: '',
      component: 'ElSelect',
      options: statusOptions,
      componentProps: {
        placeholder: t('attendance.phSchoolStatus'),
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
      field: 'entryAcsChannel',
      label: '',
      component: 'ElInput',
      componentProps: {
        placeholder: t('attendance.phEntryChannel'),
        clearable: true
      },
      colProps: { span: 6 }
    },
    {
      field: 'leavingAcsChannel',
      label: '',
      component: 'ElInput',
      componentProps: {
        placeholder: t('attendance.phLeavingChannel'),
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
  rowProps: { gutter: 8 },
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
    prop: 'personCode',
    label: t('attendance.personCode'),
    type: 'text',
    minWidth: 110,
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
    prop: 'deptName',
    label: t('attendance.dept'),
    type: 'text',
    minWidth: 120,
    showOverflowTooltip: true
  },
  {
    prop: 'cardNumber',
    label: t('attendance.cardNumber'),
    type: 'text',
    minWidth: 110,
    showOverflowTooltip: true
  },
  {
    prop: 'schoolStatus',
    label: t('attendance.status'),
    type: 'text',
    width: 100
  },
  {
    prop: 'entryOpenType',
    label: t('attendance.schoolAtt.entryOpenType'),
    type: 'text',
    width: 110
  },
  {
    prop: 'entryTime',
    label: t('attendance.entryTime'),
    type: 'text',
    minWidth: 160,
    showOverflowTooltip: true
  },
  {
    prop: 'entryAcsChannel',
    label: t('attendance.schoolAtt.entryChannel'),
    type: 'text',
    minWidth: 110,
    showOverflowTooltip: true
  },
  {
    prop: 'leavingOpenType',
    label: t('attendance.schoolAtt.leavingOpenType'),
    type: 'text',
    width: 110
  },
  {
    prop: 'leavingTime',
    label: t('attendance.leavingTime'),
    type: 'text',
    minWidth: 160,
    showOverflowTooltip: true
  },
  {
    prop: 'leavingAcsChannel',
    label: t('attendance.schoolAtt.leavingChannel'),
    type: 'text',
    minWidth: 110,
    showOverflowTooltip: true
  },
  {
    prop: 'attendanceDate',
    label: t('attendance.attendanceDate'),
    type: 'text',
    width: 120
  },
  {
    prop: 'createdAt',
    label: t('attendance.createdAt'),
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
    { field: 'personCode', label: t('attendance.personCode'), component: 'ElInput' },
    { field: 'personName', label: t('attendance.staffName'), component: 'ElInput' },
    { field: 'deptName', label: t('attendance.dept'), component: 'ElInput' },
    { field: 'cardNumber', label: t('attendance.cardNumber'), component: 'ElInput' },
    {
      field: 'schoolStatus',
      label: t('attendance.status'),
      component: 'ElInput'
    },
    {
      field: 'entryOpenType',
      label: t('attendance.schoolAtt.entryOpenType'),
      component: 'ElInput'
    },
    { field: 'entryTime', label: t('attendance.entryTime'), component: 'ElInput' },
    {
      field: 'entryAcsChannel',
      label: t('attendance.schoolAtt.entryChannel'),
      component: 'ElInput'
    },
    {
      field: 'leavingOpenType',
      label: t('attendance.schoolAtt.leavingOpenType'),
      component: 'ElInput'
    },
    {
      field: 'leavingTime',
      label: t('attendance.leavingTime'),
      component: 'ElInput'
    },
    {
      field: 'leavingAcsChannel',
      label: t('attendance.schoolAtt.leavingChannel'),
      component: 'ElInput'
    },
    {
      field: 'attendanceDate',
      label: t('attendance.attendanceDate'),
      component: 'ElInput'
    },
    { field: 'createdAt', label: t('attendance.createdAt'), component: 'ElInput' }
  ]
})
