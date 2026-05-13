<template>
  <section class="dash">
    <header class="dash__hero">
      <div class="dash__hero-text">
        <h1>{{ $t('route.dashboard') }}</h1>
        <p>{{ $t('dashboard.description') }}</p>
      </div>
      <div class="dash__hero-meta">
        <time class="dash__hero-date" :datetime="todayIso">{{ heroDateDisplay }}</time>
        <el-button
          class="dash__refresh"
          :icon="RefreshRight"
          circle
          :loading="statsLoading"
          :title="$t('dashboard.refresh')"
          @click="refresh"
        />
      </div>
    </header>

    <el-alert
      v-if="!statsLoading && attentionTotal > 0"
      class="dash__alert"
      type="warning"
      :closable="false"
      show-icon
    >
      <template #title>{{ $t('dashboard.healthAlertTitle', { n: attentionTotal }) }}</template>
      {{ healthAlertDetail }}
    </el-alert>

    <div class="dash__kpi-strip" :aria-busy="statsLoading">
      <div v-loading="statsLoading" class="dash__kpi-inner">
        <article v-for="k in kpis" :key="k.key" class="dash-kpi">
          <div class="dash-kpi__glow" />
          <div class="dash-kpi__icon" aria-hidden="true">
            <el-icon><component :is="k.icon" /></el-icon>
          </div>
          <div class="dash-kpi__body">
            <span class="dash-kpi__label">{{ k.label }}</span>
            <strong class="dash-kpi__value">{{ k.display }}</strong>
            <span class="dash-kpi__hint">{{ k.hint }}</span>
          </div>
        </article>
      </div>
    </div>

    <DashboardChartPanels :stats="stats" :loading="statsLoading" />

    <section class="dash__overview dash__overview--grid">
      <el-card shadow="never" class="dash__outline-card">
        <template #header>
          <div class="dash__card-head">
            <span>{{ $t('dashboard.overviewTitle') }}</span>
            <span class="dash__card-sub">{{ overviewSub }}</span>
          </div>
        </template>
        <ul class="dash__outline">
          <li v-for="row in outlineRows" :key="row.label">
            <span>{{ row.label }}</span>
            <strong>{{ row.value }}</strong>
          </li>
        </ul>
      </el-card>

      <el-card shadow="never" class="dash__outline-card">
        <template #header>
          <div class="dash__card-head">
            <span>{{ $t('dashboard.contentOverviewTitle') }}</span>
            <span class="dash__card-sub">{{ overviewSub }}</span>
          </div>
        </template>
        <ul class="dash__outline dash__outline--quad">
          <li v-for="row in contentOutlineRows" :key="row.label">
            <span>{{ row.label }}</span>
            <strong>{{ row.value }}</strong>
          </li>
        </ul>
      </el-card>
    </section>

    <el-card shadow="never" class="dash__shortcuts-card">
      <template #header>
        <div class="dash__card-head">
          <span>{{ $t('dashboard.shortcuts') }}</span>
        </div>
      </template>

      <div class="dash__shortcuts">
        <button
          v-for="item in shortcuts"
          :key="item.path"
          class="dash__shortcut"
          type="button"
          @click="go(item)"
        >
          <span class="dash__shortcut-icon" aria-hidden="true">
            <el-icon><component :is="shortcutIconMap[item.icon ?? 'Tickets']" /></el-icon>
          </span>
          <span class="dash__shortcut-text">
            <strong>{{ item.label }}</strong>
            <span>{{ item.description }}</span>
          </span>
          <em>{{ $t('dashboard.enter') }}</em>
        </button>
      </div>
    </el-card>

    <el-collapse class="dash__collapse">
      <el-collapse-item :title="$t('dashboard.statsHintTitle')" name="data">
        <p class="dash__collapse-body">{{ $t('dashboard.statsHintBody') }}</p>
      </el-collapse-item>
    </el-collapse>
  </section>
</template>

<script setup lang="ts">
import {
  Calendar,
  List,
  Memo,
  Message,
  RefreshRight,
  Tickets,
  User,
  UserFilled,
  Van
} from '@element-plus/icons-vue'
import dayjs from 'dayjs'
import 'dayjs/locale/en'
import 'dayjs/locale/zh-cn'
import { computed } from 'vue'
import { useUniI18n } from 'uni-ui-lib'
import { useRouter } from 'vue-router'

