import type { UniFormConfig, UniOption, UniTableColumn } from 'uni-ui-lib'

import type { Translate } from '@/types/i18n'

/** 是否（对齐旧 `consts.yesOrno`，请求取值 `0`/`1`）。 */
export const ynOpts = (t: Translate): UniOption[] => [
  { label: t('attendance.student.options.ynYes'), value: '1' },
  { label: t('attendance.student.options.ynNo'), value: '0' }
]

/** 到校状态（对齐旧 `consts.attendanceSchoolType`）。 */
export const attendanceSchoolStatusOpts = (t: Translate): UniOption[] => [
  { label: t('attendance.student.options.statusNoRecord'), value: '0', type: 'info' },
  { label: t('attendance.student.options.statusOnSite'), value: '1', type: 'success' },
  { label: t('attendance.student.options.statusOffSite'), value: '2', type: 'warning' },
  { label: t('attendance.student.options.statusLeave'), value: '3', type: 'warning' },
  { label: t('attendance.student.options.statusAbsent'), value: '4', type: 'danger' }
]

export const attendanceStudentSearchForm = (
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
        placeholder: t('attendance.student.placeholders.school'),
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
        placeholder: t('attendance.student.placeholders.admissionNo'),
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
        placeholder: t('attendance.student.placeholders.grade'),
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
        placeholder: t('attendance.student.placeholders.boarding'),
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
        placeholder: t('attendance.student.placeholders.onBus'),
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
        placeholder: t('attendance.student.placeholders.schoolStatus'),
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
        placeholder: t('attendance.student.placeholders.beginDate'),
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
        placeholder: t('attendance.student.placeholders.endDate'),
        valueFormat: 'YYYY-MM-DD',
        clearable: true
      },
      colProps: { span: 6 }
    }
  ],
  rowProps: { gutter: 16 },
  colProps: { span: 6 }
})

export const attendanceStudentColumns = (t: Translate, schoolOptions: UniOption[]): UniTableColumn[] => [
  { prop: 'id', label: t('attendance.student.columns.id'), type: 'text', width: 90, fixed: 'left' },
  {
    prop: 'schoolId',
    label: t('attendance.student.columns.schoolName'),
    type: 'text',
    options: schoolOptions,
    minWidth: 140,
    showOverflowTooltip: true
  },
  {
    prop: 'studentName',
    label: t('attendance.student.columns.studentName'),
    type: 'text',
    minWidth: 110,
    showOverflowTooltip: true
  },
  {
    prop: 'admissionNo',
    label: t('attendance.student.columns.admissionNo'),
    type: 'text',
    minWidth: 120,
    showOverflowTooltip: true
  },
  { prop: 'grade', label: t('attendance.student.columns.grade'), type: 'text', width: 100 },
  { prop: 'form', label: t('attendance.student.columns.form'), type: 'text', width: 100 },
  {
    prop: 'boarding',
    label: t('attendance.student.columns.boarding'),
    type: 'text',
    width: 100
  },
  {
    prop: 'schoolBus',
    label: t('attendance.student.columns.schoolBus'),
    type: 'text',
    width: 110
  },
  {
    prop: 'schoolStatus',
    label: t('attendance.student.columns.schoolStatus'),
    type: 'text',
    width: 110
  },
  {
    prop: 'attendanceDate',
    label: t('attendance.student.columns.attendanceDate'),
    type: 'text',
    width: 120
  },
  {
    prop: 'entryTime',
    label: t('attendance.student.columns.entryTime'),
    type: 'text',
    minWidth: 150,
    showOverflowTooltip: true
  },
  {
    prop: 'leavingTime',
    label: t('attendance.student.columns.leavingTime'),
    type: 'text',
    minWidth: 150,
    showOverflowTooltip: true
  },
  {
    prop: 'updatedAt',
    label: t('attendance.student.columns.updatedAt'),
    type: 'text',
    minWidth: 160,
    showOverflowTooltip: true
  },
  {
    prop: 'createdAt',
    label: t('attendance.student.columns.createdAt'),
    type: 'text',
    minWidth: 160,
    showOverflowTooltip: true
  }
]

export const attendanceStudentDetailForm = (t: Translate, schoolOptions: UniOption[]): UniFormConfig => ({
  mode: 'view',
  formProps: { labelWidth: '110px' },
  rowProps: { gutter: 16 },
  colProps: { span: 12 },
  view: { emptyText: '-' },
  schema: [
    { field: 'id', label: t('attendance.student.columns.id'), component: 'ElInput' },
    {
      field: 'schoolId',
      label: t('attendance.student.columns.schoolName'),
      component: 'ElInput',
      viewType: 'enum',
      options: schoolOptions
    },
    { field: 'studentName', label: t('attendance.student.columns.studentName'), component: 'ElInput' },
    { field: 'admissionNo', label: t('attendance.student.columns.admissionNo'), component: 'ElInput' },
    { field: 'grade', label: t('attendance.student.columns.grade'), component: 'ElInput' },
    { field: 'form', label: t('attendance.student.columns.form'), component: 'ElInput' },
    { field: 'boarding', label: t('attendance.student.columns.boarding'), component: 'ElInput' },
    { field: 'schoolBus', label: t('attendance.student.columns.schoolBus'), component: 'ElInput' },
    { field: 'schoolStatus', label: t('attendance.student.columns.schoolStatus'), component: 'ElInput' },
    { field: 'attendanceDate', label: t('attendance.student.columns.attendanceDate'), component: 'ElInput' },
    { field: 'entryTime', label: t('attendance.student.columns.entryTime'), component: 'ElInput' },
    { field: 'leavingTime', label: t('attendance.student.columns.leavingTime'), component: 'ElInput' },
    { field: 'updatedAt', label: t('attendance.student.columns.updatedAt'), component: 'ElInput' },
    { field: 'createdAt', label: t('attendance.student.columns.createdAt'), component: 'ElInput' }
  ]
})
