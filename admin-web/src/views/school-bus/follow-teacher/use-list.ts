import type { UniTableAction, UniTableRequest } from 'uni-ui-lib'
import dayjs from 'dayjs'
import { useUniI18n, useUniListState } from 'uni-ui-lib'
import { computed, nextTick, onMounted, ref, watch } from 'vue'

import { searchForm, statusOpts, tableCols } from './list.config'

import { membershipApi, schoolBusFollowTeacherApi } from '@/api'
import { normalizePaged } from '@/utils/api-response-normalize'
import type { SchoolOptionRecord } from '@/types/modules/membership'
import type {
  FollowTeacherListParams,
  FollowTeacherRecord
} from '@/types/modules/school-bus-follow-teacher'
import { membershipSchoolLabel, membershipSchoolToOptions } from '@/utils/membership-school'

type Loose = Record<string, unknown>

const pickSchoolRecords = (payload: unknown): SchoolOptionRecord[] => {
  if (Array.isArray(payload)) {
    return payload as SchoolOptionRecord[]
  }
  if (payload && typeof payload === 'object') {
    const data = (payload as Loose).data
    if (Array.isArray(data)) {
      return data as SchoolOptionRecord[]
    }
  }
  return []
}

export const useList = () => {
  const { locale, t } = useUniI18n()
  const initialFilters: Record<string, unknown> = {
    keyword: '',
    schoolIds: undefined
  }
  const { queryModel, filters, tableRef, search, reset, handleLoadSuccess } = useUniListState({
    initialFilters
  })

  const schoolRecords = ref<SchoolOptionRecord[]>([])
  const schoolOptions = computed(() => membershipSchoolToOptions(schoolRecords.value, locale()))
  const multiSchool = computed(() => schoolRecords.value.length > 1)
  const defaultSchoolId = computed(() =>
    schoolRecords.value.length === 1 ? schoolRecords.value[0].id : null
  )

  const statusOptions = computed(() => statusOpts(t))
  const searchCfg = computed(() => searchForm(t, schoolOptions.value, multiSchool.value))
  const columns = computed(() => tableCols(t, statusOptions.value))

  const formVisible = ref(false)
  const formMode = ref<'add' | 'edit' | 'look'>('add')
  const activeRow = ref<FollowTeacherRecord | null>(null)

  const schoolLabel = (id: unknown) => membershipSchoolLabel(schoolRecords.value, id, locale())

  const decorate = (row: FollowTeacherRecord): FollowTeacherRecord => ({
    ...row,
    schoolLabel: schoolLabel(row.school),
    lastLoginTime: row.lastLoginTime
      ? dayjs(String(row.lastLoginTime)).format('YYYY-MM-DD HH:mm')
      : '--'
  })

  const loadData: UniTableRequest = async ({ pageNo: current, pageSize: size, filters: f }) => {
    const raw: FollowTeacherListParams = { current, size, ...f } as FollowTeacherListParams
    if (!multiSchool.value && defaultSchoolId.value != null && raw.schoolIds == null) {
      raw.schoolIds = defaultSchoolId.value
    }
    const result = await schoolBusFollowTeacherApi.page.get(raw)
    const { list, total } = normalizePaged<FollowTeacherRecord>(result)
    return { data: list.map(decorate), total }
  }

  const openForm = (mode: 'add' | 'edit' | 'look', row?: FollowTeacherRecord) => {
    formMode.value = mode
    activeRow.value = row ?? null
    formVisible.value = true
  }

  const actions = computed<UniTableAction[]>(() => [
    {
      label: t('schoolBus.driver.actions.look'),
      onClick: (row) => openForm('look', row as FollowTeacherRecord)
    },
    {
      label: t('schoolBus.driver.actions.edit'),
      code: 'teacheruser_edit',
      onClick: (row) => openForm('edit', row as FollowTeacherRecord)
    }
  ])

  onMounted(async () => {
    const raw = await membershipApi.school.get()
    schoolRecords.value = pickSchoolRecords(raw)
  })

  watch(
    () => schoolRecords.value,
    (records) => {
      if (records.length === 1) {
        queryModel.schoolIds = [records[0].id]
      }
      if (records.length > 0) {
        nextTick(() => tableRef.value?.refresh())
      }
    }
  )

  return {
    actions,
    columns,
    activeRow,
    defaultSchoolId,
    filters,
    formMode,
    formVisible,
    handleLoadSuccess,
    loadData,
    multiSchool,
    openForm,
    queryModel,
    reset,
    schoolOptions,
    search,
    searchCfg,
    statusOptions,
    tableRef
  }
}
