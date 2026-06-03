type Loose = Record<string, unknown>

/** 请假分页行：后端可能仅返回 snake_case，操作列依赖 `procId` / `id`。 */
export const normalizeHolidayListRow = (raw: Loose): Loose => {
  const out: Loose = { ...raw }
  const proc =
    out.procId ??
    out.proc_id ??
    out.processId ??
    out.process_id ??
    out.procInstId ??
    out.proc_inst_id
  if ((out.procId == null || out.procId === '') && proc != null && proc !== '') {
    out.procId = proc
  }
  if ((out.id == null || out.id === '') && out.holiday_id != null && out.holiday_id !== '') {
    out.id = out.holiday_id
  }
  if ((out.id == null || out.id === '') && out.holidayId != null && out.holidayId !== '') {
    out.id = out.holidayId
  }
  if (out.dataFrom == null && out.data_from != null && out.data_from !== '') {
    out.dataFrom = out.data_from
  }
  return out
}

/** 嵌套 VO：销假分页常与请假字段拆开，需要摊平后再走请假同款表格列。 */
const RETURN_NESTED_KEYS = [
  'holiday',
  'holidayInfo',
  'isaHoliday',
  'leaveHoliday',
  'holidayVo',
  'holidayDTO',
  'holidayEntity'
] as const

const normalizeScopeLikeToArray = (scope: unknown): unknown => {
  if (scope == null || scope === '') {
    return scope
  }
  if (Array.isArray(scope)) {
    return scope
  }
  if (typeof scope === 'string') {
    const s = scope.trim()
    if (s.startsWith('[')) {
      try {
        const p = JSON.parse(s) as unknown
        return Array.isArray(p) ? p : scope
      } catch {
        /* 按分隔符拆 */
      }
    }
    return s
      .split(/[,，]/)
      .map((x) => x.trim())
      .filter(Boolean)
  }
  return scope
}

/** 在 row 上按 key 顺序取第一个非空字段（销假/请假行归一化共用） */
const firstNonEmptyField = (row: Loose, ...keys: string[]): unknown => {
  for (const k of keys) {
    const v = row[k]
    if (v !== undefined && v !== null && v !== '') {
      return v
    }
  }
  return undefined
}

const firstNonEmptyString = (row: Loose, ...keys: string[]): string | undefined => {
  const v = firstNonEmptyField(row, ...keys)
  return v === undefined ? undefined : String(v)
}

const normalizeDateLimitLike = (dateLimit: unknown): unknown => {
  if (dateLimit == null || dateLimit === '') {
    return dateLimit
  }
  if (Array.isArray(dateLimit)) {
    return dateLimit
  }
  if (typeof dateLimit === 'string') {
    const s = dateLimit.trim()
    if (s.startsWith('[')) {
      try {
        const p = JSON.parse(s) as unknown
        return Array.isArray(p) ? p : dateLimit
      } catch {
        /* ignore */
      }
    }
    const parts = s
      .split(/[-–~]/)
      .map((x) => x.trim())
      .filter(Boolean)
    if (parts.length === 2) {
      return parts
    }
  }
  return dateLimit
}

/**
 * 销假 `return-page` 与请假 `page` 字段名不完全一致：嵌套请假对象、正确拼写 `admissionNo`、snake_case 等。
 * 统一映射到列表常用字段（学号/班级、返校时间相关、`createdAt` 等）；销假 Tab 仅用精简列。
 */
export const normalizeHolidayReturnRow = (raw: Loose): Loose => {
  let merged: Loose = { ...raw }
  for (const key of RETURN_NESTED_KEYS) {
    const n = raw[key]
    if (n && typeof n === 'object' && !Array.isArray(n)) {
      merged = { ...(n as Loose), ...merged }
    }
  }

  const admisson = firstNonEmptyString(
    merged,
    'admissonNo',
    'admissionNo',
    'studentAdmissionNo',
    'admissionNumber',
    'student_admission_no',
    'admission_no',
    'stuNo',
    'studentNo',
    'student_no'
  )

  const type = firstNonEmptyString(
    merged,
    'type',
    'holidayType',
    'leaveType',
    'holiday_type',
    'leave_type'
  )

  const reason = firstNonEmptyString(
    merged,
    'reason',
    'holidayReason',
    'leaveReason',
    'remark',
    'leave_reason',
    'reasonDesc',
    'reason_desc'
  )

  let scope = firstNonEmptyField(merged, 'scope', 'holidayScope', 'scopeList', 'scopes')
  scope = normalizeScopeLikeToArray(scope)

  let weekDays = firstNonEmptyField(merged, 'weekDays', 'week_days', 'weekDayList')
  weekDays = normalizeScopeLikeToArray(weekDays)

  let dateLimit = firstNonEmptyField(merged, 'dateLimit', 'date_limit', 'timeSlot', 'time_slot')
  dateLimit = normalizeDateLimitLike(dateLimit)

  const bt = firstNonEmptyString(
    merged,
    'beginTime',
    'startDate',
    'begin_time',
    'start_date',
    'leaveBeginTime'
  )
  const et = firstNonEmptyString(
    merged,
    'endTime',
    'endDate',
    'end_time',
    'end_date',
    'leaveEndTime'
  )
  const dateString =
    firstNonEmptyString(
      merged,
      'dateString',
      'date_range_text',
      'leaveDateRange',
      'dateRangeText',
      'leave_date_range'
    ) ?? (bt && et ? `${bt} ~ ${et}` : undefined)

  const isInfectious = firstNonEmptyString(merged, 'isInfectious', 'is_infectious', 'infectious')
  const fixed = firstNonEmptyString(merged, 'fixed', 'isFixed', 'fixed_leave', 'fixedLeave')

  const status = firstNonEmptyString(
    merged,
    'status',
    'holidayStatus',
    'approvalStatus',
    'holiday_status'
  )

  const createdAt = firstNonEmptyField(
    merged,
    'createdAt',
    'created_at',
    'createTime',
    'create_time',
    'gmtCreate',
    'gmt_create'
  )

  const holidayId =
    firstNonEmptyField(merged, 'holidayId', 'holiday_id', 'leaveId', 'leave_id', 'holidayBizId') ??
    merged.holidayId

  return {
    ...merged,
    holidayId,
    admissonNo: admisson ?? merged.admissonNo,
    type: type ?? merged.type,
    scope,
    reason: reason ?? merged.reason,
    dateString: dateString ?? merged.dateString,
    dateLimit,
    weekDays,
    isInfectious: isInfectious ?? merged.isInfectious,
    fixed: fixed ?? merged.fixed,
    status: status ?? merged.status,
    createdAt: createdAt ?? merged.createdAt
  }
}
