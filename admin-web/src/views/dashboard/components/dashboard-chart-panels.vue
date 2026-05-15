<script setup lang="ts">
import type { EChartsCoreOption } from 'echarts'
import * as echarts from 'echarts/core'
import { BarChart, LineChart, PieChart } from 'echarts/charts'
import {
  GridComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import { nextTick, onUnmounted, ref, watch } from 'vue'

import { useUniI18n } from 'uni-ui-lib'

import type { DashboardStatsPayload } from '@/types/modules/dashboard'

import {
  buildAttendanceTrendOption,
  buildBacklogOption,
  buildLeaveDomainOption,
  buildMemberMixOption,
  buildWorkflowLoadOption
} from '../build-chart-options'

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  LineChart,
  PieChart,
  BarChart,
  CanvasRenderer
])

const props = defineProps<{
  stats: DashboardStatsPayload
  loading: boolean
}>()

const { t, locale } = useUniI18n()

const trendEl = ref<HTMLElement | null>(null)
const mixEl = ref<HTMLElement | null>(null)
const backlogEl = ref<HTMLElement | null>(null)
const workflowEl = ref<HTMLElement | null>(null)
const leaveDomainEl = ref<HTMLElement | null>(null)

let trendChart: echarts.ECharts | null = null
let mixChart: echarts.ECharts | null = null
let backlogChart: echarts.ECharts | null = null
let workflowChart: echarts.ECharts | null = null
let leaveDomainChart: echarts.ECharts | null = null

const onResize = () => {
  trendChart?.resize()
  mixChart?.resize()
  backlogChart?.resize()
  workflowChart?.resize()
  leaveDomainChart?.resize()
}

const disposeAll = () => {
  window.removeEventListener('resize', onResize)
  trendChart?.dispose()
  mixChart?.dispose()
  backlogChart?.dispose()
  workflowChart?.dispose()
  leaveDomainChart?.dispose()
  trendChart = null
  mixChart = null
  backlogChart = null
  workflowChart = null
  leaveDomainChart = null
}

const ensureInstance = (el: HTMLElement | null, prev: echarts.ECharts | null) => {
  if (!el) {
    prev?.dispose()
    return null
  }
  if (!prev) {
    return echarts.init(el)
  }
  return prev
}

const refreshCharts = () => {
  if (props.loading) {
    return
  }

  const tr = buildAttendanceTrendOption(props.stats.attendanceTrend, {
    chart: t('dashboard.chartAttendanceTrend')
  })
  const memberHasData = props.stats.studentTotal + props.stats.teacherTotal > 0
  const mix: EChartsCoreOption | null = memberHasData
    ? buildMemberMixOption(props.stats, {
        chart: t('dashboard.chartMemberMix'),
        student: t('route.memberStudent'),
        teacher: t('route.memberTeacher')
      })
    : null
  const bl = buildBacklogOption(props.stats, {
    chart: t('dashboard.chartBacklog'),
    leave: t('dashboard.chartBacklogLeave'),
    bus: t('dashboard.chartBacklogBus')
  })

  const wf = buildWorkflowLoadOption(props.stats, {
    chart: t('dashboard.chartWorkflowLoad'),
    todo: t('dashboard.chartWorkflowTodo'),
    started: t('dashboard.chartWorkflowStarted'),
    done: t('dashboard.chartWorkflowDone')
  })

  const ld = buildLeaveDomainOption(props.stats, {
    chart: t('dashboard.chartLeaveDomain'),
    leaveList: t('dashboard.chartLeaveDomainLeave'),
    returnList: t('dashboard.chartLeaveDomainReturn'),
    pass: t('dashboard.chartLeaveDomainPass')
  })

  if (trendEl.value) {
    trendChart = ensureInstance(trendEl.value, trendChart)
    trendChart?.setOption(tr, true)
  }

  if (mixEl.value) {
    if (mix) {
      mixChart = ensureInstance(mixEl.value, mixChart)
      mixChart?.setOption(mix, true)
    } else {
      mixChart?.dispose()
      mixChart = null
    }
  }

  if (backlogEl.value) {
    backlogChart = ensureInstance(backlogEl.value, backlogChart)
    backlogChart?.setOption(bl, true)
  }

  if (workflowEl.value) {
    workflowChart = ensureInstance(workflowEl.value, workflowChart)
    workflowChart?.setOption(wf, true)
  }

  if (leaveDomainEl.value) {
    leaveDomainChart = ensureInstance(leaveDomainEl.value, leaveDomainChart)
    leaveDomainChart?.setOption(ld, true)
  }

  window.removeEventListener('resize', onResize)
  window.addEventListener('resize', onResize)
  onResize()
}

watch(
  () => [props.stats, props.loading, locale()] as const,
  async () => {
    await nextTick()
    refreshCharts()
  },
  { deep: true }
)

onUnmounted(disposeAll)
</script>

<template>
  <div class="dash-panels-root">
    <div class="dash-panels dash-panels--r1">
      <el-card shadow="never" class="dash-panels__card">
        <div
          ref="trendEl"
          class="dash-panels__chart"
          role="img"
          :aria-label="t('dashboard.chartAttendanceTrend')" />
      </el-card>
      <el-card shadow="never" class="dash-panels__card">
        <div
          v-if="stats.studentTotal + stats.teacherTotal > 0"
          ref="mixEl"
          class="dash-panels__chart"
          role="img"
          :aria-label="t('dashboard.chartMemberMix')" />
        <div v-else class="dash-panels__empty">{{ t('dashboard.chartEmptyMix') }}</div>
      </el-card>
      <el-card shadow="never" class="dash-panels__card">
        <div
          ref="backlogEl"
          class="dash-panels__chart"
          role="img"
          :aria-label="t('dashboard.chartBacklog')" />
      </el-card>
    </div>

    <div class="dash-panels dash-panels--r2">
      <el-card shadow="never" class="dash-panels__card">
        <div
          ref="workflowEl"
          class="dash-panels__chart dash-panels__chart--short"
          role="img"
          :aria-label="t('dashboard.chartWorkflowLoad')" />
      </el-card>
      <el-card shadow="never" class="dash-panels__card">
        <div
          ref="leaveDomainEl"
          class="dash-panels__chart dash-panels__chart--short"
          role="img"
          :aria-label="t('dashboard.chartLeaveDomain')" />
      </el-card>
    </div>
  </div>
</template>

<style scoped lang="scss">
.dash-panels-root {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.dash-panels {
  display: grid;
  gap: 16px;

  &--r1 {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  &--r2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  &__card {
    border-radius: 16px;
    overflow: hidden;
  }

  &__chart {
    width: 100%;
    height: 300px;

    &--short {
      height: 280px;
    }
  }

  &__empty {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 300px;
    padding: 16px;
    color: var(--app-text-color-secondary);
    font-size: 14px;
    text-align: center;
  }
}

@media (width <=1100px) {
  .dash-panels--r1,
  .dash-panels--r2 {
    grid-template-columns: 1fr;
  }
}
</style>
