<template>
  <section class="dashboard-page">
    <el-card shadow="never" class="dashboard-page__welcome">
      <h1>{{ $t('route.dashboard') }}</h1>
      <p>{{ $t('dashboard.description') }}</p>
    </el-card>

    <div class="dashboard-page__metrics">
      <el-card v-for="item in metrics" :key="item.label" shadow="never" class="dashboard-page__metric">
        <span>{{ item.label }}</span>
        <strong>{{ item.value }}</strong>
      </el-card>
    </div>

    <el-card shadow="never">
      <template #header>
        <div class="dashboard-page__card-title">{{ $t('dashboard.shortcuts') }}</div>
      </template>

      <div class="dashboard-page__shortcuts">
        <button v-for="item in shortcuts" :key="item.path" class="dashboard-page__shortcut" type="button"
          @click="goShortcut(item)">
          <strong>{{ item.label }}</strong>
          <span>{{ item.description }}</span>
          <em>{{ $t('dashboard.enter') }}</em>
        </button>
      </div>
    </el-card>

    <el-card shadow="never" class="dashboard-page__phase">
      <strong>{{ $t('dashboard.firstPhase') }}</strong>
      <span>{{ $t('dashboard.firstPhaseDescription') }}</span>
    </el-card>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useUniI18n } from 'uni-ui-lib'
import { useRouter } from 'vue-router'

import type { DashboardShortcut } from '@/types/modules/dashboard'

const { t } = useUniI18n()
const router = useRouter()

const metrics = computed(() => [
  { label: t('dashboard.memberTotal'), value: '-' },
  { label: t('dashboard.todayActivityTotal'), value: '-' },
  { label: t('dashboard.pendingTaskTotal'), value: '-' },
  { label: t('dashboard.alertTotal'), value: '-' }
])
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
  }
])

const goShortcut = (item: DashboardShortcut) => {
  router.push(item.path)
}
</script>

<style scoped lang="scss">
.dashboard-page {
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

  .dashboard-page__metrics,
  .dashboard-page__shortcuts {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (width <=640px) {

  .dashboard-page__metrics,
  .dashboard-page__shortcuts {
    grid-template-columns: 1fr;
  }
}
</style>
