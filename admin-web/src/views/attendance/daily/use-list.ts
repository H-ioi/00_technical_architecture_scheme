import type { UniTableRequest } from 'uni-ui-lib'
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
import { dateFormat } from '@/utils/tool'
import type { AttendanceDailyListParams, AttendanceDailyRecord } from '@/types/modules/attendance-daily'

type Loose = Record<string, unknown>

/** 对齐旧页 `renderSection`：`MB` 来源展示「第 n 节课」，否则展示 `date2`。 */
const attendanceTimeText = (row: Loose, tr: (key: string, params?: Record<string, unknown>) => string) => {
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
  return tr('attendance.daily.mbLesson', { period: String(d2) })
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

    const busN = Number(raw.busStatus)
    const dormN = Number(raw.dormitoryStatus)
    row.busStatusLabel =
      busN === 1 ? t('attendance.yes') : busN === 0 ? t('attendance.no') : '--'
    row.dormitoryStatusLabel =
      dormN === 1 ? t('attendance.yes') : dormN === 0 ? t('attendance.no') : '--'

    const statusKey = String(raw.status ?? '')
    const statusMap: Record<string, string> = {
      Late: t('attendance.daily.statusLate'),
      Present: t('attendance.daily.statusPresent'),
      Leave: t('attendance.daily.statusLeave'),
      Absent: t('attendance.daily.statusAbsent'),
      Exit: t('attendance.daily.statusExit'),
      Enter: t('attendance.daily.statusEnter')
    }
    row.statusLabel = statusMap[statusKey] || (statusKey ? statusKey : '--')

    const dataFromKey = String(raw.dataFrom ?? '')
    const dataFromMap: Record<string, string> = {
      MB: t('attendance.daily.dataFromMb'),
      schoolBus: t('attendance.daily.dataFromSchoolBus'),
      gate: t('attendance.daily.dataFromGate'),
      community: t('attendance.daily.dataFromCommunity')
    }
    row.dataFromLabel = dataFromMap[dataFromKey] || dataFromKey || '--'

    row.attendanceTimeLabel = attendanceTimeText(raw, t)
    row.createdAt = dateFormat(String(raw.createdAt ?? ''))
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
