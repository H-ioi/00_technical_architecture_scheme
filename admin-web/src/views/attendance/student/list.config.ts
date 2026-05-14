import type { UniFormConfig, UniOption, UniTableColumn } from 'uni-ui-lib'

import type { Translate } from '@/types/i18n'

/** 是否（对齐旧 `consts.yesOrno`，请求取值 `0`/`1`）。 */
export const ynOpts = (t: Translate): UniOption[] => [
  { label: t('attendance.yes'), value: '1' },
  { label: t('attendance.no'), value: '0' }
]

/** 到校状态（对齐旧 `consts.attendanceSchoolType`）。 */
export const attendanceSchoolStatusOpts = (t: Translate): UniOption[] => [
  { label: t('attendance.student.statusNoRecord'), value: '0', type: 'info' },
  { label: t('attendance.student.statusOnSite'), value: '1', type: 'success' },
  { label: t('attendance.student.statusOffSite'), value: '2', type: 'warning' },
  { label: t('attendance.student.statusLeave'), value: '3', type: 'warning' },
  { label: t('attendance.student.statusAbsent'), value: '4', type: 'danger' }
]

export const searchForm = (
  t: Translate,
  schoolOptions: UniOption[],
  gradeOptions: UniOption[],
  ynOptions: UniOption[],
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
      field: 'admissionNo',
      label: '',
      component: 'ElInput',
      componentProps: {
        placeholder: t('attendance.phAdmissionNo'),
        clearable: true
      },
      colProps: { span: 6 }
    },
    {
      field: 'grade',
      label: '',
      component: 'ElSelect',
      options: gradeOptions,
      componentProps: {
        placeholder: t('attendance.phGrade'),
        clearable: true,
        filterable: true
      },
      colProps: { span: 6 }
    },
    {
      field: 'onBoarding',
      label: '',
      component: 'ElSelect',
      options: ynOptions,
      componentProps: {
        placeholder: t('attendance.phBoarding'),
        clearable: true
      },
      colProps: { span: 6 }
    },
    {
      field: 'onBus',
      label: '',
      component: 'ElSelect',
      options: ynOptions,
      componentProps: {
        placeholder: t('attendance.phSchoolBus'),
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
    minWidth: 140,
    showOverflowTooltip: true
  },
  {
    prop: 'studentName',
    label: t('attendance.studentName'),
    type: 'text',
    minWidth: 110,
    showOverflowTooltip: true
  },
  {
    prop: 'admissionNo',
    label: t('attendance.admissionNo'),
    type: 'text',
    minWidth: 120,
    showOverflowTooltip: true
  },
  { prop: 'grade', label: t('attendance.grade'), type: 'text', width: 100 },
  { prop: 'form', label: t('attendance.className'), type: 'text', width: 100 },
  {
    prop: 'boarding',
    label: t('attendance.boarding'),
    type: 'text',
    width: 100
  },
  {
    prop: 'schoolBus',
    label: t('attendance.schoolBus'),
    type: 'text',
    width: 110
  },
  {
    prop: 'schoolStatus',
    label: t('attendance.status'),
    type: 'text',
    width: 110
  },
  {
    prop: 'attendanceDate',
    label: t('attendance.attendanceDate'),
    type: 'text',
    width: 120
  },
  {
    prop: 'entryTime',
    label: t('attendance.entryTime'),
    type: 'text',
    minWidth: 150,
    showOverflowTooltip: true
  },
  {
    prop: 'leavingTime',
    label: t('attendance.leavingTime'),
    type: 'text',
    minWidth: 150,
    showOverflowTooltip: true
  },
  {
    prop: 'updatedAt',
    label: t('attendance.updatedAt'),
    type: 'text',
    minWidth: 160,
    showOverflowTooltip: true
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
    {
      field: 'studentName',
      label: t('attendance.studentName'),
      component: 'ElInput'
    },
    {
      field: 'admissionNo',
      label: t('attendance.admissionNo'),
      component: 'ElInput'
    },
    { field: 'grade', label: t('attendance.grade'), component: 'ElInput' },
    { field: 'form', label: t('attendance.className'), component: 'ElInput' },
    { field: 'boarding', label: t('attendance.boarding'), component: 'ElInput' },
    { field: 'schoolBus', label: t('attendance.schoolBus'), component: 'ElInput' },
    {
      field: 'schoolStatus',
      label: t('attendance.status'),
      component: 'ElInput'
    },
    {
      field: 'attendanceDate',
      label: t('attendance.attendanceDate'),
      component: 'ElInput'
    },
    { field: 'entryTime', label: t('attendance.entryTime'), component: 'ElInput' },
    {
      field: 'leavingTime',
      label: t('attendance.leavingTime'),
      component: 'ElInput'
    },
    { field: 'updatedAt', label: t('attendance.updatedAt'), component: 'ElInput' },
    { field: 'createdAt', label: t('attendance.createdAt'), component: 'ElInput' }
  ]
})
