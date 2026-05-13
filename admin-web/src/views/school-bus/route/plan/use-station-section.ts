import type { UniFormConfig, UniTableAction, UniTableColumn, UniTableRequest } from 'uni-ui-lib'
import dayjs from 'dayjs'
import { toUniOptions, useUniI18n, useUniListState } from 'uni-ui-lib'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { Ref } from 'vue'
import { computed, ref, watch } from 'vue'

import { schoolBusStationApi } from '@/api'
import { normalizeApiPagedBody } from '@/utils/api-response-normalize'
import type { SchoolOptionRecord } from '@/types/modules/membership'
import type { StationListParams } from '@/types/modules/school-bus-station'

type Loose = Record<string, unknown>
type SchoolRecordsRef = Ref<SchoolOptionRecord[]>

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

const stripEmptyParams = (p: Record<string, unknown>): Record<string, unknown> => {
  const o: Record<string, unknown> = {}

  for (const [k, v] of Object.entries(p)) {
    if (v === '' || v === undefined || v === null) {
      continue
    }

    if (Array.isArray(v) && v.length === 0) {
      continue
    }

    o[k] = v
  }

  return o
}

export const useStationSection = (schoolRecords: SchoolRecordsRef) => {
  const { locale, t } = useUniI18n()

  const initialFilters: Record<string, unknown> = {
    schoolIds: undefined,
    cnName: ''
  }

  const { queryModel, filters, tableRef, search, reset, handleLoadSuccess } = useUniListState({
    initialFilters
  })

  const stationFormVisible = ref(false)
  const stationEditingId = ref<string | number | null>(null)

  const stationDetailVisible = ref(false)
  const stationDetailRecord = ref<Loose | null>(null)

  const picked = ref<Loose[]>([])
  const selectedIds = computed(() =>
    picked.value.map((item) => item.id as string | number).filter((id) => id != null && id !== '')
  )

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

  const searchConfig = computed<UniFormConfig>(() => {
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
          field: 'cnName',
          label: '',
          component: 'ElInput',
          componentProps: {
            placeholder: t('schoolBus.routePlan.placeholders.stationNameKeyword'),
            clearable: true
          },
          colProps: { span: 6 }
        }
      ],
      rowProps: { gutter: 16 },
      colProps: { span: 6 }
    }
  })

  const fmtRowStation = (row: Loose) => {
    normalizeSchoolIdsField(row)
    const loc = locale()
    row.showStationName = loc === 'en' ? row.enName : row.cnName
    row.createTime = row.createTime
      ? dayjs(String(row.createTime)).format('YYYY-MM-DD HH:mm')
      : '--'

    return row
  }

  const stationColumns = computed<UniTableColumn[]>(() => [
    { prop: 'id', label: 'ID', width: 88, fixed: 'left' },
    {
      prop: 'schoolIds',
      label: t('schoolBus.driver.fields.school'),
      type: 'array',
      options: schoolOptions.value,
      lookup: { splitValues: true },
      minWidth: 200,
      showOverflowTooltip: true
    },
    {
      prop: 'showStationName',
      label: t('schoolBus.routePlan.fields.stationName'),
      minWidth: 160
    },
    { prop: 'createTime', label: t('schoolBus.routeOperation.columns.createTime'), width: 160 }
  ])

  const loadStations: UniTableRequest = async ({ pageNo, pageSize, filters: f }) => {
    const raw = (f ?? {}) as StationListParams
    const base: Record<string, unknown> = {
      current: pageNo,
      size: pageSize,
      ...raw
    }

    if (!multiSchool.value && defaultSchoolId.value != null && base.schoolIds == null) {
      base.schoolIds = defaultSchoolId.value
    }

    const params = stripEmptyParams(base)
    const result = await schoolBusStationApi.page.get(params)
    const { list, total } = normalizeApiPagedBody<Loose>(result)

    return {
      data: list.map((r) => fmtRowStation({ ...r })),
      total
    }
  }

  const openStationDetail = (row: Loose) => {
    stationDetailRecord.value = row
    stationDetailVisible.value = true
  }

  const openStationEdit = (row: Loose) => {
    stationEditingId.value = row.id as string | number
    stationFormVisible.value = true
  }

  const openStationAdd = () => {
    stationEditingId.value = null
    stationFormVisible.value = true
  }

  const actions = computed<UniTableAction[]>(() => [
    {
      label: t('schoolBus.driver.actions.look'),
      onClick: (row) => openStationDetail(row as Loose)
    },
    {
      label: t('schoolBus.driver.actions.edit'),
      code: 'busstation_edit',
      onClick: (row) => openStationEdit(row as Loose)
    }
  ])

  const onSelectionChange = (rows: Loose[]) => {
    picked.value = rows
  }

  const deleteStationsSelected = async () => {
    const ids = selectedIds.value

    if (ids.length === 0) {
      ElMessage.warning(t('schoolBus.routePlan.messages.selectStationsFirst'))
      return
    }

    try {
      await ElMessageBox.confirm(
        t('schoolBus.routePlan.messages.confirmDeleteStations'),
        t('schoolBus.driver.actions.delete'),
        { type: 'warning' }
      )
    } catch {
      return
    }

    try {
      await schoolBusStationApi['delete'].delete(ids)
      ElMessage.success(t('schoolBus.driver.messages.deleteSuccess'))
      tableRef.value?.refresh()
      picked.value = []
    } catch {
      /* request 层已提示 */
    }
  }

  watch(
    () => schoolRecords.value,
    (records) => {
      if (records.length === 1) {
        queryModel.schoolIds = records[0].id
      }
    }
  )

  return {
    actions,
    columns: stationColumns,
    defaultSchoolId,
    deleteStationsSelected,
    filters,
    handleLoadSuccess,
    loadStations,
    multiSchool,
    onSelectionChange,
    openStationAdd,
    queryModel,
    reset,
    search,
    searchConfig,
    selectedIds,
    tableRef,
    stationDetailRecord,
    stationDetailVisible,
    stationEditingId,
    stationFormVisible
  }
}
