<template>
  <section class="uni-list-page">
    <div class="uni-list-page__header">
      <div>
        <h1>{{ $t('attendance.holiday.pageTitle') }}</h1>
        <p>{{ $t('attendance.holiday.pageDesc') }}</p>
      </div>
      <div v-if="activeTab === 'leave'" class="uni-list-page__header-actions">
        <el-button type="primary" @click="leaveAddVisible = true">{{
          $t('attendance.add')
        }}</el-button>
      </div>
    </div>

    <el-tabs v-model="activeTab" class="attendance-holiday-tab__tabs">
      <el-tab-pane :label="$t('attendance.holiday.tabLeave')" name="leave">
        <UniSearchForm
          v-model="leaveQueryModel"
          :config="leaveSearchConfig"
          :collapsed="true"
          :collapsed-rows="1"
          :action-min-span="0"
          :submit-text="$t('member.search')"
          :reset-text="$t('member.reset')"
          @search="searchLeave"
          @reset="resetLeaveSearch" />
        <UniDataTable
          ref="leaveTableRef"
          row-key="id"
          :columns="leaveColumns"
          :request="loadLeaveData"
          :filters="leaveFilters"
          :pagination="{ pageSize: 10, pageSizes: [10, 20, 50, 100] }"
          :toolbar="{ refresh: true, density: true, columnSetting: true }"
          :actions="leaveActions"
          :action-column="{ width: 168, fixed: 'right' }"
          @load-success="onLeaveTableLoadSuccess"
          @request-error="leaveTableEmpty.onRequestError">
          <template #empty>
            <ListTableEmpty
              :kind="leaveTableEmpty.kind"
              @reset="resetLeaveSearch"
              @retry="retryLeaveTable" />
          </template>
        </UniDataTable>
      </el-tab-pane>

      <el-tab-pane :label="$t('attendance.holiday.tabReturn')" name="return">
        <UniSearchForm
          v-model="returnQueryModel"
          :config="returnSearchConfig"
          :collapsed="true"
          :collapsed-rows="1"
          :action-min-span="0"
          :submit-text="$t('member.search')"
          :reset-text="$t('member.reset')"
          @search="searchReturn"
          @reset="resetReturnSearch" />
        <UniDataTable
          ref="returnTableRef"
          row-key="id"
          :columns="returnColumns"
          :request="loadReturnData"
          :filters="returnFilters"
          :pagination="{ pageSize: 10, pageSizes: [10, 20, 50, 100] }"
          :toolbar="{ refresh: true, density: true, columnSetting: true }"
          :actions="returnActions"
          :action-column="{ width: 88, fixed: 'right' }"
          @load-success="onReturnTableLoadSuccess"
          @request-error="returnTableEmpty.onRequestError">
          <template #empty>
            <ListTableEmpty
              :kind="returnTableEmpty.kind"
              @reset="resetReturnSearch"
              @retry="retryReturnTable" />
          </template>
        </UniDataTable>
      </el-tab-pane>
    </el-tabs>

    <HolidayFormDrawer v-model:visible="leaveAddVisible" @success="onLeaveFormSuccess" />

    <DetailDrawer
      v-model:visible="leaveDetailVisible"
      :source="leaveDetailModel"
      :config="leaveDetailConfig"
      :loading="leaveDetailLoading" />

    <DetailDrawer
      v-model:visible="returnDetailVisible"
      :source="returnDetailModel"
      :config="returnDetailConfig"
      :loading="returnDetailLoading" />
  </section>
</template>

<script setup lang="ts">
import type { UniTableRequestResult } from 'uni-ui-lib'
import { UniDataTable, UniSearchForm } from 'uni-ui-lib'
import { nextTick, onMounted, ref, watch } from 'vue'

import ListTableEmpty from '@/components/list-table-empty.vue'
import { useListTableEmpty } from '@/composables/use-list-table-empty'
import { useTabQuerySync } from '@/composables/use-tab-query-sync'
import { membershipApi } from '@/api'
import type { SchoolOptionRecord } from '@/types/modules/membership'
import DetailDrawer from './components/detail-drawer.vue'
import HolidayFormDrawer from './components/holiday-form-drawer.vue'
import { useHolidayLeave } from './use-holiday-leave'
import { useHolidayReturn } from './use-holiday-return'

const HOLIDAY_TABS = ['leave', 'return'] as const
const activeTab = ref<(typeof HOLIDAY_TABS)[number]>('leave')
useTabQuerySync(activeTab, HOLIDAY_TABS)
const schoolRecords = ref<SchoolOptionRecord[]>([])
const leaveAddVisible = ref(false)

const {
  actions: leaveActions,
  columns: leaveColumns,
  detailConfig: leaveDetailConfig,
  detailLoading: leaveDetailLoading,
  detailModel: leaveDetailModel,
  detailVisible: leaveDetailVisible,
  filters: leaveFilters,
  handleLoadSuccess: handleLeaveLoadSuccess,
  loadData: loadLeaveData,
  queryModel: leaveQueryModel,
  reset: resetLeaveSearch,
  search: searchLeave,
  searchCfg: leaveSearchConfig,
  tableRef: leaveTableRef
} = useHolidayLeave(schoolRecords)

const leaveTableEmpty = useListTableEmpty(leaveFilters)

const onLeaveTableLoadSuccess = (result: UniTableRequestResult) => {
  leaveTableEmpty.onLoadSuccess(result)
  handleLeaveLoadSuccess(result)
}

const retryLeaveTable = () => {
  leaveTableEmpty.resetError()
  leaveTableRef.value?.refresh()
}

const {
  actions: returnActions,
  columns: returnColumns,
  detailConfig: returnDetailConfig,
  detailLoading: returnDetailLoading,
  detailModel: returnDetailModel,
  detailVisible: returnDetailVisible,
  filters: returnFilters,
  handleLoadSuccess: handleReturnLoadSuccess,
  loadData: loadReturnData,
  queryModel: returnQueryModel,
  reset: resetReturnSearch,
  search: searchReturn,
  searchCfg: returnSearchConfig,
  tableRef: returnTableRef
} = useHolidayReturn(schoolRecords)

const returnTableEmpty = useListTableEmpty(returnFilters)

const onReturnTableLoadSuccess = (result: UniTableRequestResult) => {
  returnTableEmpty.onLoadSuccess(result)
  handleReturnLoadSuccess(result)
}

const retryReturnTable = () => {
  returnTableEmpty.resetError()
  returnTableRef.value?.refresh()
}

const onLeaveFormSuccess = () => {
  leaveTableRef.value?.refresh()
}

onMounted(async () => {
  schoolRecords.value = await membershipApi.school.get()
})

watch(
  () => schoolRecords.value.length,
  (n) => {
    if (n === 0) {
      return
    }
    nextTick(() => {
      leaveTableRef.value?.refresh()
      returnTableRef.value?.refresh()
    })
  }
)
</script>

<style scoped lang="scss">
.attendance-holiday-tab__tabs {
  margin-top: 8px;
}
</style>
