import type { UniTableAction, UniTableRequest } from 'uni-ui-lib'
import dayjs from 'dayjs'
import { toUniOptions, useUniI18n, useUniListState } from 'uni-ui-lib'
import { computed, ref } from 'vue'

import {
  attendanceWechatNoticeColumns,
  attendanceWechatNoticeDetailForm,
  attendanceWechatNoticeSearchForm,
  wechatNoticeSendStatusOpts
} from './list.config'

import { attendanceWechatNoticeApi, membershipApi } from '@/api'
import type {
  AttendanceWechatNoticeListParams,
  AttendanceWechatNoticeRecord
} from '@/types/modules/attendance-wechat-notice'
import type { SchoolOptionRecord } from '@/types/modules/membership'

type Loose = Record<string, unknown>

const unwrapNoticePage = (payload: unknown): { list: Loose[]; total: number } => {
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
    personName: '',
    openId: '',
    sendStatus: undefined,
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

  const sendStatusSearchOptions = computed(() => wechatNoticeSendStatusOpts(t))

  const searchConfig = computed(() =>
    attendanceWechatNoticeSearchForm(t, schoolOptions.value, sendStatusSearchOptions.value)
  )

  const columns = computed(() => attendanceWechatNoticeColumns(t, schoolOptions.value))

  const detailConfig = computed(() => attendanceWechatNoticeDetailForm(t, schoolOptions.value))

  const detailVisible = ref(false)
  const currentRecord = ref<AttendanceWechatNoticeRecord | null>(null)

  const sendStatusLabel = (raw: unknown) => {
    const s = String(raw ?? '')
    const row = sendStatusSearchOptions.value.find((o) => String(o.value) === s)
    return row?.label ?? (s === '' ? '--' : s)
  }

  const decorateRow = (raw: Loose): AttendanceWechatNoticeRecord => ({
    ...(raw as AttendanceWechatNoticeRecord),
    sendStatus: sendStatusLabel(raw.sendStatus),
    updateTime: formatMaybeDateTime(raw.updateTime),
    createTime: formatMaybeDateTime(raw.createTime)
  })

  const loadData: UniTableRequest = async ({ pageNo, pageSize, filters: f }) => {
    const params: AttendanceWechatNoticeListParams = {
      current: pageNo,
      size: pageSize,
      ...(f as Record<string, unknown>)
    }
    const raw = await attendanceWechatNoticeApi.noticePage.get(params)
    const { list, total } = unwrapNoticePage(raw)
    return {
      data: list.map(decorateRow),
      total
    }
  }

  const showDetail = (row: AttendanceWechatNoticeRecord) => {
    currentRecord.value = row
    detailVisible.value = true
  }

  const actions = computed<UniTableAction[]>(() => [
    {
      label: t('attendance.wechatNotice.actions.detail'),
      onClick: (row) => showDetail(row as AttendanceWechatNoticeRecord)
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
    queryModel,
    reset,
    search,
    searchConfig,
    tableRef
  }
}
