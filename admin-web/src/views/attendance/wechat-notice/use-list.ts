import type { UniTableAction, UniTableRequest } from 'uni-ui-lib'
import { toUniOptions, useUniI18n, useUniListState } from 'uni-ui-lib'
import { computed, ref } from 'vue'

import {
  detailForm,
  searchForm,
  tableCols,
  wechatNoticeSendStatusOpts
} from './list.config'

import { attendanceWechatNoticeApi, membershipApi } from '@/api'
import { normalizePaged } from '@/utils/api-response-normalize'
import { dateFormat } from '@/utils/tool'
import type {
  AttendanceWechatNoticeListParams,
  AttendanceWechatNoticeRecord
} from '@/types/modules/attendance-wechat-notice'
import type { SchoolOptionRecord } from '@/types/modules/membership'

type Loose = Record<string, unknown>

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

  const searchCfg = computed(() =>
    searchForm(t, schoolOptions.value, sendStatusSearchOptions.value)
  )

  const columns = computed(() => tableCols(t, schoolOptions.value))

  const detailConfig = computed(() => detailForm(t, schoolOptions.value))

  const detailVisible = ref(false)
  const activeRow = ref<AttendanceWechatNoticeRecord | null>(null)

  const decorateRow = (raw: Loose): AttendanceWechatNoticeRecord => {
    const s = String(raw.sendStatus ?? '')
    const statusHit = sendStatusSearchOptions.value.find((o) => String(o.value) === s)
    return {
      ...(raw as AttendanceWechatNoticeRecord),
      sendStatus: statusHit?.label ?? (s === '' ? '--' : s),
      updateTime: dateFormat(String(raw.updateTime ?? '')),
      createTime: dateFormat(String(raw.createTime ?? ''))
    }
  }

  const loadData: UniTableRequest = async ({ pageNo, pageSize, filters: f }) => {
    const params: AttendanceWechatNoticeListParams = {
      current: pageNo,
      size: pageSize,
      ...(f as Record<string, unknown>)
    }
    const raw = await attendanceWechatNoticeApi.noticePage.get(params)
    const { list, total } = normalizePaged<Loose>(raw)
    return {
      data: list.map(decorateRow),
      total
    }
  }

  const showDetail = (row: AttendanceWechatNoticeRecord) => {
    activeRow.value = row
    detailVisible.value = true
  }

  const actions = computed<UniTableAction[]>(() => [
    {
      label: t('attendance.detail'),
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
