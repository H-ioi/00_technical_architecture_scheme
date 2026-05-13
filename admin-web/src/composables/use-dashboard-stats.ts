import dayjs from 'dayjs'
import { onMounted, ref } from 'vue'

import {
  attendanceDailyApi,
  attendanceHolidayApi,
  schoolBusOrderApi,
  studentApi,
  teacherApi
} from '@/api'
import { normalizeApiPagedBody } from '@/utils/api-response-normalize'

export interface DashboardStatsPayload {
  memberTotal: number
  todayAttendanceTotal: number
  pendingTasks: number
  pendingBusIntentions: number
}

async function fetchPagedTotal(getter: () => Promise<unknown>): Promise<number> {
  try {
    const raw = await getter()
    return normalizeApiPagedBody(raw).total
  } catch {
    return 0
  }
}

/** 与各列表页同源接口：仅取分页 total，不打满列表。 */
export async function fetchDashboardStats(): Promise<DashboardStatsPayload> {
  const today = dayjs().format('YYYY-MM-DD')
  const [students, teachers, daily, todos, intentions] = await Promise.all([
    fetchPagedTotal(() => studentApi.page.get({ current: 1, size: 1 })),
    fetchPagedTotal(() => teacherApi.page.get({ current: 1, size: 1 })),
    fetchPagedTotal(() =>
      attendanceDailyApi.dailyPage.get({
        current: 1,
        size: 1,
        beginTime: today,
        endTime: today
      })
    ),
    fetchPagedTotal(() => attendanceHolidayApi.flowMyTodo.get({ page: 1, limit: 1 })),
    fetchPagedTotal(() =>
      schoolBusOrderApi.intentionPage.get({
        current: 1,
        size: 1,
        approvalStatus: '0'
      })
    )
  ])
  return {
    memberTotal: students + teachers,
    todayAttendanceTotal: daily,
    pendingTasks: todos,
    pendingBusIntentions: intentions
  }
}

export function useDashboardStats() {
  const loading = ref(true)
  const stats = ref<DashboardStatsPayload>({
    memberTotal: 0,
    todayAttendanceTotal: 0,
    pendingTasks: 0,
    pendingBusIntentions: 0
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
