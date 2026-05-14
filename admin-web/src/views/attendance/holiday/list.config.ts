import type { UniFormConfig, UniOption, UniTableColumn } from 'uni-ui-lib'

import type { Translate } from '@/types/i18n'

type Loose = Record<string, unknown>

export const holidayLeaveTypeSearchOpts = (t: Translate): UniOption[] => [
  { label: t('attendance.holiday.leavePersonal'), value: '101' },
  { label: t('attendance.holiday.leaveSick'), value: '102' }
]

export const holidayScopeSearchOpts = (t: Translate): UniOption[] => [
  { label: t('attendance.holiday.scopeCourse'), value: 'course' },
  { label: t('attendance.holiday.scopeDorm'), value: 'dorm' },
  { label: t('attendance.holiday.scopeBus'), value: 'bus' }
]

export const scopeLabel = (code: unknown, t: Translate): string => {
  const s = String(code ?? '')
  const map: Record<string, string> = {
    course: t('attendance.holiday.scopeCourse'),
    dorm: t('attendance.holiday.scopeDorm'),
    bus: t('attendance.holiday.scopeBus')
  }
  return map[s] || s || '--'
}

export const holidayStatusLabel = (status: unknown, t: Translate): string => {
  const key = String(status ?? '')
  const map: Record<string, string> = {
    '1100': t('attendance.holiday.statusPending'),
    '102': t('attendance.holiday.statusRejected'),
    '101': t('attendance.holiday.statusWithdrawn'),
    '1101': t('attendance.holiday.statusOnLeave'),
    '1102': t('attendance.holiday.statusFinished'),
    '1103': t('attendance.holiday.statusLeaveSoon')
  }
  return map[key] || (key ? key : '--')
}

export const holidayTypeLabel = (type: unknown, t: Translate): string => {
  const key = String(type ?? '')
  if (key === '101') {
    return t('attendance.holiday.leavePersonal')
  }
  if (key === '102') {
    return t('attendance.holiday.leaveSick')
  }
  return key || '--'
}

export const yn101102Label = (v: unknown, t: Translate): string => {
  const key = String(v ?? '')
  if (key === '101') {
    return t('attendance.yes')
  }
  if (key === '102') {
    return t('attendance.no')
  }
  return key || '--'
}

export const formatScopeCell = (row: Loose, t: Translate) => {
  const raw = row.scope
  if (!Array.isArray(raw)) {
    return '--'
  }
  return raw.map((x) => scopeLabel(x, t)).join('，')
}

export const formatWeekDaysCell = (row: Loose) => {
  const raw = row.weekDays
  if (!Array.isArray(raw)) {
    return '--'
  }
  return raw.map(String).join('，')
}

export const formatDateLimitCell = (row: Loose) => {
  const raw = row.dateLimit
  if (Array.isArray(raw) && raw.length === 2) {
    return `${raw[0]}-${raw[1]}`
  }
  return '--'
}

