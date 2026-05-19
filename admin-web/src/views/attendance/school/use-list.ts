import type { UniTableAction, UniTableRequest } from 'uni-ui-lib'
import { toUniOptions, useUniI18n, useUniListState } from 'uni-ui-lib'
import { computed, ref } from 'vue'

import {
  attendanceOpenTypeOpts,
  detailForm,
  searchForm,
  tableCols
} from './list.config'

import { attendanceSchoolStatusOpts } from '../student/list.config'

import { attendanceSchoolApi, membershipApi } from '@/api'
import { normalizePaged } from '@/utils/api-response-normalize'
import { dateFormat } from '@/utils/tool'
import type {
  AttendanceSchoolListParams,
  AttendanceSchoolRecord
} from '@/types/modules/attendance-school'
import type { SchoolOptionRecord } from '@/types/modules/membership'

type Loose = Record<string, unknown>

export const useList = () => {
  const { locale, t } = useUniI18n()
  const initialFilters: Record<string, unknown> = {
    schoolId: undefined,
    deptName: undefined,
    personName: '',
    personCode: '',
    schoolStatus: undefined,
    cardNumber: '',
    entryAcsChannel: '',
    leavingAcsChannel: '',
    beginDate: undefined,
    endDate: undefined
  }

  const { queryModel, filters, tableRef, handleLoadSuccess, reset, search } = useUniListState({
    initialFilters
  })

  const schoolRecords = ref<SchoolOptionRecord[]>([])
  const schoolOptions = computed(() =>
    toUniOptions(schoolRecords.value, {
      labelKeys: locale() === 'en' ? ['enName', 'name'] : ['name', 'cnName', 'enName'],
      valueKey: 'id'
    })
  )

  const deptStrings = ref<string[]>([])
  const deptOptions = computed(() =>
    toUniOptions(
      deptStrings.value.map((d) => ({ label: d, value: d })),
      { labelKeys: ['label'], valueKey: 'value' }
    )
  )

  const statusSearchOptions = computed(() => attendanceSchoolStatusOpts(t))
  const openTypeSearchOptions = computed(() => attendanceOpenTypeOpts(t))

  const searchCfg = computed(() =>
    searchForm(t, schoolOptions.value, deptOptions.value, statusSearchOptions.value)
  )

  const columns = computed(() => tableCols(t, schoolOptions.value))

  const detailConfig = computed(() => detailForm(t, schoolOptions.value))

  const detailVisible = ref(false)
  const activeRow = ref<AttendanceSchoolRecord | null>(null)

  const decorateRow = (raw: Loose): AttendanceSchoolRecord => {
    const entryCh = raw.entryAcsChannel ?? raw.entryAscChannel
    const leavingCh = raw.leavingAcsChannel ?? raw.leavingAscChannel
    const row: AttendanceSchoolRecord = {
      ...(raw as AttendanceSchoolRecord),
      schoolStatus:
        statusSearchOptions.value.find((o) => String(o.value) === String(raw.schoolStatus ?? ''))
          ?.label ?? String(raw.schoolStatus ?? '--'),
      entryOpenType:
        openTypeSearchOptions.value.find(
          (o) => String(o.value) === String(raw.entryOpenType ?? '')
        )?.label ?? String(raw.entryOpenType ?? '--'),
      leavingOpenType:
        openTypeSearchOptions.value.find(
          (o) => String(o.value) === String(raw.leavingOpenType ?? '')
        )?.label ?? String(raw.leavingOpenType ?? '--'),
      entryTime: dateFormat(String(raw.entryTime ?? '')),
      leavingTime: dateFormat(String(raw.leavingTime ?? '')),
      attendanceDate: dateFormat(String(raw.attendanceDate ?? ''), 'yyyy-MM-dd'),
      createdAt: dateFormat(String(raw.createdAt ?? '')),
      entryAcsChannel: entryCh != null ? String(entryCh) : '',
      leavingAcsChannel: leavingCh != null ? String(leavingCh) : ''
    }
    return row
  }

  const loadData: UniTableRequest = async ({ pageNo, pageSize, filters: f }) => {
    const params: AttendanceSchoolListParams = {
      current: pageNo,
      size: pageSize,
      ...(f as Record<string, unknown>)
    }
    const raw = await attendanceSchoolApi.schoolPage.get(params)
    const { list, total } = normalizePaged<Loose>(raw)
    return {
      data: list.map(decorateRow),
      total
    }
  }

  const showDetail = (row: AttendanceSchoolRecord) => {
    activeRow.value = row
    detailVisible.value = true
  }

  const actions = computed<UniTableAction[]>(() => [
    {
      label: t('attendance.detail'),
      onClick: (row) => showDetail(row as AttendanceSchoolRecord)
    }
  ])

  const loadOpts = async () => {
    const [schools, depts] = await Promise.all([
      membershipApi.school.get(),
      attendanceSchoolApi.departmentList.get()
    ])
    schoolRecords.value = schools
    deptStrings.value = Array.isArray(depts) ? depts : []
  }

  loadOpts()

  return {
    actions,
    columns,
    activeRow,
    detailConfig,
    detailVisible,
    filters,
    handleLoadSuccess,
    loadData,
    queryModel,
    reset,
    search,
    searchCfg,
    tableRef
  }
}
