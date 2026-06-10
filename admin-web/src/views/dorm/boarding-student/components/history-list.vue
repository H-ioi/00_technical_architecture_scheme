<template>
  <div class="boarding-history-list">
    <UniSearchForm
      v-model="queryModel"
      :config="searchCfg"
      :collapsed="true"
      :collapsed-rows="2"
      :action-min-span="0"
      :submit-text="$t('dorm.common.search')"
      :reset-text="$t('dorm.common.reset')"
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
      :action-column="{ width: 120, fixed: 'right' }"
      @load-success="tableEmpty.onLoadSuccess"
      @request-error="tableEmpty.onRequestError">
      <template #empty>
        <ListTableEmpty :kind="tableEmpty.kind" @reset="onReset" @retry="tableEmpty.retry" />
      </template>
    </UniDataTable>

    <StudentDetailDialog v-model:visible="detailVisible" :admission-no="activeAdmissionNo" variant="history" />
    <HistoryEditDialog
      v-model:visible="editVisible"
      :admission-no="activeAdmissionNo"
      @saved="refreshTable" />
  </div>
</template>

<script setup lang="ts">
import type { UniTableAction, UniTableRequest } from 'uni-ui-lib'
import { UniDataTable, UniSearchForm, toUniOptions, useUniI18n, useUniListState } from 'uni-ui-lib'
import { computed, nextTick, onMounted, ref, watch } from 'vue'

import { dormStudentApi, membershipApi } from '@/api'
import ListTableEmpty from '@/components/list-table-empty/index.vue'
import { useDormSpaceSearchFilters } from '@/composables/use-dorm-space-search-filters'
import { useListTableEmpty } from '@/composables/use-list-table-empty'
import type { DormStudentHistoryRow } from '@/types/modules/dorm-student'
import type { SchoolOptionRecord } from '@/types/modules/membership'
import { normalizePaged } from '@/utils/api-response-normalize'

import { historySearchForm, historyTableCols } from '../history.config'
import HistoryEditDialog from './history-edit-dialog.vue'
import StudentDetailDialog from './student-detail-dialog.vue'

type Row = DormStudentHistoryRow & {
  schoolName?: string
  studentName?: string
  grade_code?: string
  form_code?: string
  nationality?: string
  genderLabel?: string
  birthdate?: string
  hasBedLabel?: string
  project_name?: string
  floor_name?: string
  room_room?: string
  bed_label?: string
}

const { t } = useUniI18n()

const initialFilters = {
  schoolId: undefined as string | number | undefined,
  buildingId: undefined as string | number | undefined,
  floorId: undefined as string | number | undefined,
  roomId: undefined as string | number | undefined,
  projectId: undefined as string | number | undefined,
  keyword: undefined as string | undefined,
  checkinDateRange: undefined as [string, string] | undefined,
  checkoutDateRange: undefined as [string, string] | undefined
}

const { queryModel, filters, tableRef, search, reset, handleLoadSuccess, refreshTable } =
  useUniListState({ initialFilters })

const schoolRecords = ref<SchoolOptionRecord[]>([])

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

const detailVisible = ref(false)
const editVisible = ref(false)
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
  historySearchForm(
    t,
    schoolOptions.value,
    buildingFilterOptions.value,
    floorFilterOptions.value,
    roomFilterOptions.value,
    projectFilterOptions.value,
    defaultSchoolId.value ?? undefined
  )
)
const columns = computed(() => historyTableCols(t))

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
  const checkoutRange = fv.checkoutDateRange as [string, string] | undefined
  const result = await dormStudentApi.historyPage.get({
    current: pageNo,
    size: pageSize,
    schoolId: fv.schoolId as string | number | undefined,
    buildingId: fv.buildingId as string | number | undefined,
    floorId: fv.floorId as string | number | undefined,
    roomId: fv.roomId as string | number | undefined,
    projectId: fv.projectId as string | number | undefined,
    keyword: fv.keyword as string | undefined,
    checkinDateStart: checkinRange?.[0],
    checkinDateEnd: checkinRange?.[1],
    checkoutDateStart: checkoutRange?.[0],
    checkoutDateEnd: checkoutRange?.[1]
  })
  const { list, total } = normalizePaged<Row>(result)
  return {
    data: list.map((row) => {
      const student = row.student ?? {}
      return {
        ...row,
        schoolName: student.school?.en_name ?? student.school?.cn_name ?? '--',
        studentName: student.en_name ?? '--',
        grade_code: student.grade_code,
        form_code: student.form_code,
        nationality: student.nationality,
        genderLabel: genderLabel(student.gender),
        birthdate: student.birthdate,
        hasBedLabel: student.has_bed ? t('attendance.yes') : t('attendance.no'),
        project_name: student.project_name,
        floor_name: student.floor_name,
        room_room: student.room_room,
        bed_label: student.bed_label,
        checkin_date: row.checkin_date ? String(row.checkin_date).slice(0, 10) : '',
        checkout_date: row.checkout_date ? String(row.checkout_date).slice(0, 10) : ''
      }
    }),
    total
  }
}

const onReset = () => {
  reset()
  if (defaultSchoolId.value != null) {
    queryModel.value.schoolId = defaultSchoolId.value
    filters.value.schoolId = defaultSchoolId.value
  }
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

const actions = computed<UniTableAction[]>(() => [
  {
    label: t('dorm.boardingStudent.view'),
    code: 'boarding-view',
    onClick: (row) => openDetail(row as Row)
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
