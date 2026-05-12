import type { UniFormConfig, UniOption, UniTableColumn } from 'uni-ui-lib'

import type { Translate } from '@/types/i18n'

export const ynOpts = (t: Translate): UniOption[] => [
  { label: t('attendance.daily.options.ynYes'), value: '1' },
  { label: t('attendance.daily.options.ynNo'), value: '0' }
]

export const dataFromOpts = (t: Translate): UniOption[] => [
  { label: t('attendance.daily.options.dataFromGate'), value: 'gate' },
  { label: t('attendance.daily.options.dataFromSchoolBus'), value: 'schoolBus' },
  { label: t('attendance.daily.options.dataFromCommunity'), value: 'community' },
  { label: t('attendance.daily.options.dataFromMb'), value: 'MB' }
]

export const dailyStatusOpts = (t: Translate): UniOption[] => [
  { label: t('attendance.daily.options.statusPresent'), value: 'Present' },
  { label: t('attendance.daily.options.statusLate'), value: 'Late' },
  { label: t('attendance.daily.options.statusLeave'), value: 'Leave' },
  { label: t('attendance.daily.options.statusAbsent'), value: 'Absent' },
  { label: t('attendance.daily.options.statusEnter'), value: 'Enter' },
  { label: t('attendance.daily.options.statusExit'), value: 'Exit' }
]

export const attendanceDailySearchForm = (
  t: Translate,
  schoolOptions: UniOption[],
  ynOptions: UniOption[],
  dataFromOptions: UniOption[],
  statusOptions: UniOption[]
): UniFormConfig => ({
  schema: [
    {
      field: 'schoolName',
      label: '',
      component: 'ElSelect',
      options: schoolOptions,
      componentProps: {
        placeholder: t('attendance.daily.placeholders.school'),
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
        placeholder: t('attendance.daily.placeholders.admissionNo'),
        clearable: true
      },
      colProps: { span: 6 }
    },
    {
      field: 'busStatus',
      label: '',
      component: 'ElSelect',
      options: ynOptions,
      componentProps: {
        placeholder: t('attendance.daily.placeholders.busStatus'),
        clearable: true
      },
      colProps: { span: 6 }
    },
    {
      field: 'dormitoryStatus',
      label: '',
      component: 'ElSelect',
      options: ynOptions,
      componentProps: {
        placeholder: t('attendance.daily.placeholders.dormitoryStatus'),
        clearable: true
      },
      colProps: { span: 6 }
    },
    {
      field: 'beginTime',
      label: '',
      component: 'ElDatePicker',
      componentProps: {
        type: 'date',
        placeholder: t('attendance.daily.placeholders.beginTime'),
        valueFormat: 'YYYY-MM-DD',
        clearable: true
      },
      colProps: { span: 6 }
    },
    {
      field: 'endTime',
      label: '',
      component: 'ElDatePicker',
      componentProps: {
        type: 'date',
        placeholder: t('attendance.daily.placeholders.endTime'),
        valueFormat: 'YYYY-MM-DD',
        clearable: true
      },
      colProps: { span: 6 }
    },
    {
      field: 'dataFrom',
      label: '',
      component: 'ElSelect',
      options: dataFromOptions,
      componentProps: {
        placeholder: t('attendance.daily.placeholders.dataFrom'),
        clearable: true
      },
      colProps: { span: 6 }
    },
    {
      field: 'status',
      label: '',
      component: 'ElSelect',
      options: statusOptions,
      componentProps: {
        placeholder: t('attendance.daily.placeholders.status'),
        clearable: true
      },
      colProps: { span: 6 }
    }
  ],
  rowProps: { gutter: 16 },
  colProps: { span: 6 }
})

export const attendanceDailyColumns = (t: Translate): UniTableColumn[] => [
  {
    prop: 'schoolName',
    label: t('attendance.daily.columns.schoolName'),
    type: 'text',
    minWidth: 160,
    showOverflowTooltip: true
  },
  {
    prop: 'admissionNo',
    label: t('attendance.daily.columns.admissionNo'),
    type: 'text',
    width: 120,
    showOverflowTooltip: true
  },
  {
    prop: 'studentName',
    label: t('attendance.daily.columns.studentName'),
    type: 'text',
    minWidth: 110,
    showOverflowTooltip: true
  },
  { prop: 'grade', label: t('attendance.daily.columns.grade'), type: 'text', width: 100 },
  { prop: 'form', label: t('attendance.daily.columns.form'), type: 'text', width: 100 },
  {
    prop: 'busStatusLabel',
    label: t('attendance.daily.columns.busStatus'),
    type: 'text',
    width: 110
  },
  {
    prop: 'dormitoryStatusLabel',
    label: t('attendance.daily.columns.dormitoryStatus'),
    type: 'text',
    width: 110
  },
  {
    prop: 'date',
    label: t('attendance.daily.columns.date'),
    type: 'text',
    width: 120
  },
  {
    prop: 'attendanceTimeLabel',
    label: t('attendance.daily.columns.attendanceTime'),
    type: 'text',
    minWidth: 140,
    showOverflowTooltip: true
  },
  {
    prop: 'statusLabel',
    label: t('attendance.daily.columns.status'),
    type: 'text',
    width: 100
  },
  {
    prop: 'dataFromLabel',
    label: t('attendance.daily.columns.dataFrom'),
    type: 'text',
    width: 100
  },
  {
    prop: 'comment',
    label: t('attendance.daily.columns.comment'),
    type: 'text',
    minWidth: 140,
    showOverflowTooltip: true
  },
  {
    prop: 'createdAt',
    label: t('attendance.daily.columns.createdAt'),
    type: 'text',
    width: 160,
    showOverflowTooltip: true
  }
]
