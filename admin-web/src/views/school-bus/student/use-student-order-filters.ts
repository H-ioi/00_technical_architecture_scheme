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

/** 旧 `const/isacommunity/consts.js` 中与乘车订单列表相关的枚举（value 与旧接口一致）。 */
export const approvalStatusOptions = (t: (k: string) => string): UniOption[] => [
  { label: t('schoolBus.studentOrder.enums.approval.pending'), value: '0', type: 'info' },
  { label: t('schoolBus.studentOrder.enums.approval.agree'), value: '1', type: 'success' },
  { label: t('schoolBus.studentOrder.enums.approval.reject'), value: '2', type: 'danger' }
]

export const paymentStatusOptions = (t: (k: string) => string): UniOption[] => [
  { label: t('schoolBus.studentOrder.enums.payment.unpaid'), value: 1, type: 'warning' },
  { label: t('schoolBus.studentOrder.enums.payment.paid'), value: 2, type: 'success' }
]

export const pickupMethodOptions = (t: (k: string) => string): UniOption[] => [
  { label: t('schoolBus.studentOrder.enums.pickup.self'), value: '1' },
  { label: t('schoolBus.studentOrder.enums.pickup.guardian'), value: '2' }
]

export const studentLineTypeOptions = (t: (k: string) => string): UniOption[] => [
  { label: t('schoolBus.studentOrder.enums.lineType.daily'), value: '0' },
  { label: t('schoolBus.studentOrder.enums.lineType.weekly'), value: '1' }
]

export const paymentMethodOptions = (t: (k: string) => string): UniOption[] => [
  { label: t('schoolBus.studentOrder.enums.payMethod.alipay'), value: 1 },
  { label: t('schoolBus.studentOrder.enums.payMethod.wechat'), value: 2 },
  { label: t('schoolBus.studentOrder.enums.payMethod.cash'), value: 3 },
  { label: t('schoolBus.studentOrder.enums.payMethod.union'), value: 4 }
]

const matchesSchoolFilter = (
  row: Record<string, unknown>,
  selected: Set<string | number>
): boolean => {
  const raw = row.schoolIds
  if (Array.isBoolean(raw)) return false
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
    syncSchoolSelection
  }
}
