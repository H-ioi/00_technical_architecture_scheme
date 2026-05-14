import type { UniFormConfig, UniTableAction, UniTableRequest } from 'uni-ui-lib'
import dayjs from 'dayjs'
import { toUniOptions, useUniI18n, useUniListState } from 'uni-ui-lib'
import { computed, nextTick, onMounted, ref, watch } from 'vue'

import { exceptionTypeMeta, tableCols, yesNoMeta } from './list.config'

import { membershipApi, schoolBusCommonApi, schoolBusExceptionApi } from '@/api'
import { normalizePaged } from '@/utils/api-response-normalize'
import type { SchoolOptionRecord } from '@/types/modules/membership'
import type { ExceptionListParams, ExceptionRecord } from '@/types/modules/school-bus-exception'

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
  schoolIds?: number[] | number | string
}

interface CarEntity {
  id: string | number
  carNumber?: string
}

const labelOf = (options: { value: string; label: string }[], value: unknown): string =>
  options.find((x) => String(x.value) === String(value))?.label ?? String(value ?? '--')

/** 将接口里的 schoolIds（或单 id / 逗号串）规范为数组。 */
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

const formatExceptionRow = (
  row: ExceptionRecord,
  locale: string,
  exceptionOpts: { value: string; label: string }[],
  yesNoOpts: { value: string; label: string }[]
): ExceptionRecord => {
  const sectionName =
    locale === 'en'
      ? String(row.sectionEnName ?? row.sectionName ?? '')
      : String(row.sectionCnName ?? row.sectionName ?? '')

  const next: ExceptionRecord = { ...row }

  normalizeSchoolIdsField(next as Loose)

  next.sectionName = sectionName || '--'
  next.exceptionTypeLabel = labelOf(exceptionOpts, row.exceptionType)
  next.needDispatchLabel = labelOf(yesNoOpts, row.needDispatch)
  next.exceptionDate = row.exceptionDate
    ? dayjs(String(row.exceptionDate)).format('YYYY-MM-DD')
    : '--'
  next.createTime = row.createTime ? dayjs(String(row.createTime)).format('YYYY-MM-DD HH:mm') : '--'

  return next
}

