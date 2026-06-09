<template>
  <section class="uni-list-page">
    <div class="uni-list-page__header">
      <div>
        <h1>{{ $t('dorm.boardingStudent.pageTitle') }}</h1>
        <p>{{ $t('dorm.boardingStudent.pageDesc') }}</p>
      </div>
    </div>

    <el-tabs v-model="activeTab" class="dorm-boarding-tab__tabs">
      <el-tab-pane :label="$t('dorm.boardingStudent.tabCurrent')" name="current">
        <CurrentList v-if="activeTab === 'current'" />
      </el-tab-pane>
      <el-tab-pane :label="$t('dorm.boardingStudent.tabHistory')" name="history">
        <HistoryList v-if="activeTab === 'history'" />
      </el-tab-pane>
    </el-tabs>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import { useTabQuerySync } from '@/composables/use-tab-query-sync'

import CurrentList from './components/current-list.vue'
import HistoryList from './components/history-list.vue'

const BOARDING_TABS = ['current', 'history'] as const
const activeTab = ref<(typeof BOARDING_TABS)[number]>('current')
useTabQuerySync(activeTab, BOARDING_TABS)
</script>

<style scoped lang="scss">
.dorm-boarding-tab {
  &__tabs {
    margin-top: 8px;
  }
}
</style>
