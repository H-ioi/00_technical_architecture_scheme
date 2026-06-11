<template>
  <section class="uni-list-page">
    <div class="uni-list-page__header">
      <div>
        <h1>{{ $t('schoolDoctor.regulation.pageTitle') }}</h1>
        <p>{{ $t('schoolDoctor.regulation.pageDesc') }}</p>
      </div>
      <div class="uni-list-page__header-actions">
        <el-button type="primary" @click="openDrawer('add')">
          {{ $t('schoolDoctor.common.add') }}
        </el-button>
      </div>
    </div>
    <div class="uni-list-page__body">
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
            {{ $t('schoolDoctor.regulation.batchDelete') }}
          </el-button>
        </template>
        <template #empty>
          <ListTableEmpty :kind="tableEmpty.kind" @reset="onReset" @retry="tableEmpty.retry" />
        </template>
      </UniDataTable>
    </div>
    <FormDrawer
      v-model:visible="drawerVisible"
      :mode="drawerMode"
      :record-id="activeRecordId"
      :school-options="schoolOptions"
      @saved="refreshTable" />
  </section>
</template>

<script setup lang="ts">
import type { UniTableAction, UniTableRequest } from 'uni-ui-lib'
import { UniDataTable, UniSearchForm, toUniOptions, useUniI18n, useUniListState } from 'uni-ui-lib'
import { ElMessage, ElMessageBox } from 'element-plus'
import { computed, nextTick, onMounted, ref, watch } from 'vue'

import { membershipApi, schoolDoctorRegulationApi } from '@/api'
import ListTableEmpty from '@/components/list-table-empty/index.vue'
import { useListTableEmpty } from '@/composables/use-list-table-empty'
import type { SchoolDoctorRegulationListRow } from '@/types/modules/school-doctor-regulation'
import type { SchoolOptionRecord } from '@/types/modules/membership'
import { normalizePaged } from '@/utils/api-response-normalize'

import FormDrawer from './components/form-drawer.vue'
import { searchForm, statusOpts, tableCols, typeOpts } from './list.config'

type Row = SchoolDoctorRegulationListRow & {
  fileName?: string
  typeText?: string
  statusText?: string
}

const { t } = useUniI18n()

const initialFilters = {
  schoolId: undefined as string | number | undefined,
  type: undefined as number | undefined,
  status: undefined as number | undefined,
  keyword: undefined as string | undefined
}

const { queryModel, filters, tableRef, search, reset, handleLoadSuccess, refreshTable } =
  useUniListState({ initialFilters })

const schoolRecords = ref<SchoolOptionRecord[]>([])
const selectedIds = ref<Array<string | number>>([])
const drawerVisible = ref(false)
const drawerMode = ref<'add' | 'view' | 'edit'>('view')
const activeRecordId = ref<string | number | undefined>()

const schoolOptions = computed(() =>
  toUniOptions(schoolRecords.value, {
    labelKeys: ['enName', 'cnName', 'name'],
    valueKey: 'id'
  })
)

const defaultSchoolId = computed(() => {
  if (schoolRecords.value.length !== 1) {
    return null
  }
  return schoolRecords.value[0]?.id
})

const searchCfg = computed(() =>
  searchForm(t, schoolOptions.value, typeOpts(t), statusOpts(t), defaultSchoolId.value ?? undefined)
)
const columns = computed(() => tableCols(t))

function formatRow(row: SchoolDoctorRegulationListRow): Row {
  const typeMap: Record<number, string> = {
    1: t('schoolDoctor.regulation.typeRule'),
    2: t('schoolDoctor.regulation.typeConsent'),
    3: t('schoolDoctor.regulation.typeAuthorization')
  }
  const statusMap: Record<number, string> = {
    1: t('schoolDoctor.regulation.statusEnabled'),
    0: t('schoolDoctor.regulation.statusDisabled')
  }
  return {
    ...row,
    fileName: row.attachmentName || row.cnTitle || row.name || '--',
    typeText: typeMap[Number(row.type)] || '--',
    statusText: statusMap[Number(row.status)] || '--'
  }
}

const loadData: UniTableRequest = async ({ pageNo, pageSize, filters: f }) => {
  const fv = f as typeof initialFilters
  const params = {
    current: pageNo,
    size: pageSize,
    type: fv.type,
    status: fv.status,
    keyword: fv.keyword,
    schoolIds: fv.schoolId != null && fv.schoolId !== '' ? [fv.schoolId] : undefined
  }
  const result = await schoolDoctorRegulationApi.page.get(params)
  const { list, total } = normalizePaged<SchoolDoctorRegulationListRow>(result)
  return { data: list.map((row) => formatRow(row)), total }
}

const onSelectionChange = (rows: Row[]) => {
  selectedIds.value = rows.map((row) => row.id).filter((id) => id != null) as Array<string | number>
}

const onReset = () => {
  reset()
  if (defaultSchoolId.value != null) {
    queryModel.value.schoolId = defaultSchoolId.value
    filters.value.schoolId = defaultSchoolId.value
  }
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
      t('schoolDoctor.regulation.confirmBatchDelete'),
      t('schoolDoctor.common.confirmTitle'),
      { type: 'warning' }
    )
  } catch {
    return
  }
  await schoolDoctorRegulationApi.deleteBatch.delete(selectedIds.value.join(','))
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

watch(defaultSchoolId, (schoolId) => {
  if (schoolId != null && queryModel.value.schoolId == null) {
    queryModel.value.schoolId = schoolId
    filters.value.schoolId = schoolId
  }
})

onMounted(async () => {
  schoolRecords.value = await membershipApi.school.get()
  if (defaultSchoolId.value != null) {
    queryModel.value.schoolId = defaultSchoolId.value
    filters.value.schoolId = defaultSchoolId.value
  }
  await nextTick(() => tableRef.value?.refresh())
})
</script>
