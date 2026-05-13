import type { UniTableAction, UniTableRequest } from 'uni-ui-lib'
import { toUniOptions, useUniI18n, useUniListState, useUniPermission } from 'uni-ui-lib'
import { ElMessage, ElMessageBox } from 'element-plus'
import { computed, ref } from 'vue'

import { leavePassColumns, leavePassSearchForm } from './list.config'
import { unwrapHolidayPage } from '@/views/attendance/holiday/holiday-utils'

import { attendanceHolidayApi, membershipApi } from '@/api'
import type { AttendanceLeavePassRecord } from '@/types/modules/attendance-holiday'
import type { SchoolOptionRecord } from '@/types/modules/membership'

type Loose = Record<string, unknown>

export const useList = () => {
  const { locale, t } = useUniI18n()
  const { hasPermission } = useUniPermission()
  const schoolRecords = ref<SchoolOptionRecord[]>([])
  const selectedRows = ref<AttendanceLeavePassRecord[]>([])

  const { queryModel, filters, tableRef, handleLoadSuccess, reset, search } = useUniListState({
    initialFilters: { keyword: '', studentSchool: '', isDormitory: '' }
  })

  const schoolOptions = computed(() =>
    toUniOptions(schoolRecords.value, {
      labelKeys: locale() === 'en' ? ['enName', 'name'] : ['name', 'cnName', 'enName'],
      valueKey: 'enName'
    })
  )

  const searchConfig = computed(() => leavePassSearchForm(t, schoolOptions.value))
  const columns = computed(() => leavePassColumns(t))

  const dialogVisible = ref(false)
  const dialogEdit = ref<AttendanceLeavePassRecord | null>(null)
  const dialogViewOnly = ref(false)
  const batchPayload = ref<AttendanceLeavePassRecord[] | null>(null)

  const loadData: UniTableRequest = async ({ pageNo, pageSize, filters: f }) => {
    const raw = await attendanceHolidayApi.leavePassPage.get({
      current: pageNo,
      size: pageSize,
      ...(f as Loose)
    })
    const { list, total } = unwrapHolidayPage(raw)
    return { data: list as AttendanceLeavePassRecord[], total }
  }

  const refresh = () => tableRef.value?.refresh()

  const updateRowStatus = (row: AttendanceLeavePassRecord, status: number) => {
    ElMessageBox.confirm(t('attendance.holidayPass.messages.actionConfirm'), t('attendance.holiday.messages.withdrawPrompt'), {
      type: 'warning',
      confirmButtonText: t('common.submit'),
      cancelButtonText: t('common.cancel')
    })
      .then(async () => {
        await attendanceHolidayApi.leavePassUpdateStatus.post({
          id: row.id,
          passTime: row.passTime,
          status,
          dataFrom: 'admin'
        })
        ElMessage.success(t('attendance.holiday.messages.withdrawSuccess'))
        refresh()
      })
      .catch(() => {})
  }

  const openAdd = () => {
    dialogEdit.value = null
    dialogViewOnly.value = false
    batchPayload.value = null
    dialogVisible.value = true
  }

  const openView = (row: AttendanceLeavePassRecord, viewOnly: boolean) => {
    dialogEdit.value = { ...(row as AttendanceLeavePassRecord) }
    dialogViewOnly.value = viewOnly
    batchPayload.value = null
    dialogVisible.value = true
  }

  const openBatch = () => {
    if (selectedRows.value.length === 0) {
      ElMessage.warning(t('attendance.holidayPass.messages.needSelection'))
      return
    }
    const bad = selectedRows.value.some((item) => String(item.status) !== '2')
    if (bad) {
      ElMessage.warning(t('attendance.holidayPass.messages.batchOnlyPending'))
      return
    }
    dialogEdit.value = null
    dialogViewOnly.value = false
    batchPayload.value = [...selectedRows.value]
    dialogVisible.value = true
  }

  const batchDelete = () => {
    if (selectedRows.value.length === 0) {
      ElMessage.warning(t('attendance.holidayPass.messages.needSelection'))
      return
    }
    const bad = selectedRows.value.some((item) => String(item.status) === '0')
    if (bad) {
      ElMessage.warning(t('attendance.holidayPass.messages.cannotDeleteActive'))
      return
    }
    ElMessageBox.confirm(t('attendance.holidayPass.messages.batchDeleteConfirm'), t('attendance.holiday.messages.withdrawPrompt'), {
      type: 'warning',
      confirmButtonText: t('common.submit'),
      cancelButtonText: t('common.cancel')
    })
      .then(async () => {
        const ids = selectedRows.value.map((r) => r.id).filter((id) => id != null)
        await attendanceHolidayApi.leavePassUpdateBatchStatus.post({ ids, status: -1 })
        ElMessage.success(t('attendance.holiday.messages.withdrawSuccess'))
        refresh()
      })
      .catch(() => {})
  }

  const onSelectionChange = (rows: Record<string, unknown>[]) => {
    selectedRows.value = rows as AttendanceLeavePassRecord[]
  }

  const actions = computed<UniTableAction[]>(() => [
    {
      label: t('attendance.holiday.actions.delete'),
      visible: (row) =>
        hasPermission('pass-delete') &&
        String((row as AttendanceLeavePassRecord).status) !== '0',
      onClick: (row) => updateRowStatus(row as AttendanceLeavePassRecord, -1)
    },
    {
      label: t('attendance.holidayPass.actions.void'),
      visible: (row) => {
        const st = Number((row as AttendanceLeavePassRecord).status)
        return hasPermission('pass-voided') && ![3, 2, 1].includes(st)
      },
      onClick: (row) => updateRowStatus(row as AttendanceLeavePassRecord, 1)
    },
    {
      label: t('attendance.holiday.actions.detail'),
      onClick: (row) => openView(row as AttendanceLeavePassRecord, true)
    },
    {
      label: t('attendance.holidayPass.actions.generate'),
      visible: (row) =>
        hasPermission('pass-generated') && String((row as AttendanceLeavePassRecord).status) === '2',
      onClick: (row) => openView(row as AttendanceLeavePassRecord, false)
    }
  ])

  const initSchools = async () => {
    schoolRecords.value = await membershipApi.school.get()
  }

  return {
    actions,
    batchDelete,
    batchPayload,
    columns,
    dialogEdit,
    dialogVisible,
    dialogViewOnly,
    filters,
    handleLoadSuccess,
    hasPermission,
    initSchools,
    loadData,
    onSelectionChange,
    openAdd,
    openBatch,
    queryModel,
    refresh,
    reset,
    search,
    searchConfig,
    selectedRows,
    schoolOptions,
    tableRef
  }
}
