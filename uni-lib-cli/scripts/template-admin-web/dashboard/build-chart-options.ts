import dayjs from 'dayjs'
import type { EChartsCoreOption } from 'echarts'

import type { AttendanceTrendPoint, DashboardStatsPayload } from './static-demo-stats'

const PRIMARY = '#ba8e62'
const ACCENT = '#6366f1'
const MUTED = '#94a3b8'
const FLOW_DONE = '#0ea5e9'

function axisTextColor(): string {
  if (typeof document === 'undefined') {
    return MUTED
  }
  return (
    getComputedStyle(document.documentElement)
      .getPropertyValue('--app-text-color-secondary')
      .trim() || MUTED
  )
}

function strongTextColor(): string {
  if (typeof document === 'undefined') {
    return '#1f2937'
  }
  return (
    getComputedStyle(document.documentElement).getPropertyValue('--app-text-color').trim() ||
    '#1f2937'
  )
}

export function buildAttendanceTrendOption(
  trend: AttendanceTrendPoint[],
  titles: { chart: string }
): EChartsCoreOption {
  const tc = axisTextColor()
  const sc = strongTextColor()
  const labels = trend.map((p) => dayjs(p.date).format('MM-DD'))
  const values = trend.map((p) => p.total)

  return {
    color: [PRIMARY],
    textStyle: {
      fontFamily: 'inherit'
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(15, 23, 42, 0.92)',
      borderColor: 'transparent',
      textStyle: { color: '#f8fafc' }
    },
    grid: { left: 52, right: 20, top: 56, bottom: 28 },
    title: {
      text: titles.chart,
      left: 0,
      top: 8,
      textStyle: { color: sc, fontSize: 14, fontWeight: 600 }
    },
    xAxis: {
      type: 'category',
      data: labels,
      axisLine: { lineStyle: { color: tc } },
      axisLabel: { color: tc }
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { type: 'dashed', color: 'rgba(148, 163, 184, 0.35)' } },
      axisLabel: { color: tc }
    },
    series: [
      {
        type: 'line',
        smooth: true,
        showSymbol: values.length < 10,
        symbolSize: 8,
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(186, 142, 98, 0.45)' },
              { offset: 1, color: 'rgba(186, 142, 98, 0.04)' }
            ]
          }
        },
        lineStyle: { width: 3, shadowColor: 'rgba(186,142,98,0.35)', shadowBlur: 12 },
        data: values
      }
    ]
  }
}

export function buildMemberMixOption(
  stats: DashboardStatsPayload,
  titles: { student: string; teacher: string; chart: string }
): EChartsCoreOption {
  const sc = strongTextColor()
  const tc = axisTextColor()
  const data = [
    { value: stats.studentTotal, name: titles.student, itemStyle: { color: PRIMARY } },
    { value: stats.teacherTotal, name: titles.teacher, itemStyle: { color: ACCENT } }
  ]

  return {
    color: [PRIMARY, ACCENT],
    textStyle: { fontFamily: 'inherit' },
    title: {
      text: titles.chart,
      left: 0,
      top: 8,
      textStyle: { color: sc, fontSize: 14, fontWeight: 600 }
    },
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(15, 23, 42, 0.92)',
      borderColor: 'transparent',
      textStyle: { color: '#f8fafc' },
      formatter: '{b}: {c} ({d}%)'
    },
    legend: {
      bottom: 8,
      left: 'center',
      textStyle: { color: tc }
    },
    series: [
      {
        type: 'pie',
        radius: ['44%', '72%'],
        center: ['50%', '52%'],
        avoidLabelOverlap: true,
        label: { color: tc },
        itemStyle: {
          borderRadius: 8,
          borderColor: '#fff',
          borderWidth: 2
        },
        emphasis: {
          scale: true,
          scaleSize: 6,
          itemStyle: {
            shadowBlur: 24,
            shadowColor: 'rgba(15, 23, 42, 0.35)'
          }
        },
        data
      }
    ]
  }
}

