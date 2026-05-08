import type {
  Recordable,
  UniOption,
  UniTableAction,
  UniTableRequest,
  UniTableRequestResult
} from 'uni-ui-lib'
import { computed, nextTick, onMounted, ref } from 'vue'
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
  items.map((item) => ({
    label: (locale === 'en' ? item.enName : item.cnName) || item.name || item.enName || item.cnName || String(item.id),
    value: item.id
  }))

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
  const queryModel = ref<Recordable>({ ...initialFilters })
  const filters = ref<Recordable>({})
  const tableRef = ref<{ refresh: () => void } | null>(null)
  const total = ref(0)
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

  const refreshTable = async () => {
    await nextTick()
    tableRef.value?.refresh()
  }

  const search = async (value: Recordable) => {
    filters.value = { ...value }
    await refreshTable()
  }

  const reset = async (value: Recordable = {}) => {
    filters.value = { ...value }
    await refreshTable()
  }

  const handleLoadSuccess = (result: UniTableRequestResult) => {
    total.value = result.total
  }

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

    schoolOptions.value = schools.map((item) => ({
      label: item.enName || item.name || String(item.id),
      value: item.id
    }))
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
