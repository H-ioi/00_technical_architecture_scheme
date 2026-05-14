import type { UniFormConfig, UniTableAction, UniTableRequest } from 'uni-ui-lib'
import dayjs from 'dayjs'
import { toUniOptions, useUniI18n, useUniListState } from 'uni-ui-lib'
import { computed, nextTick, onMounted, ref, watch } from 'vue'

import { operationStatusMeta, tableCols } from './list.config'

import { membershipApi, schoolBusCommonApi, schoolBusOperationApi } from '@/api'
import { normalizePaged } from '@/utils/api-response-normalize'
import type { SchoolOptionRecord } from '@/types/modules/membership'
import type { OperationListParams, OperationRecord } from '@/types/modules/school-bus-operation'

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

const pickNamedList = (payload: unknown): NamedEntity[] => {
  if (Array.isArray(payload)) {
    return payload as NamedEntity[]
  }

  if (payload && typeof payload === 'object') {
    const data = (payload as Loose).data

    if (Array.isArray(data)) {
      return data as NamedEntity[]
    }
  }

  return []
}

interface NamedEntity {
  id: string | number
  cnName?: string
  enName?: string
  lineName?: string
  stationName?: string
  schoolIds?: number[] | number | string
  name?: string
}

const labelOf = (options: { value: string; label: string }[], value: unknown): string =>
  options.find((x) => String(x.value) === String(value))?.label ?? String(value ?? '--')

const normalizeSchoolIdsField = (row: Loose): void => {
  if (row.schoolIds == null && row.schoolId != null) {
    row.schoolIds = [row.schoolId as string | number]
  }

  const raw = row.schoolIds

  if (Array.isArray(raw)) {
    row.schoolIds = raw.filter((x) => x !== '' && x != null) as Array<string | number>

    return
  }

  if (raw == null || raw === '') {
    row.schoolIds = []

    return
  }

  if (typeof raw === 'string' && raw.includes(',')) {
    row.schoolIds = raw
      .split(',')
      .map((s) => s.trim())
      .filter((x) => x !== '')

    return
  }

  row.schoolIds = [raw as string | number]
}

const formatOperationRow = (
  row: OperationRecord,
  locale: string,
  statusOptions: { value: string; label: string }[]
): OperationRecord => {
  const sectionName =
    locale === 'en'
      ? String(row.sectionEnName ?? row.sectionName ?? '')
      : String(row.sectionCnName ?? row.sectionName ?? '')

  const next: OperationRecord = { ...row }

  normalizeSchoolIdsField(next as Loose)

  next.sectionName = sectionName || '--'
  next.statusLabel = labelOf(statusOptions, row.status)
  next.arrivalStatusLabel = labelOf(statusOptions, row.arrivalStatus)
  next.rideDate = row.rideDate ? dayjs(String(row.rideDate)).format('YYYY-MM-DD') : '--'
  next.arrivalTime = row.arrivalTime
    ? dayjs(String(row.arrivalTime)).format('YYYY-MM-DD HH:mm')
    : '--'
  next.createTime = row.createTime ? dayjs(String(row.createTime)).format('YYYY-MM-DD HH:mm') : '--'
  next.updateTime = row.updateTime ? dayjs(String(row.updateTime)).format('YYYY-MM-DD HH:mm') : '--'

  return next
}

