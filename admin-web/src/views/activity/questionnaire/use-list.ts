import type { UniOption, UniTableAction, UniTableRequest } from 'uni-ui-lib'
import { toUniOptions, useUniI18n, useUniListState } from 'uni-ui-lib'
import dayjs from 'dayjs'
import { ElMessage, ElMessageBox } from 'element-plus'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import { activityApi, activityQuestionnaireApi, membershipApi } from '@/api'
import type { Translate } from '@/types/i18n'
import type { QuestionnaireListDialogRefs } from '@/types/modules/activity-questionnaire'
import { normalizeArray, normalizePaged } from '@/utils/api-response-normalize'

import { searchForm, tableCols } from './list.config'

function stripSlash(s: string): string {
  return s.replace(/\/$/, '')
}

function buildQuestionnaireSignupUrl(questionnaireId: string | number): string {
  const origin = stripSlash(String(import.meta.env.VITE_COMMUNITY_WEB_ORIGIN ?? ''))
  if (!origin) {
    return ''
  }
  return `${origin}/#/isacommunity/activity/questionnaire/signup?id=${encodeURIComponent(String(questionnaireId))}`
}

function yesNoOptions(t: (k: string) => string): UniOption[] {
  return [
    { label: t('activity.yes'), value: '1' },
    { label: t('activity.no'), value: '0' }
  ]
}

function fmtTs(v: unknown, empty = '—') {
  if (v == null || v === '') {
    return empty
  }
  const d = dayjs(String(v))
  return d.isValid() ? d.format('YYYY-MM-DD HH:mm') : String(v)
}

function useMembershipSchoolOptions() {
  const { locale } = useUniI18n()
  const schoolOptions = ref<UniOption[]>([])

  const loadSchoolOptions = async () => {
    const raw = await membershipApi.school.get()
    const list = Array.isArray(raw) ? raw : []
    schoolOptions.value = toUniOptions(list, {
      labelKeys:
        locale.value === 'en' ? ['enName', 'name', 'cnName'] : ['cnName', 'name', 'enName'],
      valueKey: 'id'
    })
  }

  return { schoolOptions, loadSchoolOptions }
}

type L = Record<string, unknown>

