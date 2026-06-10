<template>
  <section class="uni-list-page">
    <div class="uni-list-page__header">
      <div>
        <h1>{{ $t('schoolDoctor.diseaseSetting.pageTitle') }}</h1>
        <p>{{ $t('schoolDoctor.diseaseSetting.pageDesc') }}</p>
      </div>
      <div class="uni-list-page__header-actions">
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
          {{ $t('schoolDoctor.diseaseSetting.batchDelete') }}
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
      @saved="refreshTable" />
  </section>
</template>

<script setup lang="ts">
import type { UniTableAction, UniTableRequest } from 'uni-ui-lib'
import { UniDataTable, UniSearchForm, useUniI18n, useUniListState } from 'uni-ui-lib'
import { ElMessage, ElMessageBox } from 'element-plus'
import { computed, nextTick, onMounted, ref } from 'vue'

import { schoolDoctorDiseaseSettingApi } from '@/api'
import ListTableEmpty from '@/components/list-table-empty/index.vue'
import { useListTableEmpty } from '@/composables/use-list-table-empty'
import type { SchoolDoctorDiseaseSettingListRow } from '@/types/modules/school-doctor-disease-setting'
import { normalizePaged } from '@/utils/api-response-normalize'

import FormDrawer from './components/form-drawer.vue'
import { searchForm, statusOpts, tableCols, typeOpts } from './list.config'

type Row = SchoolDoctorDiseaseSettingListRow & {
  typeText?: string
  statusText?: string
}

const { t } = useUniI18n()

const initialFilters = {
  type: undefined as number | undefined,
  status: undefined as number | undefined,
  keyword: undefined as string | undefined
}

const { queryModel, filters, tableRef, search, reset, handleLoadSuccess, refreshTable } =
  useUniListState({ initialFilters })

const selectedIds = ref<Array<string | number>>([])
const drawerVisible = ref(false)
const drawerMode = ref<'add' | 'view' | 'edit'>('view')
const activeRecordId = ref<string | number | undefined>()

const searchCfg = computed(() => searchForm(t, typeOpts(t), statusOpts(t)))
const columns = computed(() => tableCols(t))

function formatRow(row: SchoolDoctorDiseaseSettingListRow): Row {
  const typeMap: Record<number, string> = {
    1: t('schoolDoctor.diseaseSetting.typeDisease'),
    2: t('schoolDoctor.diseaseSetting.typeSymptom')
  }
  const statusMap: Record<number, string> = {
    1: t('schoolDoctor.diseaseSetting.statusEnabled'),
    0: t('schoolDoctor.diseaseSetting.statusDisabled')
  }
  return {
    ...row,
    cnName: row.cnName || row.name || '--',
    enName: row.enName || '--',
    typeText: typeMap[Number(row.type)] || '--',
    statusText: statusMap[Number(row.status)] || '--'
  }
}

const loadData: UniTableRequest = async ({ pageNo, pageSize, filters: f }) => {
  const fv = f as typeof initialFilters
  const result = await schoolDoctorDiseaseSettingApi.page.get({
    current: pageNo,
    size: pageSize,
    type: fv.type,
    status: fv.status,
    keyword: fv.keyword
  })
  const { list, total } = normalizePaged<SchoolDoctorDiseaseSettingListRow>(result)
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
      t('schoolDoctor.diseaseSetting.confirmBatchDelete'),
      t('schoolDoctor.common.confirmTitle'),
      { type: 'warning' }
    )
  } catch {
    return
  }
  await schoolDoctorDiseaseSettingApi.deleteBatch.delete(selectedIds.value.join(','))
  ElMessage.success(t('schoolDoctor.common.deleteSuccess'))
  selectedIds.value = []
  void refreshTable()
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
  await nextTick(() => tableRef.value?.refresh())
})
</script>
