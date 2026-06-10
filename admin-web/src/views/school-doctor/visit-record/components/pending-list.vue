<template>
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
    :columns="columns"
    :request="loadData"
    :filters="filters"
    :pagination="{ pageSize: 10, pageSizes: [10, 20, 50, 100] }"
    :toolbar="{ refresh: true, density: true, columnSetting: true }"
    :actions="actions"
    :action-column="{ width: 140, fixed: 'right' }"
    @load-success="tableEmpty.onLoadSuccess"
    @request-error="tableEmpty.onRequestError">
    <template #empty>
      <ListTableEmpty :kind="tableEmpty.kind" @reset="onReset" @retry="tableEmpty.retry" />
    </template>
  </UniDataTable>

  <PendingDrawer
    v-model:visible="drawerVisible"
    :mode="drawerMode"
    :record-id="activeRecordId"
    :list-row="activeRow"
    @saved="refreshTable" />
</template>

<script setup lang="ts">
import type { UniTableAction, UniTableRequest } from 'uni-ui-lib'
import { UniDataTable, UniSearchForm, toUniOptions, useUniI18n, useUniListState } from 'uni-ui-lib'
import { ElMessage } from 'element-plus'
import { computed, nextTick, onMounted, ref, watch } from 'vue'

import { membershipApi, schoolDoctorVisitRecordApi } from '@/api'
import ListTableEmpty from '@/components/list-table-empty/index.vue'
import { useListTableEmpty } from '@/composables/use-list-table-empty'
import type { PendingMedicationListRow } from '@/types/modules/school-doctor-visit-record'
import type { SchoolOptionRecord } from '@/types/modules/membership'
import { normalizePaged } from '@/utils/api-response-normalize'

import { pendingSearchForm, pendingSearchStatusOpts, pendingTableCols } from '../pending.config'
import PendingDrawer from './pending-drawer.vue'

const PENDING_ENDED = 1
const APP_WAITING = 1
const APP_IN_PROGRESS = 2

type Row = PendingMedicationListRow & {
  statusText?: string
  applyMedicationDateText?: string
}

const { t } = useUniI18n()

const initialFilters = {
  schoolId: undefined as string | number | undefined,
  keyword: undefined as string | undefined,
  searchStatus: undefined as string | undefined,
  applyDateRange: undefined as [string, string] | undefined
}

const { queryModel, filters, tableRef, search, reset, handleLoadSuccess, refreshTable } =
  useUniListState({ initialFilters })

const schoolRecords = ref<SchoolOptionRecord[]>([])
const drawerVisible = ref(false)
const drawerMode = ref<'view' | 'operate'>('view')
const activeRecordId = ref<string | number | undefined>()
const activeRow = ref<Row | undefined>()

const defaultSchoolId = computed(() => (schoolRecords.value.length === 1 ? schoolRecords.value[0]?.id : null))
const schoolOptions = computed(() =>
  toUniOptions(schoolRecords.value, { labelKeys: ['enName', 'cnName', 'name'], valueKey: 'id' })
)
const searchCfg = computed(() =>
  pendingSearchForm(t, schoolOptions.value, pendingSearchStatusOpts(t), defaultSchoolId.value ?? undefined)
)
const columns = computed(() => pendingTableCols(t))

function formatRow(row: PendingMedicationListRow): Row {
  let statusText = t('schoolDoctor.visitRecord.pendingStatusWaiting')
  if (Number(row.status) === PENDING_ENDED) {
    statusText = t('schoolDoctor.visitRecord.pendingStatusEnded')
  } else if (Number(row.applicationStatus) === APP_IN_PROGRESS) {
    statusText = t('schoolDoctor.visitRecord.pendingStatusInProgress')
  }
  const start = row.applyMedicationDateStart || ''
  const end = row.applyMedicationDateEnd || ''
  const applyMedicationDateText =
    start && end ? `${start.slice(0, 16)} ~ ${end.slice(0, 16)}` : row.applyMedicationDate || '--'
  return { ...row, statusText, applyMedicationDateText }
}

const loadData: UniTableRequest = async ({ pageNo, pageSize, filters: f }) => {
  const fv = f as typeof initialFilters
  const params: Record<string, unknown> = {
    current: pageNo,
    size: pageSize,
    keyword: fv.keyword,
    schoolIds: fv.schoolId != null && fv.schoolId !== '' ? [fv.schoolId] : undefined
  }
  if (fv.applyDateRange?.length === 2) {
    params.applyMedicationDateStart = fv.applyDateRange[0]
    params.applyMedicationDateEnd = fv.applyDateRange[1]
  }
  if (fv.searchStatus === 'waiting') {
    params.status = 0
    params.applicationStatus = APP_WAITING
  } else if (fv.searchStatus === 'inProgress') {
    params.status = 0
    params.applicationStatus = APP_IN_PROGRESS
  } else if (fv.searchStatus === 'ended') {
    params.status = PENDING_ENDED
  }
  const result = await schoolDoctorVisitRecordApi.pendingPage.get(params)
  const { list, total } = normalizePaged<PendingMedicationListRow>(result)
  return { data: list.map((row) => formatRow(row)), total }
}

function openDrawer(mode: 'view' | 'operate', row: Row) {
  if (mode === 'operate' && Number(row.status) === PENDING_ENDED) {
    ElMessage.warning(t('schoolDoctor.visitRecord.pendingEndedTip'))
    return
  }
  drawerMode.value = mode
  activeRecordId.value = row.id
  activeRow.value = row
  drawerVisible.value = true
}

const onReset = () => {
  reset()
  if (defaultSchoolId.value != null) {
    queryModel.value.schoolId = defaultSchoolId.value
    filters.value.schoolId = defaultSchoolId.value
  }
  void nextTick(() => search())
}

const actions = computed<UniTableAction[]>(() => [
  {
    label: t('schoolDoctor.studentRecord.view'),
    onClick: (row) => openDrawer('view', row as Row)
  },
  {
    label: t('schoolDoctor.visitRecord.operateMedication'),
    show: (row) => Number((row as Row).status) !== PENDING_ENDED,
    onClick: (row) => openDrawer('operate', row as Row)
  }
])

const tableEmpty = useListTableEmpty(filters, { tableRef, afterLoadSuccess: handleLoadSuccess })

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
