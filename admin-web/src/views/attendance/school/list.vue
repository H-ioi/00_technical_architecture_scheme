<template>
  <section class="uni-list-page">
    <div class="uni-list-page__header">
      <div>
        <h1>{{ $t('attendance.school.page.title') }}</h1>
        <p>{{ $t('attendance.school.page.description') }}</p>
      </div>
      <el-button v-uni-permission="'school_attendance_export'" @click="exportData">
        {{ $t('attendance.school.actions.export') }}
      </el-button>
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
      row-key="id"
      :columns="columns"
      :request="loadData"
      :filters="filters"
      :pagination="{ pageSize: 10, pageSizes: [10, 20, 50, 100] }"
      :toolbar="{ refresh: true, density: true, columnSetting: true }"
      :actions="actions"
      :action-column="{ width: 88, fixed: 'right' }"
      @load-success="handleLoadSuccess" />

    <DetailDialog v-model:visible="detailVisible" :source="currentRecord" :config="detailConfig" />
  </section>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { useUniI18n } from 'uni-ui-lib'

import DetailDialog from './components/detail-dialog.vue'
import { useList } from './use-list'

import { attendanceSchoolApi } from '@/api'
import { downloadBlob } from '@/utils/download'

const { t } = useUniI18n()

const {
  actions,
  columns,
  currentRecord,
  detailConfig,
  detailVisible,
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
    const blob = await attendanceSchoolApi.schoolExport.get(raw)
    downloadBlob(blob, 'school-attendance-export.xlsx')
    ElMessage.success(t('attendance.school.messages.exportSuccess'))
  } catch {
    /* request 层已提示 */
  }
}
</script>

<style scoped lang="scss"></style>
