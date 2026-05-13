import type { UniTableAction, UniTableRequest } from 'uni-ui-lib'
import dayjs from 'dayjs'
import { toUniOptions, useUniI18n, useUniListState } from 'uni-ui-lib'
import { computed, ref } from 'vue'

import {
  attendanceAccessColumns,
  attendanceAccessDetailForm,
  attendanceAccessSearchForm,
  accessEnterExitOpts,
  accessOpenResultOpts
} from './list.config'

import { attendanceOpenTypeOpts } from '../school/list.config'

import { attendanceAccessApi, attendanceSchoolApi, membershipApi } from '@/api'
import { normalizeApiPagedBody } from '@/utils/api-response-normalize'
import type {
  AttendanceAccessListParams,
  AttendanceAccessRecord
} from '@/types/modules/attendance-access'
import type { SchoolOptionRecord } from '@/types/modules/membership'

type Loose = Record<string, unknown>

const formatMaybeDateTime = (value: unknown) => {
  if (value == null || value === '') {
    return ''
  }
  const d = dayjs(String(value))
  return d.isValid() ? d.format('YYYY-MM-DD HH:mm:ss') : String(value)
}

const formatDateOnly = (value: unknown) => {
  if (value == null || value === '') {
    return ''
  }
  const d = dayjs(String(value))
  return d.isValid() ? d.format('YYYY-MM-DD') : String(value)
}

export const useList = () => {
  const { locale, t } = useUniI18n()
  const initialFilters: Record<string, unknown> = {
    schoolId: undefined,
    deptName: undefined,
    personName: '',
    personCode: '',
    cardNumber: '',
    acsChannelName: '',
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

  const deptStrings = ref<string[]>([])
  const deptOptions = computed(() =>
    toUniOptions(
      deptStrings.value.map((d) => ({ label: d, value: d })),
      { labelKeys: ['label'], valueKey: 'value' }
    )
  )

  const searchCfg = computed(() =>
    attendanceAccessSearchForm(t, schoolOptions.value, deptOptions.value)
  )

  const columns = computed(() => attendanceAccessColumns(t, schoolOptions.value))

  const detailConfig = computed(() => attendanceAccessDetailForm(t, schoolOptions.value))

  const detailVisible = ref(false)
  const activeRow = ref<AttendanceAccessRecord | null>(null)

  const openTypeOptions = computed(() => attendanceOpenTypeOpts(t))
  const enterExitOptions = computed(() => accessEnterExitOpts(t))
  const openResultOptions = computed(() => accessOpenResultOpts(t))

  const openTypeLabel = (raw: unknown) => {
    const row = openTypeOptions.value.find((o) => String(o.value) === String(raw ?? ''))
    return row?.label ?? String(raw ?? '--')
  }

  const enterExitLabel = (raw: unknown) => {
    const row = enterExitOptions.value.find((o) => String(o.value) === String(raw ?? ''))
    return row?.label ?? String(raw ?? '--')
  }

  const openResultLabel = (raw: unknown) => {
    const row = openResultOptions.value.find((o) => String(o.value) === String(raw ?? ''))
    return row?.label ?? String(raw ?? '--')
  }

  const decorateRow = (raw: Loose): AttendanceAccessRecord => {
    const row: AttendanceAccessRecord = {
      ...(raw as AttendanceAccessRecord),
      openType: openTypeLabel(raw.openType),
      openResult: openResultLabel(raw.openResult),
      enterOrExit: enterExitLabel(raw.enterOrExit),
      attendanceDate: formatDateOnly(raw.attendanceDate),
      swingTime: formatMaybeDateTime(raw.swingTime),
      createTime: formatMaybeDateTime(raw.createTime)
    }
    return row
  }

  const loadData: UniTableRequest = async ({ pageNo, pageSize, filters: f }) => {
    const params: AttendanceAccessListParams = {
      current: pageNo,
      size: pageSize,
      ...(f as Record<string, unknown>)
    }
    const raw = await attendanceAccessApi.unionPage.get(params)
    const { list, total } = normalizeApiPagedBody<Loose>(raw)
    return {
      data: list.map(decorateRow),
      total
    }
  }

  const showDetail = (row: AttendanceAccessRecord) => {
    activeRow.value = row
    detailVisible.value = true
  }

  const actions = computed<UniTableAction[]>(() => [
    {
      label: t('attendance.access.actions.detail'),
      onClick: (row) => showDetail(row as AttendanceAccessRecord)
    }
  ])

  const loadOpts = async () => {
    const [schools, depts] = await Promise.all([
      membershipApi.school.get(),
      attendanceSchoolApi.departmentList.get()
    ])
    schoolRecords.value = schools
    deptStrings.value = Array.isArray(depts) ? depts : []
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
