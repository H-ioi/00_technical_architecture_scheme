import type { UniTableAction, UniTableRequest } from 'uni-ui-lib'
import { ElMessage, ElMessageBox } from 'element-plus'
import { toUniOptions, useUniI18n, useUniListState } from 'uni-ui-lib'
import { computed, type Ref, ref } from 'vue'

import {
  detailForm,
  formatHolidayDetailView,
  searchForm,
  tableCols,
  type AttendanceHolidayDetailViewModel
} from './list.config'
import { formatMaybeDateTime, normalizeHolidayListRow } from './holiday-utils'

import { useDialogDetailLoading } from '@/composables/use-dialog-detail-loading'
import { normalizeEnvelope, normalizePaged } from '@/utils/api-response-normalize'
import { attendanceHolidayApi } from '@/api'
import type { AttendanceHolidayListParams, AttendanceHolidayRecord } from '@/types/modules/attendance-holiday'
import type { SchoolOptionRecord } from '@/types/modules/membership'

type Loose = Record<string, unknown>

/**
 * 旧 `cancelFlow(procId, id)` 模板拼接：`${base}/holiday/back/${procId}/${id}`。
 * JSON `procId: null` → 路径段为字面量 **null**（如 `/back/null/70`），后端按请假 id 处理，并非未实现。
 */
const holidayBackProcPathSegment = (procId: unknown): string | number => {
  if (procId === undefined || procId === null || procId === '') {
    return 'null'
  }
  return (typeof procId === 'number' || typeof procId === 'string') ? procId : String(procId)
}

/** 对齐 `test/old-test/.../leaveManage.vue`：撤销为 `1100|1103` 且 `dataFrom !== 'MB'`（勿与 admin-web/old 单页 index 的 `procId/!isEnd` 混淆）。 */
const withdrawVisible = (row: AttendanceHolidayRecord): boolean => {
  const r = row as Loose
  if (r.dataFrom === 'MB' || r.data_from === 'MB') {
    return false
  }
  const st = row.status
  return st === '1100' || st === 1100 || st === '1103' || st === 1103
}

const deleteVisible = (row: AttendanceHolidayRecord): boolean =>
  row.id != null && row.id !== ''

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

  const searchCfg = computed(() => searchForm(t, schoolOptions.value))
  const columns = computed(() => tableCols(t))
  const detailConfig = computed(() => detailForm(t))

  const detailVisible = ref(false)
  const detailModel = ref<AttendanceHolidayDetailViewModel | null>(null)

  const decorateRow = (raw: Loose): AttendanceHolidayRecord => {
    const n = normalizeHolidayListRow(raw)
    return {
      ...(n as AttendanceHolidayRecord),
      createdAt: formatMaybeDateTime(n.createdAt)
    }
  }

  const loadData: UniTableRequest = async ({ pageNo, pageSize, filters: f }) => {
    const params: AttendanceHolidayListParams = {
      current: pageNo,
      size: pageSize,
      ...(f as Record<string, unknown>)
    }
    const raw = await attendanceHolidayApi.holidayPage.get(params)
    const { list, total } = normalizePaged(raw)
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
      const body = normalizeEnvelope(raw)
      detailModel.value = formatHolidayDetailView(body, t)
    })
  }

  const withdraw = (row: AttendanceHolidayRecord) => {
    const procId = row.procId
    const holidayId = row.id
    if (holidayId == null || holidayId === '') {
      ElMessage.warning(t('attendance.holiday.withdrawMissingId'))
      return
    }
    const procSeg = holidayBackProcPathSegment(procId)
    ElMessageBox.confirm(
      t('attendance.holiday.withdrawConfirm', {
        procId: String(procSeg),
        id: String(holidayId ?? '')
      }),
      t('attendance.tipTitle'),
      {
        type: 'warning',
        confirmButtonText: t('common.submit'),
        cancelButtonText: t('common.cancel')
      }
    )
      .then(async () => {
        try {
          await attendanceHolidayApi.holidayCancelFlow.get(procSeg, holidayId)
          ElMessage.success(t('attendance.holiday.withdrawSuccess'))
          tableRef.value?.refresh()
        } catch {
          ElMessage.error(t('attendance.holiday.withdrawFail'))
        }
      })
      .catch(() => {})
  }

  const removeRow = (row: AttendanceHolidayRecord) => {
    if (row.id == null || row.id === '') {
      return
    }
    ElMessageBox.confirm(
      t('attendance.holiday.deleteConfirm', { id: String(row.id) }),
      t('attendance.tipTitle'),
      {
        type: 'warning',
        confirmButtonText: t('common.submit'),
        cancelButtonText: t('common.cancel')
      }
    )
      .then(async () => {
        await attendanceHolidayApi.holidayDelete.remove(row.id)
        ElMessage.success(t('attendance.holiday.deleteSuccess'))
        tableRef.value?.refresh()
      })
      .catch(() => {})
  }

  const actions = computed<UniTableAction[]>(() => [
    {
      label: t('attendance.holiday.withdraw'),
      visible: (row) => withdrawVisible(row as AttendanceHolidayRecord),
      onClick: (row) => withdraw(row as AttendanceHolidayRecord)
    },
    {
      label: t('attendance.detail'),
      onClick: (row) => openDetail(row as AttendanceHolidayRecord)
    },
    {
      label: t('attendance.delete'),
      visible: (row) => deleteVisible(row as AttendanceHolidayRecord),
      onClick: (row) => removeRow(row as AttendanceHolidayRecord)
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
    searchCfg,
    tableRef
  }
}
