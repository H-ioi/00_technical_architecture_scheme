import { computed, nextTick, onMounted, ref } from 'vue'
import type {
  Recordable,
  UniOption,
  UniTableAction,
  UniTableRequest,
  UniTableRequestResult
} from 'uni-ui-lib'

import {
  fetchTeacherDetail as fetchDetail,
  fetchTeacherPage as fetchPage,
  fetchTeacherRoleOptions as fetchRoles,
  fetchTeacherSchoolOptions as fetchSchools
} from '@/api'
import { useAppI18n } from '@/composables/use-app-i18n'
import type { TeacherDetail as Detail, TeacherRecord as Row } from '@/types/modules/member-teacher'

import {
  createColumns,
  createDetailConfig,
  createRoleOptions,
  createSearchConfig,
  createStatusOptions
} from './list.config'

export const useList = () => {
  const { t } = useAppI18n()
  const initialFilters = {
    keywordssearch: '',
    schoolIds: undefined,
    role: undefined,
    archived: undefined
  }
  const queryModel = ref<Recordable>({ ...initialFilters })
  const filters = ref<Recordable>({})
  const tableRef = ref<{ refresh: () => void } | null>(null)
  const total = ref(0)
  const detailVisible = ref(false)
  const currentRecord = ref<Detail | null>(null)
  const schoolOptions = ref<UniOption[]>([])
  const roleOptions = ref<UniOption[]>([])

  const statusOptions = computed(() => createStatusOptions(t))
  const valueEnums = computed<Record<string, UniOption[]>>(() => ({
    archived: statusOptions.value,
    schoolName: schoolOptions.value
  }))
  const searchConfig = computed(() =>
    createSearchConfig(t, schoolOptions.value, roleOptions.value, statusOptions.value)
  )
  const columns = computed(() => createColumns(t))
  const detailConfig = computed(() => createDetailConfig(t))

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

  const openDetail = async (row: Row) => {
    currentRecord.value = row.teacherIdInt ? await fetchDetail(row.teacherIdInt) : row
    detailVisible.value = true
  }

  const actions = computed<UniTableAction[]>(() => [
    {
      label: t('member.actions.detail'),
      code: 'dataform_file_look',
      onClick: (row) => openDetail(row as Row)
    }
  ])

  onMounted(async () => {
    const [schools, roles] = await Promise.all([fetchSchools(), fetchRoles()])

    schoolOptions.value = schools.map((item) => ({ label: item.enName || item.name, value: item.id }))
    roleOptions.value = createRoleOptions(roles)
  })

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