export const searchForm = (
  t: Translate,
  schoolOptions: UniOption[]
): UniFormConfig => ({
  schema: [
    {
      field: 'type',
      label: '',
      component: 'ElSelect',
      options: holidayLeaveTypeSearchOpts(t),
      componentProps: {
        placeholder: t('attendance.phLeaveType'),
        clearable: true
      },
      colProps: { span: 6 }
    },
    {
      field: 'studentSchool',
      label: '',
      component: 'ElSelect',
      options: schoolOptions,
      componentProps: {
        placeholder: t('attendance.phSchoolOrg'),
        clearable: true,
        filterable: true
      },
      colProps: { span: 6 }
    },
    {
      field: 'scp',
      label: '',
      component: 'ElSelect',
      options: holidayScopeSearchOpts(t),
      componentProps: {
        placeholder: t('attendance.phScope'),
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
      field: 'keyword',
      label: '',
      component: 'ElInput',
      componentProps: {
        placeholder: t('attendance.phKeyword'),
        clearable: true
      },
      colProps: { span: 6 }
    }
  ],
  rowProps: { gutter: 8 },
  colProps: { span: 6 }
})

/** 销假 Tab 检索（对齐旧页）：仅「学校」「学号/姓名」。 */
export const returnSearchForm = (
  t: Translate,
  schoolOptions: UniOption[]
): UniFormConfig => ({
  schema: [
    {
      field: 'studentSchool',
      label: '',
      component: 'ElSelect',
      options: schoolOptions,
      componentProps: {
        placeholder: t('attendance.phSchoolOrg'),
        clearable: true,
        filterable: true
      },
      colProps: { span: 6 }
    },
    {
      field: 'keyword',
      label: '',
      component: 'ElInput',
      componentProps: {
        placeholder: t('attendance.phKeyword'),
        clearable: true
      },
      colProps: { span: 6 }
    }
  ],
  rowProps: { gutter: 8 },
  colProps: { span: 6 }
})

export const tableCols = (t: Translate): UniTableColumn[] => [
  {
    prop: 'admissonNo',
    label: t('attendance.admissionNo'),
    type: 'text',
    width: 120,
    fixed: 'left',
    showOverflowTooltip: true
  },
  {
    prop: 'studentName',
    label: t('attendance.studentName'),
    type: 'text',
    width: 110,
    showOverflowTooltip: true
  },
  {
    prop: 'studentSchool',
    label: t('attendance.school'),
    type: 'text',
    minWidth: 160,
    showOverflowTooltip: true
  },
  { prop: 'studentGrade', label: t('attendance.grade'), type: 'text', width: 90 },
  {
    prop: 'studentClass',
    label: t('attendance.className'),
    type: 'text',
    width: 90
  },
  {
    prop: 'type',
    label: t('attendance.holiday.leaveType'),
    type: 'text',
    width: 100,
    formatter: (_row, _c, value) => holidayTypeLabel(value, t)
  },
  {
    prop: 'scope',
    label: t('attendance.holiday.scope'),
    type: 'array',
    minWidth: 180,
    options: holidayScopeSearchOpts(t),
    lookup: { splitValues: true },
    array: { renderMode: 'tag', separator: '、' }
  },
  {
    prop: 'reason',
    label: t('attendance.holiday.reason'),
    type: 'text',
    width: 120,
    showOverflowTooltip: true
  },
  {
    prop: 'dateString',
    label: t('attendance.holiday.dateRange'),
    type: 'text',
    minWidth: 180,
    showOverflowTooltip: true
  },
  {
    prop: 'dateLimit',
    label: t('attendance.holiday.timeSlot'),
    type: 'text',
    width: 120,
    formatter: (row) => formatDateLimitCell(row as Loose)
  },
  {
    prop: 'isInfectious',
    label: t('attendance.holiday.infectious'),
    type: 'text',
    width: 100,
    formatter: (_row, _c, value) => yn101102Label(value, t)
  },
  {
    prop: 'fixed',
    label: t('attendance.holiday.fixed'),
    type: 'text',
    width: 90,
    formatter: (_row, _c, value) => yn101102Label(value, t)
  },
  {
    prop: 'weekDays',
    label: t('attendance.holiday.weekDays'),
    type: 'text',
    minWidth: 140,
    formatter: (row) => formatWeekDaysCell(row as Loose)
  },
  {
    prop: 'status',
    label: t('attendance.status'),
    type: 'text',
    width: 110,
    formatter: (_row, _c, value) => holidayStatusLabel(value, t)
  },
  {
    prop: 'createdAt',
    label: t('attendance.createdAt'),
    type: 'datetime',
    minWidth: 170,
    showOverflowTooltip: true
  }
]

/** 销假 Tab 专用列（对齐旧页「销假管理」：学号～班级 + 返校时间 + 创建时间）。 */
export const returnTableCols = (t: Translate): UniTableColumn[] => [
  {
    prop: 'admissonNo',
    label: t('attendance.admissionNo'),
    type: 'text',
    width: 120,
    fixed: 'left',
    showOverflowTooltip: true
  },
  {
    prop: 'studentName',
    label: t('attendance.studentName'),
    type: 'text',
    width: 110,
    showOverflowTooltip: true
  },
  {
    prop: 'studentSchool',
    label: t('attendance.school'),
    type: 'text',
    minWidth: 160,
    showOverflowTooltip: true
  },
  { prop: 'studentGrade', label: t('attendance.grade'), type: 'text', width: 90 },
  {
    prop: 'studentClass',
    label: t('attendance.className'),
    type: 'text',
    width: 90
  },
  {
    prop: 'backTime',
    label: t('attendance.holiday.returnSchoolTime'),
    type: 'datetime',
    minWidth: 170,
    showOverflowTooltip: true
  },
  {
    prop: 'createdAt',
    label: t('attendance.createdAt'),
    type: 'datetime',
    minWidth: 170,
    showOverflowTooltip: true
  }
]

/** 详情抽屉展示模型已由页面层格式化为此扁平结构。 */
export interface AttendanceHolidayDetailViewModel {
  id?: unknown
  admissonNo?: unknown
  studentName?: unknown
  studentSchool?: unknown
  studentGrade?: unknown
  studentClass?: unknown
  leaveTypeLabel?: unknown
  scopeText?: unknown
  reason?: unknown
  dateString?: unknown
  dateLimitText?: unknown
  infectiousLabel?: unknown
  fixedLabel?: unknown
  weekDaysText?: unknown
  statusLabel?: unknown
  procId?: unknown
  beginTime?: unknown
  endTime?: unknown
  createdAt?: unknown
  parentResponsibleLabel?: unknown
}

export const detailForm = (t: Translate): UniFormConfig => ({
  mode: 'view',
  formProps: { labelWidth: '80px' },
  rowProps: { gutter: 16 },
  colProps: { span: 12 },
  view: { emptyText: '-' },
  schema: [
    { field: 'id', label: t('attendance.id'), component: 'ElInput' },
    {
      field: 'admissonNo',
      label: t('attendance.admissionNo'),
      component: 'ElInput'
    },
    {
      field: 'studentName',
      label: t('attendance.studentName'),
      component: 'ElInput'
    },
    { field: 'studentSchool', label: t('attendance.school'), component: 'ElInput' },
    { field: 'studentGrade', label: t('attendance.grade'), component: 'ElInput' },
    {
      field: 'studentClass',
      label: t('attendance.className'),
      component: 'ElInput'
    },
    {
      field: 'leaveTypeLabel',
      label: t('attendance.holiday.leaveType'),
      component: 'ElInput'
    },
    { field: 'scopeText', label: t('attendance.holiday.scope'), component: 'ElInput' },
    { field: 'reason', label: t('attendance.holiday.reason'), component: 'ElInput' },
    { field: 'dateString', label: t('attendance.holiday.dateRange'), component: 'ElInput' },
    {
      field: 'dateLimitText',
      label: t('attendance.holiday.timeSlot'),
      component: 'ElInput'
    },
    {
      field: 'beginTime',
      label: t('attendance.holiday.detailBeginTime'),
      component: 'ElInput'
    },
    { field: 'endTime', label: t('attendance.holiday.detailEndTime'), component: 'ElInput' },
    {
      field: 'infectiousLabel',
      label: t('attendance.holiday.infectious'),
      component: 'ElInput'
    },
    { field: 'fixedLabel', label: t('attendance.holiday.fixed'), component: 'ElInput' },
    {
      field: 'weekDaysText',
      label: t('attendance.holiday.weekDays'),
      component: 'ElInput'
    },
    { field: 'statusLabel', label: t('attendance.status'), component: 'ElInput' },
    { field: 'procId', label: t('attendance.holiday.procId'), component: 'ElInput' },
    { field: 'createdAt', label: t('attendance.createdAt'), component: 'ElInput' },
    {
      field: 'parentResponsibleLabel',
      label: t('attendance.holiday.parentResponsible'),
      component: 'ElInput'
    }
  ]
})

export const formatHolidayDetailView = (
  raw: Loose,
  t: Translate
): AttendanceHolidayDetailViewModel => ({
  id: raw.id,
  admissonNo: raw.admissonNo,
  studentName: raw.studentName,
  studentSchool: raw.studentSchool,
  studentGrade: raw.studentGrade,
  studentClass: raw.studentClass,
  leaveTypeLabel: holidayTypeLabel(raw.type, t),
  scopeText: formatScopeCell(raw, t),
  reason: raw.reason,
  dateString: raw.dateString,
  dateLimitText: formatDateLimitCell(raw),
  infectiousLabel: yn101102Label(raw.isInfectious, t),
  fixedLabel: yn101102Label(raw.fixed, t),
  weekDaysText: formatWeekDaysCell(raw),
  statusLabel: holidayStatusLabel(raw.status, t),
  procId: raw.procId,
  beginTime: raw.beginTime,
  endTime: raw.endTime,
  createdAt: raw.createdAt,
  parentResponsibleLabel:
    raw.parentResponsible === true ||
    raw.parentResponsible === 'true' ||
    raw.parentResponsible === 1
      ? t('attendance.yes')
      : raw.parentResponsible === false ||
          raw.parentResponsible === 'false' ||
          raw.parentResponsible === 0
        ? t('attendance.no')
        : '--'
})