export const useList = () => {
  const { locale, t } = useUniI18n()

  const initialFilters: Record<string, unknown> = {
    schoolIds: undefined,
    lineIds: undefined,
    stationId: undefined,
    status: undefined,
    rideDateStart: undefined,
    rideDateEnd: undefined
  }

  const { queryModel, filters, tableRef, search, reset, handleLoadSuccess } = useUniListState({
    initialFilters
  })

  const schoolRecords = ref<SchoolOptionRecord[]>([])
  const lineSource = ref<NamedEntity[]>([])
  const stationSource = ref<NamedEntity[]>([])
  const formVisible = ref(false)
  const formMode = ref<'add' | 'edit' | 'look'>('add')
  const activeRow = ref<OperationRecord | null>(null)
  const detailVisible = ref(false)
  const detailRecord = ref<OperationRecord | null>(null)

  const schoolOptions = computed(() =>
    toUniOptions(schoolRecords.value, {
      labelKeys: locale() === 'en' ? ['enName', 'name'] : ['name', 'cnName', 'enName'],
      valueKey: 'id'
    })
  )

  const multiSchool = computed(() => schoolRecords.value.length > 1)
  const defaultSchoolId = computed(() =>
    schoolRecords.value.length === 1 ? schoolRecords.value[0].id : null
  )

  const selectedSchoolSet = computed(() => {
    const raw = queryModel.schoolIds as unknown

    if (raw == null || raw === '') {
      return new Set<string | number>()
    }

    const arr = Array.isArray(raw) ? raw : [raw]

    return new Set(arr.filter((x) => x !== '' && x != null))
  })

  const filterBySchools = (list: NamedEntity[]) => {
    if (!selectedSchoolSet.value.size) {
      return list
    }

    return list.filter((item) => {
      const sid = item.schoolIds

      if (Array.isArray(sid)) {
        return sid.some((id) => selectedSchoolSet.value.has(id))
      }

      return selectedSchoolSet.value.has(sid as string | number)
    })
  }

  const lineOptions = computed(() =>
    toUniOptions(filterBySchools(lineSource.value), {
      labelKeys:
        locale() === 'en' ? ['enName', 'lineName', 'name'] : ['cnName', 'lineName', 'name'],
      valueKey: 'id'
    })
  )

  const stationOptions = computed(() =>
    toUniOptions(filterBySchools(stationSource.value), {
      labelKeys:
        locale() === 'en' ? ['enName', 'stationName', 'name'] : ['cnName', 'stationName', 'name'],
      valueKey: 'id'
    })
  )

  const statusOptions = computed(() => operationStatusMeta(t))

  const searchCfg = computed<UniFormConfig>(() => {
    const schoolSchema = multiSchool.value
      ? [
          {
            field: 'schoolIds',
            label: '',
            component: 'ElSelect' as const,
            options: schoolOptions.value,
            componentProps: {
              placeholder: t('schoolBus.routeOperation.placeholders.school'),
              clearable: true,
              filterable: true,
              multiple: true,
              collapseTags: true,
              collapseTagsTooltip: true
            },
            colProps: { span: 6 }
          }
        ]
      : []

    return {
      schema: [
        ...schoolSchema,
        {
          field: 'lineIds',
          label: '',
          component: 'ElSelect',
          options: lineOptions.value,
          componentProps: {
            placeholder: t('schoolBus.routeOperation.placeholders.line'),
            clearable: true,
            filterable: true,
            multiple: true,
            collapseTags: true,
            collapseTagsTooltip: true
          },
          colProps: { span: 6 }
        },
        {
          field: 'stationId',
          label: '',
          component: 'ElSelect',
          options: stationOptions.value,
          componentProps: {
            placeholder: t('schoolBus.routeOperation.placeholders.station'),
            clearable: true,
            filterable: true
          },
          colProps: { span: 6 }
        },
        {
          field: 'status',
          label: '',
          component: 'ElSelect',
          options: statusOptions.value,
          componentProps: {
            placeholder: t('schoolBus.routeOperation.placeholders.status'),
            clearable: true
          },
          colProps: { span: 6 }
        },
        {
          field: 'rideDateStart',
          label: '',
          component: 'ElDatePicker',
          componentProps: {
            type: 'date',
            placeholder: t('schoolBus.routeOperation.placeholders.rideDateStart'),
            valueFormat: 'YYYY-MM-DD',
            clearable: true
          },
          colProps: { span: 6 }
        },
        {
          field: 'rideDateEnd',
          label: '',
          component: 'ElDatePicker',
          componentProps: {
            type: 'date',
            placeholder: t('schoolBus.routeOperation.placeholders.rideDateEnd'),
            valueFormat: 'YYYY-MM-DD',
            clearable: true
          },
          colProps: { span: 6 }
        }
      ],
      rowProps: { gutter: 16 },
      colProps: { span: 6 }
    }
  })

  const columns = computed(() => tableCols(t, schoolOptions.value))

  const loadData: UniTableRequest = async ({ pageNo, pageSize, filters: f }) => {
    const params: OperationListParams = {
      current: pageNo,
      size: pageSize,
      ...(f as OperationListParams)
    }

    if (!multiSchool.value && defaultSchoolId.value != null && params.schoolIds == null) {
      params.schoolIds = defaultSchoolId.value
    }

    const result = await schoolBusOperationApi.page.get(params)
    const { list, total } = normalizePaged<OperationRecord>(result)
    const opts = operationStatusMeta(t).map((x) => ({ value: String(x.value), label: x.label }))

    return {
      data: list.map((row) => formatOperationRow(row, locale(), opts)),
      total
    }
  }

  const openForm = (mode: 'add' | 'edit' | 'look', row?: OperationRecord) => {
    formMode.value = mode
    activeRow.value = row ?? null
    formVisible.value = true
  }

  const openDetail = (row: OperationRecord) => {
    detailRecord.value = row
    detailVisible.value = true
  }

  const actions = computed<UniTableAction[]>(() => [
    {
      label: t('schoolBus.look'),
      onClick: (row) => openDetail(row as OperationRecord)
    },
    {
      label: t('schoolBus.edit'),
      code: 'busoperation_edit',
      onClick: (row) => openForm('edit', row as OperationRecord)
    }
  ])

  onMounted(async () => {
    const rawSchools = await membershipApi.school.get()
    schoolRecords.value = pickSchoolRecords(rawSchools)

    const [linesRaw, stationsRaw] = await Promise.all([
      schoolBusCommonApi.lineList.get(),
      schoolBusCommonApi.stationList.get()
    ])

    lineSource.value = pickNamedList(linesRaw)
    stationSource.value = pickNamedList(stationsRaw)
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
    activeRow,
    defaultSchoolId,
    detailRecord,
    detailVisible,
    filters,
    formMode,
    formVisible,
    handleLoadSuccess,
    lineOptions,
    loadData,
    multiSchool,
    openDetail,
    openForm,
    queryModel,
    reset,
    schoolOptions,
    search,
    searchCfg,
    stationOptions,
    statusOptions,
    tableRef,
    schoolRecords,
    lineSource,
    stationSource
  }
}