import { useDashboardStats } from '@/composables/use-dashboard-stats'
import type { DashboardShortcut } from '@/types/modules/dashboard'

import DashboardChartPanels from './components/dashboard-chart-panels.vue'

const shortcutIconMap: Record<string, typeof User> = {
  User,
  UserFilled,
  Memo,
  Van,
  Calendar,
  Message,
  Tickets
}

const { t, locale } = useUniI18n()
const router = useRouter()

const { loading: statsLoading, stats, refresh } = useDashboardStats()

const todayIso = computed(() => dayjs().format('YYYY-MM-DD'))

const heroDateDisplay = computed(() => {
  const loc = locale()
  dayjs.locale(loc === 'zh-CN' || loc === 'zh-cn' ? 'zh-cn' : 'en')
  return loc === 'zh-CN' || loc === 'zh-cn'
    ? dayjs().format('YYYY年M月D日 dddd')
    : dayjs().format('dddd, MMM D, YYYY')
})

const formatStat = (n: number) =>
  new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(n)

const kpis = computed(() => {
  const s = stats.value
  const pending = statsLoading.value
  const disp = (n: number) => (pending ? '—' : formatStat(n))

  const attHint = (() => {
    if (pending) {
      return ''
    }
    const tdy = s.todayAttendanceTotal
    const y = s.yesterdayAttendanceTotal
    if (y <= 0 && tdy <= 0) {
      return t('dashboard.kpiNoCompare')
    }
    if (y <= 0) {
      return t('dashboard.kpiVsYesterdayNew')
    }
    const pct = Math.round(((tdy - y) / y) * 100)
    return t('dashboard.kpiVsYesterday', { pct: pct > 0 ? `+${pct}%` : `${pct}%` })
  })()

  const busHint = pending
    ? ''
    : t('dashboard.kpiBusHint', {
        pending: formatStat(s.pendingBusIntentions),
        total: formatStat(s.busIntentionTotal)
      })

  const memberHint = pending
    ? ''
    : t('dashboard.kpiMemberHint', {
        students: formatStat(s.studentTotal),
        teachers: formatStat(s.teacherTotal)
      })

  return [
    {
      key: 'member',
      label: t('dashboard.memberTotal'),
      display: disp(s.memberTotal),
      hint: memberHint,
      icon: UserFilled
    },
    {
      key: 'daily',
      label: t('dashboard.todayActivityTotal'),
      display: disp(s.todayAttendanceTotal),
      hint: attHint,
      icon: Calendar
    },
    {
      key: 'todo',
      label: t('dashboard.pendingTaskTotal'),
      display: disp(s.pendingTasks),
      hint: t('dashboard.kpiTodoHint'),
      icon: List
    },
    {
      key: 'bus',
      label: t('dashboard.alertTotal'),
      display: disp(s.pendingBusIntentions),
      hint: busHint,
      icon: Van
    }
  ]
})

const attentionTotal = computed(() => stats.value.pendingTasks + stats.value.pendingBusIntentions)

const healthAlertDetail = computed(() =>
  statsLoading.value
    ? ''
    : t('dashboard.healthAlertBody', {
        leave: formatStat(stats.value.pendingTasks),
        bus: formatStat(stats.value.pendingBusIntentions)
      })
)

const outlineRows = computed(() => {
  const s = stats.value
  const p = statsLoading.value
  const v = (n: number) => (p ? '—' : formatStat(n))

  const busRate =
    !p && s.busIntentionTotal > 0
      ? `${Math.round((s.pendingBusIntentions / s.busIntentionTotal) * 100)}%`
      : p
        ? '—'
        : '0%'

  return [
    {
      label: t('dashboard.outlineBusOrders'),
      value: v(s.busOrderTotal)
    },
    {
      label: t('dashboard.outlineBusIntentions'),
      value: v(s.busIntentionTotal)
    },
    {
      label: t('dashboard.outlinePendingRate'),
      value: busRate
    }
  ]
})

