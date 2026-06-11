import type { UniForm, UniOption } from 'uni-ui-lib'
import { useUniI18n } from 'uni-ui-lib'
import { ElMessage } from 'element-plus'
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { activityApi, activityProgramApi, protocolApi } from '@/api'
import type { ActivityProgramFormModel } from '@/types/modules/activity-program-form'
import type { ActivityProgramQuotaRow } from '@/types/modules/activity-program-form'
import type { Translate } from '@/types/i18n'
import { normalizeArray, normalizeEnvelope, normalizePayload } from '@/utils/api-response-normalize'

import { programTypeOptions as listProgTypeOptions } from '../list.config'
import {
  blessingRuleOptions,
  buildProgramEditFormConfig,
  lotteryIdentifierOptions,
  lotteryScopeOptions,
  ynOptions
} from './program-edit-form.config'
import { applyProgramDetailToForm, fillQuotasFromDetail } from './program-edit-detail'
import { canEditProgramRow, isPrizeCountOnlyEdit } from './program-edit-helpers'
import {
  applyLotteryDefaults,
  buildProgramSubmitPayload,
  emptyProgramForm,
  findActivityRow,
  validateProgramQuotas
} from './program-edit-payload'

type Loose = Record<string, unknown>

export function useProgramEditPage() {
  const { t, locale } = useUniI18n()
  const tr = t as Translate
  const route = useRoute()
  const router = useRouter()

  const uniFormRef = ref<InstanceType<typeof UniForm> | null>(null)
  const loading = ref(false)
  const saving = ref(false)
  const form = reactive<ActivityProgramFormModel>(emptyProgramForm())
  const formModel = computed({
    get: () => form,
    set: (value: ActivityProgramFormModel) => {
      Object.assign(form, value)
    }
  })
  const quotasList = ref<ActivityProgramQuotaRow[]>([])
  const activityRows = ref<Loose[]>([])

  const serverStatus = ref('')
  const serverType = ref('')
  const serverTotalRounds = ref<number | string>(0)
  const activityStatus = ref('')

  const detailId = computed(() => {
    const raw = route.query.id
    if (raw == null || raw === '') {
      return ''
    }
    return String(raw)
  })

  const isEditRoute = computed(() => route.query.mode === 'edit')
  const isCreate = computed(() => !detailId.value)

  const pageTitle = computed(() =>
    isCreate.value
      ? tr('activity.programCreateTitle')
      : isEditRoute.value
        ? tr('activity.programEditTitle')
        : tr('activity.programDetailTitle')
  )

  const pageDesc = computed(() =>
    isCreate.value
      ? tr('activity.programCreateDesc')
      : isEditRoute.value
        ? tr('activity.programEditDesc')
        : tr('activity.programDetailDesc')
  )

  const activityOptions = computed<UniOption[]>(() =>
    activityRows.value.map((x) => ({
      label: String(
        locale.value === 'en'
          ? (x.activityEnName ?? x.activityCnName ?? x.id)
          : (x.activityCnName ?? x.activityEnName ?? x.id)
      ),
      value: x.id as string | number
    }))
  )

  const prizeOnlyRow = computed(() => ({
    programStatus: serverStatus.value,
    programType: serverType.value,
    totalRounds: serverTotalRounds.value
  }))

  const bodyLocked = computed(() => isEditRoute.value && isPrizeCountOnlyEdit(prizeOnlyRow.value))

  const typeChoiceLocked = computed(() => !isCreate.value || bodyLocked.value)
  const quotaTotal = computed(() =>
    quotasList.value.reduce((sum, item) => sum + (Number(item.quotaCount) || 0), 0)
  )
  const prizeCountMin = computed(() => (form.programType === '1' ? quotaTotal.value : 0))

  const formConfig = computed(() =>
    buildProgramEditFormConfig(tr, {
      programType: String(form.programType || ''),
      activityOptions: activityOptions.value,
      ynOptions: ynOptions(tr),
      lotteryIdOptions: lotteryIdentifierOptions(tr),
      lotteryScopeOptions: lotteryScopeOptions(tr),
      blessingOptions: blessingRuleOptions(tr),
      programTypeOptions: listProgTypeOptions(tr),
      bodyLocked: bodyLocked.value,
      typeChoiceLocked: typeChoiceLocked.value,
      prizeCountMin: prizeCountMin.value
    })
  )

  const canEdit = computed(() => {
    if (!detailId.value) {
      return false
    }
    // Old detail `canEditProgram`: null/empty activity status → not editable
    if (activityStatus.value === '') {
      return false
    }
    if (activityStatus.value === '3') {
      return false
    }
    if (activityStatus.value !== '2') {
      return true
    }
    return canEditProgramRow({
      programStatus: serverStatus.value,
      programType: serverType.value,
      totalRounds: serverTotalRounds.value
    })
  })

  const canSubmit = computed(() => isEditRoute.value && (isCreate.value || canEdit.value))
  const uniMode = computed<'view' | 'edit'>(() => (canSubmit.value ? 'edit' : 'view'))

  const loadActivities = async () => {
    const raw = await activityApi.listBrief.get()
    activityRows.value = normalizeArray(raw) as Loose[]
  }

  const syncPrizeCountWithQuotas = () => {
    if (form.programType !== '1') {
      return
    }
    const min = quotaTotal.value
    if (Number(form.prizeCount) < min) {
      form.prizeCount = min
    }
  }

  const getQuotaMax = (row: ActivityProgramQuotaRow) => {
    const prizeCount = Number(form.prizeCount) || 0
    const current = Number(row.quotaCount) || 0
    const otherTotal = quotaTotal.value - current

    return Math.max(1, prizeCount - otherTotal)
  }

  const normalizeQuotaRow = (row: ActivityProgramQuotaRow) => {
    if (bodyLocked.value) {
      return
    }
    const max = getQuotaMax(row)
    const value = Number(row.quotaCount) || 1
    row.quotaCount = Math.min(Math.max(value, 1), max)
    syncPrizeCountWithQuotas()
  }

  const applyDetail = (d: Loose) => {
    applyProgramDetailToForm(form, quotasList, serverStatus, serverType, serverTotalRounds, d)
  }

  const loadDetail = async () => {
    if (!detailId.value) {
      return
    }
    loading.value = true
    try {
      const raw = await activityProgramApi.detail.get(detailId.value)
      const env = normalizeEnvelope(raw)
      if (Object.keys(env).length) {
        applyDetail(env)
      } else {
        const inner = normalizePayload(raw)
        if (inner && typeof inner === 'object' && !Array.isArray(inner)) {
          applyDetail(inner as Loose)
        }
      }
    } catch {
      ElMessage.error(tr('activity.loadDetailFail'))
    } finally {
      loading.value = false
    }
  }

  const loadActivityStatus = async () => {
    if (form.activityId == null || form.activityId === '') {
      activityStatus.value = ''
      return
    }
    try {
      const raw = await activityApi.detail.get(form.activityId)
      const row = normalizeEnvelope(raw)
      activityStatus.value =
        row.activityStatus != null && row.activityStatus !== '' ? String(row.activityStatus) : ''
    } catch {
      activityStatus.value = ''
    }
  }

  const resetForCreate = () => {
    Object.assign(form, emptyProgramForm())
    quotasList.value = []
    serverStatus.value = ''
    serverType.value = ''
    serverTotalRounds.value = 0
    activityStatus.value = ''
  }

  watch(
    () => form.totalRounds,
    (raw) => {
      if (form.programType !== '1' || bodyLocked.value) {
        return
      }
      const totalRounds = parseInt(String(raw), 10) || 0
      const currentLength = quotasList.value.length
      if (totalRounds > currentLength) {
        for (let i = currentLength; i < totalRounds; i++) {
          quotasList.value.push({ roundNo: i + 1, quotaCount: 1 })
        }
      } else if (totalRounds < currentLength) {
        quotasList.value = quotasList.value.slice(0, totalRounds)
      }
      syncPrizeCountWithQuotas()
    }
  )

  watch(
    () => form.programType,
    (pt) => {
      if (!isCreate.value) {
        return
      }
      const p = String(pt)
      if (p === '1') {
        applyLotteryDefaults(form)
        quotasList.value = []
        const n = parseInt(String(form.totalRounds), 10) || 0
        if (n > 0) {
          fillQuotasFromDetail(quotasList, [], n)
        }
        syncPrizeCountWithQuotas()
      } else if (p === '2') {
        form.needVote = '0'
        form.votePerAttemptCount = 0
        form.prizeCount = 0
        const act = findActivityRow(activityRows.value, form.activityId)
        form.voteStartTime =
          act && act.activityStartTime != null ? String(act.activityStartTime) : ''
        form.voteEndTime = act && act.activityEndTime != null ? String(act.activityEndTime) : ''
      } else if (p === '3') {
        form.blessingDisplayRule = '1'
        quotasList.value = []
      }
    }
  )

  watch(
    () => form.activityId,
    (aid) => {
      if (!isCreate.value || String(form.programType) !== '2') {
        return
      }
      const act = findActivityRow(activityRows.value, aid)
      if (act) {
        form.voteStartTime = act.activityStartTime != null ? String(act.activityStartTime) : ''
        form.voteEndTime = act.activityEndTime != null ? String(act.activityEndTime) : ''
      }
    }
  )

  onMounted(async () => {
    await loadActivities()
    if (detailId.value) {
      await loadDetail()
      await loadActivityStatus()
    } else if (isEditRoute.value) {
      resetForCreate()
    }
  })

  const goBack = () => {
    router.push({ name: 'ActivityProgramList' })
  }

  const goEdit = () => {
    if (!detailId.value) {
      return
    }
    router.replace({
      name: 'ActivityProgramDetail',
      query: { id: detailId.value, mode: 'edit' }
    })
  }

  const onCoverBeforeUpload = (rawFile: File) => {
    void (async () => {
      if (bodyLocked.value && uniMode.value === 'edit') {
        return
      }
      try {
        form.backgroundImage = await protocolApi.upload.post(rawFile)
      } catch {
        ElMessage.error(tr('activity.coverUploadFail'))
      }
    })()
    return false
  }

  const submit = async () => {
    if (!isEditRoute.value) {
      return
    }
    if (!isCreate.value && activityStatus.value === '3') {
      ElMessage.warning(tr('activity.programActivityEndedNoStatus'))
      return
    }
    if (!isCreate.value && !canEdit.value) {
      ElMessage.warning(tr('activity.programEditLimited'))
      return
    }
    const ok = await uniFormRef.value?.validate().catch(() => false)
    if (!ok) {
      return
    }
    if (form.programType === '1') {
      const qerr = validateProgramQuotas(quotasList.value, form.prizeCount, tr)
      if (qerr) {
        ElMessage.error(qerr)
        return
      }
    }
    if (form.programType === '2' && form.needVote === '1') {
      const n = Number(form.votePerAttemptCount)
      if (!Number.isFinite(n) || n <= 0) {
        ElMessage.error(tr('activity.ruleInput'))
        return
      }
    }

    const payload = buildProgramSubmitPayload(form, quotasList.value)
    saving.value = true
    try {
      if (isCreate.value) {
        await activityProgramApi.add.post([payload])
      } else {
        await activityProgramApi.edit.post([payload])
      }
      ElMessage.success(tr('activity.saveOk'))
      goBack()
    } catch {
      ElMessage.error(tr('activity.saveFail'))
    } finally {
      saving.value = false
    }
  }

  return {
    uniFormRef,
    loading,
    saving,
    form,
    formModel,
    formConfig,
    uniMode,
    pageTitle,
    pageDesc,
    detailId,
    isEditRoute,
    canSubmit,
    isCreate,
    canEdit,
    goBack,
    goEdit,
    submit,
    onCoverBeforeUpload,
    quotasList,
    getQuotaMax,
    normalizeQuotaRow,
    bodyLocked
  }
}
