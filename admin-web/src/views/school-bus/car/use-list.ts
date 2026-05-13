import type { UniTableAction, UniTableRequest } from 'uni-ui-lib'
import dayjs from 'dayjs'
import { useUniI18n, useUniListState } from 'uni-ui-lib'
import { computed, nextTick, onMounted, ref, watch } from 'vue'

import { searchForm, tableCols, carStatusOpts } from './list.config'

import { membershipApi, schoolBusCarApi } from '@/api'
import { normalizeApiPagedBody } from '@/utils/api-response-normalize'
import type { SchoolOptionRecord } from '@/types/modules/membership'
import type { CarListParams, CarRecord } from '@/types/modules/school-bus-car'
import { membershipSchoolLabelsJoined, membershipSchoolToOptions } from '@/utils/membership-school'

type Loose = Record<string, unknown>

const pickSchoolRecords = (payload: unknown): SchoolOptionRecord[] => {
  if (Array.isArray(payload)) {
    return payload as SchoolOptionRecord[]
  }
  if (payload && typeof payload === 'object') {
    const data = (payload as Loose).data
    if (Array.isArray(data)) {
      return data as SchoolOptionRecord[]
    }
  }
  return []
}

export const useList = () => {
  const { locale, t } = useUniI18n()
  const initialFilters: Record<string, unknown> = {
    schoolIds: undefined,
    carNumber: '',
    driver: '',
    carTeacher: '',
    status: undefined
  }
  const { queryModel, filters, tableRef, search, reset, handleLoadSuccess } = useUniListState({
    initialFilters
  })
  const schoolRecords = ref<SchoolOptionRecord[]>([])
  const schoolOptions = computed(() => membershipSchoolToOptions(schoolRecords.value, locale()))
  const multiSchool = computed(() => schoolRecords.value.length > 1)
  const defaultSchoolId = computed(() =>
    schoolRecords.value.length === 1 ? schoolRecords.value[0].id : null
  )

  const statusOptions = computed(() => carStatusOpts(t))
  const searchConfig = computed(() =>
    searchForm(t, schoolOptions.value, statusOptions.value, multiSchool.value)
  )
  const columns = computed(() => tableCols(t, statusOptions.value))

  const formVisible = ref(false)
  const formMode = ref<'add' | 'edit' | 'look'>('add')
  const currentRecord = ref<CarRecord | null>(null)

  const decorate = (row: CarRecord): CarRecord => {
    const loc = locale()
    const showSchoolNames = membershipSchoolLabelsJoined(
      schoolRecords.value,
      row.schoolIds,
      loc,
      row.schoolEnNames != null ? String(row.schoolEnNames) : undefined
    )
    return {
      ...row,
      showSchoolNames,
      driverName:
        row.driverInfo && typeof row.driverInfo === 'object'
          ? (row.driverInfo as { name?: string }).name
          : row.driverName,
      createTime: row.createTime ? dayjs(String(row.createTime)).format('YYYY-MM-DD HH:mm') : '',
      updateTime: row.updateTime ? dayjs(String(row.updateTime)).format('YYYY-MM-DD HH:mm') : ''
    }
  }

  const loadData: UniTableRequest = async ({ pageNo: current, pageSize: size, filters: f }) => {
    const raw: CarListParams = { current, size, ...f } as CarListParams
    if (!multiSchool.value && defaultSchoolId.value != null && raw.schoolIds == null) {
      raw.schoolIds = defaultSchoolId.value
    }
    const result = await schoolBusCarApi.page.get(raw)
    const { list, total } = normalizeApiPagedBody<CarRecord>(result)
    return { data: list.map(decorate), total }
  }

  const openForm = (mode: 'add' | 'edit' | 'look', row?: CarRecord) => {
    formMode.value = mode
    currentRecord.value = row ?? null
    formVisible.value = true
  }

  const actions = computed<UniTableAction[]>(() => [
    {
      label: t('schoolBus.driver.actions.look'),
      onClick: (row) => openForm('look', row as CarRecord)
    },
    {
      label: t('schoolBus.driver.actions.edit'),
      code: 'buscarinfo_edit',
      onClick: (row) => openForm('edit', row as CarRecord)
    }
  ])

  onMounted(async () => {
    const raw = await membershipApi.school.get()
    schoolRecords.value = pickSchoolRecords(raw)
  })

  watch(
    () => schoolRecords.value,
    (records) => {
      if (records.length === 1) {
        queryModel.schoolIds = records[0].id
      }
      if (records.length > 0) {
        nextTick(() => tableRef.value?.refresh())
      }
    }
  )

  return {
    actions,
    columns,
    currentRecord,
    defaultSchoolId,
    filters,
    formMode,
    formVisible,
    handleLoadSuccess,
    loadData,
    multiSchool,
    openForm,
    queryModel,
    reset,
    schoolOptions,
    search,
    searchConfig,
    statusOptions,
    tableRef
  }
}
