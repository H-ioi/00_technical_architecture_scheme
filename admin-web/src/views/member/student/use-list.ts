import { computed, ref } from 'vue'
import type { UniOption, UniTableAction, UniTableRequest } from 'uni-ui-lib'
import { toUniOptions, useUniListState } from 'uni-ui-lib'

import {
  fetchFormOptions as fetchForms,
  fetchMembershipSchoolOptions as fetchSchools,
  fetchStudentPage as fetchPage,
  fetchYearGroupOptions as fetchYearGroups
} from '@/api'
import { useAppI18n } from '@/composables/use-app-i18n'
import type { StudentRecord as Row } from '@/types/modules/member-student'

import {
  createBusOptions,
  createColumns,
  createDetailConfig,
  createDormitoryOptions,
  createSearchConfig,
  createStatusDisplayOptions,
  createStatusOptions,
  createYesNoDisplayOptions
} from './list.config'

export const useList = () => {
  const { locale, t } = useAppI18n()
  const initialFilters = {
    keywordssearch: '',
    schoolIds: undefined,
    yearGroupName: [],
    form: [],
    dormitoryStatus: undefined,
    busStatus: undefined,
    studentStatus: undefined
  }
  // 学生列表复用组件库列表状态，避免每个列表重复维护 search/reset/refresh。
  const { queryModel, filters, tableRef, total, search, reset, handleLoadSuccess } = useUniListState({
    initialFilters
  })
  const schoolOptions = ref<UniOption[]>([])
  const yearGroupOptions = ref<UniOption[]>([])
  const formOptions = ref<UniOption[]>([])
  const detailVisible = ref(false)
  const currentRecord = ref<Row | null>(null)

  const statusOptions = computed(() => createStatusOptions(t))
  const statusDisplayOptions = computed(() => createStatusDisplayOptions(t))
  const busOptions = computed(() => createBusOptions(t))
  const dormitoryOptions = computed(() => createDormitoryOptions(t))
  const yesNoDisplayOptions = computed(() => createYesNoDisplayOptions(t))
  const valueEnums = computed<Record<string, UniOption[]>>(() => ({
    busStatus: yesNoDisplayOptions.value,
    dormitoryStatus: yesNoDisplayOptions.value,
    schoolName: schoolOptions.value,
    studentStatus: statusDisplayOptions.value
  }))
  const searchConfig = computed(() =>
    createSearchConfig(
      t,
      schoolOptions.value,
      yearGroupOptions.value,
      formOptions.value,
      dormitoryOptions.value,
      busOptions.value,
      statusOptions.value
    )
  )
  const columns = computed(() => createColumns(t))
  const detailConfig = computed(() => createDetailConfig(t))

  const loadData: UniTableRequest = ({ pageNo, pageSize, filters }) =>
    fetchPage({ pageNo, pageSize, ...filters })

  const openDetail = (row: Row) => {
    currentRecord.value = row
    detailVisible.value = true
  }

  const actions = computed<UniTableAction[]>(() => [
    {
      label: t('member.actions.detail'),
      code: 'dataform_file_look',
      onClick: (row) => openDetail(row as Row)
    }
  ])

  const loadOptions = async () => {
    const [schools, yearGroups, forms] = await Promise.all([
      fetchSchools(),
      fetchYearGroups(),
      fetchForms()
    ])

    // 选项统一转成 UniOption，供搜索表单下拉和表格枚举展示共享。
    schoolOptions.value = toUniOptions(schools, {
      labelKeys: locale.value === 'en' ? ['enName', 'name'] : ['name', 'cnName', 'enName'],
      valueKey: 'id'
    })
    yearGroupOptions.value = toUniOptions(yearGroups.map((item) => ({ label: item, value: item })), {
      labelKeys: ['label'],
      valueKey: 'value'
    })
    formOptions.value = toUniOptions(forms.map((item) => ({ label: item, value: item })), {
      labelKeys: ['label'],
      valueKey: 'value'
    })
  }

  loadOptions()

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
    total,
    valueEnums
  }
}
