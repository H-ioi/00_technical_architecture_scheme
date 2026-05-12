import type { UniTableAction, UniTableRequest } from 'uni-ui-lib'
import dayjs from 'dayjs'
import { toUniOptions, useUniI18n, useUniListState } from 'uni-ui-lib'
import { computed, ref } from 'vue'

import {
  attendanceWechatOpenidColumns,
  attendanceWechatOpenidDetailForm,
  attendanceWechatOpenidSearchForm,
  wechatOpenidStatusOpts
} from './list.config'

import { attendanceWechatOpenidApi, membershipApi } from '@/api'
import type {
  AttendanceWechatOpenidListParams,
  AttendanceWechatOpenidRecord
} from '@/types/modules/attendance-wechat-openid'
import type { SchoolOptionRecord } from '@/types/modules/membership'

type Loose = Record<string, unknown>

const unwrapOpenidPage = (payload: unknown): { list: Loose[]; total: number } => {
  if (!payload || typeof payload !== 'object') {
    return { list: [], total: 0 }
  }
  const r = payload as Loose
  const num = (value: unknown) => (typeof value === 'number' && Number.isFinite(value) ? value : 0)
  if (Array.isArray(r.data)) {
    return { list: r.data as Loose[], total: num(r.total) }
  }
  const inner = r.data
  if (inner && typeof inner === 'object' && !Array.isArray(inner)) {
    const obj = inner as Loose
    const list = Array.isArray(obj.data) ? (obj.data as Loose[]) : []
    return { list, total: num(r.total) || num(obj.total) }
  }
  return { list: [], total: num(r.total) }
}

const formatMaybeDateTime = (value: unknown) => {
  if (value == null || value === '') {
    return ''
  }
  const d = dayjs(String(value))
  return d.isValid() ? d.format('YYYY-MM-DD HH:mm:ss') : String(value)
}

export const useList = () => {
  const { locale, t } = useUniI18n()
  const initialFilters: Record<string, unknown> = {
    schoolId: undefined,
    admissionNo: '',
    nickname: '',
    openId: '',
    status: undefined,
    beginDate: undefined,
    endDate: undefined
  }

  const { queryModel, filters, tableRef, handleLoadSuccess, reset, search, refreshTable } =
    useUniListState({
      initialFilters
    })

  const schoolRecords = ref<SchoolOptionRecord[]>([])
  const schoolOptions = computed(() =>
    toUniOptions(schoolRecords.value, {
      labelKeys: locale() === 'en' ? ['enName', 'name'] : ['name', 'cnName', 'enName'],
      valueKey: 'id'
    })
  )

  const statusSearchOptions = computed(() => wechatOpenidStatusOpts(t))

  const searchConfig = computed(() =>
    attendanceWechatOpenidSearchForm(t, schoolOptions.value, statusSearchOptions.value)
  )

  const columns = computed(() => attendanceWechatOpenidColumns(t, schoolOptions.value))

  const detailConfig = computed(() => attendanceWechatOpenidDetailForm(t, schoolOptions.value))

  const detailVisible = ref(false)
  const currentRecord = ref<AttendanceWechatOpenidRecord | null>(null)

  const picked = ref<AttendanceWechatOpenidRecord[]>([])
  const onSelectionChange = (rows: unknown[]) => {
    picked.value = rows as AttendanceWechatOpenidRecord[]
  }

  const statusLabel = (raw: unknown) => {
    const row = statusSearchOptions.value.find((o) => String(o.value) === String(raw ?? ''))
    return row?.label ?? String(raw ?? '--')
  }

  const decorateRow = (raw: Loose): AttendanceWechatOpenidRecord => ({
    ...(raw as AttendanceWechatOpenidRecord),
    status: statusLabel(raw.status),
    updateTime: formatMaybeDateTime(raw.updateTime),
    createTime: formatMaybeDateTime(raw.createTime)
  })

  const loadData: UniTableRequest = async ({ pageNo, pageSize, filters: f }) => {
    const params: AttendanceWechatOpenidListParams = {
      current: pageNo,
      size: pageSize,
      ...(f as Record<string, unknown>)
    }
    const raw = await attendanceWechatOpenidApi.openidPage.get(params)
    const { list, total } = unwrapOpenidPage(raw)
    return {
      data: list.map(decorateRow),
      total
    }
  }

  const showDetail = (row: AttendanceWechatOpenidRecord) => {
    currentRecord.value = row
    detailVisible.value = true
  }

  const actions = computed<UniTableAction[]>(() => [
    {
      label: t('attendance.wechatOpenid.actions.detail'),
      onClick: (row) => showDetail(row as AttendanceWechatOpenidRecord)
    }
  ])

  const loadOpts = async () => {
    schoolRecords.value = await membershipApi.school.get()
  }

  loadOpts()

  return {
    actions,
    columns,
    currentRecord,
    detailConfig,
    detailVisible,
    filters,
    handleLoadSuccess,
    loadData,
    onSelectionChange,
    picked,
    queryModel,
    refreshTable,
    reset,
    search,
    searchConfig,
    tableRef
  }
}
