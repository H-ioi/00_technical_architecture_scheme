<template>
  <section class="uni-list-page">
    <div class="uni-list-page__header">
      <div>
        <h1>{{ $t('schoolDoctor.visitRecord.pageTitle') }}</h1>
        <p>{{ $t('schoolDoctor.visitRecord.pageDesc') }}</p>
      </div>
      <div v-if="activeTab === 'record'" class="uni-list-page__header-actions">
        <el-button type="primary" @click="recordListRef?.openAdd()">
          {{ $t('schoolDoctor.common.add') }}
        </el-button>
      </div>
    </div>

    <el-tabs v-model="activeTab" class="visit-record-tab__tabs">
      <el-tab-pane :label="$t('schoolDoctor.visitRecord.tabPending')" name="pending">
        <PendingList v-if="activeTab === 'pending'" />
      </el-tab-pane>
      <el-tab-pane :label="$t('schoolDoctor.visitRecord.tabRecord')" name="record">
        <RecordList v-if="activeTab === 'record'" ref="recordListRef" />
      </el-tab-pane>
    </el-tabs>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import { useTabQuerySync } from '@/composables/use-tab-query-sync'

import PendingList from './components/pending-list.vue'
import RecordList from './components/record-list.vue'

const VISIT_TABS = ['pending', 'record'] as const
const activeTab = ref<(typeof VISIT_TABS)[number]>('pending')
const recordListRef = ref<InstanceType<typeof RecordList> | null>(null)

useTabQuerySync(activeTab, VISIT_TABS)
</script>

<style scoped lang="scss">
.visit-record-tab__tabs {
  margin-top: 8px;
}
</style>
