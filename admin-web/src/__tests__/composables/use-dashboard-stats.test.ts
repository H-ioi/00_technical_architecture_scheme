import { describe, it, expect, vi, beforeEach } from 'vitest'
import { nextTick } from 'vue'

// ========== Mock dayjs ==========
const fixedToday = '2026-05-25'
vi.mock('dayjs', () => {
  const dayjsFn = vi.fn((input?: string) => ({
    format: (fmt: string) => {
      if (fmt === 'YYYY-MM-DD') return input || fixedToday
      return String(new Date(input || '2026-05-25T12:00:00').getTime())
    },
    subtract: (n: number, unit: string) =>
      dayjsFn(unit === 'day' ? `2026-05-${String(25 - n).padStart(2, '0')}` : fixedToday)
  }))
  return { default: dayjsFn }
})

// ========== Mock normalizePaged ==========
vi.mock('@/utils/api-response-normalize', () => ({
  normalizePaged: (raw: unknown) => {
    if (!raw || typeof raw !== 'object') return { list: [], total: 0 }
    const r = raw as Record<string, unknown>
    return { list: (r.records || r.list || []) as unknown[], total: (r.total as number) ?? 0 }
  }
}))

// ========== Mock @/api (direct module) ==========
vi.mock('@/api', () => {
  const page = { get: vi.fn(async () => ({ total: 100, records: [] })) }
  return {
    studentApi: { page },
    teacherApi: { page },
    attendanceDailyApi: { dailyPage: { get: vi.fn(async () => ({ total: 350, records: [] })) } },
    attendanceHolidayApi: {
      flowMyTodo: { get: vi.fn(async () => ({ total: 5, records: [] })) },
      flowMyStart: { get: vi.fn(async () => ({ total: 12, records: [] })) },
      flowMyComplete: { get: vi.fn(async () => ({ total: 8, records: [] })) },
      holidayPage: { get: vi.fn(async () => ({ total: 20, records: [] })) },
      holidayReturnPage: { get: vi.fn(async () => ({ total: 15, records: [] })) },
      leavePassPage: { get: vi.fn(async () => ({ total: 10, records: [] })) }
    },
    schoolBusOrderApi: {
      intentionPage: { get: vi.fn(async () => ({ total: 0, records: [] })) },
      orderPage: { get: vi.fn(async () => ({ total: 0, records: [] })) }
    },
    bulkEmailApi: {
      groupPage: { get: vi.fn(async () => ({ total: 6, records: [] })) },
      sendRecordPage: { get: vi.fn(async () => ({ total: 0, records: [] })) }
    },
    protocolApi: { page }
  }
})

// ========== Static import under test ==========
import { fetchDashboardStats, useDashboardStats } from '../../composables/use-dashboard-stats'

describe('use-dashboard-stats.ts', () => {

  describe('fetchDashboardStats', () => {
    it('应返回完整的 DashboardStatsPayload 结构', async () => {
      const stats = await fetchDashboardStats()

      expect(stats).toHaveProperty('studentTotal')
      expect(stats).toHaveProperty('teacherTotal')
      expect(stats).toHaveProperty('memberTotal')
      expect(stats).toHaveProperty('todayAttendanceTotal')
      expect(stats).toHaveProperty('yesterdayAttendanceTotal')
      expect(stats).toHaveProperty('pendingTasks')
      expect(stats).toHaveProperty('pendingBusIntentions')
      expect(stats).toHaveProperty('busIntentionTotal')
      expect(stats).toHaveProperty('busOrderTotal')
      expect(stats).toHaveProperty('workflowMyStarted')
      expect(stats).toHaveProperty('workflowMyCompleted')
      expect(stats).toHaveProperty('holidayLeaveTotal')
      expect(stats).toHaveProperty('holidayReturnTotal')
      expect(stats).toHaveProperty('leavePassTotal')
      expect(stats).toHaveProperty('mailGroupTotal')
      expect(stats).toHaveProperty('mailSentTotal')
      expect(stats).toHaveProperty('mailDraftTotal')
      expect(stats).toHaveProperty('protocolTotal')
      expect(stats).toHaveProperty('attendanceTrend')
    })

    it('memberTotal 应为 studentTotal + teacherTotal', async () => {
      const stats = await fetchDashboardStats()
      expect(stats.memberTotal).toBe(stats.studentTotal + stats.teacherTotal)
    })

    it('attendanceTrend 应包含 7 天的数据', async () => {
      const stats = await fetchDashboardStats()
      expect(stats.attendanceTrend).toHaveLength(7)
    })

    it('attendanceTrend 中每项应有 date 和 total', async () => {
      const stats = await fetchDashboardStats()
      for (const point of stats.attendanceTrend) {
        expect(point).toHaveProperty('date')
        expect(point).toHaveProperty('total')
        expect(typeof point.date).toBe('string')
        expect(typeof point.total).toBe('number')
      }
    })

    it('attendanceTrend 日期应为最近 7 天（倒序生成）', async () => {
      const stats = await fetchDashboardStats()
      const dates = stats.attendanceTrend.map((p) => p.date)
      expect(dates).toEqual([
        '2026-05-19',
        '2026-05-20',
        '2026-05-21',
        '2026-05-22',
        '2026-05-23',
        '2026-05-24',
        '2026-05-25'
      ])
    })

    it('todayAttendanceTotal 和 yesterdayAttendanceTotal 应来自 dailyPage API', async () => {
      const stats = await fetchDashboardStats()
      expect(stats.todayAttendanceTotal).toBe(350)
      expect(stats.yesterdayAttendanceTotal).toBe(350)
    })

    it('pendingTasks 应来自 flowMyTodo', async () => {
      const stats = await fetchDashboardStats()
      expect(stats.pendingTasks).toBe(5)
    })

    it('workflowMyStarted / workflowMyCompleted 应来自对应 API', async () => {
      const stats = await fetchDashboardStats()
      expect(stats.workflowMyStarted).toBe(12)
      expect(stats.workflowMyCompleted).toBe(8)
    })
  })

  describe('useDashboardStats', () => {
    beforeEach(() => {
      vi.clearAllMocks()
    })

    it('初始状态：loading=true，stats 全为 0', () => {
      const { loading, stats } = useDashboardStats()
      expect(loading.value).toBe(true)
      expect(stats.value.studentTotal).toBe(0)
      expect(stats.value.teacherTotal).toBe(0)
      expect(stats.value.memberTotal).toBe(0)
      expect(stats.value.attendanceTrend).toEqual([])
    })

    it('refresh 后 loading 变为 false', async () => {
      const { loading, refresh } = useDashboardStats()
      await refresh()
      await nextTick()
      expect(loading.value).toBe(false)
    })

    it('refresh 后 stats 被填充', async () => {
      const { stats, refresh } = useDashboardStats()
      await refresh()
      await nextTick()
      expect(stats.value.studentTotal).toBeGreaterThan(0)
      expect(stats.value.attendanceTrend).toHaveLength(7)
    })
  })
})
