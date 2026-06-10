<template>
  <div class="boarding-current-list">
    <div class="boarding-current-list__toolbar">
      <el-button v-uni-permission="'boarding-add'" type="primary" @click="addVisible = true">
        {{ $t('dorm.boardingStudent.add') }}
      </el-button>
    </div>

    <UniSearchForm
      v-model="queryModel"
      :config="searchCfg"
      :collapsed="true"
      :collapsed-rows="1"
      :action-min-span="0"
      :submit-text="$t('dorm.common.search')"
      :reset-text="$t('dorm.common.reset')"
      @search="search"
      @reset="onReset"
    />

    <UniDataTable
      ref="tableRef"
      row-key="admission_no"
      selection
      :columns="columns"
      :request="loadData"
      :filters="filters"
      :pagination="{ pageSize: 10, pageSizes: [10, 20, 50, 100] }"
      :toolbar="{ refresh: true, density: true, columnSetting: true }"
      :actions="actions"
      :action-column="{ width: 150, fixed: 'right' }"
      @selection-change="onSelectionChange"
      @load-success="tableEmpty.onLoadSuccess"
      @request-error="tableEmpty.onRequestError"
    >
      <template #toolbar>
        <el-button
          v-uni-permission="'boarding-assigne'"
          type="danger"
          :disabled="selectedRows.length === 0"
          @click="batchAssign"
        >
          {{ $t('dorm.boardingStudent.batchAssign') }}
        </el-button>
        <el-button
          v-uni-permission="'boarding-checkout'"
          type="danger"
          :disabled="selectedRows.length === 0"
          @click="batchCheckout"
        >
          {{ $t('dorm.boardingStudent.batchCheckout') }}
        </el-button>
        <el-button
          v-uni-permission="'boarding-planCheckOut'"
          type="danger"
          :disabled="selectedRows.length === 0"
          @click="openPlannedCheckout"
        >
          {{ $t('dorm.boardingStudent.plannedCheckout') }}
        </el-button>
      </template>
      <template #empty>
        <ListTableEmpty :kind="tableEmpty.kind" @reset="onReset" @retry="tableEmpty.retry" />
      </template>
    </UniDataTable>

    <StudentAddDialog
      v-model:visible="addVisible"
      :school-options="schoolOptions"
      :default-school-id="defaultSchoolId ?? undefined"
      @saved="refreshTable"
    />
    <StudentDetailDialog v-model:visible="detailVisible" :admission-no="activeAdmissionNo" variant="current" />
    <StudentEditDialog
      v-model:visible="editVisible"
      :admission-no="activeAdmissionNo"
      :school-options="schoolOptions"
      @saved="refreshTable"
    />
    <PlannedCheckoutDialog
      v-model:visible="plannedVisible"
      :admission-nos="selectedAdmissionNos"
      @saved="onPlannedSaved"
    />
  </div>
</template>

<script setup lang="ts">
import type { UniTableAction, UniTableRequest } from 'uni-ui-lib'
import { UniDataTable, UniSearchForm, toUniOptions, useUniI18n, useUniListState } from 'uni-ui-lib'
import { ElMessage, ElMessageBox } from 'element-plus'
import { computed, nextTick, onMounted, ref, watch } from 'vue'

import { dormBedApi, dormStudentApi, membershipApi } from '@/api'
import ListTableEmpty from '@/components/list-table-empty/index.vue'
import { useDormSpaceSearchFilters } from '@/composables/use-dorm-space-search-filters'
import { useListTableEmpty } from '@/composables/use-list-table-empty'
import type { DormStudentListRow } from '@/types/modules/dorm-student'
import type { SchoolOptionRecord } from '@/types/modules/membership'
import { normalizePaged } from '@/utils/api-response-normalize'

import { currentSearchForm, currentTableCols } from '../current.config'
import PlannedCheckoutDialog from './planned-checkout-dialog.vue'
import StudentAddDialog from './student-add-dialog.vue'
import StudentDetailDialog from './student-detail-dialog.vue'
import StudentEditDialog from './student-edit-dialog.vue'

type Row = DormStudentListRow & {
  schoolName?: string
  genderLabel?: string
  hasBedLabel?: string
}

const { t } = useUniI18n()

