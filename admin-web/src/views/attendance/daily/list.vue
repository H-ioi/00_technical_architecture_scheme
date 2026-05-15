<template>
  <section class="uni-list-page">
    <div class="uni-list-page__header">
      <div>
        <h1>{{ $t('attendance.daily.pageTitle') }}</h1>
        <p>{{ $t('attendance.daily.pageDesc') }}</p>
      </div>
      <div class="uni-list-page__header-actions">
        <el-button type="primary" @click="exportData">{{ $t('attendance.export') }}</el-button>
      </div>
    </div>

    <UniSearchForm
      v-model="queryModel"
      :config="searchCfg"
      :collapsed="true"
      :collapsed-rows="1"
      :action-min-span="0"
      :submit-text="$t('member.search')"
      :reset-text="$t('member.reset')"
      @search="search"
      @reset="reset" />

    <UniDataTable
      ref="tableRef"
      row-key="_key"
      :columns="columns"
      :request="loadData"
      :filters="filters"
      :pagination="{ pageSize: 10, pageSizes: [10, 20, 50, 100] }"
      :toolbar="{ refresh: true, density: true, columnSetting: true }"
      @load-success="onTableLoadSuccess"
      @request-error="tableEmpty.onRequestError">
      <template #empty>
        <ListTableEmpty :kind="tableEmpty.kind" @reset="reset" @retry="retryTable" />
      </template>
    </UniDataTable>
  </section>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import type { UniTableRequestResult } from 'uni-ui-lib'
import { useUniI18n } from 'uni-ui-lib'

import ListTableEmpty from '@/components/list-table-empty.vue'
import { useListTableEmpty } from '@/composables/use-list-table-empty'
import { attendanceDailyApi } from '@/api'
import { downloadBlob } from '@/utils/download'
import { useList } from './use-list'

const { t } = useUniI18n()

const {
  columns,
  filters,
  handleLoadSuccess,
  loadData,
  queryModel,
  reset,
  search,
  searchCfg,
  tableRef
} = useList()

const tableEmpty = useListTableEmpty(filters)

const onTableLoadSuccess = (result: UniTableRequestResult) => {
  tableEmpty.onLoadSuccess(result)
  handleLoadSuccess(result)
}

const retryTable = () => {
  tableEmpty.resetError()
  tableRef.value?.refresh()
}

const exportData = async () => {
  const raw: Record<string, unknown> = { ...filters.value }
  delete raw.size
  delete raw.current
  try {
    const blob = await attendanceDailyApi.dailyExport.get(raw)
    downloadBlob(blob, 'daily-attendance-export.xlsx')
    ElMessage.success(t('attendance.exportStarted'))
  } catch {
    /* request 层已提示 */
  }
}
</script>
