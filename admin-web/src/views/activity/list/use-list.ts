import type { UniOption, UniTableAction, UniTableRequest } from 'uni-ui-lib'
import { toUniOptions, useUniI18n, useUniListState } from 'uni-ui-lib'
import dayjs from 'dayjs'
import { ElMessage, ElMessageBox } from 'element-plus'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import { activityApi, activityQuestionnaireApi, membershipApi } from '@/api'
import type { Translate } from '@/types/i18n'
import { normalizePaged } from '@/utils/api-response-normalize'
import { downloadBlob, downloadResponseBlob } from '@/utils/download'

import {
  activityStatusOptions,
  checkinMethodOptions,
  searchForm,
  tableCols
} from './list.config'

type ActivityRow = Record<string, unknown>

function formatListTimestamp(value: unknown, emptyText = '—') {
  if (value == null || value === '') {
    return emptyText
  }
  const d = dayjs(String(value))
  return d.isValid() ? d.format('YYYY-MM-DD HH:mm') : String(value)
}

function useMembershipSchoolOptions() {
  const { locale } = useUniI18n()
  const schoolOptionsRef = ref<UniOption[]>([])

  const loadSchoolOptions = async () => {
    const raw = await membershipApi.school.get()
    const list = Array.isArray(raw) ? raw : []
    schoolOptionsRef.value = toUniOptions(list as Record<string, unknown>[], {
      labelKeys:
        locale.value === 'en' ? ['enName', 'name', 'cnName'] : ['cnName', 'name', 'enName'],
      valueKey: 'id'
    })
  }

  return { schoolOptions: schoolOptionsRef, loadSchoolOptions }
}

function normalizeSchoolIdsForTable(raw: unknown): unknown {
  if (Array.isArray(raw)) {
    return raw
  }
  if (raw == null || raw === '') {
    return []
  }
  if (typeof raw === 'string') {
    return raw
      .split(/[,;\s]+/)
      .map((segment) => segment.trim())
      .filter(Boolean)
  }
  return [raw]
}