const initialFilters = {
  schoolId: undefined as string | number | undefined,
  buildingId: undefined as string | number | undefined,
  floorId: undefined as string | number | undefined,
  roomId: undefined as string | number | undefined,
  projectId: undefined as string | number | undefined,
  keyword: undefined as string | undefined,
  hasBed: undefined as string | undefined,
  checkinDateRange: undefined as [string, string] | undefined,
  plannedCheckoutDateRange: undefined as [string, string] | undefined
}

const { queryModel, filters, tableRef, search, reset, handleLoadSuccess, refreshTable } =
  useUniListState({ initialFilters })

const schoolRecords = ref<SchoolOptionRecord[]>([])
const selectedRows = ref<Row[]>([])

const {
  buildingFilterOptions,
  floorFilterOptions,
  roomFilterOptions,
  projectFilterOptions,
  loadBuildingFilter,
  loadFloorFilter,
  loadRoomFilter,
  loadProjectFilter,
  loadSchoolCascade,
  bindCascadeWatchers
} = useDormSpaceSearchFilters(queryModel)
bindCascadeWatchers()

const addVisible = ref(false)
const detailVisible = ref(false)
const editVisible = ref(false)
const plannedVisible = ref(false)
const activeAdmissionNo = ref<string | undefined>()

const schoolOptions = computed(() =>
  toUniOptions(schoolRecords.value, {
    labelKeys: ['enName', 'cnName', 'name'],
    valueKey: 'externId'
  }).map((item, index) => ({
    label: item.label,
    value: item.value ?? schoolRecords.value[index]?.id
  }))
)

const defaultSchoolId = computed(() => {
  if (schoolRecords.value.length !== 1) {
    return null
  }
  const school = schoolRecords.value[0]
  return school.externId ?? school.id
})

const searchCfg = computed(() =>
  currentSearchForm(
    t,
    schoolOptions.value,
    buildingFilterOptions.value,
    floorFilterOptions.value,
    roomFilterOptions.value,
    projectFilterOptions.value,
    defaultSchoolId.value ?? undefined
  )
)
const columns = computed(() => currentTableCols(t))
const selectedAdmissionNos = computed(() =>
  selectedRows.value.map((row) => String(row.admission_no ?? '')).filter(Boolean)
)

function genderLabel(raw: unknown) {
  const g = String(raw ?? '')
  if (g === '1') {
    return t('dorm.room.genderMale')
  }
  if (g === '2') {
    return t('dorm.room.genderFemale')
  }
  return g || '--'
}

const loadData: UniTableRequest = async ({ pageNo, pageSize, filters: f }) => {
  const fv = f as Record<string, unknown>
  const checkinRange = fv.checkinDateRange as [string, string] | undefined
  const plannedRange = fv.plannedCheckoutDateRange as [string, string] | undefined
  const result = await dormStudentApi.page.get({
    current: pageNo,
    size: pageSize,
    schoolId: fv.schoolId as string | number | undefined,
    buildingId: fv.buildingId as string | number | undefined,
    floorId: fv.floorId as string | number | undefined,
    roomId: fv.roomId as string | number | undefined,
    projectId: fv.projectId as string | number | undefined,
    keyword: fv.keyword as string | undefined,
    hasBed: fv.hasBed as string | undefined,
    checkinDateStart: checkinRange?.[0],
    checkinDateEnd: checkinRange?.[1],
    plannedCheckoutDateStart: plannedRange?.[0],
    plannedCheckoutDateEnd: plannedRange?.[1]
  })
  const { list, total } = normalizePaged<Row>(result)
  return {
    data: list.map((row) => ({
      ...row,
      schoolName: row.school?.en_name ?? row.school?.cn_name ?? '--',
      genderLabel: genderLabel(row.gender),
      hasBedLabel: row.has_bed ? t('attendance.yes') : t('attendance.no'),
      checkin_date: row.checkin_date ? String(row.checkin_date).slice(0, 10) : ''
    })),
    total
  }
}

const onSelectionChange = (rows: Row[]) => {
  selectedRows.value = rows
}

const onReset = () => {
  reset()
  if (defaultSchoolId.value != null) {
    queryModel.value.schoolId = defaultSchoolId.value
    filters.value.schoolId = defaultSchoolId.value
  }
  selectedRows.value = []
  void loadBuildingFilter(filters.value.schoolId)
  void loadProjectFilter(filters.value.schoolId)
  void loadFloorFilter(filters.value.buildingId)
  void loadRoomFilter(filters.value.floorId)
  void nextTick(() => search())
}

