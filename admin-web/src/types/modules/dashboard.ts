export interface DashboardOverview {
  memberTotal: number
  todayActivityTotal: number
  pendingTaskTotal: number
  alertTotal: number
}

export interface DashboardShortcut {
  label: string
  description: string
  path: string
  permission?: string
}