export function buildWorkflowLoadOption(
  stats: DashboardStatsPayload,
  titles: { chart: string; todo: string; started: string; done: string }
): EChartsCoreOption {
  const sc = strongTextColor()
  const tc = axisTextColor()
  const cats = [titles.todo, titles.started, titles.done]
  const vals = [stats.pendingTasks, stats.workflowMyStarted, stats.workflowMyCompleted]
  const colors = [ACCENT, PRIMARY, FLOW_DONE]

  return {
    textStyle: { fontFamily: 'inherit' },
    title: {
      text: titles.chart,
      left: 0,
      top: 8,
      textStyle: { color: sc, fontSize: 14, fontWeight: 600 }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: 'rgba(15, 23, 42, 0.92)',
      borderColor: 'transparent',
      textStyle: { color: '#f8fafc' }
    },
    grid: { left: 44, right: 20, top: 56, bottom: 36 },
    xAxis: {
      type: 'category',
      data: cats,
      axisLine: { lineStyle: { color: tc } },
      axisLabel: { color: tc }
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { type: 'dashed', color: 'rgba(148, 163, 184, 0.35)' } },
      axisLabel: { color: tc }
    },
    series: [
      {
        type: 'bar',
        data: vals.map((v, idx) => ({
          value: v,
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 1,
              x2: 0,
              y2: 0,
              colorStops: [
                { offset: 0, color: `${colors[idx]}aa` },
                { offset: 1, color: colors[idx] ?? PRIMARY }
              ]
            },
            borderRadius: [8, 8, 0, 0]
          }
        })),
        barMaxWidth: 40,
        label: { show: true, position: 'top', color: sc, fontWeight: 600 }
      }
    ]
  }
}

export function buildLeaveDomainOption(
  stats: DashboardStatsPayload,
  titles: {
    chart: string
    leaveList: string
    returnList: string
    pass: string
  }
): EChartsCoreOption {
  const sc = strongTextColor()
  const tc = axisTextColor()
  const cats = [titles.leaveList, titles.returnList, titles.pass]
  const vals = [stats.holidayLeaveTotal, stats.holidayReturnTotal, stats.leavePassTotal]
  const colors = [PRIMARY, ACCENT, FLOW_DONE]

  return {
    textStyle: { fontFamily: 'inherit' },
    title: {
      text: titles.chart,
      left: 0,
      top: 8,
      textStyle: { color: sc, fontSize: 14, fontWeight: 600 }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: 'rgba(15, 23, 42, 0.92)',
      borderColor: 'transparent',
      textStyle: { color: '#f8fafc' }
    },
    grid: { left: 44, right: 20, top: 56, bottom: 36 },
    xAxis: {
      type: 'category',
      data: cats,
      axisLine: { lineStyle: { color: tc } },
      axisLabel: { color: tc }
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { type: 'dashed', color: 'rgba(148, 163, 184, 0.35)' } },
      axisLabel: { color: tc }
    },
    series: [
      {
        type: 'bar',
        data: vals.map((v, idx) => ({
          value: v,
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 1,
              x2: 0,
              y2: 0,
              colorStops: [
                { offset: 0, color: `${colors[idx]}99` },
                { offset: 1, color: colors[idx] ?? PRIMARY }
              ]
            },
            borderRadius: [8, 8, 0, 0]
          }
        })),
        barMaxWidth: 40,
        label: { show: true, position: 'top', color: sc, fontWeight: 600 }
      }
    ]
  }
}

export function buildBacklogOption(
  stats: DashboardStatsPayload,
  titles: { chart: string; leave: string; bus: string }
): EChartsCoreOption {
  const sc = strongTextColor()
  const tc = axisTextColor()
  const items = [
    { name: titles.leave, value: stats.pendingTasks, color: ACCENT },
    { name: titles.bus, value: stats.pendingBusIntentions, color: PRIMARY }
  ]

  return {
    textStyle: { fontFamily: 'inherit' },
    title: {
      text: titles.chart,
      left: 0,
      top: 8,
      textStyle: { color: sc, fontSize: 14, fontWeight: 600 }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: 'rgba(15, 23, 42, 0.92)',
      borderColor: 'transparent',
      textStyle: { color: '#f8fafc' }
    },
    grid: { left: 12, right: 28, top: 56, bottom: 20, containLabel: true },
    xAxis: {
      type: 'value',
      splitLine: { lineStyle: { type: 'dashed', color: 'rgba(148, 163, 184, 0.35)' } },
      axisLabel: { color: tc }
    },
    yAxis: {
      type: 'category',
      data: items.map((x) => x.name),
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: tc }
    },
    series: [
      {
        type: 'bar',
        data: items.map((x) => ({
          value: x.value,
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 1,
              y2: 0,
              colorStops: [
                { offset: 0, color: x.color },
                { offset: 1, color: `${x.color}88` }
              ]
            },
            borderRadius: [0, 8, 8, 0]
          }
        })),
        barMaxWidth: 28,
        label: {
          show: true,
          position: 'right',
          color: sc,
          fontWeight: 600
        }
      }
    ]
  }
}
