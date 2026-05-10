import type { UniTableAction, UniTableRequest } from 'uni-ui-lib'
import { toUniOptions, useUniI18n, useUniListState } from 'uni-ui-lib'
import { computed, nextTick, onMounted, ref, watch } from 'vue'

import { membershipApi, schoolBusDriverApi } from '@/api'
import type { SchoolOptionRecord } from '@/types/modules/membership'
import type { DriverRecord as Row } from '@/types/modules/school-bus-driver'

import { searchForm, statusOpts, tableCols } from './list.config'

type Loose = Record<string, unknown>

/** 分页体兼容 `{ data:[] }` / `{ records:[] }` / `data: { list:[] }` */
const unwrapDriverPage = (payload: unknown): { list: Row[]; total: number } => {
  if (!payload || typeof payload !== 'object') {
    return { list: [], total: 0 }
  }

  const r = payload as Loose
  const num = (value: unknown) =>
    typeof value === 'number' && Number.isFinite(value) ? value : 0

  if (Array.isArray(r.data)) {
    return { list: r.data as Row[], total: num(r.total) }
  }

  if (Array.isArray(r.records)) {
    return { list: r.records as Row[], total: num(r.total) }
  }

  if (Array.isArray(r.list)) {
    return { list: r.list as Row[], total: num(r.total) }
  }

  const inner = r.data

  if (inner && typeof inner === 'object' && !Array.isArray(inner)) {
    const obj = inner as Loose
    let list: Row[] = []

    if (Array.isArray(obj.records)) {
      list = obj.records as Row[]
    } else if (Array.isArray(obj.list)) {
      list = obj.list as Row[]
    } else if (Array.isArray(obj.data)) {
      list = obj.data as Row[]
    } else if (Array.isArray(obj.content)) {
      list = obj.content as Row[]
    }

    return {
      list,
      total:
        num(r.total) ||
        num(obj.total) ||
        num(obj.totalElements) ||
        num(r.totalElements)
    }
  }

  return {
    list: [],
    total: num(r.total) ?? num(r.totalRow) ?? num(r.totalElements)
  }
}

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
  const initialFilters = {
    schoolIds: undefined as string | number | undefined,
    keyword: '',
    status: undefined as string | number | undefined
  }
  const { queryModel, filters, tableRef, total, search, reset, handleLoadSuccess } = useUniListState({
    initialFilters
  })
  const schoolRecords = ref<SchoolOptionRecord[]>([])
  const schoolOptions = computed(() =>
    toUniOptions(schoolRecords.value, {
      labelKeys: locale() === 'en' ? ['enName', 'name'] : ['name', 'cnName', 'enName'],
      valueKey: 'id'
    })
  )
  const formVisible = ref(false)
  const formMode = ref<'add' | 'edit' | 'look'>('add')
  const currentRecord = ref<Row | null>(null)

  /** 与旧系统一致：仅一所学校时列表默认带 schoolIds，新增表单默认勾选该校 */
  const defaultSchoolId = computed(() =>
    schoolRecords.value.length === 1 ? schoolRecords.value[0].id : null
  )

  const statusOptions = computed(() => statusOpts(t))
  const searchConfig = computed(() =>
    searchForm(t, schoolOptions.value, statusOptions.value, defaultSchoolId.value ?? undefined)
  )
  const columns = computed(() => tableCols(t, schoolOptions.value, statusOptions.value))

  const loadData: UniTableRequest = async ({ pageNo: current, pageSize: size, filters: f }) => {
    const result = await schoolBusDriverApi.page.get({ current, size, ...f })
    const { list, total: pageTotal } = unwrapDriverPage(result)

    return {
      data: list,
      total: pageTotal
    }
  }

  const openForm = (mode: 'add' | 'edit' | 'look', row?: Row) => {
    formMode.value = mode
    currentRecord.value = row ?? null
    formVisible.value = true
  }

  const actions = computed<UniTableAction[]>(() => [
    {
      label: t('schoolBus.driver.actions.look'),
      onClick: (row) => openForm('look', row as Row)
    },
    {
      label: t('schoolBus.driver.actions.edit'),
      code: 'busdriver_edit',
      onClick: (row) => openForm('edit', row as Row)
    }
  ])

  const downloadImportTemplate = async () => {
    await schoolBusDriverApi.template.download()
  }

  onMounted(async () => {
    const raw = await membershipApi.school.get()
    schoolRecords.value = pickSchoolRecords(raw)
  })

  /** 校区加载后：单校默认带 schoolIds；刷新表格以应用列 options */
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
    downloadImportTemplate,
    filters,
    formMode,
    formVisible,
    handleLoadSuccess,
    loadData,
    openForm,
    queryModel,
    reset,
    schoolOptions,
    search,
    searchConfig,
    statusOptions,
    tableRef,
    total
  }
}