export const useList = () => {
  const { locale, t } = useUniI18n()

  const initialFilters: Record<string, unknown> = {
    schoolIds: undefined,
    sectionId: undefined,
    lineIds: undefined,
    carId: undefined,
    exceptionType: undefined,
    needDispatch: undefined,
    exceptionDateStart: undefined,
    exceptionDateEnd: undefined
  }

  const { queryModel, filters, tableRef, search, reset, handleLoadSuccess } = useUniListState({
    initialFilters
  })

  const schoolRecords = ref<SchoolOptionRecord[]>([])
  const sectionSource = ref<NamedEntity[]>([])
  const lineSource = ref<NamedEntity[]>([])
  const carSource = ref<CarEntity[]>([])

  const formVisible = ref(false)
  const formMode = ref<'add' | 'edit' | 'look'>('add')
  const activeRow = ref<ExceptionRecord | null>(null)
  const detailVisible = ref(false)
  const detailRecord = ref<ExceptionRecord | null>(null)

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

  const lineOptions = computed(() =>
    toUniOptions(filterBySchools(lineSource.value), {
      labelKeys: locale() === 'en' ? ['enName', 'cnName'] : ['cnName', 'enName'],
      valueKey: 'id'
    })
  )

  const carOptions = computed(() =>
    carSource.value.map((c) => ({
      label: String(c.carNumber ?? c.id),
      value: c.id
    }))
  )

  const exceptionTypeOptions = computed(() => exceptionTypeMeta(t))
  const yesNoOptions = computed(() => yesNoMeta(t))

  const searchCfg = computed<UniFormConfig>(() => {
    const schoolSchema = multiSchool.value
      ? [
          {
            field: 'schoolIds',
            label: '',
            component: 'ElSelect' as const,
            options: schoolOptions.value,
            componentProps: {
              placeholder: t('schoolBus.routeException.placeholders.school'),
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
            placeholder: t('schoolBus.routeException.placeholders.section'),
            clearable: true,
            filterable: true
          },
          colProps: { span: 6 }
        },
        {
          field: 'lineIds',
          label: '',
          component: 'ElSelect',
          options: lineOptions.value,
          componentProps: {
            placeholder: t('schoolBus.routeException.placeholders.line'),
            clearable: true,
            filterable: true,
            multiple: true,
            collapseTags: true,
            collapseTagsTooltip: true
          },
          colProps: { span: 6 }
        },
        {
          field: 'carId',
          label: '',
          component: 'ElSelect',
          options: carOptions.value,
          componentProps: {
            placeholder: t('schoolBus.routeException.placeholders.car'),
            clearable: true,
            filterable: true
          },
          colProps: { span: 6 }
        },
        {
          field: 'exceptionType',
          label: '',
          component: 'ElSelect',
          options: exceptionTypeOptions.value,
          componentProps: {
            placeholder: t('schoolBus.routeException.placeholders.exceptionType'),
            clearable: true
          },
          colProps: { span: 6 }
        },
        {
          field: 'needDispatch',
          label: '',
          component: 'ElSelect',
          options: yesNoOptions.value,
          componentProps: {
            placeholder: t('schoolBus.routeException.placeholders.needDispatch'),
            clearable: true
          },
          colProps: { span: 6 }
        },
        {
          field: 'exceptionDateStart',
          label: '',
          component: 'ElDatePicker',
          componentProps: {
            type: 'date',
            placeholder: t('schoolBus.routeException.placeholders.exceptionDateStart'),
            valueFormat: 'YYYY-MM-DD',
            clearable: true
          },
          colProps: { span: 6 }
        },
        {
          field: 'exceptionDateEnd',
          label: '',
          component: 'ElDatePicker',
          componentProps: {
            type: 'date',
            placeholder: t('schoolBus.routeException.placeholders.exceptionDateEnd'),
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
    const params: ExceptionListParams = {
      current: pageNo,
      size: pageSize,
      ...(f as ExceptionListParams)
    }

    if (!multiSchool.value && defaultSchoolId.value != null && params.schoolIds == null) {
      params.schoolIds = defaultSchoolId.value
    }

    const result = await schoolBusExceptionApi.page.get(params)
    const { list, total } = normalizePaged<ExceptionRecord>(result)
    const exOpts = exceptionTypeMeta(t).map((x) => ({ value: String(x.value), label: x.label }))
    const ynOpts = yesNoMeta(t).map((x) => ({ value: String(x.value), label: x.label }))

    return {
      data: list.map((row) => formatExceptionRow(row, locale(), exOpts, ynOpts)),
      total
    }
  }

  const openForm = (mode: 'add' | 'edit' | 'look', row?: ExceptionRecord) => {
    formMode.value = mode
    activeRow.value = row ?? null
    formVisible.value = true
  }

  const openDetail = (row: ExceptionRecord) => {
    detailRecord.value = row
    detailVisible.value = true
  }

  const actions = computed<UniTableAction[]>(() => [
    {
      label: t('schoolBus.look'),
      onClick: (row) => openDetail(row as ExceptionRecord)
    },
    {
      label: t('schoolBus.edit'),
      code: 'busexception_edit',
      onClick: (row) => openForm('edit', row as ExceptionRecord)
    }
  ])

  onMounted(async () => {
    const rawSchools = await membershipApi.school.get()
    schoolRecords.value = pickSchoolRecords(rawSchools)

    const [sectionsRaw, linesRaw, carsRaw] = await Promise.all([
      schoolBusCommonApi.sectionList.get(),
      schoolBusCommonApi.lineList.get(),
      schoolBusCommonApi.carinfoList.get()
    ])

    sectionSource.value = pickNamedList(sectionsRaw)
    lineSource.value = pickNamedList(linesRaw)
    carSource.value = pickNamedList(carsRaw) as CarEntity[]
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
    loadData,
    multiSchool,
    openDetail,
    openForm,
    queryModel,
    reset,
    schoolOptions,
    search,
    searchCfg,
    tableRef,
    schoolRecords
  }
}
