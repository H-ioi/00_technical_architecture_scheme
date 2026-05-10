<template>
  <section class="uni-list-page">
    <div class="uni-list-page__header">
      <div>
        <h1>{{ $t('schoolBus.driver.page.title') }}</h1>
        <p>{{ $t('schoolBus.driver.page.description') }}</p>
      </div>
      <div class="school-bus-driver-page__header-actions">
        <el-button v-uni-permission="'busdriver_import'" @click="downloadImportTemplate">
          {{ $t('schoolBus.driver.actions.downloadTemplate') }}
        </el-button>
        <el-button v-uni-permission="'busdriver_import'" @click="pickImport">
          {{ $t('schoolBus.driver.actions.import') }}
        </el-button>
        <el-button v-uni-permission="'busdriver_add'" type="primary" @click="openForm('add')">
          {{ $t('schoolBus.driver.actions.add') }}
        </el-button>
      </div>
    </div>

    <input
      ref="fileRef"
      type="file"
      accept=".xlsx,.xls"
      class="school-bus-driver-page__file"
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
      :value-enums="valueEnums"
      :actions="actions"
      :action-column="{ width: 100, fixed: 'right' }"
      @selection-change="onSelectionChange"
      @load-success="handleLoadSuccess"
    >
      <template #toolbar>
        <el-button
          v-uni-permission="'busdriver_del'"
          type="danger"
          :disabled="ids.length === 0"
          @click="del"
        >
          {{ $t('schoolBus.driver.actions.delete') }}
        </el-button>
      </template>
    </UniDataTable>

    <DriverForm
      v-model:visible="formVisible"
      :mode="formMode"
      :source="currentRecord"
      :school-options="schoolOptions"
      :status-options="statusOptions"
      @saved="reload"
    />
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
  currentRecord,
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
  searchConfig,
  statusOptions,
  tableRef,
  valueEnums
} = useList()

const picked = ref<DriverRow[]>([])
const ids = computed(() => picked.value.map((item) => item.id))

const onSelectionChange = (rows: DriverRow[]) => {
  picked.value = rows
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

  try {
    await schoolBusDriverApi.import.post(file)
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

  await ElMessageBox.confirm(
    t('schoolBus.driver.messages.confirmDelete'),
    t('schoolBus.driver.actions.delete'),
    {
      confirmButtonText: t('schoolBus.driver.actions.submit'),
      cancelButtonText: t('schoolBus.driver.actions.cancel'),
      type: 'warning'
    }
  )

  await schoolBusDriverApi.delete.delete(ids.value)
  ElMessage.success(t('schoolBus.driver.messages.deleteSuccess'))
  picked.value = []
  reload()
}
</script>

<style scoped lang="scss">
.school-bus-driver-page__header-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.school-bus-driver-page__file {
  position: absolute;
  width: 0;
  height: 0;
  opacity: 0;
  pointer-events: none;
}
</style>
