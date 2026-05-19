import type { UniTableAction, UniTableRequest } from 'uni-ui-lib'
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
import { dateFormat } from '@/utils/tool'
import type {
  AttendanceStudentListParams,
  AttendanceStudentRecord
} from '@/types/modules/attendance-student'
import type { SchoolOptionRecord } from '@/types/modules/membership'

type Loose = Record<string, unknown>

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

  const decorateRow = (raw: Loose): AttendanceStudentRecord => {
    const boardingStr = String(raw.boarding ?? '')
    const schoolBusStr = String(raw.schoolBus ?? '')
    const statusHit = statusSearchOptions.value.find(
      (o) => String(o.value) === String(raw.schoolStatus ?? '')
    )
    const row: AttendanceStudentRecord = {
      ...(raw as AttendanceStudentRecord),
      boarding:
        boardingStr === '1'
          ? t('attendance.yes')
          : boardingStr === '0'
            ? t('attendance.no')
            : '--',
      schoolBus:
        schoolBusStr === '1'
          ? t('attendance.yes')
          : schoolBusStr === '0'
            ? t('attendance.no')
            : '--',
      schoolStatus: statusHit?.label ?? String(raw.schoolStatus ?? '--'),
      attendanceDate: dateFormat(String(raw.attendanceDate ?? ''), 'yyyy-MM-dd'),
      entryTime: dateFormat(String(raw.entryTime ?? '')),
      leavingTime: dateFormat(String(raw.leavingTime ?? '')),
      updatedAt: dateFormat(String(raw.updatedAt ?? '')),
      createdAt: dateFormat(String(raw.createdAt ?? ''))
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
