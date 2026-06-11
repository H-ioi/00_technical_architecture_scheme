<template>
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
      @load-success="onTableLoadSuccess"
      @request-error="tableEmpty.onRequestError">
      <template #toolbar>
        <el-button type="danger" :disabled="selectedIds.length === 0" @click="batchDelete">
          {{ $t('schoolDoctor.visitRecord.batchDelete') }}
        </el-button>
      </template>
      <template #empty>
        <ListTableEmpty :kind="tableEmpty.kind" @reset="onReset" @retry="tableEmpty.retry" />
      </template>
    </UniDataTable>
  </div>
  <RecordFormDrawer
    v-model:visible="drawerVisible"
    :mode="drawerMode"
    :record-id="activeRecordId"
    :school-records="schoolRecords"
    @saved="refreshTable" />
</template>

<script setup lang="ts">
import type { UniTableAction, UniTableRequest } from 'uni-ui-lib'
import { UniDataTable, UniSearchForm, toUniOptions, useUniI18n, useUniListState } from 'uni-ui-lib'
import { ElMessage, ElMessageBox } from 'element-plus'
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { membershipApi, schoolDoctorVisitRecordApi } from '@/api'
import ListTableEmpty from '@/components/list-table-empty/index.vue'
import { useListTableEmpty } from '@/composables/use-list-table-empty'
import type { VisitRecordListRow } from '@/types/modules/school-doctor-visit-record'
import type { SchoolOptionRecord } from '@/types/modules/membership'
import { normalizePaged } from '@/utils/api-response-normalize'

import {
  leaveDestinationOpts,
  recordSearchForm,
  recordTableCols,
  yesNoOpts
} from '../record.config'
import RecordFormDrawer from './record-form-drawer.vue'

type Row = VisitRecordListRow & {
  visitDate?: string
  visitTimeText?: string
  specificSituationText?: string
  leaveDestinationText?: string
  executeOperationText?: string
  contactParentText?: string
  parentSignatureText?: string
}

const { t } = useUniI18n()
const route = useRoute()
const router = useRouter()

const initialFilters = {
  schoolId: undefined as string | number | undefined,
  keyword: undefined as string | undefined,
  leaveDestination: undefined as number | undefined,
  parentAgree: undefined as number | undefined,
  contactParent: undefined as number | undefined,
  visitDateRange: undefined as [string, string] | undefined
}

const { queryModel, filters, tableRef, search, reset, handleLoadSuccess, refreshTable } =
  useUniListState({ initialFilters })

const schoolRecords = ref<SchoolOptionRecord[]>([])
const selectedIds = ref<Array<string | number>>([])
const drawerVisible = ref(false)
const drawerMode = ref<'add' | 'view' | 'edit'>('view')
const activeRecordId = ref<string | number | undefined>()

const defaultSchoolId = computed(() =>
  schoolRecords.value.length === 1 ? schoolRecords.value[0]?.id : null
)
const schoolOptions = computed(() =>
  toUniOptions(schoolRecords.value, { labelKeys: ['enName', 'cnName', 'name'], valueKey: 'id' })
)
const searchCfg = computed(() =>
  recordSearchForm(
    t,
    schoolOptions.value,
    leaveDestinationOpts(t),
    yesNoOpts(t),
    defaultSchoolId.value ?? undefined
  )
)
const columns = computed(() => recordTableCols(t))

function formatYesNo(value?: number) {
  if (value === 1) {
    return t('schoolDoctor.common.yes')
  }
  if (value === 0) {
    return t('schoolDoctor.common.no')
  }
  return '--'
}

function formatLeave(value?: number) {
  const item = leaveDestinationOpts(t).find((opt) => opt.value === value)
  return item?.label || '--'
}

function formatRow(row: VisitRecordListRow): Row {
  const visitTime = row.visitTime || ''
  return {
    ...row,
    visitDate: visitTime ? visitTime.slice(0, 16) : '--',
    visitTimeText: visitTime ? visitTime.slice(0, 16) : '--',
    specificSituationText: row.specificSituation || row.remark || row.chiefComplaint || '--',
    leaveDestinationText: formatLeave(row.leaveDestination),
    executeOperationText: formatYesNo(row.executeOperation),
    contactParentText: formatYesNo(row.contactParent),
    parentSignatureText: row.parentSignaturePath
      ? t('schoolDoctor.visitRecord.hasSignature')
      : t('schoolDoctor.visitRecord.noSignature')
  }
}

const loadData: UniTableRequest = async ({ pageNo, pageSize, filters: f }) => {
  const fv = f as typeof initialFilters
  const params = {
    current: pageNo,
    size: pageSize,
    keyword: fv.keyword,
    leaveDestination: fv.leaveDestination,
    parentAgree: fv.parentAgree,
    contactParent: fv.contactParent,
    schoolIds: fv.schoolId != null && fv.schoolId !== '' ? [fv.schoolId] : undefined,
    visitDateStart: fv.visitDateRange?.[0],
    visitDateEnd: fv.visitDateRange?.[1]
  }
  const result = await schoolDoctorVisitRecordApi.recordPage.get(params)
  const { list, total } = normalizePaged<VisitRecordListRow>(result)
  return { data: list.map((row) => formatRow(row)), total }
}

function openDrawer(mode: 'add' | 'view' | 'edit', row?: Row) {
  drawerMode.value = mode
  activeRecordId.value = mode === 'add' ? undefined : row?.id
  drawerVisible.value = true
}

function openAdd() {
  openDrawer('add')
}

defineExpose({ openAdd })

async function onTableLoadSuccess() {
  handleLoadSuccess()
  const recordId = route.query.recordId
  if (!recordId || drawerVisible.value) {
    return
  }
  openDrawer('view', { id: Array.isArray(recordId) ? recordId[0] : recordId } as Row)
  const nextQuery = { ...route.query, tab: 'record' }
  delete nextQuery.recordId
  void router.replace({ query: nextQuery })
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

async function batchDelete() {
  if (selectedIds.value.length === 0) {
    return
  }
  try {
    await ElMessageBox.confirm(
      t('schoolDoctor.visitRecord.confirmBatchDelete'),
      t('schoolDoctor.common.confirmTitle'),
      { type: 'warning' }
    )
  } catch {
    return
  }
  await schoolDoctorVisitRecordApi.recordDeleteBatch.delete(selectedIds.value.join(','))
  ElMessage.success(t('schoolDoctor.common.deleteSuccess'))
  selectedIds.value = []
  void refreshTable()
}

const actions = computed<UniTableAction[]>(() => [
  { label: t('schoolDoctor.studentRecord.view'), onClick: (row) => openDrawer('view', row as Row) },
  { label: t('schoolDoctor.studentRecord.edit'), onClick: (row) => openDrawer('edit', row as Row) }
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