const contentOutlineRows = computed(() => {
  const s = stats.value
  const p = statsLoading.value
  const v = (n: number) => (p ? '—' : formatStat(n))

  return [
    { label: t('dashboard.outlineMailGroups'), value: v(s.mailGroupTotal) },
    { label: t('dashboard.outlineMailSent'), value: v(s.mailSentTotal) },
    { label: t('dashboard.outlineMailDrafts'), value: v(s.mailDraftTotal) },
    { label: t('dashboard.outlineProtocols'), value: v(s.protocolTotal) }
  ]
})

const overviewSub = computed(() => (statsLoading.value ? '' : t('dashboard.overviewSubtitle')))

const shortcuts = computed<DashboardShortcut[]>(() => [
  {
    icon: 'User',
    label: t('route.memberStudent'),
    description: t('dashboard.studentShortcutDescription'),
    path: '/member/student'
  },
  {
    icon: 'UserFilled',
    label: t('route.memberTeacher'),
    description: t('dashboard.teacherShortcutDescription'),
    path: '/member/teacher'
  },
  {
    icon: 'Memo',
    label: t('route.attendanceHolidayTask'),
    description: t('dashboard.taskShortcutDescription'),
    path: '/attendance/task'
  },
  {
    icon: 'Van',
    label: t('route.schoolBusStudentApply'),
    description: t('dashboard.busApplyShortcutDescription'),
    path: '/school-bus/student/apply'
  },
  {
    icon: 'Calendar',
    label: t('route.attendanceDaily'),
    description: t('dashboard.dailyShortcutDescription'),
    path: '/attendance/daily'
  },
  {
    icon: 'Message',
    label: t('route.emailGroup'),
    description: t('dashboard.emailGroupShortcutDescription'),
    path: '/email/group'
  }
])

const go = (item: DashboardShortcut) => {
  router.push(item.path)
}
</script>

