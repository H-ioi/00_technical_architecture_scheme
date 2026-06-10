<template>
  <section class="uni-list-page">
    <div class="uni-list-page__header">
      <div>
        <h1>{{ $t('schoolDoctor.infectiousDisease.pageTitle') }}</h1>
        <p>{{ $t('schoolDoctor.infectiousDisease.pageDesc') }}</p>
      </div>
      <div class="uni-list-page__header-actions">
        <el-upload
          ref="uploadRef"
          action="#"
          :show-file-list="false"
          :auto-upload="false"
          accept=".xlsx,.xls"
          :on-change="onImportFile">
          <el-button :loading="importing">{{ $t('schoolDoctor.common.import') }}</el-button>
        </el-upload>
        <el-button @click="handleExport">{{ $t('schoolDoctor.common.export') }}</el-button>
        <el-button type="primary" @click="openDrawer('add')">
          {{ $t('schoolDoctor.common.add') }}
        </el-button>
      </div>
    </div>

    <UniSearchForm
      v-model="queryModel"
      :config="searchCfg"
      :collapsed="true"
      :collapsed-rows="1"
      :action-min-span="0"
      :submit-text="$t('schoolDoctor.common.search')"
      :reset-text="$t('schoolDoctor.common.reset')"
      @search="search"
      @reset="onReset" />

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
      :action-column="{ width: 120, fixed: 'right' }"
      @selection-change="onSelectionChange"
      @load-success="tableEmpty.onLoadSuccess"
      @request-error="tableEmpty.onRequestError">
      <template #toolbar>
        <el-button type="danger" :disabled="selectedIds.length === 0" @click="batchDelete">
          {{ $t('schoolDoctor.infectiousDisease.batchDelete') }}
        </el-button>
      </template>
      <template #empty>
        <ListTableEmpty :kind="tableEmpty.kind" @reset="onReset" @retry="tableEmpty.retry" />
      </template>
    </UniDataTable>

    <FormDrawer
      v-model:visible="drawerVisible"
      :mode="drawerMode"
      :record-id="activeRecordId"
      :school-records="schoolRecords"
      @saved="refreshTable" />
  </section>
</template>

<script setup lang="ts">
import type { UploadFile, UploadInstance } from 'element-plus'
import type { UniTableAction, UniTableRequest } from 'uni-ui-lib'
import { UniDataTable, UniSearchForm, useUniI18n, useUniListState } from 'uni-ui-lib'
import { ElMessage, ElMessageBox } from 'element-plus'
import { computed, nextTick, onMounted, ref } from 'vue'

import { membershipApi, schoolDoctorInfectiousDiseaseApi } from '@/api'
import ListTableEmpty from '@/components/list-table-empty/index.vue'
import { useListTableEmpty } from '@/composables/use-list-table-empty'
import type { InfectiousDiseaseListRow, InfectiousDiseasePageParams } from '@/types/modules/school-doctor-infectious-disease'
import type { SchoolOptionRecord } from '@/types/modules/membership'
import { downloadBlob } from '@/utils/download'
import { normalizePaged } from '@/utils/api-response-normalize'

import FormDrawer from './components/form-drawer.vue'
import { searchForm, statusOpts, tableCols } from './list.config'

type Row = InfectiousDiseaseListRow & { statusText?: string }

const { t } = useUniI18n()

const initialFilters = {
  status: undefined as number | undefined,
  keyword: undefined as string | undefined,
  discoveryDateRange: undefined as [string, string] | undefined
}

const { queryModel, filters, tableRef, search, reset, handleLoadSuccess, refreshTable } =
  useUniListState({ initialFilters })

const schoolRecords = ref<SchoolOptionRecord[]>([])
const selectedIds = ref<Array<string | number>>([])
const drawerVisible = ref(false)
const drawerMode = ref<'add' | 'view' | 'edit'>('view')
const activeRecordId = ref<string | number | undefined>()
const importing = ref(false)
const uploadRef = ref<UploadInstance | null>(null)

const searchCfg = computed(() => searchForm(t, statusOpts(t)))
const columns = computed(() => tableCols(t))

