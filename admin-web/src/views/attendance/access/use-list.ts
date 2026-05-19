import type { UniTableAction, UniTableRequest } from 'uni-ui-lib'
import { toUniOptions, useUniI18n, useUniListState } from 'uni-ui-lib'
import { computed, ref } from 'vue'

import {
  accessEnterExitOpts,
  accessOpenResultOpts,
  detailForm,
  searchForm,
  tableCols
} from './list.config'

import { attendanceOpenTypeOpts } from '../school/list.config'

import { attendanceAccessApi, attendanceSchoolApi, membershipApi } from '@/api'
import { normalizePaged } from '@/utils/api-response-normalize'
import { dateFormat } from '@/utils/tool'
import type {
  AttendanceAccessListParams,
  AttendanceAccessRecord
} from '@/types/modules/attendance-access'
import type { SchoolOptionRecord } from '@/types/modules/membership'

type Loose = Record<string, unknown>

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
    searchForm(t, schoolOptions.value, deptOptions.value)
  )

  const columns = computed(() => tableCols(t, schoolOptions.value))

  const detailConfig = computed(() => detailForm(t, schoolOptions.value))

  const detailVisible = ref(false)
  const activeRow = ref<AttendanceAccessRecord | null>(null)

  const openTypeOptions = computed(() => attendanceOpenTypeOpts(t))
  const enterExitOptions = computed(() => accessEnterExitOpts(t))
  const openResultOptions = computed(() => accessOpenResultOpts(t))

  const decorateRow = (raw: Loose): AttendanceAccessRecord => {
    const row: AttendanceAccessRecord = {
      ...(raw as AttendanceAccessRecord),
      openType:
        openTypeOptions.value.find((o) => String(o.value) === String(raw.openType ?? ''))?.label ??
        String(raw.openType ?? '--'),
      openResult:
        openResultOptions.value.find((o) => String(o.value) === String(raw.openResult ?? ''))
          ?.label ?? String(raw.openResult ?? '--'),
      enterOrExit:
        enterExitOptions.value.find((o) => String(o.value) === String(raw.enterOrExit ?? ''))
          ?.label ?? String(raw.enterOrExit ?? '--'),
      attendanceDate: dateFormat(String(raw.attendanceDate ?? ''), 'yyyy-MM-dd'),
      swingTime: dateFormat(String(raw.swingTime ?? '')),
      createTime: dateFormat(String(raw.createTime ?? ''))
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
    const { list, total } = normalizePaged<Loose>(raw)
    return {
      data: list.map(decorateRow),
      total
    }
  }

  const actions = computed<UniTableAction[]>(() => [
    {
      label: t('attendance.detail'),
      onClick: (row) => {
        activeRow.value = row as AttendanceAccessRecord
        detailVisible.value = true
      }
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
