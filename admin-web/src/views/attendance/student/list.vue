<template>
  <section class="uni-list-page">
    <div class="uni-list-page__header">
      <div>
        <h1>{{ $t('attendance.student.pageTitle') }}</h1>
        <p>{{ $t('attendance.student.pageDesc') }}</p>
      </div>
      <div class="uni-list-page__header-actions">
        <el-button v-uni-permission="'student_attendance_export'" @click="exportData">
          {{ $t('attendance.export') }}
        </el-button>
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
      row-key="id"
      :columns="columns"
      :request="loadData"
      :filters="filters"
      :pagination="{ pageSize: 10, pageSizes: [10, 20, 50, 100] }"
      :toolbar="{ refresh: true, density: true, columnSetting: true }"
      :actions="actions"
      :action-column="{ width: 88, fixed: 'right' }"
      @load-success="handleLoadSuccess" />

    <DetailDialog v-model:visible="detailVisible" :source="activeRow" :config="detailConfig" />
  </section>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { useUniI18n } from 'uni-ui-lib'

import DetailDialog from './components/detail-dialog.vue'
import { useList } from './use-list'

import { attendanceStudentApi } from '@/api'
import { downloadBlob } from '@/utils/download'

const { t } = useUniI18n()

const {
  actions,
  columns,
  activeRow,
  detailConfig,
  detailVisible,
  filters,
  handleLoadSuccess,
  loadData,
  queryModel,
  reset,
  search,
  searchCfg,
  tableRef
} = useList()

const exportData = async () => {
  const raw: Record<string, unknown> = { ...filters.value }
  delete raw.size
  delete raw.current
  try {
    const blob = await attendanceStudentApi.studentExport.get(raw)
    downloadBlob(blob, 'student-attendance-export.xlsx')
    ElMessage.success(t('attendance.exportStarted'))
  } catch {
    /* request 层已提示 */
  }
}
</script>

<style scoped lang="scss"></style>
