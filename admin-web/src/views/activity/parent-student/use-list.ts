import { useUniI18n } from 'uni-ui-lib'
import { ElMessage } from 'element-plus'
import { computed, ref } from 'vue'

import { activityParentStudentApi } from '@/api'
import type { Translate } from '@/types/i18n'
import type {
  ActivityParentInfo,
  ActivityParentStudentActivityRow,
  ActivityParentStudentRow,
  ActivityParentStudentSearchModel
} from '@/types/modules/activity-parent-student'
import { normalizeEnvelope } from '@/utils/api-response-normalize'

import { activityColumns, searchForm, studentColumns } from './list.config'

type Loose = Record<string, unknown>

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

  const parentPhone = computed(() => {
    const v = parentData.value.phoneNumber
    return v == null || v === '' ? '—' : String(v)
  })
  const parentEmail = computed(() => {
    const v = parentData.value.email
    return v == null || v === '' ? '—' : String(v)
  })
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
      const raw = await activityParentStudentApi.lookupByPhone.get({ phone })
      const first = normalizeEnvelope(raw)
      const nested = first.data
      const payload =
        nested && typeof nested === 'object' && !Array.isArray(nested) ? (nested as Loose) : first
      parentData.value =
        payload.parent && typeof payload.parent === 'object' && !Array.isArray(payload.parent)
          ? (payload.parent as ActivityParentInfo)
          : {}
      studentRows.value = Array.isArray(payload.students)
        ? (payload.students as ActivityParentStudentRow[])
        : []
      activityRows.value = Array.isArray(payload.activities)
        ? (payload.activities as ActivityParentStudentActivityRow[])
        : []
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
