import type { UniTableRequest } from 'uni-ui-lib'
import dayjs from 'dayjs'
import { toUniOptions, useUniI18n, useUniListState } from 'uni-ui-lib'
import { computed, ref } from 'vue'

import {
  dailyStatusOpts,
  dataFromOpts,
  searchForm,
  tableCols,
  ynOpts
} from './list.config'

import { attendanceDailyApi } from '@/api'
import { normalizeArray, normalizePaged } from '@/utils/api-response-normalize'
import type { Translate } from '@/types/i18n'
import type { AttendanceDailyListParams, AttendanceDailyRecord } from '@/types/modules/attendance-daily'

type Loose = Record<string, unknown>

const formatMaybeDateTime = (value: unknown) => {
  if (value == null || value === '') {
    return ''
  }
  const d = dayjs(String(value))
  return d.isValid() ? d.format('YYYY-MM-DD HH:mm:ss') : String(value)
}

const ynLabel = (raw: unknown, t: Translate) => {
  const n = Number(raw)
  if (n === 1) {
    return t('attendance.daily.options.ynYes')
  }
  if (n === 0) {
    return t('attendance.daily.options.ynNo')
  }
  return '--'
}

const statusLabel = (raw: unknown, t: Translate) => {
  const key = String(raw ?? '')
  const map: Record<string, string> = {
    Late: t('attendance.daily.options.statusLate'),
    Present: t('attendance.daily.options.statusPresent'),
    Leave: t('attendance.daily.options.statusLeave'),
    Absent: t('attendance.daily.options.statusAbsent'),
    Exit: t('attendance.daily.options.statusExit'),
    Enter: t('attendance.daily.options.statusEnter')
  }
  return map[key] || (key ? key : '--')
}

const dataFromLabel = (raw: unknown, t: Translate) => {
  const key = String(raw ?? '')
  const map: Record<string, string> = {
    MB: t('attendance.daily.options.dataFromMb'),
    schoolBus: t('attendance.daily.options.dataFromSchoolBus'),
    gate: t('attendance.daily.options.dataFromGate'),
    community: t('attendance.daily.options.dataFromCommunity')
  }
  return map[key] || key || '--'
}

/** 对齐旧页 `renderSection`：`MB` 来源展示「第 n 节课」，否则展示 `date2`。 */
const attendanceTimeText = (row: Loose, t: Translate) => {
  const df = row.dataFrom
  const d2 = row.date2
  if (df !== 'MB') {
    if (d2 == null || d2 === '') {
      return '-'
    }
    return String(d2)
  }
  if (d2 === '-') {
    return '-'
  }
  if (d2 == null || d2 === '') {
    return '-'
  }
  return t('attendance.daily.mbLesson', { period: String(d2) })
}

export const useList = () => {
  const { locale, t } = useUniI18n()

  const initialFilters: Record<string, unknown> = {
    schoolName: undefined,
    admissionNo: '',
    busStatus: undefined,
    dormitoryStatus: undefined,
    beginTime: undefined,
    endTime: undefined,
    dataFrom: undefined,
    status: undefined
  }

  const { queryModel, filters, tableRef, handleLoadSuccess, reset, search } = useUniListState({
    initialFilters
  })

  const schoolRecords = ref<Loose[]>([])
  const schoolOptions = computed(() =>
    toUniOptions(schoolRecords.value, {
      labelKeys: locale() === 'en' ? ['enName', 'name'] : ['name', 'cnName', 'enName'],
      valueKey: 'enName'
    })
  )

  const ynSearchOptions = computed(() => ynOpts(t))
  const dataFromSearchOptions = computed(() => dataFromOpts(t))
  const statusSearchOptions = computed(() => dailyStatusOpts(t))

  const searchCfg = computed(() =>
    searchForm(
      t,
      schoolOptions.value,
      ynSearchOptions.value,
      dataFromSearchOptions.value,
      statusSearchOptions.value
    )
  )

  const columns = computed(() => tableCols(t))

  const decorateRow = (raw: Loose): AttendanceDailyRecord => {
    const row: AttendanceDailyRecord = { ...(raw as AttendanceDailyRecord) }
    row._key = String(raw.id ?? `${raw.admissionNo ?? ''}-${raw.date ?? ''}-${raw.createdAt ?? ''}`)
    row.busStatusLabel = ynLabel(raw.busStatus, t)
    row.dormitoryStatusLabel = ynLabel(raw.dormitoryStatus, t)
    row.statusLabel = statusLabel(raw.status, t)
    row.dataFromLabel = dataFromLabel(raw.dataFrom, t)
    row.attendanceTimeLabel = attendanceTimeText(raw, t)
    row.createdAt = formatMaybeDateTime(raw.createdAt)
    row.form = raw.form != null && raw.form !== '' ? String(raw.form) : '-'
    return row
  }

  const loadData: UniTableRequest = async ({ pageNo, pageSize, filters: f }) => {
    const flat = f as Record<string, unknown>
    const params: AttendanceDailyListParams = {
      current: pageNo,
      size: pageSize,
      schoolName: flat.schoolName ? String(flat.schoolName) : undefined,
      admissionNo: flat.admissionNo ? String(flat.admissionNo) : undefined,
      busStatus: flat.busStatus as AttendanceDailyListParams['busStatus'],
      dormitoryStatus: flat.dormitoryStatus as AttendanceDailyListParams['dormitoryStatus'],
      beginTime: flat.beginTime ? String(flat.beginTime) : undefined,
      endTime: flat.endTime ? String(flat.endTime) : undefined,
      dataFrom: flat.dataFrom ? String(flat.dataFrom) : undefined,
      status: flat.status ? String(flat.status) : undefined
    }

    const raw = await attendanceDailyApi.dailyPage.get(params)
    const { list, total } = normalizePaged<Loose>(raw)
    return {
      data: list.map(decorateRow),
      total
    }
  }

  const loadSchools = async () => {
    const payload = await attendanceDailyApi.commonSchoolList.get()
    schoolRecords.value = (normalizeArray(payload) as Loose[]).filter(
      (s) => s.enName != null && s.enName !== ''
    )
  }

  loadSchools()

  return {
    columns,
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
