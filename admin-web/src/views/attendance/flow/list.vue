<template>
  <section class="uni-list-page">
    <div class="uni-list-page__header">
      <div>
        <h1>{{ $t('attendance.holidayFlow.pageTitle') }}</h1>
        <p class="attendance-flow-list__desc">
          {{
            active === 'def'
              ? $t('attendance.holidayFlow.flowDef.deployHint')
              : $t('attendance.holidayFlow.pageDesc')
          }}
        </p>
      </div>
      <div v-if="active === 'def'" class="uni-list-page__header-actions">
        <el-button type="primary" @click="goCreateFlow">{{
          $t('attendance.holidayFlow.flowDef.add')
        }}</el-button>
      </div>
    </div>
    <el-tabs v-model="active" class="attendance-flow-list__tabs">
      <el-tab-pane :label="$t('attendance.holidayFlow.tabModel')" name="def">
        <FlowDefPanel />
      </el-tab-pane>
      <el-tab-pane :label="$t('attendance.holidayFlow.tabDeployed')" name="proc">
        <ProcDefPanel />
      </el-tab-pane>
    </el-tabs>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import FlowDefPanel from './components/flow-def-panel.vue'
import ProcDefPanel from './components/proc-def-panel.vue'

const router = useRouter()
const active = ref<'def' | 'proc'>('def')

const goCreateFlow = () => {
  void router.push({ name: 'AttendanceHolidayFlowDesignCreate' })
}
</script>

<style scoped lang="scss">
.attendance-flow-list__tabs {
  margin-top: 0;
}

.attendance-flow-list__desc {
  margin: 8px 0 0;
  font-size: 13px;
  color: var(--el-text-color-secondary);
}
</style>
