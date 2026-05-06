<script setup lang="ts">
import { computed } from 'vue'

import { useAppI18n } from '@/composables/use-app-i18n'

const { t } = useAppI18n()

const metrics = computed(() => [
  { label: t('dashboard.todo'), value: 12 },
  { label: t('dashboard.visits'), value: 2480 },
  { label: t('dashboard.alerts'), value: 3 },
  { label: t('dashboard.apps'), value: 8 }
])
</script>

<template>
  <section class="dashboard-page">
    <el-card shadow="never" class="dashboard-page__welcome">
      <h1>{{ t('route.dashboard') }}</h1>
      <p>{{ t('dashboard.description') }}</p>
    </el-card>

    <div class="dashboard-page__metrics">
      <el-card
        v-for="item in metrics"
        :key="item.label"
        shadow="never"
        class="dashboard-page__metric"
      >
        <span>{{ item.label }}</span>
        <strong>{{ item.value }}</strong>
      </el-card>
    </div>

    <el-card shadow="never">
      <template #header>
        <div class="dashboard-page__card-title">{{ t('dashboard.permissionDemo') }}</div>
      </template>
      <el-button v-permission="'dashboard:view'" type="primary">
        {{ t('dashboard.viewDashboard') }}
      </el-button>
      <el-button v-permission="'uni-lib:demo:view'">
        {{ t('dashboard.viewUniLibDemo') }}
      </el-button>
    </el-card>
  </section>
</template>

<style scoped lang="scss">
.dashboard-page {
  display: grid;
  gap: 16px;
}

.dashboard-page__welcome {
  h1 {
    margin: 0 0 8px;
    font-size: 24px;
  }

  p {
    margin: 0;
    color: var(--app-text-color-secondary);
  }
}

.dashboard-page__metrics {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}

.dashboard-page__metric {
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

.dashboard-page__card-title {
  font-weight: 700;
}

@media (width <= 960px) {
  .dashboard-page__metrics {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
