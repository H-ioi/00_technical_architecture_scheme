<template>
  <section class="uni-list-page">
    <div class="uni-list-page__header">
      <div>
        <h1>{{ $t('schoolBus.studentOrder.page.title') }}</h1>
        <p>{{ $t('schoolBus.studentOrder.page.description') }}</p>
      </div>
      <div class="school-bus-student-order__actions">
        <el-button v-uni-permission="'busorder_export_order'" @click="exportData">
          {{ $t('schoolBus.driver.actions.export') }}
        </el-button>
        <el-button v-uni-permission="'busorder_import_order'" @click="downloadOrderTemplate">
          {{ $t('schoolBus.driver.actions.downloadTemplate') }}
        </el-button>
        <el-button v-uni-permission="'busorder_import_order'" @click="pickImport">
          {{ $t('schoolBus.driver.actions.import') }}
        </el-button>
        <el-button v-uni-permission="'busorder_add'" type="primary" @click="openFormAdd">
          {{ $t('schoolBus.driver.actions.add') }}
        </el-button>
      </div>
    </div>

    <input
      ref="fileRef"
      type="file"
      accept=".xlsx,.xls"
      class="school-bus-student-order__file"
      @change="onImportFile"
    >

    <UniSearchForm
      v-model="queryModel"
      :config="searchConfig"
      :collapsed="true"
      :collapsed-rows="1"
      :action-min-span="0"
      :submit-text="$t('schoolBus.driver.actions.search')"
      :reset-text="$t('schoolBus.driver.actions.reset')"
      @search="search"
      @reset="reset"
    />

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
      :action-column="{ width: 150, fixed: 'right' }"
      @selection-change="onSelectionChange"
      @load-success="handleLoadSuccess"
    >
      <template #toolbar>
        <el-button
          v-uni-permission="'busorder_del'"
          type="danger"
          :disabled="picked.length === 0"
          @click="del"
        >
          {{ $t('schoolBus.driver.actions.delete') }}
        </el-button>
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
      @saved="reload"
    />
  </section>
</template>

<script setup lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUniI18n } from 'uni-ui-lib'
import { computed, ref } from 'vue'

import OrderDetailDialog from '../components/order-detail-dialog.vue'
import BusOrderFormDialog from '../components/bus-order-form-dialog.vue'
import { useOrderList } from './use-list'

import { schoolBusOrderApi } from '@/api'
import type { BusOrderRecord } from '@/types/modules/school-bus-order'
import { downloadBlob } from '@/utils/download'

const { t } = useUniI18n()
const {
  actions,
  closeDetail,
  columns,
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
  reset,
  schoolOptions,
  search,
  searchConfig,
  tableRef
} = useOrderList()

const fileRef = ref<HTMLInputElement | null>(null)
const picked = ref<BusOrderRecord[]>([])
const IMPORT_MAX_BYTES = 10 * 1024 * 1024

const selectionIds = computed(() => picked.value.map((r) => r.id))

const reload = () => tableRef.value?.refresh()

const onSelectionChange = (rows: BusOrderRecord[]) => {
  picked.value = rows
}

const downloadOrderTemplate = async () => {
  try {
    await schoolBusOrderApi.downloadOrder.download()
  } catch {
    /* request 层已提示 */
  }
}

const pickImport = () => fileRef.value?.click()

const isSpreadsheetFilename = (name: string) => {
  const lower = name.toLowerCase()
  return lower.endsWith('.xls') || lower.endsWith('.xlsx')
}

const onImportFile = async (e: Event) => {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''
  if (!file) {
    return
  }
  if (!isSpreadsheetFilename(file.name)) {
    ElMessage.warning(t('schoolBus.driver.messages.importInvalidType'))
    return
  }
  if (file.size > IMPORT_MAX_BYTES) {
    ElMessage.warning(t('schoolBus.driver.messages.importTooLarge'))
    return
  }
  try {
    await schoolBusOrderApi.importOrder.post(file)
    ElMessage.success(t('schoolBus.driver.messages.importSuccess'))
    reload()
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
    ElMessage.success(t('schoolBus.studentOrder.messages.exportSuccess'))
  } catch {
    /* request 层已提示 */
  }
}

const del = async () => {
  if (picked.value.length === 0) {
    return
  }
  try {
    await ElMessageBox.confirm(
      t('schoolBus.studentOrder.messages.confirmDelete'),
      t('schoolBus.driver.actions.delete'),
      { type: 'warning' }
    )
  } catch {
    return
  }
  try {
    await schoolBusOrderApi.delOrder.delete(selectionIds.value)
    ElMessage.success(t('schoolBus.studentApply.messages.success'))
    picked.value = []
    reload()
  } catch {
    /* request 层已提示 */
  }
}
</script>

<style scoped lang="scss">
.school-bus-student-order__actions {
  display: flex;
  flex-wrap: wrap;
}

.school-bus-student-order__file {
  position: absolute;
  width: 0;
  height: 0;
  opacity: 0;
  pointer-events: none;
}
</style>