export function useActivityEventList() {
  const { t } = useUniI18n()
  const tr = t as Translate
  const router = useRouter()

  const { schoolOptions, loadSchoolOptions } = useMembershipSchoolOptions()
  const lockedSchoolId = ref<string | number | undefined>(undefined)

  const statusOpts = computed(() => activityStatusOptions(tr))
  const checkinOpts = computed(() => checkinMethodOptions(tr))
  const ynOpts = computed(() => [
    { label: tr('activity.yes'), value: '1' },
    { label: tr('activity.no'), value: '0' }
  ])
  const showSchoolFilter = computed(() => schoolOptions.value.length > 1)

  onMounted(async () => {
    await loadSchoolOptions()
    if (schoolOptions.value.length === 1) {
      const v = schoolOptions.value[0]?.value
      if (v != null) {
        lockedSchoolId.value = v as string | number
      }
    }
  })

  const initialFilters = {
    activityCnName: '',
    activityEnName: '',
    schoolIds: undefined,
    activityStatus: undefined,
    isBanner: undefined,
    recommended: undefined,
    activityStartTime: undefined,
    activityEndTime: undefined
  } as Record<string, unknown>

  const { queryModel, filters, handleLoadSuccess, reset, search, tableRef } = useUniListState({
    initialFilters
  })

  const searchCfg = computed(() =>
    searchForm(tr, schoolOptions.value, ynOpts.value, statusOpts.value, showSchoolFilter.value)
  )

  const columns = computed(() =>
    tableCols(tr, schoolOptions.value, ynOpts.value, statusOpts.value, checkinOpts.value)
  )

  const selectedRows = ref<ActivityRow[]>([])
  const selectedIds = computed(
    () =>
      selectedRows.value.map((row) => row.id).filter((id) => id != null) as Array<string | number>
  )

  const formatRows = (list: ActivityRow[]) => {
    for (const row of list) {
      row.schoolIds = normalizeSchoolIdsForTable(row.schoolIds)
      row.activityStatus = row.activityStatus == null ? '' : String(row.activityStatus)
      row.recommended = row.recommended == null ? '' : String(row.recommended)
      const bannerRaw = row.banner ?? row.isBanner
      row.banner = bannerRaw == null ? '' : String(bannerRaw)
      row.checkinMethod = row.checkinMethod == null ? '' : String(row.checkinMethod)
      row.createTime = formatListTimestamp(row.createTime)
      row.activityStartTime = formatListTimestamp(row.activityStartTime)
      row.activityEndTime = formatListTimestamp(row.activityEndTime)
    }
  }

  const onSelectionChange = (rows: Record<string, unknown>[]) => {
    selectedRows.value = rows as ActivityRow[]
  }

  const loadData: UniTableRequest = async ({
    pageNo: current,
    pageSize: size,
    filters: filterModel
  }) => {
    const f = filterModel as ActivityRow
    const raw = await activityApi.page.get({
      current,
      size,
      activityCnName: (f.activityCnName as string) || undefined,
      activityEnName: (f.activityEnName as string) || undefined,
      schoolIds: lockedSchoolId.value ?? f.schoolIds ?? undefined,
      activityStatus: f.activityStatus || undefined,
      isBanner: f.isBanner || undefined,
      recommended: f.recommended || undefined,
      activityStartTime: (f.activityStartTime as string) || undefined,
      activityEndTime: (f.activityEndTime as string) || undefined
    })
    const { list, total } = normalizePaged<ActivityRow>(raw)
    formatRows(list)
    return { data: list, total }
  }

  const goDetail = (row: ActivityRow, mode: 'view' | 'edit') => {
    if (row.id == null) {
      return
    }
    router.push({ name: 'ActivityEventDetail', query: { id: String(row.id), mode } })
  }

  const goCreate = () => {
    router.push({ name: 'ActivityEventDetail', query: { mode: 'edit' } })
  }

  const actions = computed<UniTableAction[]>(() => [
    { label: tr('activity.lookDetail'), onClick: (row) => goDetail(row as ActivityRow, 'view') },
    {
      label: tr('activity.entryEdit'),
      code: 'busdriver_edit',
      visible: (row) => ['0', '1'].includes(String((row as ActivityRow).activityStatus)),
      onClick: (row) => {
        if (!['0', '1'].includes(String((row as ActivityRow).activityStatus))) {
          ElMessage.warning(tr('activity.eventEndedNoEdit'))
          return
        }
        goDetail(row as ActivityRow, 'edit')
      }
    }
  ])

  const handleSendWechat = async (items: ActivityRow[], isTest: boolean) => {
    const list = items.length ? items : []
    if (!list.length) {
      ElMessage.warning(tr('activity.eventSelFirst'))
      return
    }
    const title = isTest ? tr('activity.sendWechatTest') : tr('activity.sendWechat')
    try {
      await ElMessageBox.confirm(tr('activity.confirmSendWechat', { title }), tr('common.tip'), {
        type: 'warning'
      })
    } catch {
      return
    }
    const req = isTest ? activityApi.sendWechatTest.post : activityApi.sendWechat.post
    const results = await Promise.all(
      list.map(async (item) => {
        try {
          await req(item.id as string | number)
          return true
        } catch {
          return false
        }
      })
    )
    if (results.length && results.every(Boolean)) {
      ElMessage.success(tr('activity.saveOk'))
    } else {
      ElMessage.warning(tr('activity.partialWechatFail'))
    }
  }

  const exportFeedbackBatch = async () => {
    if (!selectedIds.value.length) {
      ElMessage.warning(tr('activity.eventSelFirst'))
      return
    }
    try {
      for (const id of selectedIds.value) {
        const response = await activityApi.feedbackExport.get(id)
        downloadResponseBlob(response, `activity-feedback-${id}.xlsx`)
      }
      ElMessage.success(tr('activity.saveOk'))
    } catch {
      ElMessage.error(tr('activity.exportFail'))
    }
  }

  const exportQuestionnaireByActivityBatch = async () => {
    if (!selectedIds.value.length) {
      ElMessage.warning(tr('activity.eventSelFirst'))
      return
    }
    try {
      for (const id of selectedIds.value) {
        const blob = await activityQuestionnaireApi.exportByActivityBlob.get(id)
        downloadBlob(blob as Blob, `questionnaire-answers-${id}.xlsx`)
      }
      ElMessage.success(tr('activity.saveOk'))
    } catch {
      ElMessage.error(tr('activity.exportQuestionnaireFail'))
    }
  }

  const publishBatch = async () => {
    if (!selectedIds.value.length) {
      ElMessage.warning(tr('activity.eventSelFirst'))
      return
    }
    const idSet = new Set(selectedIds.value.map((id) => String(id)))
    const pendingRows = selectedRows.value.filter(
      (row) => idSet.has(String(row.id)) && String(row.activityStatus) === '0'
    )
    const ids = pendingRows
      .map((row) => row.id)
      .filter((id) => id != null) as Array<string | number>
    if (!ids.length) {
      ElMessage.warning(tr('activity.noPendingInSelection'))
      return
    }
    const skipped = selectedIds.value.length - pendingRows.length
    const tip =
      skipped > 0
        ? tr('activity.batchPublishSkip', { n: ids.length, m: skipped })
        : tr('activity.batchPublishConfirm', { n: ids.length })
    try {
      await ElMessageBox.confirm(tip, tr('common.tip'), { type: 'warning' })
    } catch {
      return
    }
    await activityApi.batchPublish.post(ids)
    ElMessage.success(tr('activity.saveOk'))
    selectedRows.value = []
    tableRef.value?.refresh()
  }

  const deleteBatch = async () => {
    if (!selectedIds.value.length) {
      ElMessage.warning(tr('activity.eventSelFirst'))
      return
    }
    await ElMessageBox.confirm(tr('activity.confirmDeleteEvents'), tr('common.tip'), {
      type: 'warning'
    })
    await activityApi.remove.delete(selectedIds.value)
    ElMessage.success(tr('activity.saveOk'))
    selectedRows.value = []
    tableRef.value?.refresh()
  }

  return {
    actions,
    columns,
    deleteBatch,
    exportFeedbackBatch,
    exportQuestionnaireByActivityBatch,
    filters,
    handleLoadSuccess,
    loadData,
    onSelectionChange,
    publishBatch,
    queryModel,
    reset,
    search,
    searchCfg,
    selectedIds,
    goCreate,
    handleSendWechat,
    selectedRows,
    tableRef
  }
}
