import type { UniOption, UniTableAction, UniTableRequest } from 'uni-ui-lib'
import { toUniOptions, useUniI18n, useUniListState } from 'uni-ui-lib'
import { computed, onMounted, ref } from 'vue'

import { membershipApi, schoolBusDriverApi } from '@/api'
import type { SchoolOptionRecord } from '@/types/modules/membership'
import type { DriverRecord as Row } from '@/types/modules/school-bus-driver'

import { searchForm, statusOpts, tableCols } from './list.config'

const dispSchool = (row: Row): string =>
  (typeof row.schoolNames === 'string' && row.schoolNames) ||
  (typeof row.schoolName === 'string' && row.schoolName) ||
  ''

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
  const formMode = ref<'add' | 'edit'>('add')
  const currentRecord = ref<Row | null>(null)

  const statusOptions = computed(() => statusOpts(t))
  const valueEnums = computed<Record<string, UniOption[]>>(() => ({
    status: statusOptions.value
  }))
  const searchConfig = computed(() => searchForm(t, schoolOptions.value, statusOptions.value))
  const columns = computed(() => tableCols(t))

  const normRow = (row: Row): Row => ({
    ...row,
    schoolNames: dispSchool(row)
  })

  const loadData: UniTableRequest = async ({ pageNo: current, pageSize: size, filters: f }) => {
    const result = await schoolBusDriverApi.page.get({ current, size, ...f })

    return {
      data: result.data.map(normRow),
      total: result.total
    }
  }

  const openForm = (mode: 'add' | 'edit', row?: Row) => {
    formMode.value = mode
    currentRecord.value = row ?? null
    formVisible.value = true
  }

  const actions = computed<UniTableAction[]>(() => [
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
    schoolRecords.value = await membershipApi.school.get()
  })

  return {
    actions,
    columns,
    currentRecord,
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
    total,
    valueEnums
  }
}
