import { computed, nextTick, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { Recordable, UniOption, UniTableAction, UniTableRequest, UniTableRequestResult } from 'uni-ui-lib'

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
  createDormitoryOptions,
  createSearchConfig,
  createStatusOptions
} from './list.config'

export const useList = () => {
  const { t } = useAppI18n()
  const initialFilters = {
    keywordssearch: '',
    schoolIds: undefined,
    yearGroupName: [],
    form: [],
    dormitoryStatus: undefined,
    busStatus: undefined,
    studentStatus: undefined
  }
  const queryModel = ref<Recordable>({ ...initialFilters })
  const filters = ref<Recordable>({})
  const tableRef = ref<{ refresh: () => void } | null>(null)
  const schoolOptions = ref<UniOption[]>([])
  const yearGroupOptions = ref<UniOption[]>([])
  const formOptions = ref<UniOption[]>([])
  const total = ref(0)

  const statusOptions = computed(() => createStatusOptions(t))
  const busOptions = computed(() => createBusOptions())
  const dormitoryOptions = computed(() => createDormitoryOptions())
  const valueEnums = computed<Record<string, UniOption[]>>(() => ({
    busStatus: busOptions.value,
    dormitoryStatus: dormitoryOptions.value,
    schoolName: schoolOptions.value,
    studentStatus: statusOptions.value
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

  const loadData: UniTableRequest = ({ pageNo, pageSize, filters }) =>
    fetchPage({ pageNo, pageSize, ...filters })

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

  const actions = computed<UniTableAction[]>(() => [
    {
      label: t('member.actions.detail'),
      code: 'dataform_file_look',
      onClick: (row) => ElMessage.info(String((row as Row).fullName ?? '-'))
    }
  ])

  const loadOptions = async () => {
    const [schools, yearGroups, forms] = await Promise.all([
      fetchSchools(),
      fetchYearGroups(),
      fetchForms()
    ])

    schoolOptions.value = schools.map((item) => ({ label: item.enName || item.name, value: item.id }))
    yearGroupOptions.value = yearGroups.map((item) => ({ label: item, value: item }))
    formOptions.value = forms.map((item) => ({ label: item, value: item }))
  }

  loadOptions()

  return {
    actions,
    columns,
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
