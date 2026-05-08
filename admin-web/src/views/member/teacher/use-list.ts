import type {
  UniOption,
  UniTableAction,
  UniTableRequest
} from 'uni-ui-lib'
import { toUniOptions, useUniListState } from 'uni-ui-lib'
import { computed, onMounted, ref } from 'vue'

import {
  fetchTeacherPage as fetchPage,
  fetchTeacherRoleOptions as fetchRoles,
  fetchSchoolOptions as fetchSchools
} from '@/api'
import { useAppI18n } from '@/composables/use-app-i18n'
import type { TeacherRecord as Row } from '@/types/modules/member-teacher'

import {
  createColumns,
  createDetailConfig,
  createRoleOptions,
  createSearchConfig,
  createStatusOptions
} from './list.config'

export const useList = () => {
  const { locale, t } = useAppI18n()
  const initialFilters = {
    keywordssearch: '',
    schoolIds: undefined,
    role: undefined,
    archived: undefined
  }
  // 成员列表共用组件库列表状态，页面只保留教师领域的列、选项和行操作。
  const { queryModel, filters, tableRef, total, search, reset, handleLoadSuccess } = useUniListState({
    initialFilters
  })
  const detailVisible = ref(false)
  const currentRecord = ref<Row | null>(null)
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

  const loadData: UniTableRequest = ({ pageNo: current, pageSize: size, filters }) =>
    fetchPage({ current, size, ...filters })

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

  onMounted(async () => {
    const [schools, roles] = await Promise.all([fetchSchools(), fetchRoles()])

    // 学校字典统一转成 UniOption，供 UniSearchForm 和 UniDataTable 枚举回显复用。
    schoolOptions.value = toUniOptions(schools, {
      labelKeys: locale.value === 'en' ? ['enName', 'name'] : ['name', 'cnName', 'enName'],
      valueKey: 'id'
    })
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
