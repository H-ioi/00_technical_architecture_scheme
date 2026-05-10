import type { UniTableAction, UniTableRequest } from 'uni-ui-lib'
import dayjs from 'dayjs'
import { useUniI18n, useUniListState } from 'uni-ui-lib'
import { computed, nextTick, onMounted, ref, watch } from 'vue'

import { useBusOrderFormDialog } from '../components/use-bus-order-form-dialog'

import { orderSearchForm, orderTableColumns } from './list.config'

import { schoolBusOrderApi } from '@/api'
import type { SchoolOptionRecord } from '@/types/modules/membership'
import type { BusOrderListParams, BusOrderRecord } from '@/types/modules/school-bus-order'
import { membershipSchoolLabel } from '@/utils/membership-school'

import { pickupMethodOptions, useStudentOrderFilters } from '../use-student-order-filters'

type Loose = Record<string, unknown>

const unwrapOrderPage = (payload: unknown): { list: BusOrderRecord[]; total: number } => {
  if (!payload || typeof payload !== 'object') {
    return { list: [], total: 0 }
  }
  const r = payload as Loose
  const num = (value: unknown) =>
    typeof value === 'number' && Number.isFinite(value) ? value : 0
  if (Array.isArray(r.data)) {
    return { list: r.data as BusOrderRecord[], total: num(r.total) }
  }
  const inner = r.data
  if (inner && typeof inner === 'object' && !Array.isArray(inner)) {
    const obj = inner as Loose
    const list = Array.isArray(obj.data) ? (obj.data as BusOrderRecord[]) : []
    return { list, total: num(r.total) || num(obj.total) }
  }
  return { list: [], total: num(r.total) }
}

const decorateRow = (
  row: BusOrderRecord,
  loc: string,
  schoolRecords: SchoolOptionRecord[]
): BusOrderRecord => {
  const r = { ...row }
  r.createTime = r.createTime ? dayjs(String(r.createTime)).format('YYYY-MM-DD HH:mm') : ''
  r.showLineName =
    loc === 'en' ? String(r.buslineEnName ?? '') : String(r.buslineCnName ?? '')
  r.showSectionName =
    loc === 'en' ? String(r.sectionEnName ?? '') : String(r.sectionCnName ?? '')
  r.showStationName =
    loc === 'en' ? String(r.busStationEnName ?? '') : String(r.busStationCnName ?? '')
  const rawSid = r.schoolId ?? r.schoolIds
  const sid = Array.isArray(rawSid) ? rawSid[0] : rawSid
  const mapped = membershipSchoolLabel(schoolRecords, sid, loc)
  r.showSchoolName =
    mapped !== '--' ? mapped : String(r.schoolEnName != null ? r.schoolEnName : '--')
  return r
}

export const useOrderList = () => {
  const { locale, t } = useUniI18n()
  const {
    initSchools,
    schoolRecords,
    schoolOptions,
    sectionOptions,
    lineOptions,
    stationOptions,
    carSelectOptions,
    defaultSingleSchoolId,
    syncSchoolSelection
  } = useStudentOrderFilters()

  const initialFilters: Record<string, unknown> = {
    schoolIds: undefined,
    sectionId: undefined,
    lineIds: undefined,
    stationIds: undefined,
    keyword: '',
    carInfoId: undefined
  }

  const { queryModel, filters, tableRef, search, reset, handleLoadSuccess } = useUniListState({
    initialFilters
  })

  const multiSchool = computed(() => schoolRecords.value.length > 1)
  const pickupOpts = computed(() => pickupMethodOptions(t))

  const searchConfig = computed(() =>
    orderSearchForm(
      t,
      schoolOptions.value,
      sectionOptions.value,
      lineOptions.value,
      stationOptions.value,
      carSelectOptions.value,
      multiSchool.value
    )
  )

  const columns = computed(() => orderTableColumns(t, pickupOpts.value))

  const { formVisible, formMode, editingOrderId, openFormAdd, openFormEdit } = useBusOrderFormDialog()

  const detailVisible = ref(false)
  const detailOrderId = ref<string | number | null>(null)

  const openDetail = (row: BusOrderRecord) => {
    detailOrderId.value = row.id
    detailVisible.value = true
  }

  const closeDetail = () => {
    detailVisible.value = false
    detailOrderId.value = null
  }

  const loadData: UniTableRequest = async ({ pageNo: _p, pageSize: _s, filters: f }) => {
    const raw: BusOrderListParams = { current: _p, size: _s, ...f } as BusOrderListParams
    if (!multiSchool.value && defaultSingleSchoolId.value != null && raw.schoolIds == null) {
      raw.schoolIds = defaultSingleSchoolId.value
    }
    const result = await schoolBusOrderApi.orderPage.get(raw)
    const { list, total } = unwrapOrderPage(result)
    const loc = locale()
    return {
      data: list.map((row) => decorateRow(row, loc, schoolRecords.value)),
      total
    }
  }

  const actions = computed<UniTableAction[]>(() => [
    {
      label: t('schoolBus.driver.actions.look'),
      onClick: (row) => openDetail(row as BusOrderRecord)
    },
    {
      label: t('schoolBus.driver.actions.edit'),
      code: 'busorder_edit',
      onClick: (row) => openFormEdit(row as BusOrderRecord)
    }
  ])

  onMounted(async () => {
    await initSchools()
    nextTick(() => tableRef.value?.refresh())
  })

  watch(
    () => queryModel.schoolIds,
    (ids) => {
      syncSchoolSelection(ids as Array<string | number> | undefined)
    }
  )

  watch(
    () => schoolRecords.value.length,
    (len) => {
      if (len === 1) {
        queryModel.schoolIds = undefined
        nextTick(() => tableRef.value?.refresh())
      }
    }
  )

  return {
    actions,
    columns,
    closeDetail,
    defaultSingleSchoolId,
    detailOrderId,
    detailVisible,
    filters,
    handleLoadSuccess,
    loadData,
    multiSchool,
    openDetail,
    queryModel,
    reset,
    search,
    searchConfig,
    tableRef,
    schoolOptions,
    formVisible,
    formMode,
    editingOrderId,
    openFormAdd,
    openFormEdit
  }
}
