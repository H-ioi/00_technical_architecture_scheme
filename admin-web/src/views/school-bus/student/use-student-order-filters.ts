import type { UniOption } from 'uni-ui-lib'
import { useUniI18n } from 'uni-ui-lib'
import { computed, ref, watch } from 'vue'

import { membershipApi, schoolBusCommonApi } from '@/api'
import type { SchoolOptionRecord } from '@/types/modules/membership'
import { membershipSchoolToOptions } from '@/utils/membership-school'

type Loose = Record<string, unknown>

const pickArray = (payload: unknown): Record<string, unknown>[] => {
  if (Array.isArray(payload)) {
    return payload as Record<string, unknown>[]
  }
  if (payload && typeof payload === 'object') {
    const data = (payload as Loose).data
    if (Array.isArray(data)) {
      return data as Record<string, unknown>[]
    }
  }
  return []
}

/** 列表查询区：多级联动禁用与下拉加载态（与 searchForm 最后一项配合）。 */
export type StudentOrderSearchCascade = {
  sectionDisabled: boolean
  lineDisabled: boolean
  stationDisabled: boolean
  optionsLoading: boolean
  optionsFailed: boolean
}

export const defaultStudentOrderSearchCascade = (): StudentOrderSearchCascade => ({
  sectionDisabled: false,
  lineDisabled: false,
  stationDisabled: false,
  optionsLoading: false,
  optionsFailed: false
})
export const approvalStatusOptions = (t: (k: string) => string): UniOption[] => [
  { label: t('schoolBus.studentOrder.enumApprovalPending'), value: '0', type: 'info' },
  { label: t('schoolBus.studentOrder.enumApprovalAgree'), value: '1', type: 'success' },
  { label: t('schoolBus.studentOrder.enumApprovalReject'), value: '2', type: 'danger' }
]

export const paymentStatusOptions = (t: (k: string) => string): UniOption[] => [
  { label: t('schoolBus.studentOrder.enumPaymentUnpaid'), value: 1, type: 'warning' },
  { label: t('schoolBus.studentOrder.enumPaymentPaid'), value: 2, type: 'success' }
]

export const pickupMethodOptions = (t: (k: string) => string): UniOption[] => [
  { label: t('schoolBus.studentOrder.enumPickupSelf'), value: '1' },
  { label: t('schoolBus.studentOrder.enumPickupGuardian'), value: '2' }
]

export const studentLineTypeOptions = (t: (k: string) => string): UniOption[] => [
  { label: t('schoolBus.studentOrder.enumLineTypeDaily'), value: '0' },
  { label: t('schoolBus.studentOrder.enumLineTypeWeekly'), value: '1' }
]

export const paymentMethodOptions = (t: (k: string) => string): UniOption[] => [
  { label: t('schoolBus.studentOrder.enumPayAlipay'), value: 1 },
  { label: t('schoolBus.studentOrder.enumPayWechat'), value: 2 },
  { label: t('schoolBus.studentOrder.enumPayCash'), value: 3 },
  { label: t('schoolBus.studentOrder.enumPayUnion'), value: 4 }
]

const matchesSchoolFilter = (
  row: Record<string, unknown>,
  selected: Set<string | number>
): boolean => {
  const raw = row.schoolIds
  if (typeof raw === 'boolean') return false
  if (Array.isArray(raw)) {
    return raw.some((id) => selected.has(id as string | number))
  }
  if (raw !== undefined && raw !== null) {
    return selected.has(raw as string | number)
  }
  const single = row.schoolId
  if (single !== undefined && single !== null) {
    return selected.has(single as string | number)
  }
  return false
}

