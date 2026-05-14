import type { UniTableAction, UniTableRequest } from 'uni-ui-lib'
import dayjs from 'dayjs'
import { useUniI18n, useUniListState } from 'uni-ui-lib'
import { computed, nextTick, onMounted, ref, watch } from 'vue'

import { useBusOrderFormDialog } from '../components/use-bus-order-form-dialog'

import { searchForm, tableCols } from './list.config'

import { schoolBusOrderApi } from '@/api'
import { normalizePaged } from '@/utils/api-response-normalize'
import type { SchoolOptionRecord } from '@/types/modules/membership'
import type { BusOrderListParams, BusOrderRecord } from '@/types/modules/school-bus-order'
import { membershipSchoolLabel } from '@/utils/membership-school'

import {
  approvalStatusOptions,
  paymentStatusOptions,
  pickupMethodOptions,
  useStudentOrderFilters
} from '../use-student-order-filters'

const decorateRow = (
  row: BusOrderRecord,
  loc: string,
  schoolRecords: SchoolOptionRecord[]
): BusOrderRecord => {
  const r = { ...row }
  r.createTime = r.createTime ? dayjs(String(r.createTime)).format('YYYY-MM-DD HH:mm') : ''
  r.showLineName = loc === 'en' ? String(r.buslineEnName ?? '') : String(r.buslineCnName ?? '')
  r.showSectionName = loc === 'en' ? String(r.sectionEnName ?? '') : String(r.sectionCnName ?? '')
  r.showStationName =
    loc === 'en' ? String(r.busStationEnName ?? '') : String(r.busStationCnName ?? '')
  const rawSid = r.schoolId ?? r.schoolIds
  const sid = Array.isArray(rawSid) ? rawSid[0] : rawSid
  const mapped = membershipSchoolLabel(schoolRecords, sid, loc)
  r.showSchoolName =
    mapped !== '--' ? mapped : String(r.schoolEnName != null ? r.schoolEnName : '--')
  return r
}

export const useApplyList = () => {
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
    syncSchoolSelection,
    commonDataLoading,
    commonDataError,
    reloadCommonData
  } = useStudentOrderFilters()

  const initialFilters: Record<string, unknown> = {
    schoolIds: undefined,
    approvalStatus: undefined,
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
  const approvalOpts = computed(() => approvalStatusOptions(t))
  const paymentOpts = computed(() => paymentStatusOptions(t))
  const pickupOpts = computed(() => pickupMethodOptions(t))

  const hasSchoolSelection = computed(() => {
    if (!multiSchool.value) {
      return true
    }
    const v = queryModel.value.schoolIds
    return Array.isArray(v) && v.length > 0
  })

  const searchCascade = computed(() => {
    const q = queryModel.value
    const hasSchool = hasSchoolSelection.value
    return {
      sectionDisabled: !hasSchool,
      lineDisabled:
        !hasSchool ||
        q.sectionId === undefined ||
        q.sectionId === null ||
        q.sectionId === '',
      stationDisabled: !hasSchool || !Array.isArray(q.lineIds) || q.lineIds.length === 0,
      optionsLoading: commonDataLoading.value,
      optionsFailed: commonDataError.value
    }
  })

  const searchCfg = computed(() =>
    searchForm(
      t,
      schoolOptions.value,
      approvalOpts.value,
      sectionOptions.value,
      lineOptions.value,
      stationOptions.value,
      carSelectOptions.value,
      multiSchool.value,
      searchCascade.value
    )
  )

  const columns = computed(() =>
    tableCols(t, approvalOpts.value, paymentOpts.value, pickupOpts.value)
  )

  const loadData: UniTableRequest = async ({ pageNo: _p, pageSize: _s, filters: f }) => {
    const current = _p
    const size = _s
    const raw: BusOrderListParams = { current, size, ...f } as BusOrderListParams
    if (!multiSchool.value && defaultSingleSchoolId.value != null && raw.schoolIds == null) {
      raw.schoolIds = defaultSingleSchoolId.value
    }
    const result = await schoolBusOrderApi.intentionPage.get(raw)
    const { list, total } = normalizePaged<BusOrderRecord>(result)
    const loc = locale()
    return {
      data: list.map((row) => decorateRow(row, loc, schoolRecords.value)),
      total
    }
  }

  const { formVisible, formMode, editingOrderId, openFormAdd, openFormEdit } =
    useBusOrderFormDialog()

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

  const actions = computed<UniTableAction[]>(() => [
    {
      label: t('schoolBus.look'),
      onClick: (row) => openDetail(row as BusOrderRecord)
    },
    {
      label: t('schoolBus.edit'),
      code: 'busorder_edit',
      onClick: (row) => openFormEdit(row as BusOrderRecord)
    }
  ])

  onMounted(async () => {
    await initSchools()
    if (schoolRecords.value.length === 1) {
      queryModel.value.schoolIds = undefined
    }
    nextTick(() => tableRef.value?.refresh())
  })

  watch(
    () => queryModel.value.schoolIds,
    (ids, prev) => {
      syncSchoolSelection(ids as Array<string | number> | undefined)
      if (!multiSchool.value) {
        return
      }
      if (JSON.stringify(ids) === JSON.stringify(prev)) {
        return
      }
      queryModel.value.sectionId = undefined
      queryModel.value.lineIds = undefined
      queryModel.value.stationIds = undefined
    },
    { deep: true }
  )

  watch(
    () => queryModel.value.sectionId,
    (next, prev) => {
      if (next === prev) {
        return
      }
      queryModel.value.lineIds = undefined
      queryModel.value.stationIds = undefined
    }
  )

  watch(
    () => queryModel.value.lineIds,
    (next, prev) => {
      if (JSON.stringify(next) === JSON.stringify(prev)) {
        return
      }
      queryModel.value.stationIds = undefined
    },
    { deep: true }
  )

  watch(
    () => schoolRecords.value.length,
    (len) => {
      if (len === 1) {
        queryModel.value.schoolIds = undefined
        nextTick(() => tableRef.value?.refresh())
      }
    }
  )

  return {
    actions,
    columns,
    commonDataError,
    defaultSingleSchoolId,
    filters,
    handleLoadSuccess,
    loadData,
    multiSchool,
    queryModel,
    reset,
    search,
    searchCfg,
    tableRef,
    schoolOptions,
    detailVisible,
    detailOrderId,
    openDetail,
    closeDetail,
    formVisible,
    formMode,
    editingOrderId,
    openFormAdd,
    openFormEdit,
    reloadCommonData
  }
}
