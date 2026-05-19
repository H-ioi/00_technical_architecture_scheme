<template>
  <section class="uni-list-page">
    <div class="uni-list-page__header">
      <div>
        <h1>{{ $t('schoolBus.routeOperation.pageTitle') }}</h1>
        <p>{{ $t('schoolBus.routeOperation.pageDesc') }}</p>
      </div>
      <div class="uni-list-page__header-actions">
        <el-button v-uni-permission="'busoperation_export'" @click="exportData">
          {{ $t('schoolBus.export') }}
        </el-button>
        <el-button v-uni-permission="'busoperation_import'" @click="downloadImportTemplate">
          {{ $t('schoolBus.downloadTemplate') }}
        </el-button>
        <el-button v-uni-permission="'busoperation_import'" @click="fileRef?.click()">
          {{ $t('schoolBus.import') }}
        </el-button>
        <el-button v-uni-permission="'busoperation_add'" type="primary" @click="openForm('add')">
          {{ $t('schoolBus.add') }}
        </el-button>
      </div>
    </div>

    <input
      ref="fileRef"
      type="file"
      accept=".xlsx,.xls"
      class="school-bus-route-operation__file"
      @change="onImportFile" />

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
          v-uni-permission="'busoperation_del'"
          type="danger"
          :disabled="ids.length === 0"
          @click="del">
          {{ $t('schoolBus.delete') }}
        </el-button>
      </template>
      <template #empty>
        <ListTableEmpty :kind="tableEmpty.kind" @reset="reset" @retry="tableEmpty.retry" />
      </template>
    </UniDataTable>

    <OperationForm
      v-model:visible="formVisible"
      :mode="formMode"
      :source="activeRow"
      :default-school-id="defaultSchoolId"
      :school-records="schoolRecords"
      :line-source="lineSource"
      :station-source="stationSource"
      @saved="refreshTable" />

    <el-dialog v-model="detailVisible" width="900px" :title="$t('schoolBus.look')">
      <el-descriptions v-if="detailRecord" :column="2" border>
        <el-descriptions-item v-for="col in columns" :key="String(col.prop)" :label="col.label">
          {{ detailCellDisplay(detailRecord, col.prop) }}
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </section>
</template>

<script setup lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus'
import type { UniTableColumn, UniTableRequestResult } from 'uni-ui-lib'
import { UniDataTable, UniSearchForm, useUniI18n } from 'uni-ui-lib'
import { computed, ref } from 'vue'

import { schoolBusOperationApi } from '@/api'
import ListTableEmpty from '@/components/list-table-empty.vue'
import { useListTableEmpty } from '@/composables/use-list-table-empty'
import type { OperationRecord } from '@/types/modules/school-bus-operation'
import OperationForm from './components/form.vue'
import { detailCellDisplay, isSpreadsheetFilename } from '@/utils/school-bus'

import { useList } from './use-list'

const { t } = useUniI18n()
const fileRef = ref<HTMLInputElement | null>(null)

const {
  actions,
  columns,
  activeRow,
  defaultSchoolId,
  detailRecord,
  detailVisible,
  filters,
  formMode,
  formVisible,
  handleLoadSuccess,
  lineSource,
  loadData,
  multiSchool,
  openForm,
  queryModel,
  refreshTable,
  reset,
  schoolRecords,
  search,
  searchCfg,
  stationSource,
  tableRef
} = useList()

const tableEmpty = useListTableEmpty(filters, { tableRef, afterLoadSuccess: handleLoadSuccess })

const selection = ref<OperationRecord[]>([])
const ids = computed(() => selection.value.map((item) => item.id))

const onSelectionChange = (rows: OperationRecord[]) => {
  selection.value = rows
}

const IMPORT_MAX_BYTES = 10 * 1024 * 1024

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
    await schoolBusOperationApi.import.post(file)
    ElMessage.success(t('schoolBus.importSuccess'))
    void refreshTable()
  } catch {
    /* request 层已提示 */
  }
}

const downloadImportTemplate = async () => {
  await schoolBusOperationApi.template.download()
}

const exportData = async () => {
  const raw: Record<string, unknown> = { ...filters.value }

  if (!multiSchool.value && defaultSchoolId.value != null && raw.schoolIds == null) {
    raw.schoolIds = defaultSchoolId.value
  }

  delete raw.size
  delete raw.current

  try {
    const blob = await schoolBusOperationApi.export.get(raw)
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'operation-export.xlsx'
    link.click()
    URL.revokeObjectURL(url)
    ElMessage.success(t('schoolBus.exportSuccess'))
  } catch {
    /* request 层已提示 */
  }
}

const del = async () => {
  if (ids.value.length === 0) {
    return
  }

  try {
    await ElMessageBox.confirm(
      t('schoolBus.routeOperation.msgConfirmDelete'),
      t('schoolBus.delete'),
      {
        confirmButtonText: t('schoolBus.submit'),
        cancelButtonText: t('schoolBus.cancel'),
        type: 'warning'
      }
    )
  } catch {
    return
  }

  await schoolBusOperationApi.delete.delete(ids.value)
  ElMessage.success(t('schoolBus.deleteSuccess'))
  selection.value = []
  void refreshTable()
}
</script>

<style scoped lang="scss">
.school-bus-route-operation {
  &__file {
    position: absolute;
    width: 0;
    height: 0;
    opacity: 0;
    pointer-events: none;
  }
}
</style>
