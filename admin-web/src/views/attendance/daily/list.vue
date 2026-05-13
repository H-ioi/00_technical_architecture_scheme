<template>
  <section class="uni-list-page">
    <div class="uni-list-page__header">
      <div>
        <h1>{{ $t('attendance.daily.page.title') }}</h1>
        <p>{{ $t('attendance.daily.page.description') }}</p>
      </div>
      <div class="uni-list-page__header-actions">
        <el-button type="primary" @click="exportData">{{ $t('attendance.daily.actions.export') }}</el-button>
      </div>
    </div>

    <UniSearchForm
      v-model="queryModel"
      :config="searchConfig"
      :collapsed="true"
      :collapsed-rows="1"
      :action-min-span="0"
      :submit-text="$t('member.actions.search')"
      :reset-text="$t('member.actions.reset')"
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
      @load-success="handleLoadSuccess" />
  </section>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { useUniI18n } from 'uni-ui-lib'

import { useList } from './use-list'

import { attendanceDailyApi } from '@/api'
import { downloadBlob } from '@/utils/download'

const { t } = useUniI18n()

const {
  columns,
  filters,
  handleLoadSuccess,
  loadData,
  queryModel,
  reset,
  search,
  searchConfig,
  tableRef
} = useList()

const exportData = async () => {
  const raw: Record<string, unknown> = { ...filters.value }
  delete raw.size
  delete raw.current
  try {
    const blob = await attendanceDailyApi.dailyExport.get(raw)
    downloadBlob(blob, 'daily-attendance-export.xlsx')
    ElMessage.success(t('attendance.daily.messages.exportSuccess'))
  } catch {
    /* request 层已提示 */
  }
}
</script>

<style scoped lang="scss"></style>
