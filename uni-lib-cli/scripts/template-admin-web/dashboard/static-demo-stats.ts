/** 工作台模版演示数据（静态，不请求接口） */
export interface AttendanceTrendPoint {
  date: string
  total: number
}

export interface DashboardShortcut {
  label: string
  description: string
  path: string
  icon?: string
}

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
  workflowMyStarted: number
  workflowMyCompleted: number
  holidayLeaveTotal: number
  holidayReturnTotal: number
  leavePassTotal: number
  mailGroupTotal: number
  mailSentTotal: number
  mailDraftTotal: number
  protocolTotal: number
  attendanceTrend: AttendanceTrendPoint[]
}

export const DEMO_DASHBOARD_STATS: DashboardStatsPayload = {
  studentTotal: 1280,
  teacherTotal: 186,
  memberTotal: 1466,
  todayAttendanceTotal: 342,
  yesterdayAttendanceTotal: 318,
  pendingTasks: 12,
  pendingBusIntentions: 5,
  busIntentionTotal: 48,
  busOrderTotal: 920,
  workflowMyStarted: 26,
  workflowMyCompleted: 19,
  holidayLeaveTotal: 156,
  holidayReturnTotal: 23,
  leavePassTotal: 41,
  mailGroupTotal: 8,
  mailSentTotal: 134,
  mailDraftTotal: 3,
  protocolTotal: 27,
  attendanceTrend: [
    { date: '2026-06-09', total: 298 },
    { date: '2026-06-10', total: 305 },
    { date: '2026-06-11', total: 312 },
    { date: '2026-06-12', total: 328 },
    { date: '2026-06-13', total: 301 },
    { date: '2026-06-14', total: 318 },
    { date: '2026-06-15', total: 342 }
  ]
}
