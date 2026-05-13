import type { UniTableAction, UniTableRequest } from 'uni-ui-lib'
import { toUniOptions, useUniI18n, useUniListState } from 'uni-ui-lib'
import { computed, type Ref, ref } from 'vue'

import {
  attendanceHolidayDetailForm,
  attendanceHolidayReturnColumns,
  attendanceHolidayReturnSearchForm,
  formatHolidayDetailView,
  type AttendanceHolidayDetailViewModel
} from './list.config'
import { formatMaybeDateTime, normalizeHolidayReturnRow } from './holiday-utils'

import { useDialogDetailLoading } from '@/composables/use-dialog-detail-loading'
import { normalizeApiEnvelope, normalizeApiPagedBody } from '@/utils/api-response-normalize'
import { attendanceHolidayApi } from '@/api'
import type {
  AttendanceHolidayRecord,
  AttendanceHolidayReturnListParams
} from '@/types/modules/attendance-holiday'
import type { SchoolOptionRecord } from '@/types/modules/membership'

type Loose = Record<string, unknown>

/** 打开请假详情：销假行优先带 `holidayId`，否则用列表 `id`。 */
const resolveHolidayDetailId = (row: AttendanceHolidayRecord): string | number | undefined => {
  const r = row as Loose
  const hid = r.holidayId ?? r.holiday_id ?? r.leaveId ?? r.leave_id
  if (hid !== undefined && hid !== null && hid !== '') {
    return hid as string | number
  }
  return row.id
}

/** 销假 Tab：`GET /attendance/holiday-return/return-page`（旧「销假管理」）；筛选项仅学校 + 学号/姓名。 */
export const useHolidayReturn = (schoolRecords: Ref<SchoolOptionRecord[]>) => {
  const { locale, t } = useUniI18n()
  const { detailLoading, runWithDetailLoading } = useDialogDetailLoading()

  const initialFilters: Record<string, unknown> = {
    keyword: '',
    studentSchool: undefined
  }

  const { queryModel, filters, tableRef, handleLoadSuccess, reset, search } = useUniListState({
    initialFilters
  })

  const schoolOptions = computed(() =>
    toUniOptions(schoolRecords.value, {
      labelKeys: locale() === 'en' ? ['enName', 'name'] : ['name', 'cnName', 'enName'],
      valueKey: 'enName'
    })
  )

  const searchConfig = computed(() => attendanceHolidayReturnSearchForm(t, schoolOptions.value))
  const columns = computed(() => attendanceHolidayReturnColumns(t))
  const detailConfig = computed(() => attendanceHolidayDetailForm(t))

  const detailVisible = ref(false)
  const detailModel = ref<AttendanceHolidayDetailViewModel | null>(null)

  const decorateRow = (raw: Loose): AttendanceHolidayRecord => ({
    ...(raw as AttendanceHolidayRecord),
    createdAt: formatMaybeDateTime(raw.createdAt)
  })

  const loadData: UniTableRequest = async ({ pageNo, pageSize, filters: f }) => {
    const fv = f as Record<string, unknown>
    const params: AttendanceHolidayReturnListParams = {
      current: pageNo,
      size: pageSize,
      keyword: typeof fv.keyword === 'string' ? fv.keyword : undefined,
      studentSchool:
        fv.studentSchool !== undefined && fv.studentSchool !== null && fv.studentSchool !== ''
          ? String(fv.studentSchool)
          : undefined
    }
    const raw = await attendanceHolidayApi.holidayReturnPage.get(params)
    const { list, total } = normalizeApiPagedBody(raw)
    return {
      data: list.map((row) => decorateRow(normalizeHolidayReturnRow(row))),
      total
    }
  }

  const openDetail = async (row: AttendanceHolidayRecord) => {
    const detailId = resolveHolidayDetailId(row)
    if (detailId == null || detailId === '') {
      return
    }
    detailVisible.value = true
    detailModel.value = null
    await runWithDetailLoading(async () => {
      const raw = await attendanceHolidayApi.holidayDetail.get(detailId)
      const body = normalizeApiEnvelope(raw)
      detailModel.value = formatHolidayDetailView(body, t)
    })
  }

  const actions = computed<UniTableAction[]>(() => [
    {
      label: t('attendance.holiday.actions.detail'),
      visible: (row) => {
        const id = resolveHolidayDetailId(row as AttendanceHolidayRecord)
        return id != null && id !== ''
      },
      onClick: (row) => openDetail(row as AttendanceHolidayRecord)
    }
  ])

  return {
    actions,
    columns,
    detailConfig,
    detailLoading,
    detailModel,
    detailVisible,
    filters,
    handleLoadSuccess,
    loadData,
    queryModel,
    reset,
    search,
    searchConfig,
    tableRef
  }
}
