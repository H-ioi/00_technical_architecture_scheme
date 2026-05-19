import dayjs from 'dayjs'
import { onMounted, ref } from 'vue'

import {
  attendanceDailyApi,
  attendanceHolidayApi,
  bulkEmailApi,
  protocolApi,
  schoolBusOrderApi,
  studentApi,
  teacherApi
} from '@/api'
import type { DashboardStatsPayload } from '@/types/modules/dashboard'
import { normalizePaged } from '@/utils/api-response-normalize'

const TREND_DAYS = 7

async function fetchPagedTotal(getter: () => Promise<unknown>): Promise<number> {
  try {
    const raw = await getter()
    return normalizePaged(raw).total
  } catch {
    return 0
  }
}

async function fetchDayAttendanceTotal(dateYmd: string): Promise<number> {
  return fetchPagedTotal(() =>
    attendanceDailyApi.dailyPage.get({
      current: 1,
      size: 1,
      beginTime: dateYmd,
      endTime: dateYmd
    })
  )
}

/** 与各列表页同源接口：仅取分页 total，不打满列表。 */
export async function fetchDashboardStats(): Promise<DashboardStatsPayload> {
  const today = dayjs().format('YYYY-MM-DD')
  const yesterday = dayjs().subtract(1, 'day').format('YYYY-MM-DD')

  const trendDates = Array.from({ length: TREND_DAYS }, (_, i) =>
    dayjs()
      .subtract(TREND_DAYS - 1 - i, 'day')
      .format('YYYY-MM-DD')
  )

  const coreAndExtra = await Promise.all([
    fetchPagedTotal(() => studentApi.page.get({ current: 1, size: 1 })),
    fetchPagedTotal(() => teacherApi.page.get({ current: 1, size: 1 })),
    fetchDayAttendanceTotal(today),
    fetchDayAttendanceTotal(yesterday),
    fetchPagedTotal(() => attendanceHolidayApi.flowMyTodo.get({ page: 1, limit: 1 })),
    fetchPagedTotal(() =>
      schoolBusOrderApi.intentionPage.get({ current: 1, size: 1, approvalStatus: '0' })
    ),
    fetchPagedTotal(() => schoolBusOrderApi.intentionPage.get({ current: 1, size: 1 })),
    fetchPagedTotal(() => schoolBusOrderApi.orderPage.get({ current: 1, size: 1 })),
    fetchPagedTotal(() => attendanceHolidayApi.flowMyStart.get({ page: 1, limit: 1 })),
    fetchPagedTotal(() => attendanceHolidayApi.flowMyComplete.get({ page: 1, limit: 1 })),
    fetchPagedTotal(() => attendanceHolidayApi.holidayPage.get({ current: 1, size: 1 })),
    fetchPagedTotal(() => attendanceHolidayApi.holidayReturnPage.get({ current: 1, size: 1 })),
    fetchPagedTotal(() => attendanceHolidayApi.leavePassPage.get({ current: 1, size: 1 })),
    fetchPagedTotal(() => bulkEmailApi.groupPage.get({ current: 1, size: 1 })),
    fetchPagedTotal(() => bulkEmailApi.sendRecordPage.get({ current: 1, size: 1, status: 1 })),
    fetchPagedTotal(() => bulkEmailApi.sendRecordPage.get({ current: 1, size: 1, status: 0 })),
    fetchPagedTotal(() => protocolApi.page.get({ current: 1, size: 1 })),
    ...trendDates.map((d) => fetchDayAttendanceTotal(d))
  ])

  let i = 0
  const students = coreAndExtra[i++]!
  const teachers = coreAndExtra[i++]!
  const todayDaily = coreAndExtra[i++]!
  const yesterdayDaily = coreAndExtra[i++]!
  const todos = coreAndExtra[i++]!
  const pendingIntentions = coreAndExtra[i++]!
  const allIntentions = coreAndExtra[i++]!
  const busOrders = coreAndExtra[i++]!
  const workflowMyStarted = coreAndExtra[i++]!
  const workflowMyCompleted = coreAndExtra[i++]!
  const holidayLeaveTotal = coreAndExtra[i++]!
  const holidayReturnTotal = coreAndExtra[i++]!
  const leavePassTotal = coreAndExtra[i++]!
  const mailGroupTotal = coreAndExtra[i++]!
  const mailSentTotal = coreAndExtra[i++]!
  const mailDraftTotal = coreAndExtra[i++]!
  const protocolTotal = coreAndExtra[i++]!
  const trendTotals = coreAndExtra.slice(i) as number[]

  const attendanceTrend = trendDates.map((date, idx) => ({
    date,
    total: trendTotals[idx] ?? 0
  }))

  return {
    studentTotal: students,
    teacherTotal: teachers,
    memberTotal: students + teachers,
    todayAttendanceTotal: todayDaily,
    yesterdayAttendanceTotal: yesterdayDaily,
    pendingTasks: todos,
    pendingBusIntentions: pendingIntentions,
    busIntentionTotal: allIntentions,
    busOrderTotal: busOrders,
    workflowMyStarted,
    workflowMyCompleted,
    holidayLeaveTotal,
    holidayReturnTotal,
    leavePassTotal,
    mailGroupTotal,
    mailSentTotal,
    mailDraftTotal,
    protocolTotal,
    attendanceTrend
  }
}

export function useDashboardStats() {
  const loading = ref(true)
  const stats = ref<DashboardStatsPayload>({
    studentTotal: 0,
    teacherTotal: 0,
    memberTotal: 0,
    todayAttendanceTotal: 0,
    yesterdayAttendanceTotal: 0,
    pendingTasks: 0,
    pendingBusIntentions: 0,
    busIntentionTotal: 0,
    busOrderTotal: 0,
    workflowMyStarted: 0,
    workflowMyCompleted: 0,
    holidayLeaveTotal: 0,
    holidayReturnTotal: 0,
    leavePassTotal: 0,
    mailGroupTotal: 0,
    mailSentTotal: 0,
    mailDraftTotal: 0,
    protocolTotal: 0,
    attendanceTrend: []
  })

  const refresh = async () => {
    loading.value = true
    try {
      stats.value = await fetchDashboardStats()
    } finally {
      loading.value = false
    }
  }

  onMounted(refresh)

  return { loading, stats, refresh }
}
