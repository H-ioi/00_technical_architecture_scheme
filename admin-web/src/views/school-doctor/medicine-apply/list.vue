<template>
  <section class="uni-list-page">
    <div class="uni-list-page__header">
      <div>
        <h1>{{ $t('schoolDoctor.medicineApply.pageTitle') }}</h1>
        <p>{{ $t('schoolDoctor.medicineApply.pageDesc') }}</p>
      </div>
      <div class="uni-list-page__header-actions">
        <el-button
          v-uni-permission="'medicationapplication_add'"
          type="primary"
          @click="openDrawer('add')">
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
        :action-column="{ width: 140, fixed: 'right' }"
        @selection-change="onSelectionChange"
        @load-success="tableEmpty.onLoadSuccess"
        @request-error="tableEmpty.onRequestError">
        <template #toolbar>
          <el-button type="danger" :disabled="selectedIds.length === 0" @click="batchDelete">
            {{ $t('schoolDoctor.medicineApply.batchDelete') }}
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
      :school-records="schoolRecords"
      @saved="refreshTable" />
  </section>
</template>

<script setup lang="ts">
import type { UniTableAction, UniTableRequest } from 'uni-ui-lib'
import { UniDataTable, UniSearchForm, toUniOptions, useUniI18n, useUniListState } from 'uni-ui-lib'
import { ElMessage, ElMessageBox } from 'element-plus'
import { computed, nextTick, onMounted, ref, watch } from 'vue'

import { membershipApi, schoolDoctorMedicineApplyApi } from '@/api'
import ListTableEmpty from '@/components/list-table-empty/index.vue'
import { useListTableEmpty } from '@/composables/use-list-table-empty'
import type { MedicineApplyListRow } from '@/types/modules/school-doctor-medicine-apply'
import type { SchoolOptionRecord } from '@/types/modules/membership'
import { normalizePaged } from '@/utils/api-response-normalize'

import FormDrawer from './components/form-drawer.vue'
import { applyMedicationFilterOpts, applyStatusOpts, searchForm, tableCols } from './list.config'

type Row = MedicineApplyListRow & {
  applyMedicationText?: string
  statusText?: string
  applicantText?: string
  showApproveBtn?: boolean
}

const { t } = useUniI18n()

const initialFilters = {
  schoolId: undefined as string | number | undefined,
  keyword: undefined as string | undefined,
  applyMedication: undefined as number | undefined,
  status: undefined as number | undefined
}

const { queryModel, filters, tableRef, search, reset, handleLoadSuccess, refreshTable } =
  useUniListState({ initialFilters })

const schoolRecords = ref<SchoolOptionRecord[]>([])
const selectedIds = ref<Array<string | number>>([])
const drawerVisible = ref(false)
const drawerMode = ref<'add' | 'view' | 'approve'>('view')
const activeRecordId = ref<string | number | undefined>()

const defaultSchoolId = computed(() =>
  schoolRecords.value.length === 1 ? schoolRecords.value[0]?.id : null
)
const schoolOptions = computed(() =>
  toUniOptions(schoolRecords.value, { labelKeys: ['enName', 'cnName', 'name'], valueKey: 'id' })
)
const searchCfg = computed(() =>
  searchForm(
    t,
    schoolOptions.value,
    applyStatusOpts(t),
    applyMedicationFilterOpts(t),
    defaultSchoolId.value ?? undefined
  )
)
const columns = computed(() => tableCols(t))

function canApproveRow(row: MedicineApplyListRow) {
  const status = row.status
  if (status != null && status !== '') {
    return Number(status) === 0
  }
  const nurseApproval = row.nurseApproval
  if (nurseApproval === 1 || nurseApproval === 2) {
    return false
  }
  return true
}

function formatApplicant(row: MedicineApplyListRow) {
  const source = [row.source, row.sourceType, row.applicantType].find((v) => v != null)
  if (
    source === 1 ||
    source === '1' ||
    source === 'mini' ||
    /mini|小程序|家长/i.test(String(row.applicant || ''))
  ) {
    return t('schoolDoctor.common.parent')
  }
  return row.applicant || row.operator || row.creator || '--'
}

function formatRow(row: MedicineApplyListRow): Row {
  const statusItem = applyStatusOpts(t).find((opt) => opt.value === row.status)
  const applyItem = applyMedicationFilterOpts(t).find((opt) => opt.value === row.applyMedication)
  return {
    ...row,
    statusText: statusItem?.label || '--',
    applyMedicationText: applyItem?.label || '--',
    applicantText: formatApplicant(row),
    showApproveBtn: canApproveRow(row)
  }
}

const loadData: UniTableRequest = async ({ pageNo, pageSize, filters: f }) => {
  const fv = f as typeof initialFilters
  const result = await schoolDoctorMedicineApplyApi.page.get({
    current: pageNo,
    size: pageSize,
    keyword: fv.keyword,
    applyMedication: fv.applyMedication,
    status: fv.status,
    schoolIds: fv.schoolId != null && fv.schoolId !== '' ? [fv.schoolId] : undefined
  })
  const { list, total } = normalizePaged<MedicineApplyListRow>(result)
  return { data: list.map((row) => formatRow(row)), total }
}

function openDrawer(mode: 'add' | 'view' | 'approve', row?: Row) {
  if (mode === 'approve' && row && !canApproveRow(row)) {
    ElMessage.warning(t('schoolDoctor.medicineApply.approveOnlyPending'))
    return
  }
  drawerMode.value = mode
  activeRecordId.value = mode === 'add' ? undefined : row?.id
  drawerVisible.value = true
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
      t('schoolDoctor.medicineApply.confirmBatchDelete'),
      t('schoolDoctor.common.confirmTitle'),
      { type: 'warning' }
    )
  } catch {
    return
  }
  await schoolDoctorMedicineApplyApi.deleteBatch.delete(selectedIds.value.join(','))
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
    label: t('schoolDoctor.medicineApply.approve'),
    show: (row) => (row as Row).showApproveBtn === true,
    onClick: (row) => openDrawer('approve', row as Row)
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
