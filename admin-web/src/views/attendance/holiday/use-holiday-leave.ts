import type { UniTableAction, UniTableRequest } from 'uni-ui-lib'
import { ElMessage, ElMessageBox } from 'element-plus'
import { toUniOptions, useUniI18n, useUniListState } from 'uni-ui-lib'
import { computed, type Ref, ref } from 'vue'

import {
  attendanceHolidayColumns,
  attendanceHolidayDetailForm,
  attendanceHolidaySearchForm,
  formatHolidayDetailView,
  type AttendanceHolidayDetailViewModel
} from './list.config'
import { formatMaybeDateTime, unwrapDetailPayload, unwrapHolidayPage } from './holiday-utils'

import { useDialogDetailLoading } from '@/composables/use-dialog-detail-loading'
import { attendanceHolidayApi } from '@/api'
import type { AttendanceHolidayListParams, AttendanceHolidayRecord } from '@/types/modules/attendance-holiday'
import type { SchoolOptionRecord } from '@/types/modules/membership'

type Loose = Record<string, unknown>

/** 请假 Tab（列表 / 撤回 / 详情）。校区由外层 `tab.vue` 注入。 */
export const useHolidayLeave = (schoolRecords: Ref<SchoolOptionRecord[]>) => {
  const { locale, t } = useUniI18n()
  const { detailLoading, runWithDetailLoading } = useDialogDetailLoading()

  const initialFilters: Record<string, unknown> = {
    keyword: '',
    type: undefined,
    studentSchool: undefined,
    scp: undefined,
    beginTime: undefined,
    endTime: undefined
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

  const searchConfig = computed(() => attendanceHolidaySearchForm(t, schoolOptions.value))
  const columns = computed(() => attendanceHolidayColumns(t))
  const detailConfig = computed(() => attendanceHolidayDetailForm(t))

  const detailVisible = ref(false)
  const detailModel = ref<AttendanceHolidayDetailViewModel | null>(null)

  const decorateRow = (raw: Loose): AttendanceHolidayRecord => ({
    ...(raw as AttendanceHolidayRecord),
    createdAt: formatMaybeDateTime(raw.createdAt)
  })

  const loadData: UniTableRequest = async ({ pageNo, pageSize, filters: f }) => {
    const params: AttendanceHolidayListParams = {
      current: pageNo,
      size: pageSize,
      ...(f as Record<string, unknown>)
    }
    const raw = await attendanceHolidayApi.holidayPage.get(params)
    const { list, total } = unwrapHolidayPage(raw)
    return {
      data: list.map(decorateRow),
      total
    }
  }

  const openDetail = async (row: AttendanceHolidayRecord) => {
    if (row.id == null || row.id === '') {
      return
    }
    detailVisible.value = true
    detailModel.value = null
    await runWithDetailLoading(async () => {
      const raw = await attendanceHolidayApi.holidayDetail.get(row.id)
      const body = unwrapDetailPayload(raw)
      detailModel.value = formatHolidayDetailView(body, t)
    })
  }

  const withdraw = (row: AttendanceHolidayRecord) => {
    const procId = row.procId
    if (procId == null || procId === '' || row.id == null || row.id === '') {
      return
    }
    ElMessageBox.confirm(
      t('attendance.holiday.messages.withdrawConfirm', {
        procId: String(procId),
        id: String(row.id ?? '')
      }),
      t('attendance.holiday.messages.withdrawPrompt'),
      {
        type: 'warning',
        confirmButtonText: t('common.submit'),
        cancelButtonText: t('common.cancel')
      }
    )
      .then(async () => {
        await attendanceHolidayApi.holidayCancelFlow.get(procId, row.id)
        ElMessage.success(t('attendance.holiday.messages.withdrawSuccess'))
        tableRef.value?.refresh()
      })
      .catch(() => {})
  }

  const actions = computed<UniTableAction[]>(() => [
    {
      label: t('attendance.holiday.actions.withdraw'),
      visible: (row) =>
        row.procId != null &&
        row.procId !== '' &&
        String(row.status) !== '102' &&
        !(row as AttendanceHolidayRecord).isEnd,
      onClick: (row) => withdraw(row as AttendanceHolidayRecord)
    },
    {
      label: t('attendance.holiday.actions.detail'),
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
