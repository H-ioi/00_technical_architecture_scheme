import type { DashboardOverview, DashboardShortcut } from '@/types/modules/dashboard'
import { request } from '@/utils/request'

/** 查询首页概览。 */
export const fetchDashboardOverview = async (): Promise<DashboardOverview> =>
  request.get<DashboardOverview, DashboardOverview>('/dashboard/overview')

/** 查询首页快捷入口。 */
export const fetchDashboardShortcuts = async (): Promise<DashboardShortcut[]> =>
  request.get<DashboardShortcut[], DashboardShortcut[]>('/dashboard/shortcuts')
