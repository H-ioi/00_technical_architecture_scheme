import type { UniFormConfig, UniTableAction, UniTableColumn, UniTableRequest } from 'uni-ui-lib'
import dayjs from 'dayjs'
import { toUniOptions, useUniI18n, useUniListState } from 'uni-ui-lib'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { Ref } from 'vue'
import { computed, onMounted, ref, watch } from 'vue'

import RouteFormModal from './components/route-form-modal.vue'

import { schoolBusCommonApi, schoolBusLineApi } from '@/api'
import { normalizePaged } from '@/utils/api-response-normalize'
import type { SchoolOptionRecord } from '@/types/modules/membership'
import type { LineListParams } from '@/types/modules/school-bus-line'

type SchoolRecordsRef = Ref<SchoolOptionRecord[]>

type Loose = Record<string, unknown>

interface NamedEntity {
  id: string | number
  cnName?: string
  enName?: string
  schoolIds?: number[] | number | string
  name?: string
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

export const useRouteLines = (
  routeFormRef: Ref<InstanceType<typeof RouteFormModal> | null>,
  schoolRecords: SchoolRecordsRef
) => {
  const { locale, t } = useUniI18n()

  const initialFilters: Record<string, unknown> = {
    schoolIds: undefined,
    sectionId: undefined,
    stationId: undefined,
    visible: undefined,
    cnName: '',
    carNumber: ''
  }

  const { queryModel, filters, tableRef, search, reset, handleLoadSuccess } = useUniListState({
    initialFilters
  })

  const sectionSource = ref<NamedEntity[]>([])
  const stationSource = ref<NamedEntity[]>([])

  const detailVisible = ref(false)
  const detailRecord = ref<Loose | null>(null)

  const selection = ref<Loose[]>([])
  const selectedIds = computed(() =>
    selection.value.map((item) => item.id as string | number).filter((id) => id != null && id !== '')
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

  const sectionOptions = computed(() =>
    toUniOptions(filterBySchools(sectionSource.value), {
      labelKeys: locale() === 'en' ? ['enName', 'cnName'] : ['cnName', 'enName'],
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

  const visibleFilterOptions = computed(() => [
    { value: true, label: t('schoolBus.routePlan.visibleYes') },
    { value: false, label: t('schoolBus.routePlan.visibleNo') }
  ])

  const searchCfg = computed<UniFormConfig>(() => {
    const schoolSchema = multiSchool.value
      ? [
          {
            field: 'schoolIds',
            label: '',
            component: 'ElSelect' as const,
            options: schoolOptions.value,
            componentProps: {
              placeholder: t('schoolBus.routeOperation.phSchool'),
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
          field: 'sectionId',
          label: '',
          component: 'ElSelect',
          options: sectionOptions.value,
          componentProps: {
            placeholder: t('schoolBus.routePlan.phSection'),
            clearable: true,
            filterable: true
          },
          colProps: { span: 6 }
        },
        {
          field: 'stationId',
          label: '',
          component: 'ElSelect',
          options: stationOptions.value,
          componentProps: {
            placeholder: t('schoolBus.routePlan.phStation'),
            clearable: true,
            filterable: true
          },
          colProps: { span: 6 }
        },
        {
          field: 'visible',
          label: '',
          component: 'ElSelect',
          options: visibleFilterOptions.value,
          componentProps: {
            placeholder: t('schoolBus.routeOperation.phStatus'),
            clearable: true
          },
          colProps: { span: 6 }
        },
        {
          field: 'cnName',
          label: '',
          component: 'ElInput',
          componentProps: {
            placeholder: t('schoolBus.routePlan.phLineName'),
            clearable: true
          },
          colProps: { span: 6 }
        },
        {
          field: 'carNumber',
          label: '',
          component: 'ElInput',
          componentProps: {
            placeholder: t('schoolBus.routePlan.phCarNumber'),
            clearable: true
          },
          colProps: { span: 6 }
        }
      ],
      rowProps: { gutter: 16 },
      colProps: { span: 6 }
    }
  })

  const fmtRowRoute = (row: Loose) => {
    normalizeSchoolIdsField(row)
    const loc = locale()
    row.showLineName = loc === 'en' ? row.enName : row.cnName
    row.showSectionName = loc === 'en' ? row.sectionEnName : row.sectionCnName
    row.lineTypeName =
      String(row.lineType) === '1'
        ? t('schoolBus.routePlan.routeTypeDaily')
        : t('schoolBus.routePlan.routeTypeWeekly')
    row.visibleLabel =
      row.visible === true || row.visible === 'true' || row.visible === 1
        ? t('schoolBus.routePlan.visibleYes')
        : t('schoolBus.routePlan.visibleNo')
    row.createTime = row.createTime
      ? dayjs(String(row.createTime)).format('YYYY-MM-DD HH:mm')
      : '--'
    row.updateTime = row.updateTime
      ? dayjs(String(row.updateTime)).format('YYYY-MM-DD HH:mm')
      : '--'

    return row
  }

  const routeColumns = computed<UniTableColumn[]>(() => [
    { prop: 'id', label: 'ID', width: 88, fixed: 'left' },
    {
      prop: 'schoolIds',
      label: t('schoolBus.driver.fieldSchool'),
      type: 'array',
      options: schoolOptions.value,
      lookup: { splitValues: true },
      minWidth: 200,
      showOverflowTooltip: true
    },
    { prop: 'showLineName', label: t('schoolBus.routeOperation.colLineName'), minWidth: 120 },
    { prop: 'lineTypeName', label: t('schoolBus.routeOperation.formTimeType'), width: 120 },
    {
      prop: 'showSectionName',
      label: t('schoolBus.routeOperation.colSectionName'),
      minWidth: 100
    },
    { prop: 'visibleLabel', label: t('schoolBus.routeOperation.colStatus'), width: 96 },
    { prop: 'createTime', label: t('schoolBus.routeOperation.colCreateTime'), width: 160 },
    { prop: 'updateTime', label: t('schoolBus.routeOperation.colUpdateTime'), width: 160 }
  ])

  const loadRoutes: UniTableRequest = async ({ pageNo, pageSize, filters: f }) => {
    const rawFilters = (f ?? {}) as LineListParams
    const base: Record<string, unknown> = {
      current: pageNo,
      size: pageSize,
      ...rawFilters
    }

    if (!multiSchool.value && defaultSchoolId.value != null && base.schoolIds == null) {
      base.schoolIds = defaultSchoolId.value
    }

    const params = stripEmptyParams(base)
    const result = await schoolBusLineApi.page.get(params)
    const { list, total } = normalizePaged<Loose>(result)

    return {
      data: list.map((r) => fmtRowRoute({ ...r })),
      total
    }
  }

  const openDetail = (row: Loose) => {
    detailRecord.value = row
    detailVisible.value = true
  }

  const openRouteEdit = (row: Loose) => {
    routeFormRef.value?.showForm('edit', row)
  }

  const actions = computed<UniTableAction[]>(() => [
    {
      label: t('schoolBus.look'),
      onClick: (row) => openDetail(row as Loose)
    },
    {
      label: t('schoolBus.edit'),
      code: 'busline_edit',
      onClick: (row) => openRouteEdit(row as Loose)
    }
  ])

  const onSelectionChange = (rows: Loose[]) => {
    selection.value = rows
  }

  const copySelected = async () => {
    const ids = selectedIds.value

    if (ids.length === 0) {
      ElMessage.warning(t('schoolBus.routePlan.msgSelectRowsFirst'))
      return
    }

    try {
      await schoolBusLineApi.batchCopy.get({ ids } as Record<string, unknown>)
      ElMessage.success(t('schoolBus.routePlan.msgCopySuccess'))
      tableRef.value?.refresh()
      selection.value = []
    } catch {
      /* request 层已提示 */
    }
  }

  const deleteSelected = async () => {
    const ids = selectedIds.value

    if (ids.length === 0) {
      ElMessage.warning(t('schoolBus.routePlan.msgSelectRowsFirst'))
      return
    }

    try {
      await ElMessageBox.confirm(
        t('schoolBus.routePlan.msgConfirmDeleteLines'),
        t('schoolBus.delete'),
        { type: 'warning' }
      )
    } catch {
      return
    }

    try {
      await schoolBusLineApi.delete.delete(ids)
      ElMessage.success(t('schoolBus.deleteSuccess'))
      tableRef.value?.refresh()
      selection.value = []
    } catch {
      /* request 层已提示 */
    }
  }

  onMounted(async () => {
    const [sectionsRaw, stationsRaw] = await Promise.all([
      schoolBusCommonApi.sectionList.get(),
      schoolBusCommonApi.stationList.get()
    ])

    sectionSource.value = pickNamedList(sectionsRaw)
    stationSource.value = pickNamedList(stationsRaw)
  })

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
    columns: routeColumns,
    defaultSchoolId,
    detailRecord,
    detailVisible,
    filters,
    handleLoadSuccess,
    loadRoutes,
    multiSchool,
    onSelectionChange,
    queryModel,
    reset,
    search,
    searchCfg,
    selectedIds,
    tableRef,
    copySelected,
    deleteSelected
  }
}
