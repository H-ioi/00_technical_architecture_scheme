import { useUniI18n } from 'uni-ui-lib'
import { ElMessage } from 'element-plus'
import { computed, ref } from 'vue'

import { activityParentStudentApi } from '@/api'
import type { Translate } from '@/types/i18n'
import type {
  ActivityParentInfo,
  ActivityParentStudentActivityRow,
  ActivityParentStudentLookupResult,
  ActivityParentStudentRow,
  ActivityParentStudentSearchModel
} from '@/types/modules/activity-parent-student'
import { normalizeEnvelope } from '@/utils/api-response-normalize'

import { activityColumns, searchForm, studentColumns } from './list.config'

type Loose = Record<string, unknown>

const asRows = <T extends Loose>(value: unknown): T[] => (Array.isArray(value) ? (value as T[]) : [])

const unwrapLookupPayload = (raw: unknown): ActivityParentStudentLookupResult => {
  const first = normalizeEnvelope(raw)
  const nested = first.data
  const payload = nested && typeof nested === 'object' && !Array.isArray(nested) ? (nested as Loose) : first

  return {
    parent:
      payload.parent && typeof payload.parent === 'object' && !Array.isArray(payload.parent)
        ? (payload.parent as ActivityParentInfo)
        : {},
    students: asRows<ActivityParentStudentRow>(payload.students),
    activities: asRows<ActivityParentStudentActivityRow>(payload.activities)
  }
}

const displayValue = (value: unknown) => {
  if (value === null || value === undefined || value === '') {
    return '—'
  }
  return String(value)
}

export function useActivityParentStudentList() {
  const { t } = useUniI18n()
  const tr = t as Translate

  const loading = ref(false)
  const hasSearched = ref(false)
  const queryModel = ref<ActivityParentStudentSearchModel>({ phone: '' })
  const parentData = ref<ActivityParentInfo>({})
  const studentRows = ref<ActivityParentStudentRow[]>([])
  const activityRows = ref<ActivityParentStudentActivityRow[]>([])

  const searchCfg = computed(() => searchForm(tr))
  const studentCols = computed(() => studentColumns(tr))
  const activityCols = computed(() => activityColumns(tr))

  const parentPhone = computed(() => displayValue(parentData.value.phoneNumber))
  const parentEmail = computed(() => displayValue(parentData.value.email))
  const isaParentText = computed(() => {
    const value = parentData.value.isIsaParent
    return value === true || value === 1 || value === '1' ? tr('activity.yes') : tr('activity.no')
  })

  const clearResult = () => {
    parentData.value = {}
    studentRows.value = []
    activityRows.value = []
    hasSearched.value = false
  }

  const search = async () => {
    const phone = queryModel.value.phone.trim()
    if (!phone) {
      ElMessage.warning(tr('activity.parentStudentPhoneRequired'))
      return
    }

    loading.value = true
    try {
      const result = unwrapLookupPayload(await activityParentStudentApi.lookupByPhone.get({ phone }))
      parentData.value = result.parent
      studentRows.value = result.students
      activityRows.value = result.activities
      hasSearched.value = true
    } finally {
      loading.value = false
    }
  }

  const reset = () => {
    queryModel.value = { phone: '' }
    clearResult()
  }

  return {
    activityCols,
    activityRows,
    hasSearched,
    isaParentText,
    loading,
    parentEmail,
    parentPhone,
    queryModel,
    reset,
    search,
    searchCfg,
    studentCols,
    studentRows
  }
}