function openDetail(row: Row) {
  activeAdmissionNo.value = String(row.admission_no ?? '')
  detailVisible.value = true
}

function openEdit(row: Row) {
  activeAdmissionNo.value = String(row.admission_no ?? '')
  editVisible.value = true
}

async function singleCheckout(row: Row) {
  const admissionNo = String(row.admission_no ?? '')
  if (!admissionNo) {
    return
  }
  try {
    await ElMessageBox.confirm(
      t('dorm.boardingStudent.confirmSingleCheckout'),
      t('dorm.boardingStudent.confirmTitle'),
      { type: 'warning' }
    )
  } catch {
    return
  }
  await dormBedApi.checkoutBatch.post({ admissionNos: admissionNo })
  ElMessage.success(t('dorm.boardingStudent.actionSuccess'))
  void refreshTable()
}

async function batchCheckout() {
  if (selectedAdmissionNos.value.length === 0) {
    ElMessage.warning(t('dorm.boardingStudent.selectRows'))
    return
  }
  try {
    await ElMessageBox.confirm(
      t('dorm.boardingStudent.confirmBatchCheckout'),
      t('dorm.boardingStudent.confirmTitle'),
      { type: 'warning' }
    )
  } catch {
    return
  }
  const raw = await dormBedApi.checkoutBatch.post({
    admissionNos: selectedAdmissionNos.value.join(',')
  })
  const body = (raw as { data?: { results?: Array<{ admission_no?: string; message?: string }> } })?.data
  const results = body?.results
  if (Array.isArray(results) && results.length > 0) {
    const lines = results.map(
      (item) => `${item.admission_no}: ${item.message || t('dorm.boardingStudent.actionSuccess')}`
    )
    await ElMessageBox.alert(lines.join('\n'), t('dorm.boardingStudent.batchCheckout'), {
      confirmButtonText: t('dorm.common.submit')
    })
  } else {
    ElMessage.success(t('dorm.boardingStudent.actionSuccess'))
  }
  selectedRows.value = []
  void refreshTable()
}

async function batchAssign() {
  if (selectedAdmissionNos.value.length === 0) {
    ElMessage.warning(t('dorm.boardingStudent.selectRows'))
    return
  }
  try {
    await ElMessageBox.confirm(
      t('dorm.boardingStudent.confirmBatchAssign'),
      t('dorm.boardingStudent.confirmTitle'),
      { type: 'warning' }
    )
  } catch {
    return
  }
  const raw = await dormBedApi.autoAssign.post({
    admissionNos: selectedAdmissionNos.value.join(','),
    dryRun: false
  })
  const body = (raw as {
    data?: { details?: Array<{ admission_no?: string; message?: string; label?: string }> }
  })?.data
  const details = body?.details
  if (Array.isArray(details) && details.length > 0) {
    const lines = details.map((item) => {
      const msg =
        item.message ||
        [item.label].filter(Boolean).join('/') ||
        t('dorm.boardingStudent.actionSuccess')
      return `${item.admission_no}: ${msg}`
    })
    await ElMessageBox.alert(lines.join('\n'), t('dorm.boardingStudent.assignResult'), {
      confirmButtonText: t('dorm.common.submit')
    })
  } else {
    ElMessage.success(t('dorm.boardingStudent.actionSuccess'))
  }
  selectedRows.value = []
  void refreshTable()
}

function openPlannedCheckout() {
  if (selectedAdmissionNos.value.length === 0) {
    ElMessage.warning(t('dorm.boardingStudent.selectRows'))
    return
  }
  plannedVisible.value = true
}

function onPlannedSaved() {
  selectedRows.value = []
  void refreshTable()
}

const actions = computed<UniTableAction[]>(() => [
  {
    label: t('dorm.boardingStudent.view'),
    code: 'boarding-view',
    onClick: (row) => openDetail(row as Row)
  },
  {
    label: t('dorm.boardingStudent.checkout'),
    code: 'boarding-checkout',
    visible: (row) => Boolean((row as Row).has_bed),
    onClick: (row) => void singleCheckout(row as Row)
  },
  {
    label: t('dorm.common.edit'),
    code: 'boarding-edit',
    onClick: (row) => openEdit(row as Row)
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
    await loadSchoolCascade(defaultSchoolId.value)
  }
  await nextTick(() => tableRef.value?.refresh())
})
</script>

<style scoped lang="scss">
.boarding-current-list__toolbar {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 8px;
}
</style>
