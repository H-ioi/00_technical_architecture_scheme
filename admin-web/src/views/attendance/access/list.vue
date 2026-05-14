<template>
  <section class="uni-list-page">
    <div class="uni-list-page__header">
      <div>
        <h1>{{ $t('attendance.access.pageTitle') }}</h1>
        <p>{{ $t('attendance.access.pageDesc') }}</p>
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
      :action-column="{ width: 60, fixed: 'right' }"
      @load-success="onTableLoadSuccess"
      @request-error="tableEmpty.onRequestError">
      <template #empty>
        <ListTableEmpty :kind="tableEmpty.kind" @reset="reset" @retry="retryTable" />
      </template>
    </UniDataTable>

    <DetailDialog v-model:visible="detailVisible" :source="activeRow" :config="detailConfig" />
  </section>
</template>

<script setup lang="ts">
import type { UniTableRequestResult } from 'uni-ui-lib'

import ListTableEmpty from '@/components/list-table-empty.vue'
import { useListTableEmpty } from '@/composables/use-list-table-empty'
import DetailDialog from './components/detail-dialog.vue'
import { useList } from './use-list'

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

const tableEmpty = useListTableEmpty(filters)

const onTableLoadSuccess = (result: UniTableRequestResult) => {
  tableEmpty.onLoadSuccess(result)
  handleLoadSuccess(result)
}

const retryTable = () => {
  tableEmpty.resetError()
  tableRef.value?.refresh()
}
</script>

<style scoped lang="scss"></style>
