<template>
  <section class="uni-list-page">
    <div class="uni-list-page__header">
      <div>
        <h1>{{ $t('attendance.wechatOpenid.pageTitle') }}</h1>
        <p>{{ $t('attendance.wechatOpenid.pageDesc') }}</p>
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
      selection
      :columns="columns"
      :request="loadData"
      :filters="filters"
      :pagination="{ pageSize: 10, pageSizes: [10, 20, 50, 100] }"
      :toolbar="{ refresh: true, density: true, columnSetting: true }"
      :actions="actions"
      :action-column="{ width: 60, fixed: 'right' }"
      @selection-change="onSelectionChange"
      @load-success="onTableLoadSuccess"
      @request-error="tableEmpty.onRequestError">
      <template #toolbar>
        <el-button
          v-uni-permission="'archive_wx_openid'"
          :disabled="selection.length === 0"
          @click="batchStatus(1)">
          {{ $t('attendance.wechatOpenid.archive') }}
        </el-button>
        <el-button
          v-uni-permission="'archive_wx_openid'"
          :disabled="selection.length === 0"
          @click="batchStatus(0)">
          {{ $t('attendance.wechatOpenid.activate') }}
        </el-button>
      </template>
      <template #empty>
        <ListTableEmpty :kind="tableEmpty.kind" @reset="reset" @retry="retryTable" />
      </template>
    </UniDataTable>

    <DetailDialog v-model:visible="detailVisible" :source="activeRow" :config="detailConfig" />
  </section>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import type { UniTableRequestResult } from 'uni-ui-lib'
import { useUniI18n } from 'uni-ui-lib'

import { attendanceWechatOpenidApi } from '@/api'
import ListTableEmpty from '@/components/list-table-empty.vue'
import { useListTableEmpty } from '@/composables/use-list-table-empty'
import DetailDialog from './components/detail-dialog.vue'
import { useList } from './use-list'

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
  onSelectionChange,
  selection,
  queryModel,
  refreshTable,
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

const batchStatus = async (status: number) => {
  if (selection.value.length === 0) {
    ElMessage.warning(t('attendance.wechatOpenid.needSelection'))
    return
  }
  const ids = selection.value.map((r) => r.id)
  try {
    await attendanceWechatOpenidApi.batchUpdateStatus.post(ids, status)
    ElMessage.success(t('attendance.wechatOpenid.batchSuccess'))
    selection.value = []
    await refreshTable()
  } catch {
    /* request 层已提示 */
  }
}
</script>