/** 申请意向 / 乘车学生列表共用的校区、学期、路线、站点、车辆下拉与联动过滤。 */
export const useStudentOrderFilters = () => {
  const { locale } = useUniI18n()
  const schoolRecords = ref<SchoolOptionRecord[]>([])
  const sectionRows = ref<Record<string, unknown>[]>([])
  const lineRows = ref<Record<string, unknown>[]>([])
  const stationRows = ref<Record<string, unknown>[]>([])
  const carRows = ref<Record<string, unknown>[]>([])
  const selectedSchoolIds = ref<Array<string | number>>([])
  const commonDataLoading = ref(false)
  const commonDataError = ref(false)

  const schoolOptions = computed(() => membershipSchoolToOptions(schoolRecords.value, locale()))

  const filterBySchool = <T extends Record<string, unknown>>(rows: T[]) => {
    if (selectedSchoolIds.value.length === 0) {
      return rows
    }
    const set = new Set(selectedSchoolIds.value)
    return rows.filter((item) => matchesSchoolFilter(item, set))
  }

  const sectionOptions = computed(() => {
    const rows = filterBySchool(sectionRows.value)
    return rows.map((item) => ({
      label:
        locale() === 'en'
          ? String(item.enName ?? item.cnName ?? item.id ?? '')
          : String(item.cnName ?? item.enName ?? item.id ?? ''),
      value: item.id as string | number
    }))
  })

  const lineOptions = computed(() => {
    const rows = filterBySchool(lineRows.value)
    return rows.map((item) => ({
      label:
        locale() === 'en'
          ? String(item.enName ?? item.cnName ?? item.id ?? '')
          : String(item.cnName ?? item.enName ?? item.id ?? ''),
      value: item.id as string | number
    }))
  })

  const stationOptions = computed(() => {
    const rows = filterBySchool(stationRows.value)
    return rows.map((item) => ({
      label:
        locale() === 'en'
          ? String(item.enName ?? item.cnName ?? item.id ?? '')
          : String(item.cnName ?? item.enName ?? item.id ?? ''),
      value: item.id as string | number
    }))
  })

  const carSelectOptions = computed(() =>
    carRows.value.map((item) => ({
      label: String(item.carNumber ?? item.id ?? ''),
      value: item.id as string | number
    }))
  )

  const defaultSingleSchoolId = computed(() =>
    schoolRecords.value.length === 1 ? schoolRecords.value[0].id : null
  )

  const hydrateSelectData = async () => {
    commonDataLoading.value = true
    commonDataError.value = false
    try {
      const [sections, lines, stations, cars] = await Promise.all([
        schoolBusCommonApi.sectionList.get(),
        schoolBusCommonApi.lineList.get(),
        schoolBusCommonApi.stationList.get(),
        schoolBusCommonApi.carinfoList.get()
      ])
      sectionRows.value = pickArray(sections)
      lineRows.value = pickArray(lines)
      stationRows.value = pickArray(stations)
      carRows.value = pickArray(cars)
    } catch {
      commonDataError.value = true
      sectionRows.value = []
      lineRows.value = []
      stationRows.value = []
      carRows.value = []
    } finally {
      commonDataLoading.value = false
    }
  }

  const initSchools = async () => {
    const raw = await membershipApi.school.get()
    if (Array.isArray(raw)) {
      schoolRecords.value = raw as SchoolOptionRecord[]
    } else if (raw && typeof raw === 'object' && Array.isArray((raw as Loose).data)) {
      schoolRecords.value = (raw as Loose).data as SchoolOptionRecord[]
    } else {
      schoolRecords.value = []
    }
    if (schoolRecords.value.length === 1) {
      selectedSchoolIds.value = [schoolRecords.value[0].id]
    }
    await hydrateSelectData()
  }

  const syncSchoolSelection = (ids: Array<string | number> | undefined | null) => {
    selectedSchoolIds.value = Array.isArray(ids) ? [...ids] : []
  }

  watch(
    () => schoolRecords.value.length,
    async (len) => {
      if (len === 1) {
        selectedSchoolIds.value = [schoolRecords.value[0].id]
        await hydrateSelectData()
      }
    }
  )

  return {
    initSchools,
    schoolRecords,
    schoolOptions,
    sectionOptions,
    lineOptions,
    stationOptions,
    carSelectOptions,
    defaultSingleSchoolId,
    selectedSchoolIds,
    syncSchoolSelection,
    commonDataLoading,
    commonDataError,
    reloadCommonData: hydrateSelectData
  }
}
