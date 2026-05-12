import type { UniOption, UniTableAction, UniTableRequest } from 'uni-ui-lib'
import { toUniOptions, useUniI18n, useUniListState } from 'uni-ui-lib'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import { membershipApi, protocolApi } from '@/api'
import type { ProtocolDict, ProtocolRecord as Row } from '@/types/modules/protocol'

import { buildProtocolDictOptions } from './dict-options'
import { searchForm, statusOpts, tableCols, yesNoOpts } from './list.config'

export const useList = () => {
  const router = useRouter()
  const { locale, t } = useUniI18n()
  const initialFilters = {
    schoolIds: undefined,
    cnName: '',
    enName: '',
    protocolType: undefined,
    module: undefined,
    status: undefined
  }
  const { queryModel, filters, tableRef, total, search, reset, handleLoadSuccess } =
    useUniListState({
      initialFilters
    })
  const formVisible = ref(false)
  const formMode = ref<'add' | 'edit'>('add')
  const currentRecord = ref<Row | null>(null)
  const schoolOptions = ref<UniOption[]>([])
  const protocolDict = ref<ProtocolDict>({})

  const protocolTypeOptions = computed(() =>
    buildProtocolDictOptions(protocolDict.value.protocolTypeList, locale())
  )
  const moduleOptions = computed(() =>
    buildProtocolDictOptions(protocolDict.value.moduleList, locale())
  )
  const yesNoOptions = computed(() => yesNoOpts(t))
  const statusOptions = computed(() => statusOpts(t))
  const searchConfig = computed(() =>
    searchForm(
      t,
      schoolOptions.value,
      protocolTypeOptions.value,
      moduleOptions.value,
      statusOptions.value
    )
  )
  const columns = computed(() =>
    tableCols(
      t,
      locale(),
      schoolOptions.value,
      protocolTypeOptions.value,
      moduleOptions.value,
      yesNoOptions.value,
      statusOptions.value
    )
  )

  const loadData: UniTableRequest = async ({ pageNo: current, pageSize: size, filters }) => {
    const result = await protocolApi.page.get({ current, size, ...filters })

    return {
      data: result.data,
      total: result.total
    }
  }

  const toDetail = (row: Row) => {
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
      onClick: (row) => toDetail(row as Row)
    },
    {
      label: t('protocol.actions.edit'),
      code: 'protocol_edit',
      onClick: (row) => openForm('edit', row as Row)
    }
  ])

  onMounted(async () => {
    const [schools, dict] = await Promise.all([membershipApi.school.get(), protocolApi.dict.get()])

    schoolOptions.value = toUniOptions(schools, {
      labelKeys: locale() === 'en' ? ['enName', 'name'] : ['name', 'cnName', 'enName'],
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
    yesNoOptions
  }
}
