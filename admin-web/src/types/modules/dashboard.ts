export interface DashboardShortcut {
  label: string
  description: string
  path: string
  permission?: string
  /** Element Plus Icons Vue 组件名 */
  icon?: string
}

/** 工作台 — 单日考勤分页 total（与各列表同源接口）。 */
export interface AttendanceTrendPoint {
  /** YYYY-MM-DD */
  date: string
  total: number
}

/** `/dashboard` 聚合统计（分页 size=1 仅取 total + 多日趋势）。 */
export interface DashboardStatsPayload {
  studentTotal: number
  teacherTotal: number
  memberTotal: number
  todayAttendanceTotal: number
  yesterdayAttendanceTotal: number
  pendingTasks: number
  pendingBusIntentions: number
  busIntentionTotal: number
  busOrderTotal: number
  /** Flowable：我的发起 / 我的已办（当前登录人维度的流程量）。 */
  workflowMyStarted: number
  workflowMyCompleted: number
  /** 请假主列表 / 销假 / 放行条分页 total。 */
  holidayLeaveTotal: number
  holidayReturnTotal: number
  leavePassTotal: number
  /** 群发邮件群组、发件记录（按 status）、协议库。 */
  mailGroupTotal: number
  mailSentTotal: number
  mailDraftTotal: number
  protocolTotal: number
  attendanceTrend: AttendanceTrendPoint[]
}
