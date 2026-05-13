import type { UniTableAction, UniTableRequest } from 'uni-ui-lib'
import dayjs from 'dayjs'
import { toUniOptions, useUniI18n, useUniListState } from 'uni-ui-lib'
import { computed, ref } from 'vue'

import {
  detailForm,
  searchForm,
  tableCols,
  wechatOpenidStatusOpts
} from './list.config'

import { attendanceWechatOpenidApi, membershipApi } from '@/api'
import { normalizePaged } from '@/utils/api-response-normalize'
import type {
  AttendanceWechatOpenidListParams,
  AttendanceWechatOpenidRecord
} from '@/types/modules/attendance-wechat-openid'
import type { SchoolOptionRecord } from '@/types/modules/membership'

type Loose = Record<string, unknown>

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

  const searchCfg = computed(() =>
    searchForm(t, schoolOptions.value, statusSearchOptions.value)
  )

  const columns = computed(() => tableCols(t, schoolOptions.value))

  const detailConfig = computed(() => detailForm(t, schoolOptions.value))

  const detailVisible = ref(false)
  const activeRow = ref<AttendanceWechatOpenidRecord | null>(null)

  const selection = ref<AttendanceWechatOpenidRecord[]>([])
  const onSelectionChange = (rows: unknown[]) => {
    selection.value = rows as AttendanceWechatOpenidRecord[]
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
    const { list, total } = normalizePaged<Loose>(raw)
    return {
      data: list.map(decorateRow),
      total
    }
  }

  const showDetail = (row: AttendanceWechatOpenidRecord) => {
    activeRow.value = row
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
    activeRow,
    detailConfig,
    detailVisible,
    filters,
    handleLoadSuccess,
    loadData,
    onSelectionChange,
    selection,
    queryModel,
    refreshTable,
    reset,
    search,
    searchCfg,
    tableRef
  }
}
