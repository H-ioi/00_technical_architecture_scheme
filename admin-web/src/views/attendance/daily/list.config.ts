import type { UniFormConfig, UniOption, UniTableColumn } from 'uni-ui-lib'

import type { Translate } from '@/types/i18n'

export const ynOpts = (t: Translate): UniOption[] => [
  { label: t('attendance.yes'), value: '1' },
  { label: t('attendance.no'), value: '0' }
]

export const dataFromOpts = (t: Translate): UniOption[] => [
  { label: t('attendance.daily.dataFromGate'), value: 'gate' },
  { label: t('attendance.daily.dataFromSchoolBus'), value: 'schoolBus' },
  { label: t('attendance.daily.dataFromCommunity'), value: 'community' },
  { label: t('attendance.daily.dataFromMb'), value: 'MB' }
]

export const dailyStatusOpts = (t: Translate): UniOption[] => [
  { label: t('attendance.daily.statusPresent'), value: 'Present' },
  { label: t('attendance.daily.statusLate'), value: 'Late' },
  { label: t('attendance.daily.statusLeave'), value: 'Leave' },
  { label: t('attendance.daily.statusAbsent'), value: 'Absent' },
  { label: t('attendance.daily.statusEnter'), value: 'Enter' },
  { label: t('attendance.daily.statusExit'), value: 'Exit' }
]

export const searchForm = (
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
      field: 'busStatus',
      label: '',
      component: 'ElSelect',
      options: ynOptions,
      componentProps: {
        placeholder: t('attendance.phBusStatus'),
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
        placeholder: t('attendance.phDormitoryStatus'),
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
        placeholder: t('attendance.beginDate'),
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
        placeholder: t('attendance.endDate'),
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
        placeholder: t('attendance.phDataFrom'),
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
        placeholder: t('attendance.phStatus'),
        clearable: true
      },
      colProps: { span: 6 }
    }
  ],
  rowProps: { gutter: 16 },
  colProps: { span: 6 }
})

export const tableCols = (t: Translate): UniTableColumn[] => [
  {
    prop: 'schoolName',
    label: t('attendance.campus'),
    type: 'text',
    minWidth: 160,
    showOverflowTooltip: true
  },
  {
    prop: 'admissionNo',
    label: t('attendance.admissionNo'),
    type: 'text',
    width: 120,
    showOverflowTooltip: true
  },
  {
    prop: 'studentName',
    label: t('attendance.studentName'),
    type: 'text',
    minWidth: 110,
    showOverflowTooltip: true
  },
  { prop: 'grade', label: t('attendance.grade'), type: 'text', width: 100 },
  { prop: 'form', label: t('attendance.className'), type: 'text', width: 100 },
  {
    prop: 'busStatusLabel',
    label: t('attendance.schoolBus'),
    type: 'text',
    width: 110
  },
  {
    prop: 'dormitoryStatusLabel',
    label: t('attendance.boarding'),
    type: 'text',
    width: 110
  },
  {
    prop: 'date',
    label: t('attendance.daily.date'),
    type: 'text',
    width: 120
  },
  {
    prop: 'attendanceTimeLabel',
    label: t('attendance.daily.attendanceTime'),
    type: 'text',
    minWidth: 140,
    showOverflowTooltip: true
  },
  {
    prop: 'statusLabel',
    label: t('attendance.status'),
    type: 'text',
    width: 100
  },
  {
    prop: 'dataFromLabel',
    label: t('attendance.dataFrom'),
    type: 'text',
    width: 100
  },
  {
    prop: 'comment',
    label: t('attendance.comment'),
    type: 'text',
    minWidth: 140,
    showOverflowTooltip: true
  },
  {
    prop: 'createdAt',
    label: t('attendance.createdAt'),
    type: 'text',
    width: 160,
    showOverflowTooltip: true
  }
]
