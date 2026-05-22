// @vitest-environment jsdom
import { describe, it, expect, vi, beforeAll } from 'vitest'

// Mock dayjs before importing chart options
vi.mock('dayjs', () => {
  return {
    default: vi.fn((input?: string) => {
      const d = input ? new Date(input) : new Date('2024-06-15')
      return {
        format: (fmt: string) => {
          if (fmt === 'MM-DD') {
            const m = String(d.getMonth() + 1).padStart(2, '0')
            const day = String(d.getDate()).padStart(2, '0')
            return `${m}-${day}`
          }
          return ''
        }
      }
    })
  }
})

import {
  buildAttendanceTrendOption,
  buildMemberMixOption,
  buildWorkflowLoadOption,
  buildLeaveDomainOption,
  buildBacklogOption
} from '../../../views/dashboard/build-chart-options'

// Setup CSS variable mocks
beforeAll(() => {
  // 保存原始 getComputedStyle，避免 stub 后 mock 内部递归调用自身
  const _origGetComputedStyle = window.getComputedStyle.bind(window)
  vi.stubGlobal('getComputedStyle', (element: Element) => {
    const real = _origGetComputedStyle(element)
    return new Proxy(real, {
      get(target, prop) {
        if (prop === 'getPropertyValue') {
          return (name: string) => {
            if (name.includes('--app-text-color')) return '#1f2937'
            if (name.includes('--app-text-color-secondary')) return '#94a3b8'
            return Reflect.apply(target.getPropertyValue, target, [name])
          }
        }
        return Reflect.get(target, prop)
      }
    }) as CSSStyleDeclaration
  })
})

describe('build-chart-options.ts', () => {

  describe('buildAttendanceTrendOption', () => {
    it('应生成折线图配置', () => {
      const trend = [
        { date: '2024-06-01', total: 120 },
        { date: '2024-06-02', total: 118 }
      ]
      const option = buildAttendanceTrendOption(trend, { chart: '考勤趋势' })

      expect(option.title).toBeDefined()
      const title = option.title as Record<string, unknown>
      expect(title.text).toBe('考勤趋势')
      expect(option.series).toHaveLength(1)
    })

    it('空数据时应正常生成配置', () => {
      const option = buildAttendanceTrendOption([], { chart: '趋势图' })
      expect(option.series).toHaveLength(1)
    })

    it('series 类型为 line', () => {
      const option = buildAttendanceTrendOption(
        [{ date: '2024-06-01', total: 100 }],
        { chart: '测试' }
      )
      expect((option.series![0] as Record<string, unknown>).type).toBe('line')
    })
  })

  describe('buildMemberMixOption', () => {
    it('应生成饼图配置', () => {
      const stats = { studentTotal: 1500, teacherTotal: 80, memberTotal: 1580 } as any
      const option = buildMemberMixOption(stats, {
        student: '学生', teacher: '教师', chart: '成员构成'
      })

      const series = option.series![0] as Record<string, unknown>
      expect(series.type).toBe('pie')
      expect((series.data as unknown[])).toHaveLength(2)
    })

    it('饼图数据包含学生和教师', () => {
      const stats = { studentTotal: 100, teacherTotal: 10, memberTotal: 110 } as any
      const option = buildMemberMixOption(stats, {
        student: '学生', teacher: '教师', chart: '成员'
      })
      const data = (option.series![0] as Record<string, unknown>).data as Array<Record<string, unknown>>
      expect(data[0]?.value).toBe(100)
      expect(data[1]?.value).toBe(10)
    })

    it('pie 配置有 radius 和 center', () => {
      const stats = { studentTotal: 1, teacherTotal: 0, memberTotal: 1 } as any
      const option = buildMemberMixOption(stats, { student: '生', teacher: '师', chart: '图' })
      const series = option.series![0] as Record<string, unknown>
      expect(series.radius).toBeDefined()
      expect(series.center).toBeDefined()
    })
  })

  describe('buildWorkflowLoadOption', () => {
    it('应生成柱状图配置', () => {
      const stats = {
        pendingTasks: 5, workflowMyStarted: 10, workflowMyCompleted: 20
      } as any
      const option = buildWorkflowLoadOption(stats, {
        chart: '流程负载', todo: '待办', started: '发起', done: '已办'
      })

      expect((option.series![0] as Record<string, unknown>).type).toBe('bar')
    })

    it('x 轴包含待办/发起/已办', () => {
      const stats = { pendingTasks: 1, workflowMyStarted: 2, workflowMyCompleted: 3 } as any
      const option = buildWorkflowLoadOption(stats, {
        chart: '负载', todo: '待', started: '始', done: '完'
      })
      const xAxis = (option as Record<string, unknown>).xAxis as Record<string, unknown>
      expect(xAxis.data).toHaveLength(3)
    })
  })

  describe('buildLeaveDomainOption', () => {
    it('应生成柱状图配置', () => {
      const stats = {
        holidayLeaveTotal: 30, holidayReturnTotal: 15, leavePassTotal: 5
      } as any
      const option = buildLeaveDomainOption(stats, {
        chart: '请假域', leaveList: '请假', returnList: '销假', pass: '放行条'
      })

      expect((option.series![0] as Record<string, unknown>).type).toBe('bar')
    })

    it('包含三个分类', () => {
      const stats = { holidayLeaveTotal: 1, holidayReturnTotal: 2, leavePassTotal: 3 } as any
      const option = buildLeaveDomainOption(stats, {
        chart: '域', leaveList: 'L', returnList: 'R', pass: 'P'
      })
      const xAxis = (option as Record<string, unknown>).xAxis as Record<string, unknown>
      expect((xAxis.data as unknown[])).toHaveLength(3)
    })
  })

  describe('buildBacklogOption', () => {
    it('应生成横向柱状图配置', () => {
      const stats = { pendingTasks: 8, pendingBusIntentions: 3 } as any
      const option = buildBacklogOption(stats, {
        chart: '待办事项', leave: '请假', bus: '校车'
      })

      expect((option.series![0] as Record<string, unknown>).type).toBe('bar')
      const xAxis = (option as Record<string, unknown>).xAxis as Record<string, unknown>
      expect(xAxis.type).toBe('value')
      const yAxis = (option as Record<string, unknown>).yAxis as Record<string, unknown>
      expect(yAxis.type).toBe('category')
    })

    it('包含请假和校车两项', () => {
      const stats = { pendingTasks: 10, pendingBusIntentions: 5 } as any
      const option = buildBacklogOption(stats, { chart: '待办', leave: '请假', bus: '校车' })
      const yAxis = (option as Record<string, unknown>).yAxis as Record<string, unknown>
      expect((yAxis.data as unknown[])).toHaveLength(2)
    })
  })
})
