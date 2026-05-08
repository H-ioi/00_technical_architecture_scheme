import type {
  UniOption,
  UniTableAction,
  UniTableRequest
} from 'uni-ui-lib'
import { toUniOptions, useUniListState } from 'uni-ui-lib'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import {
  fetchProtocolDict,
  fetchProtocolPage as fetchPage,
  fetchProtocolSchoolOptions as fetchSchools
} from '@/api'
import { useAppI18n } from '@/composables/use-app-i18n'
import type { ProtocolDict, ProtocolDictItem, ProtocolRecord as Row } from '@/types/modules/protocol'

import {
  createColumns,
  createSearchConfig,
  createStatusOptions,
  createYesNoOptions
} from './list.config'

const createDictOptions = (items: ProtocolDictItem[] = [], locale: string): UniOption[] =>
  toUniOptions(items, {
    labelKeys: locale === 'en' ? ['enName', 'name', 'cnName'] : ['name', 'cnName', 'enName'],
    valueKey: 'id'
  })

export const useList = () => {
  const router = useRouter()
  const { locale, t } = useAppI18n()
  const initialFilters = {
    schoolIds: undefined,
    cnName: '',
    enName: '',
    protocolType: undefined,
    module: undefined,
    status: undefined
  }
  // useUniListState 抽离列表页通用状态：查询模型、实际过滤条件、表格 ref 和总数。
  const { queryModel, filters, tableRef, total, search, reset, handleLoadSuccess } = useUniListState({
    initialFilters
  })
  const formVisible = ref(false)
  const formMode = ref<'add' | 'edit'>('add')
  const currentRecord = ref<Row | null>(null)
  const schoolOptions = ref<UniOption[]>([])
  const protocolDict = ref<ProtocolDict>({})

  const protocolTypeOptions = computed(() => createDictOptions(protocolDict.value.protocolTypeList, locale.value))
  const moduleOptions = computed(() => createDictOptions(protocolDict.value.moduleList, locale.value))
  const yesNoOptions = computed(() => createYesNoOptions(t))
  const statusOptions = computed(() => createStatusOptions(t))
  const valueEnums = computed<Record<string, UniOption[]>>(() => ({
    protocolType: protocolTypeOptions.value,
    module: moduleOptions.value,
    needSign: yesNoOptions.value,
    status: statusOptions.value
  }))
  const searchConfig = computed(() =>
    createSearchConfig(t, schoolOptions.value, protocolTypeOptions.value, moduleOptions.value, statusOptions.value)
  )
  const columns = computed(() => createColumns(t))

  const normalizeRow = (row: Row): Row => ({
    ...row,
    schoolName: (locale.value === 'en' ? row.schoolEnNames : row.schoolCnNames) || row.schoolEnNames || row.schoolCnNames
  })

  const loadData: UniTableRequest = async ({ pageNo, pageSize, filters }) => {
    const result = await fetchPage({ pageNo, pageSize, ...filters })

    return {
      records: result.records.map(normalizeRow),
      total: result.total
    }
  }

  // 查看动作进入独立详情页，由路由生成对应 tag，避免详情弹窗承载大表格。
  const openDetail = (row: Row) => {
    void router.push(`/protocol/detail/${row.id}`)
  }

  const openForm = (mode: 'add' | 'edit', row?: Row) => {
    formMode.value = mode
    currentRecord.value = row ?? null
    formVisible.value = true
  }

  const actions = computed<UniTableAction[]>(() => [
    {
      label: t('protocol.actions.detail'),
      onClick: (row) => openDetail(row as Row)
    },
    {
      label: t('protocol.actions.edit'),
      code: 'protocol_edit',
      onClick: (row) => openForm('edit', row as Row)
    }
  ])

  onMounted(async () => {
    const [schools, dict] = await Promise.all([fetchSchools(), fetchProtocolDict()])

    schoolOptions.value = toUniOptions(schools, {
      labelKeys: locale.value === 'en' ? ['enName', 'name'] : ['name', 'cnName', 'enName'],
      valueKey: 'id'
    })
    protocolDict.value = dict ?? {}
  })

  return {
    actions,
    columns,
    currentRecord,
    filters,
    formMode,
    formVisible,
    handleLoadSuccess,
    loadData,
    moduleOptions,
    openForm,
    protocolTypeOptions,
    queryModel,
    reset,
    schoolOptions,
    search,
    searchConfig,
    statusOptions,
    tableRef,
    total,
    valueEnums,
    yesNoOptions
  }
}
