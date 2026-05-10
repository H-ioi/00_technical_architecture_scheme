import type {
  UniOption,
  UniTableAction,
  UniTableRequest
} from 'uni-ui-lib'
import { toUniOptions, useUniI18n, useUniListState } from 'uni-ui-lib'
import { computed, onMounted, ref } from 'vue'

import { membershipApi, teacherApi } from '@/api'
import type { TeacherRecord as Row } from '@/types/modules/member-teacher'

import { detailForm, roleOpts, searchForm, statusOpts, tableCols } from './list.config'

export const useList = () => {
  const { locale, t } = useUniI18n()
  const initialFilters = {
    keywordssearch: '',
    schoolIds: undefined,
    role: undefined,
    archived: undefined
  }
  const { queryModel, filters, tableRef, total, search, reset, handleLoadSuccess } = useUniListState({
    initialFilters
  })
  const detailVisible = ref(false)
  const currentRecord = ref<Row | null>(null)
  const schoolOptions = ref<UniOption[]>([])
  const roleOptions = ref<UniOption[]>([])

  const statusOptions = computed(() => statusOpts(t))
  const valueEnums = computed<Record<string, UniOption[]>>(() => ({
    archived: statusOptions.value,
    schoolName: schoolOptions.value
  }))
  const searchConfig = computed(() =>
    searchForm(t, schoolOptions.value, roleOptions.value, statusOptions.value)
  )
  const columns = computed(() => tableCols(t))
  const detailConfig = computed(() => detailForm(t))

  const loadData: UniTableRequest = ({ pageNo: current, pageSize: size, filters }) =>
    teacherApi.page.get({ current, size, ...filters })

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

  onMounted(async () => {
    const [schools, roles] = await Promise.all([membershipApi.school.get(), teacherApi.role.get()])

    schoolOptions.value = toUniOptions(schools, {
      labelKeys: locale() === 'en' ? ['enName', 'name'] : ['name', 'cnName', 'enName'],
      valueKey: 'id'
    })
    roleOptions.value = roleOpts(roles)
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
