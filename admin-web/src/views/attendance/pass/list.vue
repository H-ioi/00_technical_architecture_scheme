<template>
  <section class="uni-list-page">
    <div class="uni-list-page__header">
      <div>
        <h1>{{ $t('attendance.holidayPass.title') }}</h1>
        <p>{{ $t('attendance.holidayPass.pageDesc') }}</p>
      </div>
      <div class="uni-list-page__header-actions">
        <el-button v-if="hasPermission('pass-add')" type="primary" @click="openAdd">{{
          $t('attendance.add')
        }}</el-button>
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
      selection="multiple"
      :columns="columns"
      :request="loadData"
      :filters="filters"
      :pagination="{ pageSize: 10, pageSizes: [10, 20, 50, 100] }"
      :toolbar="{ refresh: true, density: true, columnSetting: true }"
      :actions="actions"
      :action-column="{ width: 150, fixed: 'right' }"
      @load-success="onTableLoadSuccess"
      @request-error="tableEmpty.onRequestError"
      @selection-change="onSelectionChange">
      <template #toolbar>
        <el-button
          v-if="hasPermission('pass-generated-batch')"
          :disabled="selection.length === 0"
          @click="openBatch">
          {{ $t('attendance.holidayPass.batchGenerate') }}
        </el-button>
        <el-button
          v-if="hasPermission('pass-delete')"
          type="danger"
          :disabled="selection.length === 0"
          @click="batchDelete">
          {{ $t('attendance.delete') }}
        </el-button>
      </template>
      <template #empty>
        <ListTableEmpty :kind="tableEmpty.kind" @reset="reset" @retry="retryTable" />
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
import type { UniTableRequestResult } from 'uni-ui-lib'
import { UniDataTable, UniSearchForm } from 'uni-ui-lib'
import { onMounted } from 'vue'

import ListTableEmpty from '@/components/list-table-empty.vue'
import { useListTableEmpty } from '@/composables/use-list-table-empty'
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
  searchCfg,
  selection,
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

onMounted(() => {
  initSchools()
})
</script>