<style scoped lang="scss">
.dash {
  display: grid;
  gap: 18px;

  &__hero {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    align-items: flex-start;
    justify-content: space-between;
    padding: 28px 28px 24px;
    overflow: hidden;
    color: #f8fafc;
    background: linear-gradient(
      125deg,
      #0f172a 0%,
      #1e293b 38%,
      color-mix(in srgb, var(--app-primary-color) 72%, #0f172a) 100%
    );
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 18px;
    box-shadow:
      0 18px 40px rgb(15 23 42 / 22%),
      inset 0 1px 0 rgb(255 255 255 / 6%);
  }

  &__hero-text {
    position: relative;
    z-index: 1;
    max-width: min(560px, 100%);

    h1 {
      margin: 0 0 8px;
      font-size: 26px;
      font-weight: 700;
      letter-spacing: 0.02em;
    }

    p {
      margin: 0;
      font-size: 14px;
      line-height: 1.6;
      color: rgb(226 232 240 / 88%);
    }
  }

  &__hero-meta {
    position: relative;
    z-index: 1;
    display: flex;
    gap: 10px;
    align-items: center;
  }

  &__hero-date {
    padding: 8px 14px;
    font-size: 13px;
    color: rgb(248 250 252 / 92%);
    background: rgb(15 23 42 / 35%);
    border: 1px solid rgb(255 255 255 / 12%);
    border-radius: 999px;
  }

  &__refresh {
    color: #0f172a;
    background: rgb(248 250 252 / 95%);
    border: none;

    &:hover {
      background: #fff;
    }
  }

  &__alert {
    border-radius: 12px;
  }

  &__kpi-strip {
    position: relative;
  }

  &__kpi-inner {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 14px;
    min-height: 120px;
    padding: 4px;
    border-radius: 4px;
  }

  &__overview {
    margin-top: -2px;

    &--grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 16px;

      @media (width <=900px) {
        grid-template-columns: 1fr;
      }
    }
  }

  &__outline-card {
    border-radius: 16px;

    :deep(.el-card__header) {
      padding-bottom: 8px;
      border-bottom: 1px solid var(--app-border-color);
    }
  }

  &__card-head {
    display: flex;
    flex-wrap: wrap;
    gap: 8px 16px;
    align-items: baseline;
    font-weight: 700;
    color: var(--app-text-color);
  }

  &__card-sub {
    font-weight: 400;
    color: var(--app-text-color-secondary);
  }

  &__outline {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 12px 24px;
    padding: 0;
    margin: 0;
    list-style: none;

    &--quad {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    li {
      display: flex;
      flex-direction: column;
      gap: 6px;
      padding: 12px 14px;
      background: linear-gradient(180deg, rgb(248 250 252) 0%, #fff 100%);
      border: 1px solid var(--app-border-color);
      border-radius: 12px;

      span {
        font-size: 13px;
        color: var(--app-text-color-secondary);
      }

      strong {
        font-size: 22px;
        font-weight: 700;
        color: var(--app-text-color);
      }
    }
  }

  &__shortcuts-card {
    border-radius: 16px;
  }

  &__shortcuts {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 14px;
  }

  &__shortcut {
    display: flex;
    gap: 14px;
    align-items: center;
    padding: 16px 18px;
    color: var(--app-text-color);
    text-align: left;
    cursor: pointer;
    background: #fff;
    background: linear-gradient(135deg, rgb(248 250 252) 0%, #fff 55%);
    border: 1px solid var(--app-border-color);
    border-radius: 14px;
    transition:
      transform 0.18s ease,
      box-shadow 0.18s ease,
      border-color 0.18s ease;

    &:hover {
      border-color: color-mix(in srgb, var(--app-primary-color) 55%, var(--app-border-color));
      box-shadow: 0 10px 28px rgb(15 23 42 / 8%);
      transform: translateY(-2px);
    }

    &-icon {
      display: flex;
      flex-shrink: 0;
      align-items: center;
      justify-content: center;
      width: 44px;
      height: 44px;
      font-size: 22px;
      color: var(--app-primary-color);
      background: color-mix(in srgb, var(--app-primary-color) 14%, #fff);
      border-radius: 12px;
    }

    &-text {
      display: flex;
      flex: 1;
      flex-direction: column;
      gap: 4px;
      min-width: 0;

      span {
        font-size: 13px;
        line-height: 1.55;
        color: var(--app-text-color-secondary);
      }
    }

    em {
      flex-shrink: 0;
      font-size: 13px;
      font-style: normal;
      font-weight: 700;
      color: var(--app-primary-color);
    }
  }

  &__collapse {
    overflow: hidden;
    border: 1px solid var(--app-border-color);
    border-radius: 12px;
  }

  &__collapse-body {
    margin: 0;
    font-size: 13px;
    line-height: 1.65;
    color: var(--app-text-color-secondary);
  }
}

.dash-kpi {
  position: relative;
  display: flex;
  gap: 14px;
  align-items: center;
  padding: 18px 18px 18px 16px;
  overflow: hidden;
  background: var(--app-card-bg-color);
  border: 1px solid var(--app-border-color);
  border-radius: 16px;
  box-shadow: 0 1px 0 rgb(255 255 255 / 60%) inset;

  &__glow {
    position: absolute;
    top: -40%;
    right: -20%;
    width: 140px;
    height: 140px;
    pointer-events: none;
    background: radial-gradient(
      circle,
      color-mix(in srgb, var(--app-primary-color) 28%, transparent) 0%,
      transparent 70%
    );
  }

  &__icon {
    position: relative;
    z-index: 1;
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    font-size: 24px;
    color: var(--app-primary-color);
    background: linear-gradient(
      145deg,
      color-mix(in srgb, var(--app-primary-color) 22%, #fff) 0%,
      #fff 100%
    );
    border-radius: 14px;
    box-shadow: 0 6px 16px rgb(15 23 42 / 6%);
  }

  &__body {
    position: relative;
    z-index: 1;
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 4px;
    min-width: 0;
  }

  &__label {
    font-size: 13px;
    color: var(--app-text-color-secondary);
  }

  &__value {
    font-size: 28px;
    font-weight: 800;
    line-height: 1.15;
    color: var(--app-text-color);
    letter-spacing: -0.02em;
  }

  &__hint {
    min-height: 1.4em;
    font-size: 12px;
    line-height: 1.45;
    color: var(--app-text-color-secondary);
  }
}

@media (width <=1100px) {
  .dash__kpi-inner {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .dash__outline {
    grid-template-columns: 1fr;
  }

  .dash__shortcuts {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (width <=640px) {
  .dash__hero {
    padding: 22px 18px;
  }

  .dash__kpi-inner,
  .dash__shortcuts {
    grid-template-columns: 1fr;
  }
}
</style>
