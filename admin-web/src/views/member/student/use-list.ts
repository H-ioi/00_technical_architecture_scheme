import type { UniOption, UniTableAction, UniTableRequest } from 'uni-ui-lib'
import { toUniOptions, useUniI18n, useUniListState } from 'uni-ui-lib'
import { computed, ref } from 'vue'

import { membershipApi, studentApi } from '@/api'
import type { StudentRecord as Row } from '@/types/modules/member-student'

import {
  busOpts,
  detailForm,
  dormOpts,
  searchForm,
  stDispOpts,
  statusOpts,
  tableCols,
  ynDispOpts
} from './list.config'

export const useList = () => {
  const { locale, t } = useUniI18n()
  const initialFilters = {
    keywordssearch: '',
    schoolIds: undefined,
    yearGroupName: [],
    form: [],
    dormitoryStatus: undefined,
    busStatus: undefined,
    studentStatus: undefined
  }
  const { queryModel, filters, tableRef, total, search, reset, handleLoadSuccess } =
    useUniListState({
      initialFilters
    })
  const schoolOptions = ref<UniOption[]>([])
  const yearGroupOptions = ref<UniOption[]>([])
  const formOptions = ref<UniOption[]>([])
  const detailVisible = ref(false)
  const currentRecord = ref<Row | null>(null)

  const statusOptions = computed(() => statusOpts(t))
  const statusDispOpts = computed(() => stDispOpts(t))
  const busOptions = computed(() => busOpts(t))
  const dormitoryOptions = computed(() => dormOpts(t))
  const ynDispOptions = computed(() => ynDispOpts(t))
  const searchConfig = computed(() =>
    searchForm(
      t,
      schoolOptions.value,
      yearGroupOptions.value,
      formOptions.value,
      dormitoryOptions.value,
      busOptions.value,
      statusOptions.value
    )
  )
  const columns = computed(() =>
    tableCols(t, schoolOptions.value, ynDispOptions.value, statusDispOpts.value)
  )
  const detailConfig = computed(() => detailForm(t))

  const loadData: UniTableRequest = ({ pageNo: current, pageSize: size, filters }) =>
    studentApi.page.get({ current, size, ...filters })

  const show = (row: Row) => {
    currentRecord.value = row
    detailVisible.value = true
  }

  const actions = computed<UniTableAction[]>(() => [
    {
      label: t('member.actions.detail'),
      code: 'dataform_file_look',
      onClick: (row) => show(row as Row)
    }
  ])

  const loadOpts = async () => {
    const [schools, yearGroups, forms] = await Promise.all([
      membershipApi.school.get(),
      studentApi.yearGroup.get(),
      studentApi.form.get()
    ])

    schoolOptions.value = toUniOptions(schools, {
      labelKeys: locale() === 'en' ? ['enName', 'name'] : ['name', 'cnName', 'enName'],
      valueKey: 'id'
    })
    yearGroupOptions.value = toUniOptions(
      yearGroups.map((item) => ({ label: item, value: item })),
      {
        labelKeys: ['label'],
        valueKey: 'value'
      }
    )
    formOptions.value = toUniOptions(
      forms.map((item) => ({ label: item, value: item })),
      {
        labelKeys: ['label'],
        valueKey: 'value'
      }
    )
  }

  loadOpts()

  return {
    actions,
    columns,
    currentRecord,
    detailConfig,
    detailVisible,
    filters,
    handleLoadSuccess,
    loadData,
    queryModel,
    reset,
    search,
    searchConfig,
    tableRef,
    total
  }
}
