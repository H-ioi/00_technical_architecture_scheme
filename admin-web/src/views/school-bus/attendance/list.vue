<template>
  <section class="uni-list-page">
    <div class="uni-list-page__header">
      <div>
        <h1>{{ $t('schoolBus.attendance.pageTitle') }}</h1>
        <p>{{ $t('schoolBus.attendance.pageDesc') }}</p>
      </div>
      <div class="uni-list-page__header-actions">
        <el-button v-uni-permission="'busattendance_add'" type="primary" @click="openForm('add')">
          {{ $t('schoolBus.add') }}
        </el-button>
      </div>
    </div>

    <UniSearchForm
      v-model="queryModel"
      :config="searchCfg"
      :collapsed="true"
      :collapsed-rows="1"
      :action-min-span="0"
      :submit-text="$t('schoolBus.search')"
      :reset-text="$t('schoolBus.reset')"
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
      :action-column="{ width: 110, fixed: 'right' }"
      @selection-change="onSelectionChange"
      @load-success="tableEmpty.onLoadSuccess"
      @request-error="tableEmpty.onRequestError">
      <template #toolbar>
        <el-button
          v-uni-permission="'busattendance_del'"
          type="danger"
          :disabled="ids.length === 0"
          @click="del">
          {{ $t('schoolBus.attendance.batchDelete') }}
        </el-button>
      </template>
      <template #empty>
        <ListTableEmpty :kind="tableEmpty.kind" @reset="onReset" @retry="tableEmpty.retry" />
      </template>
    </UniDataTable>

    <AttendanceFormDrawer
      v-model:visible="formVisible"
      :mode="formMode"
      :record-id="activeId"
      :school-options="schoolOptions"
      :default-school-id="defaultSchoolId"
      @saved="refreshTable" />
  </section>
</template>

<script setup lang="ts">
import AttendanceFormDrawer from './components/form-drawer.vue'
import {
  attendanceStatusOpts,
  rideTypeOpts,
  searchForm,
  tableCols
} from './list.config'
import { membershipApi, schoolBusAttendanceApi, schoolBusCommonApi } from '@/api'
import ListTableEmpty from '@/components/list-table-empty/index.vue'
import { useListTableEmpty } from '@/composables/use-list-table-empty'
import type { SchoolOptionRecord } from '@/types/modules/membership'
import type { BusAttendanceRecord as Row } from '@/types/modules/school-bus-attendance'
import { normalizeArray, normalizePaged } from '@/utils/api-response-normalize'
import { ElMessage, ElMessageBox } from 'element-plus'
import dayjs from 'dayjs'
import { useUniI18n, toUniOptions, useUniListState } from 'uni-ui-lib'
import type { UniTableAction, UniTableRequest } from 'uni-ui-lib'
import { computed, nextTick, onMounted, ref, watch } from 'vue'

type LineStationRow = {
  id: string | number
  cnName?: string
  enName?: string
  schoolIds?: string | number | Array<string | number>
  lineId?: string | number
}

const { locale, t } = useUniI18n()

const initialFilters = {
  schoolId: undefined as string | number | undefined,
  keyword: '',
  dateRange: undefined as [string, string] | undefined,
  formCode: '',
  lineId: undefined as string | number | undefined,
  stationId: undefined as string | number | undefined,
  attendanceStatus: undefined as number | undefined
}
const { queryModel, filters, tableRef, search, reset, handleLoadSuccess, refreshTable } =
  useUniListState({
    initialFilters
  })

const schoolRecords = ref<SchoolOptionRecord[]>([])
const lineList = ref<LineStationRow[]>([])
const stationList = ref<LineStationRow[]>([])

const schoolOptions = computed(() =>
  toUniOptions(schoolRecords.value, {
    labelKeys: locale() === 'en' ? ['enName', 'name'] : ['name', 'cnName', 'enName'],
    valueKey: 'id'
  })
)

const defaultSchoolId = computed(() =>
  schoolRecords.value.length === 1 ? schoolRecords.value[0].id : null
)

const filterLineOptions = computed(() =>
  toUniOptions(filterBySchool(lineList.value, queryModel.schoolId), {
    labelKeys: locale() === 'en' ? ['enName', 'cnName'] : ['cnName', 'enName'],
    valueKey: 'id'
  })
)

const filterStationOptions = computed(() =>
  toUniOptions(
    filterBySchool(stationList.value, queryModel.schoolId).filter((item) => {
      if (!queryModel.lineId) {
        return true
      }
      return String(item.lineId) === String(queryModel.lineId)
    }),
    {
      labelKeys: locale() === 'en' ? ['enName', 'cnName'] : ['cnName', 'enName'],
      valueKey: 'id'
    }
  )
)

const rideOptions = computed(() => rideTypeOpts(t))
const statusOptions = computed(() => attendanceStatusOpts(t))

const searchCfg = computed(() =>
  searchForm(
    t,
    schoolOptions.value,
    filterLineOptions.value,
    filterStationOptions.value,
    statusOptions.value,
    defaultSchoolId.value ?? undefined
  )
)
const columns = computed(() => tableCols(t, rideOptions.value, statusOptions.value))

