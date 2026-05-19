import type { UniOption, UniTableAction, UniTableRequest } from 'uni-ui-lib'
import { toUniOptions, useUniI18n, useUniListState } from 'uni-ui-lib'
import { ElMessage, ElMessageBox } from 'element-plus'
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { activityApi, activityQuestionnaireApi } from '@/api'
import { useActivityYesNoOptions } from '@/composables/use-activity-yes-no-options'
import { useMembershipSchoolOptions } from '@/composables/use-membership-school-options'
import type { Translate } from '@/types/i18n'
import type { QuestionnaireListDialogRefs } from '@/types/modules/activity-questionnaire'
import { normalizeArray, normalizePaged } from '@/utils/api-response-normalize'
import { dateFormat } from '@/utils/tool'

import { buildQuestionnaireSignupUrl } from '@/utils/questionnaire-url'

import { searchForm, tableCols } from './list.config'

type QuestionnaireListRow = Record<string, unknown>

export function useQuestionnaireList(
  refs: QuestionnaireListDialogRefs,
  options: { activityId?: string | number } = {}
) {
  const { t, locale } = useUniI18n()
  const tr = t as Translate
  const route = useRoute()
  const router = useRouter()

  const { schoolOptions, loadSchoolOptions } = useMembershipSchoolOptions()
  const activityOptions = ref<UniOption[]>([])

  const ynDispOptions = useActivityYesNoOptions()

  const loadOpts = async () => {
    try {
      const raw = await activityApi.listBrief.get({ questionnaireFlag: 1 })
      const rows = normalizeArray(raw) as Record<string, unknown>[]
      activityOptions.value = rows.map((row) => ({
        label: String(
          locale.value === 'en'
            ? (row.activityEnName ?? row.activityCnName ?? row.activityName ?? row.name ?? row.id ?? '')
            : (row.activityCnName ?? row.activityEnName ?? row.activityName ?? row.name ?? row.id ?? '')
        ),
        value: row.id as string | number
      }))
    } catch {
      activityOptions.value = []
    }
  }

  onMounted(async () => {
    await loadSchoolOptions()
    await loadOpts()
  })

  const initialFilters = {
    name: '',
    schoolIds: undefined,
    activityId:
      options.activityId != null && options.activityId !== ''
        ? String(options.activityId)
        : route.query.activityId != null && route.query.activityId !== ''
        ? String(route.query.activityId)
        : undefined,
    status: undefined,
    createStartTime: undefined,
    createEndTime: undefined
  } as Record<string, unknown>

  const {
    queryModel,
    filters,
    handleLoadSuccess,
    refreshTable,
    reset,
    search,
    tableRef
  } = useUniListState({
    initialFilters
  })

  const searchCfg = computed(() =>
    searchForm(tr, schoolOptions.value, activityOptions.value, ynDispOptions.value)
  )

  const columns = computed(() => tableCols(tr, schoolOptions.value, ynDispOptions.value))

  const selectedRows = ref<QuestionnaireListRow[]>([])
  const selectedIds = computed(
    () =>
      selectedRows.value.map((row) => row.id).filter((id) => id != null) as Array<string | number>
  )

  const applyRowDisplayFormat = (list: QuestionnaireListRow[]) => {
    for (const row of list) {
      const rawSchoolIds = row.schoolIds
      if (Array.isArray(rawSchoolIds)) {
        row.schoolIds = rawSchoolIds
      } else if (rawSchoolIds == null || rawSchoolIds === '') {
        row.schoolIds = []
      } else if (typeof rawSchoolIds === 'string') {
        row.schoolIds = rawSchoolIds
          .split(/[,;\s]+/)
          .map((segment) => segment.trim())
          .filter(Boolean)
      } else {
        row.schoolIds = [rawSchoolIds]
      }
      row.status = row.status == null ? '' : String(row.status)
      row.frozen = row.frozen == null ? '' : String(row.frozen)
      row.needStudentInfo = row.needStudentInfo == null ? '' : String(row.needStudentInfo)
      row.createTime = row.createTime
        ? dateFormat(String(row.createTime), 'yyyy-MM-dd hh:mm')
        : '—'
      row.updateTime = row.updateTime
        ? dateFormat(String(row.updateTime), 'yyyy-MM-dd hh:mm')
        : '—'
    }
  }

  const onSelectionChange = (rows: Record<string, unknown>[]) => {
    selectedRows.value = rows as QuestionnaireListRow[]
  }

  const loadData: UniTableRequest = async ({
    pageNo: current,
    pageSize: size,
    filters: filterModel
  }) => {
    const f = filterModel as QuestionnaireListRow
    const raw = await activityQuestionnaireApi.page.get({
      current,
      size,
      name: f.name || undefined,
      schoolIds: f.schoolIds || undefined,
      activityId: f.activityId || undefined,
      status: f.status || undefined,
      createStartTime: f.createStartTime || undefined,
      createEndTime: f.createEndTime || undefined
    })
    const { list, total } = normalizePaged<QuestionnaireListRow>(raw)
    applyRowDisplayFormat(list)
    return { data: list, total }
  }

  const copySignupLink = async (row: QuestionnaireListRow) => {
    if (row.id == null) {
      return
    }
    const url = buildQuestionnaireSignupUrl(row.id as string | number)
    if (!url) {
      ElMessage.warning(tr('activity.signupLinkUnavailable'))
      return
    }
    try {
      await navigator.clipboard.writeText(url)
      ElMessage.success(tr('activity.signupLinkCopied'))
    } catch {
      ElMessage.error(tr('activity.signupLinkCopyFail'))
    }
  }

  const actions = computed<UniTableAction[]>(() => [
    {
      label: tr('activity.questionnaireRowData'),
      onClick: (row) => {
        const id = (row as QuestionnaireListRow).id
        if (id != null) {
          void router.push({ name: 'ActivityQuestionnaireSubmissions', params: { id: String(id) } })
        }
      }
    },
    {
      label: tr('activity.entryEdit'),
      code: 'busdriver_edit',
      onClick: (row) => void refs.metaDlg.value?.open('edit', row as QuestionnaireListRow)
    },
    {
      label: tr('activity.questionnaireDesigner'),
      code: 'busdriver_edit',
      onClick: (row) => {
        const id = (row as QuestionnaireListRow).id
        if (id != null) {
          void router.push({ name: 'ActivityQuestionnaireEdit', params: { id: String(id) } })
        }
      }
    },
    {
      label: tr('activity.actionCopyQuestionnaire'),
      code: 'busdriver_edit',
      onClick: (row) => void refs.copyDlg.value?.open(row as QuestionnaireListRow)
    },
    { label: tr('activity.copySignupLink'), onClick: (row) => void copySignupLink(row as QuestionnaireListRow) }
  ])

  const deleteSelected = async () => {
    if (!selectedIds.value.length) {
      return
    }
    await ElMessageBox.confirm(tr('activity.confirmDeleteQuestionnaire'), tr('common.tip'), {
      type: 'warning'
    })
    await activityQuestionnaireApi.remove.delete(selectedIds.value)
    ElMessage.success(tr('activity.deleteOk'))
    selectedRows.value = []
    tableRef.value?.refresh()
  }

  return {
    actions,
    columns,
    deleteSelected,
    filters,
    handleLoadSuccess,
    loadData,
    refreshTable,
    onSelectionChange,
    queryModel,
    reset,
    search,
    searchCfg,
    selectedIds,
    tableRef
  }
}
