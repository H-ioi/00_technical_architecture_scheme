<template>
  <section class="uni-list-page">
    <div class="uni-list-page__header">
      <div>
        <h1>{{ $t('attendance.holidayPass.page.title') }}</h1>
        <p>{{ $t('attendance.holidayPass.page.description') }}</p>
      </div>
      <div class="uni-list-page__header-actions">
        <el-button v-if="hasPermission('pass-add')" type="primary" @click="openAdd">{{
          $t('attendance.holidayPass.actions.add')
        }}</el-button>
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
      row-key="id"
      selection="multiple"
      :columns="columns"
      :request="loadData"
      :filters="filters"
      :pagination="{ pageSize: 10, pageSizes: [10, 20, 50, 100] }"
      :toolbar="{ refresh: true, density: true, columnSetting: true }"
      :actions="actions"
      :action-column="{ width: 220, fixed: 'right' }"
      @load-success="handleLoadSuccess"
      @selection-change="onSelectionChange">
      <template #toolbar>
        <el-button
          v-if="hasPermission('pass-generated-batch')"
          :disabled="selectedRows.length === 0"
          @click="openBatch">
          {{ $t('attendance.holidayPass.actions.batchGenerate') }}
        </el-button>
        <el-button
          v-if="hasPermission('pass-delete')"
          type="danger"
          :disabled="selectedRows.length === 0"
          @click="batchDelete">
          {{ $t('attendance.holiday.actions.delete') }}
        </el-button>
      </template>
    </UniDataTable>

    <PassFormDialog
      v-model:visible="dialogVisible"
      :edit="dialogEdit"
      :batch-rows="batchPayload"
      :view-only="dialogViewOnly"
      @success="refresh" />
  </section>
</template>

<script setup lang="ts">
import { UniDataTable, UniSearchForm } from 'uni-ui-lib'
import { onMounted } from 'vue'

import PassFormDialog from './components/pass-form-dialog.vue'
import { useList } from './use-list'

const {
  actions,
  batchDelete,
  batchPayload,
  columns,
  dialogEdit,
  dialogVisible,
  dialogViewOnly,
  filters,
  handleLoadSuccess,
  hasPermission,
  initSchools,
  loadData,
  onSelectionChange,
  openAdd,
  openBatch,
  queryModel,
  refresh,
  reset,
  search,
  searchConfig,
  selectedRows,
  tableRef
} = useList()

onMounted(() => {
  initSchools()
})
</script>
