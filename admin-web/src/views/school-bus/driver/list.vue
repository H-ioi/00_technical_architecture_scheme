<template>
  <section class="uni-list-page">
    <div class="uni-list-page__header">
      <div>
        <h1>{{ $t('schoolBus.driver.pageTitle') }}</h1>
        <p>{{ $t('schoolBus.driver.pageDesc') }}</p>
      </div>
      <div class="uni-list-page__header-actions">
        <el-button v-uni-permission="'busdriver_download'" @click="downloadImportTemplate">
          {{ $t('schoolBus.downloadTemplate') }}
        </el-button>
        <el-button v-uni-permission="'busdriver_import'" @click="pickImport">
          {{ $t('schoolBus.import') }}
        </el-button>
        <el-button v-uni-permission="'busdriver_add'" type="primary" @click="openForm('add')">
          {{ $t('schoolBus.add') }}
        </el-button>
      </div>
    </div>

    <input
      ref="fileRef"
      type="file"
      accept=".xlsx,.xls"
      class="school-bus-driver-page__file"
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
      :action-column="{ width: 160, fixed: 'right' }"
      @selection-change="onSelectionChange"
      @load-success="handleLoadSuccess">
      <template #toolbar>
        <el-button
          v-uni-permission="'busdriver_del'"
          type="danger"
          :disabled="ids.length === 0"
          @click="del">
          {{ $t('schoolBus.delete') }}
        </el-button>
      </template>
    </UniDataTable>

    <DriverForm
      v-model:visible="formVisible"
      :mode="formMode"
      :source="activeRow"
      :default-school-id="defaultSchoolId"
      :school-options="schoolOptions"
      :status-options="statusOptions"
      @saved="reload" />
  </section>
</template>

<script setup lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUniI18n } from 'uni-ui-lib'
import { computed, ref } from 'vue'

import DriverForm from './components/form.vue'
import { useList } from './use-list'

import { schoolBusDriverApi } from '@/api'
import type { DriverRecord as DriverRow } from '@/types/modules/school-bus-driver'

const { t } = useUniI18n()
const fileRef = ref<HTMLInputElement | null>(null)
const {
  actions,
  columns,
  activeRow,
  defaultSchoolId,
  downloadImportTemplate,
  filters,
  formMode,
  formVisible,
  handleLoadSuccess,
  loadData,
  openForm,
  queryModel,
  reset,
  schoolOptions,
  search,
  searchCfg,
  statusOptions,
  tableRef
} = useList()

const IMPORT_MAX_BYTES = 10 * 1024 * 1024

const isSpreadsheetFilename = (name: string) => {
  const lower = name.toLowerCase()
  return lower.endsWith('.xls') || lower.endsWith('.xlsx')
}

const selection = ref<DriverRow[]>([])
const ids = computed(() => selection.value.map((item) => item.id))

const onSelectionChange = (rows: DriverRow[]) => {
  selection.value = rows
}

const reload = () => {
  tableRef.value?.refresh()
}

const pickImport = () => {
  fileRef.value?.click()
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
    await schoolBusDriverApi.import.post(file)
    ElMessage.success(t('schoolBus.importSuccess'))
    reload()
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
      t('schoolBus.confirmDeleteDriver'),
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

  await schoolBusDriverApi.delete.delete(ids.value)
  ElMessage.success(t('schoolBus.deleteSuccess'))
  selection.value = []
  reload()
}
</script>

<style scoped lang="scss">
.school-bus-driver-page__file {
  position: absolute;
  width: 0;
  height: 0;
  opacity: 0;
  pointer-events: none;
}
</style>