function buildPageParams(fv: typeof initialFilters, pageNo: number, pageSize: number): InfectiousDiseasePageParams {
  const params: InfectiousDiseasePageParams = {
    current: pageNo,
    size: pageSize,
    status: fv.status,
    keyword: fv.keyword
  }
  if (fv.discoveryDateRange?.length === 2) {
    params.discoveryDateStart = fv.discoveryDateRange[0]
    params.discoveryDateEnd = fv.discoveryDateRange[1]
  }
  return params
}

function formatRow(row: InfectiousDiseaseListRow): Row {
  const statusMap: Record<number, string> = {
    1: t('schoolDoctor.infectiousDisease.statusRecovered'),
    2: t('schoolDoctor.infectiousDisease.statusSickLeave')
  }
  return {
    ...row,
    admissionNo: row.admissionNo || row.admissonNo || '',
    fullName: row.fullName || row.studentName || row.cnFullName || '',
    grade: row.grade || row.gradeName || '',
    formCode: row.formCode || row.className || '',
    statusText: statusMap[Number(row.status)] || '--'
  }
}

const loadData: UniTableRequest = async ({ pageNo, pageSize, filters: f }) => {
  const fv = f as typeof initialFilters
  const result = await schoolDoctorInfectiousDiseaseApi.page.get(buildPageParams(fv, pageNo, pageSize))
  const { list, total } = normalizePaged<InfectiousDiseaseListRow>(result)
  return { data: list.map((row) => formatRow(row)), total }
}

const onSelectionChange = (rows: Row[]) => {
  selectedIds.value = rows.map((row) => row.id).filter((id) => id != null) as Array<string | number>
}

const onReset = () => {
  reset()
  selectedIds.value = []
  void nextTick(() => search())
}

function openDrawer(mode: 'add' | 'view' | 'edit', row?: Row) {
  drawerMode.value = mode
  activeRecordId.value = mode === 'add' ? undefined : row?.id
  drawerVisible.value = true
}

async function batchDelete() {
  if (selectedIds.value.length === 0) {
    return
  }
  try {
    await ElMessageBox.confirm(
      t('schoolDoctor.infectiousDisease.confirmBatchDelete'),
      t('schoolDoctor.common.confirmTitle'),
      { type: 'warning' }
    )
  } catch {
    return
  }
  await schoolDoctorInfectiousDiseaseApi.deleteBatch.delete(selectedIds.value.join(','))
  ElMessage.success(t('schoolDoctor.common.deleteSuccess'))
  selectedIds.value = []
  void refreshTable()
}

async function onImportFile(file: UploadFile) {
  if (!file.raw) {
    return
  }
  importing.value = true
  try {
    await schoolDoctorInfectiousDiseaseApi.import.post(file.raw)
    ElMessage.success(t('schoolDoctor.common.importSuccess'))
    void refreshTable()
  } catch {
    ElMessage.error(t('schoolDoctor.common.importFailed'))
  } finally {
    importing.value = false
    uploadRef.value?.clearFiles()
  }
}

async function handleExport() {
  try {
    await ElMessageBox.confirm(
      t('schoolDoctor.infectiousDisease.confirmExport'),
      t('schoolDoctor.common.confirmTitle'),
      { type: 'warning' }
    )
  } catch {
    return
  }
  const fv = filters.value as typeof initialFilters
  const blob = await schoolDoctorInfectiousDiseaseApi.export.get(buildPageParams(fv, 1, 10000))
  downloadBlob(blob, t('schoolDoctor.infectiousDisease.exportFileName'))
  ElMessage.success(t('schoolDoctor.common.exportSuccess'))
}

const actions = computed<UniTableAction[]>(() => [
  {
    label: t('schoolDoctor.studentRecord.view'),
    onClick: (row) => openDrawer('view', row as Row)
  },
  {
    label: t('schoolDoctor.studentRecord.edit'),
    onClick: (row) => openDrawer('edit', row as Row)
  }
])

const tableEmpty = useListTableEmpty(filters, {
  tableRef,
  afterLoadSuccess: handleLoadSuccess
})

onMounted(async () => {
  schoolRecords.value = await membershipApi.school.get()
  await nextTick(() => tableRef.value?.refresh())
})
</script>
