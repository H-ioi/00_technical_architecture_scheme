<template>
  <section class="uni-list-page">
    <div class="uni-list-page__header">
      <div>
        <h1>{{ $t('schoolBus.routeOperation.page.title') }}</h1>
        <p>{{ $t('schoolBus.routeOperation.page.description') }}</p>
      </div>
      <div class="uni-list-page__header-actions">
        <el-button v-uni-permission="'busoperation_export'" @click="exportData">
          {{ $t('schoolBus.driver.actions.export') }}
        </el-button>
        <el-button v-uni-permission="'busoperation_import'" @click="downloadImportTemplate">
          {{ $t('schoolBus.driver.actions.downloadTemplate') }}
        </el-button>
        <el-button v-uni-permission="'busoperation_import'" @click="pickImport">
          {{ $t('schoolBus.driver.actions.import') }}
        </el-button>
        <el-button v-uni-permission="'busoperation_add'" type="primary" @click="openForm('add')">
          {{ $t('schoolBus.driver.actions.add') }}
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
      :submit-text="$t('schoolBus.driver.actions.search')"
      :reset-text="$t('schoolBus.driver.actions.reset')"
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
      :action-column="{ width: 160, fixed: 'right' }"
      @selection-change="onSelectionChange"
      @load-success="handleLoadSuccess">
      <template #toolbar>
        <el-button
          v-uni-permission="'busoperation_del'"
          type="danger"
          :disabled="ids.length === 0"
          @click="del">
          {{ $t('schoolBus.driver.actions.delete') }}
        </el-button>
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
      @saved="reload" />

    <el-dialog v-model="detailVisible" width="900px" :title="$t('schoolBus.driver.actions.look')">
      <el-descriptions v-if="detailRecord" :column="2" border>
        <el-descriptions-item v-for="col in columns" :key="String(col.prop)" :label="col.label">
          {{ detailRowText(col.prop) }}
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </section>
</template>

<script setup lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus'
import type { UniTableColumn } from 'uni-ui-lib'
import { UniDataTable, UniSearchForm, useUniI18n } from 'uni-ui-lib'
import { computed, ref } from 'vue'

import OperationForm from './components/form.vue'
import { useList } from './use-list'

import { schoolBusOperationApi } from '@/api'
import type { OperationRecord } from '@/types/modules/school-bus-operation'

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
  reset,
  schoolRecords,
  search,
  searchCfg,
  stationSource,
  tableRef
} = useList()

const selection = ref<OperationRecord[]>([])
const ids = computed(() => selection.value.map((item) => item.id))

const onSelectionChange = (rows: OperationRecord[]) => {
  selection.value = rows
}

const reload = () => {
  tableRef.value?.refresh()
}

const detailRowText = (prop: UniTableColumn['prop']) => {
  if (!detailRecord.value || prop == null) {
    return ''
  }

  const val = (detailRecord.value as Record<string, unknown>)[String(prop)]

  return val == null || val === '' ? '--' : String(val)
}

const pickImport = () => {
  fileRef.value?.click()
}

const IMPORT_MAX_BYTES = 10 * 1024 * 1024

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
    await schoolBusOperationApi.import.post(file)
    ElMessage.success(t('schoolBus.driver.messages.importSuccess'))
    reload()
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
    ElMessage.success(t('schoolBus.routeOperation.messages.exportSuccess'))
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
      t('schoolBus.routeOperation.messages.confirmDelete'),
      t('schoolBus.driver.actions.delete'),
      {
        confirmButtonText: t('schoolBus.driver.actions.submit'),
        cancelButtonText: t('schoolBus.driver.actions.cancel'),
        type: 'warning'
      }
    )
  } catch {
    return
  }

  await schoolBusOperationApi.delete.delete(ids.value)
  ElMessage.success(t('schoolBus.driver.messages.deleteSuccess'))
  selection.value = []
  reload()
}
</script>

<style scoped lang="scss">
.school-bus-route-operation__file {
  position: absolute;
  width: 0;
  height: 0;
  opacity: 0;
  pointer-events: none;
}
</style>