const formVisible = ref(false)
const formMode = ref<'add' | 'edit' | 'look'>('add')
const activeId = ref<string | number | null>(null)

function matchSchool(row: LineStationRow, schoolId: string | number | undefined) {
  if (schoolId == null || schoolId === '') {
    return false
  }
  const target = String(schoolId)
  if (Array.isArray(row.schoolIds)) {
    return row.schoolIds.some((id) => String(id) === target)
  }
  return String(row.schoolIds) === target
}

function filterBySchool(rows: LineStationRow[], schoolId: string | number | undefined) {
  if (schoolId == null || schoolId === '') {
    return []
  }
  return rows.filter((row) => matchSchool(row, schoolId))
}

function schoolNameById(schoolId: string | number | undefined) {
  if (schoolId == null) {
    return ''
  }
  const hit = schoolRecords.value.find((item) => String(item.id) === String(schoolId))
  if (!hit) {
    return ''
  }
  return locale() === 'en'
    ? hit.enName || hit.name || hit.cnName || ''
    : hit.name || hit.cnName || hit.enName || ''
}

function formatRow(row: Row): Row {
  const next = { ...row }
  next.schoolName = next.schoolName || schoolNameById(next.schoolId) || '—'
  next.grade = next.grade || next.studentGrade || '—'
  next.lineName = next.lineName || next.buslineCnName || next.buslineEnName || '—'
  next.stationName = next.stationName || next.busStationCnName || next.busStationEnName || '—'
  if (next.attendanceDate) {
    next.attendanceDate = dayjs(next.attendanceDate).format('YYYY-MM-DD')
  }
  if (next.createTime) {
    next.createTime = dayjs(next.createTime).format('YYYY-MM-DD HH:mm')
  }
  next.operator = next.operator || next.createBy || next.creator || '—'
  next.remark = next.remark == null || next.remark === '' ? '—' : next.remark
  return next
}

const loadData: UniTableRequest = async ({ pageNo: current, pageSize: size, filters: f }) => {
  const params: Record<string, unknown> = { current, size, ...f }

  if (params.schoolId) {
    params.schoolIds = [params.schoolId]
    delete params.schoolId
  }

  const range = params.dateRange as [string, string] | undefined
  delete params.dateRange
  if (Array.isArray(range) && range.length === 2) {
    params.attendanceDateStart = `${range[0]} 00:00:00`
    params.attendanceDateEnd = `${range[1]} 23:59:59`
  }

  const result = await schoolBusAttendanceApi.page.get(params)
  const { list, total: pageTotal } = normalizePaged<Row>(result)

  return {
    data: list.map(formatRow),
    total: pageTotal
  }
}

const openForm = (mode: 'add' | 'edit' | 'look', row?: Row) => {
  formMode.value = mode
  activeId.value = row?.id ?? null
  formVisible.value = true
}

const actions = computed<UniTableAction[]>(() => [
  {
    label: t('schoolBus.look'),
    onClick: (row) => openForm('look', row as Row)
  },
  {
    label: t('schoolBus.edit'),
    code: 'busattendance_edit',
    onClick: (row) => openForm('edit', row as Row)
  }
])

const selection = ref<Row[]>([])
const ids = computed(() => selection.value.map((item) => item.id))

const onSelectionChange = (rows: Row[]) => {
  selection.value = rows
}

const onReset = () => {
  reset()
  if (defaultSchoolId.value != null) {
    queryModel.schoolId = defaultSchoolId.value
  }
}

const del = async () => {
  if (ids.value.length === 0) {
    return
  }

  try {
    await ElMessageBox.confirm(
      t('schoolBus.attendance.confirmBatchDelete'),
      t('schoolBus.attendance.notice'),
      {
        confirmButtonText: t('schoolBus.submit'),
        cancelButtonText: t('schoolBus.cancel'),
        type: 'warning'
      }
    )
  } catch {
    return
  }

  await schoolBusAttendanceApi.delete.delete(ids.value)
  ElMessage.success(t('schoolBus.deleteSuccess'))
  selection.value = []
  void refreshTable()
}

onMounted(async () => {
  const [schoolRaw, lineRaw, stationRaw] = await Promise.all([
    membershipApi.school.get(),
    schoolBusCommonApi.lineList.get(),
    schoolBusCommonApi.stationList.get()
  ])
  schoolRecords.value = normalizeArray(schoolRaw) as SchoolOptionRecord[]
  lineList.value = normalizeArray(lineRaw) as LineStationRow[]
  stationList.value = normalizeArray(stationRaw) as LineStationRow[]
})

watch(
  () => schoolRecords.value,
  (records) => {
    if (records.length === 1) {
      queryModel.schoolId = records[0].id
    }
    if (records.length > 0) {
      nextTick(() => tableRef.value?.refresh())
    }
  }
)

watch(
  () => queryModel.schoolId,
  () => {
    queryModel.lineId = undefined
    queryModel.stationId = undefined
  }
)

watch(
  () => queryModel.lineId,
  () => {
    queryModel.stationId = undefined
  }
)

const tableEmpty = useListTableEmpty(filters, { tableRef, afterLoadSuccess: handleLoadSuccess })
</script>
