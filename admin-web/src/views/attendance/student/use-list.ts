import type { UniTableAction, UniTableRequest } from 'uni-ui-lib'
import dayjs from 'dayjs'
import { toUniOptions, useUniI18n, useUniListState } from 'uni-ui-lib'
import { computed, ref } from 'vue'

import {
  attendanceSchoolStatusOpts,
  detailForm,
  searchForm,
  tableCols,
  ynOpts
} from './list.config'

import { attendanceStudentApi, membershipApi } from '@/api'
import { normalizePaged } from '@/utils/api-response-normalize'
import type {
  AttendanceStudentListParams,
  AttendanceStudentRecord
} from '@/types/modules/attendance-student'
import type { SchoolOptionRecord } from '@/types/modules/membership'

type Loose = Record<string, unknown>

const formatMaybeDateTime = (value: unknown) => {
  if (value == null || value === '') {
    return ''
  }
  const d = dayjs(String(value))
  return d.isValid() ? d.format('YYYY-MM-DD HH:mm:ss') : String(value)
}

const formatDateOnly = (value: unknown) => {
  if (value == null || value === '') {
    return ''
  }
  const d = dayjs(String(value))
  return d.isValid() ? d.format('YYYY-MM-DD') : String(value)
}

export const useList = () => {
  const { locale, t } = useUniI18n()
  const initialFilters: Record<string, unknown> = {
    schoolId: undefined,
    admissionNo: '',
    grade: undefined,
    onBoarding: undefined,
    onBus: undefined,
    schoolStatus: undefined,
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

  const gradeStrings = ref<string[]>([])
  const gradeOptions = computed(() =>
    toUniOptions(
      gradeStrings.value.map((g) => ({ label: g, value: g })),
      { labelKeys: ['label'], valueKey: 'value' }
    )
  )

  const ynSearchOptions = computed(() => ynOpts(t))
  const statusSearchOptions = computed(() => attendanceSchoolStatusOpts(t))

  const searchCfg = computed(() =>
    searchForm(
      t,
      schoolOptions.value,
      gradeOptions.value,
      ynSearchOptions.value,
      statusSearchOptions.value
    )
  )

  const columns = computed(() => tableCols(t, schoolOptions.value))

  const detailConfig = computed(() => detailForm(t, schoolOptions.value))

  const detailVisible = ref(false)
  const activeRow = ref<AttendanceStudentRecord | null>(null)

  const ynLabel = (raw: unknown) => {
    const s = String(raw ?? '')
    if (s === '1') {
      return t('attendance.yes')
    }
    if (s === '0') {
      return t('attendance.no')
    }
    return '--'
  }

  const statusLabel = (raw: unknown) => {
    const row = statusSearchOptions.value.find((o) => String(o.value) === String(raw ?? ''))
    return row?.label ?? String(raw ?? '--')
  }

  const decorateRow = (raw: Loose): AttendanceStudentRecord => {
    const row: AttendanceStudentRecord = {
      ...(raw as AttendanceStudentRecord),
      boarding: ynLabel(raw.boarding),
      schoolBus: ynLabel(raw.schoolBus),
      schoolStatus: statusLabel(raw.schoolStatus),
      attendanceDate: formatDateOnly(raw.attendanceDate),
      entryTime: formatMaybeDateTime(raw.entryTime),
      leavingTime: formatMaybeDateTime(raw.leavingTime),
      updatedAt: formatMaybeDateTime(raw.updatedAt),
      createdAt: formatMaybeDateTime(raw.createdAt)
    }
    return row
  }

  const loadData: UniTableRequest = async ({ pageNo, pageSize, filters: f }) => {
    const params: AttendanceStudentListParams = {
      current: pageNo,
      size: pageSize,
      ...(f as Record<string, unknown>)
    }
    const raw = await attendanceStudentApi.studentPage.get(params)
    const { list, total } = normalizePaged<Loose>(raw)
    return {
      data: list.map(decorateRow),
      total
    }
  }

  const showDetail = (row: AttendanceStudentRecord) => {
    activeRow.value = row
    detailVisible.value = true
  }

  /** 旧页「查看」未绑定权限码，全员可见。 */
  const actions = computed<UniTableAction[]>(() => [
    {
      label: t('attendance.detail'),
      onClick: (row) => showDetail(row as AttendanceStudentRecord)
    }
  ])

  const loadOpts = async () => {
    const [schools, grades] = await Promise.all([
      membershipApi.school.get(),
      attendanceStudentApi.gradeList.get()
    ])
    schoolRecords.value = schools
    gradeStrings.value = Array.isArray(grades) ? grades : []
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
