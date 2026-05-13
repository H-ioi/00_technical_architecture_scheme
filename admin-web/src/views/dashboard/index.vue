<template>
  <section class="dash">
    <el-card shadow="never" class="dash__welcome">
      <h1>{{ $t('route.dashboard') }}</h1>
      <p>{{ $t('dashboard.description') }}</p>
    </el-card>

    <div v-loading="statsLoading" class="dash__metrics">
      <el-card v-for="item in metrics" :key="item.label" shadow="never" class="dash__metric">
        <span>{{ item.label }}</span>
        <strong>{{ item.display }}</strong>
      </el-card>
    </div>

    <el-card shadow="never">
      <template #header>
        <div class="dash__card-title">{{ $t('dashboard.shortcuts') }}</div>
      </template>

      <div class="dash__shortcuts">
        <button
          v-for="item in shortcuts"
          :key="item.path"
          class="dash__shortcut"
          type="button"
          @click="go(item)">
          <strong>{{ item.label }}</strong>
          <span>{{ item.description }}</span>
          <em>{{ $t('dashboard.enter') }}</em>
        </button>
      </div>
    </el-card>

    <el-card shadow="never" class="dash__phase">
      <strong>{{ $t('dashboard.statsHintTitle') }}</strong>
      <span>{{ $t('dashboard.statsHintBody') }}</span>
    </el-card>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useUniI18n } from 'uni-ui-lib'
import { useRouter } from 'vue-router'

import { useDashboardStats } from '@/composables/use-dashboard-stats'
import type { DashboardShortcut } from '@/types/modules/dashboard'

const { t } = useUniI18n()
const router = useRouter()

const { loading: statsLoading, stats } = useDashboardStats()

const formatStat = (n: number) =>
  new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(n)

const metrics = computed(() => {
  const s = stats.value
  const pending = statsLoading.value
  return [
    {
      label: t('dashboard.memberTotal'),
      display: pending ? '—' : formatStat(s.memberTotal)
    },
    {
      label: t('dashboard.todayActivityTotal'),
      display: pending ? '—' : formatStat(s.todayAttendanceTotal)
    },
    {
      label: t('dashboard.pendingTaskTotal'),
      display: pending ? '—' : formatStat(s.pendingTasks)
    },
    {
      label: t('dashboard.alertTotal'),
      display: pending ? '—' : formatStat(s.pendingBusIntentions)
    }
  ]
})

const shortcuts = computed<DashboardShortcut[]>(() => [
  {
    label: t('route.memberStudent'),
    description: t('dashboard.studentShortcutDescription'),
    path: '/member/student'
  },
  {
    label: t('route.memberTeacher'),
    description: t('dashboard.teacherShortcutDescription'),
    path: '/member/teacher'
  },
  {
    label: t('route.attendanceHolidayTask'),
    description: t('dashboard.taskShortcutDescription'),
    path: '/attendance/task'
  },
  {
    label: t('route.schoolBusStudentApply'),
    description: t('dashboard.busApplyShortcutDescription'),
    path: '/school-bus/student/apply'
  },
  {
    label: t('route.attendanceDaily'),
    description: t('dashboard.dailyShortcutDescription'),
    path: '/attendance/daily'
  },
  {
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
  gap: 16px;

  &__welcome {
    h1 {
      margin: 0 0 8px;
      font-size: 24px;
    }

    p {
      margin: 0;
      color: var(--app-text-color-secondary);
    }
  }

  &__metrics {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 16px;
  }

  &__metric {
    border-radius: 14px;

    span {
      color: var(--app-text-color-secondary);
    }

    strong {
      display: block;
      margin-top: 12px;
      color: var(--app-text-color);
      font-size: 28px;
    }
  }

  &__card-title {
    font-weight: 700;
  }

  &__shortcuts {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 14px;
  }

  &__shortcut {
    display: grid;
    gap: 8px;
    padding: 16px;
    color: var(--app-text-color);
    text-align: left;
    cursor: pointer;
    background: #f8fafc;
    border: 1px solid var(--app-border-color);
    border-radius: 12px;

    span {
      color: var(--app-text-color-secondary);
      line-height: 1.6;
    }

    em {
      color: var(--app-primary-color);
      font-style: normal;
      font-weight: 700;
    }
  }

  &__phase {
    :deep(.el-card__body) {
      display: flex;
      gap: 12px;
      align-items: center;
      color: var(--app-text-color-secondary);
    }

    strong {
      color: var(--app-text-color);
    }
  }
}

@media (width <=960px) {
  .dash__metrics,
  .dash__shortcuts {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (width <=640px) {
  .dash__metrics,
  .dash__shortcuts {
    grid-template-columns: 1fr;
  }
}
</style>
