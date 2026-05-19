<template>
  <section class="uni-list-page">
    <div class="uni-list-page__header">
      <div>
        <h1>{{ $t('schoolBus.studentOrder.pageTitle') }}</h1>
        <p>{{ $t('schoolBus.studentOrder.pageDesc') }}</p>
      </div>
      <div class="uni-list-page__header-actions">
        <el-button v-uni-permission="'busorder_export_order'" @click="exportData">
          {{ $t('schoolBus.export') }}
        </el-button>
        <el-button v-uni-permission="'busorder_import_order'" @click="downloadOrderTemplate">
          {{ $t('schoolBus.downloadTemplate') }}
        </el-button>
        <el-button v-uni-permission="'busorder_import_order'" @click="fileRef?.click()">
          {{ $t('schoolBus.import') }}
        </el-button>
        <el-button v-uni-permission="'busorder_add'" type="primary" @click="openFormAdd">
          {{ $t('schoolBus.add') }}
        </el-button>
      </div>
    </div>

    <input
      ref="fileRef"
      type="file"
      accept=".xlsx,.xls"
      class="school-bus-student-order__file"
      @change="onImportFile" />

    <el-alert
      v-if="commonDataError"
      class="school-bus-student-order__cascade-alert"
      type="warning"
      :closable="false"
      show-icon>
      <template #default>
        <span>{{ $t('schoolBus.cascadeOptionsLoadFail') }}</span>
        <el-button type="primary" link @click="reloadCommonData">{{
          $t('common.retry')
        }}</el-button>
      </template>
    </el-alert>

    <UniSearchForm
      v-model="queryModel"
      :config="searchCfg"
      :collapsed="true"
      :collapsed-rows="1"
      :action-min-span="0"
      :submit-text="$t('schoolBus.search')"
      :reset-text="$t('schoolBus.reset')"
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
      :action-column="{ width: 110, fixed: 'right' }"
      @selection-change="onSelectionChange"
      @load-success="tableEmpty.onLoadSuccess"
      @request-error="tableEmpty.onRequestError">
      <template #toolbar>
        <el-button
          v-uni-permission="'busorder_del'"
          type="danger"
          :disabled="selection.length === 0"
          @click="del">
          {{ $t('schoolBus.delete') }}
        </el-button>
      </template>
      <template #empty>
        <ListTableEmpty :kind="tableEmpty.kind" @reset="reset" @retry="tableEmpty.retry" />
      </template>
    </UniDataTable>

    <OrderDetailDialog :visible="detailVisible" :order-id="detailOrderId" @close="closeDetail" />

    <BusOrderFormDialog
      v-model:visible="formVisible"
      :mode="formMode"
      :order-id="editingOrderId"
      form-type="order"
      :school-options="schoolOptions"
      :default-school-id="defaultSingleSchoolId"
      :multi-school="multiSchool"
      @saved="refreshTable" />
  </section>
</template>

<script setup lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUniI18n } from 'uni-ui-lib'
import { computed, ref } from 'vue'

import { schoolBusOrderApi } from '@/api'
import ListTableEmpty from '@/components/list-table-empty.vue'
import { useListTableEmpty } from '@/composables/use-list-table-empty'
import type { BusOrderRecord } from '@/types/modules/school-bus-order'
import { downloadBlob } from '@/utils/download'
import BusOrderFormDialog from '../components/bus-order-form-dialog.vue'
import OrderDetailDialog from '../components/order-detail-dialog.vue'
import { isSpreadsheetFilename } from '@/utils/school-bus'

import { useOrderList } from './use-list'

const { t } = useUniI18n()
const {
  actions,
  closeDetail,
  columns,
  commonDataError,
  defaultSingleSchoolId,
  detailOrderId,
  detailVisible,
  editingOrderId,
  filters,
  formMode,
  formVisible,
  handleLoadSuccess,
  loadData,
  multiSchool,
  openFormAdd,
  queryModel,
  reloadCommonData,
  reset,
  schoolOptions,
  search,
  searchCfg,
  tableRef
} = useOrderList()

const tableEmpty = useListTableEmpty(filters, { tableRef, afterLoadSuccess: handleLoadSuccess })

const fileRef = ref<HTMLInputElement | null>(null)
const selection = ref<BusOrderRecord[]>([])
const IMPORT_MAX_BYTES = 10 * 1024 * 1024

const selectionIds = computed(() => selection.value.map((r) => r.id))

const onSelectionChange = (rows: BusOrderRecord[]) => {
  selection.value = rows
}

const downloadOrderTemplate = async () => {
  try {
    await schoolBusOrderApi.downloadOrder.download()
  } catch {
    /* request 层已提示 */
  }
}

const onImportFile = async (e: Event) => {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''
  if (!file) {
    return
  }
  if (!isSpreadsheetFilename(file.name)) {
    ElMessage.warning(t('schoolBus.importInvalidType'))
    return
  }
  if (file.size > IMPORT_MAX_BYTES) {
    ElMessage.warning(t('schoolBus.importTooLarge'))
    return
  }
  try {
    await schoolBusOrderApi.importOrder.post(file)
    ElMessage.success(t('schoolBus.importSuccess'))
    void refreshTable()
  } catch {
    /* request 层已提示 */
  }
}

const exportData = async () => {
  const raw: Record<string, unknown> = { ...filters.value }
  delete raw.size
  delete raw.current
  try {
    const blob = await schoolBusOrderApi.exportOrder.get(raw)
    downloadBlob(blob, 'bus-order-export.xlsx')
    ElMessage.success(t('schoolBus.exportSuccess'))
  } catch {
    /* request 层已提示 */
  }
}

const del = async () => {
  if (selection.value.length === 0) {
    return
  }
  try {
    await ElMessageBox.confirm(t('schoolBus.confirmDeleteRows'), t('schoolBus.delete'), {
      type: 'warning'
    })
  } catch {
    return
  }
  try {
    await schoolBusOrderApi.delOrder.delete(selectionIds.value)
    ElMessage.success(t('schoolBus.operationSuccess'))
    selection.value = []
    void refreshTable()
  } catch {
    /* request 层已提示 */
  }
}
</script>

<style scoped lang="scss">
.school-bus-student-order {
  &__cascade-alert {
    margin-bottom: 12px;
  }

  &__file {
    position: absolute;
    width: 0;
    height: 0;
    opacity: 0;
    pointer-events: none;
  }
}
</style>