export function useQuestionnaireList(refs: QuestionnaireListDialogRefs) {
  const { t, locale } = useUniI18n()
  const tr = t as Translate
  const router = useRouter()

  const { schoolOptions, loadSchoolOptions } = useMembershipSchoolOptions()
  const activityOptions = ref<UniOption[]>([])

  const ynDispOptions = computed(() => yesNoOptions(tr))

  const loadActs = async () => {
    try {
      const raw = await activityApi.listBrief.get({ questionnaireFlag: 1 })
      const rows = normalizeArray(raw) as Record<string, unknown>[]
      activityOptions.value = rows.map((x) => ({
        label: String(
          locale.value === 'en'
            ? (x.activityEnName ?? x.activityCnName ?? x.activityName ?? x.name ?? x.id ?? '')
            : (x.activityCnName ?? x.activityEnName ?? x.activityName ?? x.name ?? x.id ?? '')
        ),
        value: x.id as string | number
      }))
    } catch {
      activityOptions.value = []
    }
  }

  onMounted(async () => {
    await loadSchoolOptions()
    await loadActs()
  })

  const {
    queryModel: qm,
    filters: filt,
    handleLoadSuccess: hdl,
    reset: rst,
    search: sea,
    tableRef: tb
  } = useUniListState({
    initialFilters: {
      name: '',
      schoolIds: undefined,
      activityId: undefined,
      status: undefined,
      createStartTime: undefined,
      createEndTime: undefined
    } as Record<string, unknown>
  })

  const sch = computed(() =>
    searchForm(tr, schoolOptions.value, activityOptions.value, ynDispOptions.value)
  )

  const cols = computed(() => tableCols(tr, schoolOptions.value, ynDispOptions.value))

  const selRows = ref<L[]>([])
  const selIds = computed(
    () => selRows.value.map((r) => r.id).filter((x) => x != null) as Array<string | number>
  )

  /** 与成员列表一致：`schoolIds` 为数组，便于 UniTable `type:array` 按 options 展示 */
  const normalizeSchoolIdsForTable = (raw: unknown): unknown => {
    if (Array.isArray(raw)) {
      return raw
    }
    if (raw == null || raw === '') {
      return []
    }
    if (typeof raw === 'string') {
      return raw
        .split(/[,;\s]+/)
        .map((s) => s.trim())
        .filter(Boolean)
    }
    return [raw]
  }

  const fmt = (list: L[]) => {
    for (const row of list) {
      row.schoolIds = normalizeSchoolIdsForTable(row.schoolIds)
      row.status = row.status == null ? '' : String(row.status)
      row.frozen = row.frozen == null ? '' : String(row.frozen)
      row.needStudentInfo = row.needStudentInfo == null ? '' : String(row.needStudentInfo)
      row.createTime = fmtTs(row.createTime)
      row.updateTime = fmtTs(row.updateTime)
    }
  }

  const onSel = (rows: Record<string, unknown>[]) => {
    selRows.value = rows as L[]
  }

  const lod: UniTableRequest = async ({ pageNo, pageSize, filters: f }) => {
    const fl = f as L
    const raw = await activityQuestionnaireApi.page.get({
      current: pageNo,
      size: pageSize,
      name: fl.name || undefined,
      schoolIds: fl.schoolIds || undefined,
      activityId: fl.activityId || undefined,
      status: fl.status || undefined,
      createStartTime: fl.createStartTime || undefined,
      createEndTime: fl.createEndTime || undefined
    })
    const { list, total } = normalizePaged<L>(raw)
    fmt(list)
    return { data: list, total }
  }

  const copySignup = async (row: L) => {
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

  const openDesignerEdit = (row: L) => {
    if (row.id == null) {
      return
    }
    router.push({
      name: 'ActivityQuestionnaireEdit',
      params: { id: String(row.id) }
    })
  }

  const openSubmissions = (row: L) => {
    if (row.id == null) {
      return
    }
    router.push({ name: 'ActivityQuestionnaireSubmissions', params: { id: String(row.id) } })
  }

  const acts = computed<UniTableAction[]>(() => [
    { label: tr('activity.questionnaireRowData'), onClick: (row) => openSubmissions(row as L) },
    {
      label: tr('activity.entryEdit'),
      code: 'busdriver_edit',
      onClick: (row) => void refs.metaDlg.value?.open('edit', row as L)
    },
    {
      label: tr('activity.questionnaireDesigner'),
      code: 'busdriver_edit',
      onClick: (row) => openDesignerEdit(row as L)
    },
    {
      label: tr('activity.actionCopyQuestionnaire'),
      code: 'busdriver_edit',
      onClick: (row) => void refs.copyDlg.value?.open(row as L)
    },
    { label: tr('activity.copySignupLink'), onClick: (row) => void copySignup(row as L) }
  ])

  const del = async () => {
    if (!selIds.value.length) {
      return
    }
    await ElMessageBox.confirm(tr('activity.confirmDeleteQuestionnaire'), tr('common.tip'), {
      type: 'warning'
    })
    await activityQuestionnaireApi.remove.delete(selIds.value)
    ElMessage.success(tr('activity.deleteOk'))
    selRows.value = []
    tb.value?.refresh()
  }

  const openMetaAdd = () => refs.metaDlg.value?.open('add')

  const onDlgSaved = () => tb.value?.refresh()

  const openBatchStatus = () => refs.batchDlg.value?.open('status', selIds.value)

  const openBatchFrozen = () => refs.batchDlg.value?.open('frozen', selIds.value)

  return {
    acts,
    cols,
    del,
    filt,
    hdl,
    lod,
    onDlgSaved,
    onSel,
    openBatchFrozen,
    openBatchStatus,
    openMetaAdd,
    qm,
    rst,
    sea,
    selIds,
    sch,
    tb
  }
}
