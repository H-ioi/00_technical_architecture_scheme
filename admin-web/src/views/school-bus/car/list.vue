<template>
  <section class="uni-list-page">
    <div class="uni-list-page__header">
      <div>
        <h1>{{ $t('schoolBus.car.page.title') }}</h1>
        <p>{{ $t('schoolBus.car.page.description') }}</p>
      </div>
      <div class="school-bus-car-page__actions">
        <el-button v-uni-permission="'buscarinfo_download'" @click="downloadTemplate">
          {{ $t('schoolBus.driver.actions.downloadTemplate') }}
        </el-button>
        <el-button v-uni-permission="'buscarinfo_import'" @click="pickImport">
          {{ $t('schoolBus.driver.actions.import') }}
        </el-button>
        <el-button v-uni-permission="'buscarinfo_add'" type="primary" @click="openForm('add')">
          {{ $t('schoolBus.driver.actions.add') }}
        </el-button>
      </div>
    </div>

    <input
      ref="fileRef"
      type="file"
      accept=".xlsx,.xls"
      class="school-bus-car-page__file"
      @change="onImportFile" />

    <UniSearchForm
      v-model="queryModel"
      :config="searchConfig"
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
      :action-column="{ width: 140, fixed: 'right' }"
      @selection-change="onSelectionChange"
      @load-success="handleLoadSuccess">
      <template #toolbar>
        <el-button
          v-uni-permission="'buscarinfo_del'"
          type="danger"
          :disabled="ids.length === 0"
          @click="del">
          {{ $t('schoolBus.driver.actions.delete') }}
        </el-button>
      </template>
    </UniDataTable>

    <CarForm
      v-model:visible="formVisible"
      :mode="formMode"
      :source="currentRecord"
      :default-school-id="defaultSchoolId"
      :school-options="schoolOptions"
      :status-options="statusOptions"
      :multi-school="multiSchool"
      @saved="reload" />
  </section>
</template>

<script setup lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUniI18n } from 'uni-ui-lib'
import { computed, ref } from 'vue'

import CarForm from './components/form.vue'
import { useList } from './use-list'

import { schoolBusCarApi } from '@/api'
import type { CarRecord } from '@/types/modules/school-bus-car'

const { t } = useUniI18n()
const fileRef = ref<HTMLInputElement | null>(null)

const {
  actions,
  columns,
  currentRecord,
  defaultSchoolId,
  filters,
  formMode,
  formVisible,
  handleLoadSuccess,
  loadData,
  multiSchool,
  openForm,
  queryModel,
  reset,
  schoolOptions,
  search,
  searchConfig,
  statusOptions,
  tableRef
} = useList()

const IMPORT_MAX_BYTES = 10 * 1024 * 1024
const picked = ref<CarRecord[]>([])
const ids = computed(() => picked.value.map((r) => r.id))

const reload = () => tableRef.value?.refresh()

const onSelectionChange = (rows: CarRecord[]) => {
  picked.value = rows
}

const downloadTemplate = async () => {
  try {
    await schoolBusCarApi.template.download()
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
    await schoolBusCarApi.import.post(file)
    ElMessage.success(t('schoolBus.driver.messages.importSuccess'))
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
      t('schoolBus.car.messages.confirmDelete'),
      t('schoolBus.driver.actions.delete'),
      {
        type: 'warning'
      }
    )
  } catch {
    return
  }
  try {
    await schoolBusCarApi.delete.delete(ids.value)
    ElMessage.success(t('schoolBus.driver.messages.deleteSuccess'))
    picked.value = []
    reload()
  } catch {
    /* request 层已提示 */
  }
}
</script>

<style scoped lang="scss">
.school-bus-car-page__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.school-bus-car-page__file {
  position: absolute;
  width: 0;
  height: 0;
  opacity: 0;
  pointer-events: none;
}
</style>
