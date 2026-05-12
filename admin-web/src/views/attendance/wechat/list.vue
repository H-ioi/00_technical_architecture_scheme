<template>
  <section class="uni-list-page">
    <div class="uni-list-page__header">
      <div>
        <h1>{{ $t('attendance.wechatOpenid.page.title') }}</h1>
        <p>{{ $t('attendance.wechatOpenid.page.description') }}</p>
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
      selection
      :columns="columns"
      :request="loadData"
      :filters="filters"
      :pagination="{ pageSize: 10, pageSizes: [10, 20, 50, 100] }"
      :toolbar="{ refresh: true, density: true, columnSetting: true }"
      :actions="actions"
      :action-column="{ width: 88, fixed: 'right' }"
      @selection-change="onSelectionChange"
      @load-success="handleLoadSuccess">
      <template #toolbar>
        <el-button
          v-uni-permission="'archive_wx_openid'"
          :disabled="picked.length === 0"
          @click="batchStatus(1)">
          {{ $t('attendance.wechatOpenid.actions.archive') }}
        </el-button>
        <el-button
          v-uni-permission="'archive_wx_openid'"
          :disabled="picked.length === 0"
          @click="batchStatus(0)">
          {{ $t('attendance.wechatOpenid.actions.activate') }}
        </el-button>
      </template>
    </UniDataTable>

    <DetailDialog v-model:visible="detailVisible" :source="currentRecord" :config="detailConfig" />
  </section>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { useUniI18n } from 'uni-ui-lib'

import DetailDialog from './components/detail-dialog.vue'
import { useList } from './use-list'

import { attendanceWechatOpenidApi } from '@/api'

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
  onSelectionChange,
  picked,
  queryModel,
  refreshTable,
  reset,
  search,
  searchConfig,
  tableRef
} = useList()

const batchStatus = async (status: number) => {
  if (picked.value.length === 0) {
    ElMessage.warning(t('attendance.wechatOpenid.messages.needSelection'))
    return
  }
  const ids = picked.value.map((r) => r.id)
  try {
    await attendanceWechatOpenidApi.batchUpdateStatus.post(ids, status)
    ElMessage.success(t('attendance.wechatOpenid.messages.batchSuccess'))
    picked.value = []
    await refreshTable()
  } catch {
    /* request 层已提示 */
  }
}
</script>

<style scoped lang="scss"></style>
