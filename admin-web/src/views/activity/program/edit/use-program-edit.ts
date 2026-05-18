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
import { canEditProgramRow, isPrizeCountOnlyEdit } from './program-edit-helpers'

type Loose = Record<string, unknown>

function emptyForm(): ActivityProgramFormModel {
  return {
    cnName: '',
    enName: '',
    activityId: undefined,
    backgroundImage: '',
    programType: '',
    sortOrder: 0,
    totalRounds: 0,
    createLotteryPool: '0',
    lotteryIdentifierType: '0',
    lotteryParticipantScope: '0',
    needCheckin: '0',
    needPayment: '0',
    prizeCount: 0,
    checkinEndOffsetMinutes: 0,
    checkinStartOffsetMinutes: 0,
    needVote: '0',
    votePerAttemptCount: 0,
    voteStartTime: '',
    voteEndTime: '',
    blessingDisplayRule: '1',
    programQuotasMarker: ''
  }
}

function applyLotteryDefaults(f: ActivityProgramFormModel) {
  f.createLotteryPool = '0'
  f.lotteryIdentifierType = '0'
  f.lotteryParticipantScope = '0'
  f.needCheckin = '0'
  f.needPayment = '0'
}

function findActivity(looseRows: Loose[], id: unknown): Loose | undefined {
  if (id == null || id === '') {
    return undefined
  }
  return looseRows.find((x) => String(x.id) === String(id))
}

function validateQuotas(
  quotas: ActivityProgramQuotaRow[],
  prizeCount: number,
  t: Translate
): string | null {
  if (!quotas.length) {
    return null
  }
  for (const item of quotas) {
    if (!item.quotaCount || item.quotaCount <= 0) {
      return t('activity.quotaMustPositive')
    }
  }
  const totalQuota = quotas.reduce((s, item) => s + (parseInt(String(item.quotaCount), 10) || 0), 0)
  const pc = parseInt(String(prizeCount), 10) || 0
  if (pc > 0 && totalQuota > pc) {
    return t('activity.quotaExceedPrize')
  }
  return null
}

function buildSubmitPayload(
  m: ActivityProgramFormModel,
  quotas: ActivityProgramQuotaRow[]
): Record<string, unknown> {
  const data: Record<string, unknown> = {
    activityId: m.activityId,
    cnName: m.cnName,
    enName: m.enName,
    backgroundImage: m.backgroundImage,
    programType: m.programType,
    rule: {},
    sortOrder: m.sortOrder != null && m.sortOrder !== ('' as unknown as number) ? Number(m.sortOrder) : 0
  }

  switch (m.programType) {
    case '1':
      data.totalRounds = m.totalRounds
      data.rule = {
        createLotteryPool: m.createLotteryPool,
        lotteryIdentifierType: m.lotteryIdentifierType,
        lotteryParticipantScope: m.lotteryParticipantScope,
        needCheckin: m.needCheckin,
        needPayment: m.needPayment,
        prizeCount: m.prizeCount,
        checkinEndOffsetMinutes: m.checkinEndOffsetMinutes,
        checkinStartOffsetMinutes: m.checkinStartOffsetMinutes
      }
      data.quotas = quotas.map((item) => ({
        roundNo: item.roundNo,
        quotaCount: item.quotaCount
      }))
      break
    case '2':
      data.totalRounds = 1
      data.rule = {
        needVote: m.needVote,
        votePerAttemptCount: m.votePerAttemptCount,
        voteStartTime: m.voteStartTime,
        voteEndTime: m.voteEndTime,
        prizeCount: m.prizeCount
      }
      break
    case '3':
      data.totalRounds = 1
      data.rule = {
        blessingDisplayRule: m.blessingDisplayRule
      }
      break
    default:
      break
  }

  if (m.id != null && m.id !== '') {
    data.id = m.id
  }

  return data
}

export function useProgramEditPage() {
  const { t, locale } = useUniI18n()
  const tr = t as Translate
  const route = useRoute()
  const router = useRouter()

  const uniFormRef = ref<InstanceType<typeof UniForm> | null>(null)
  const loading = ref(false)
  const saving = ref(false)
  const form = reactive<ActivityProgramFormModel>(emptyForm())
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

  const bodyLocked = computed(
    () => isEditRoute.value && isPrizeCountOnlyEdit(prizeOnlyRow.value)
  )

  const typeChoiceLocked = computed(() => !isCreate.value || bodyLocked.value)

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
      typeChoiceLocked: typeChoiceLocked.value
    })
  )

  const canEdit = computed(() => {
    if (!detailId.value) {
      return false
    }
    if (activityStatus.value === '3') {
      return false
    }
    const programEditable = canEditProgramRow({
      programStatus: serverStatus.value,
      programType: serverType.value,
      totalRounds: serverTotalRounds.value
    })
    if (activityStatus.value === '2') {
      return programEditable
    }
    return programEditable
  })

  const canSubmit = computed(() => isEditRoute.value && (isCreate.value || canEdit.value))
  const uniMode = computed<'view' | 'edit'>(() => (canSubmit.value ? 'edit' : 'view'))

  const loadActivities = async () => {
    const raw = await activityApi.listBrief.get()
    activityRows.value = normalizeArray(raw) as Loose[]
  }

  const fillQuotasFromDetail = (q: unknown, totalRounds: number) => {
    const list: ActivityProgramQuotaRow[] = []
    if (Array.isArray(q) && q.length > 0) {
      for (const item of q) {
        const o = item as Loose
        list.push({
          roundNo: parseInt(String(o.roundNo), 10),
          quotaCount: parseInt(String(o.quotaCount), 10)
        })
      }
    } else if (totalRounds > 0) {
      for (let i = 0; i < totalRounds; i++) {
        list.push({ roundNo: i + 1, quotaCount: 1 })
      }
    }
    quotasList.value = list
  }

  const applyDetail = (d: Loose) => {
    const rule =
      d.rule && typeof d.rule === 'object' && !Array.isArray(d.rule) ? (d.rule as Loose) : {}
    const sortFromApi = d.sortOrder
    const sortFromRule = rule.sortOrder
    let soRaw = 0
    if (sortFromApi != null && sortFromApi !== '') {
      soRaw = Number(sortFromApi)
    } else if (sortFromRule != null && sortFromRule !== '') {
      soRaw = Number(sortFromRule)
    }
    const sortOrderVal = Number.isFinite(soRaw) ? soRaw : 0

    form.id = d.id as string | number | undefined
    form.activityId = d.activityId as string | number | undefined
    form.cnName = String(d.cnName ?? '')
    form.enName = String(d.enName ?? '')
    form.backgroundImage = String(d.backgroundImage ?? '')
    form.programType = d.programType != null ? String(d.programType) : ''
    form.sortOrder = sortOrderVal

    const trn = Number(d.totalRounds)
    const totalRounds = Number.isFinite(trn) ? trn : 0
    form.totalRounds = totalRounds

    serverStatus.value = d.programStatus != null ? String(d.programStatus) : ''
    serverType.value = form.programType
    serverTotalRounds.value = d.totalRounds ?? totalRounds

    switch (form.programType) {
      case '1': {
        form.createLotteryPool = String(rule.createLotteryPool ?? '0')
        form.lotteryIdentifierType = String(rule.lotteryIdentifierType ?? '0')
        form.lotteryParticipantScope = String(rule.lotteryParticipantScope ?? '0')
        form.needCheckin = String(rule.needCheckin ?? '0')
        form.needPayment = String(rule.needPayment ?? '0')
        form.prizeCount = parseInt(String(rule.prizeCount ?? 0), 10) || 0
        form.checkinEndOffsetMinutes =
          parseInt(String(rule.checkinEndOffsetMinutes ?? 0), 10) || 0
        form.checkinStartOffsetMinutes =
          parseInt(String(rule.checkinStartOffsetMinutes ?? 0), 10) || 0
        fillQuotasFromDetail(d.quotas, totalRounds)
        break
      }
      case '2': {
        form.needVote = String(rule.needVote ?? '0')
        form.votePerAttemptCount =
          parseInt(String(rule.votePerAttemptCount ?? 0), 10) || 0
        form.voteStartTime = rule.voteStartTime != null ? String(rule.voteStartTime) : ''
        form.voteEndTime = rule.voteEndTime != null ? String(rule.voteEndTime) : ''
        form.prizeCount = parseInt(String(rule.prizeCount ?? 0), 10) || 0
        quotasList.value = []
        break
      }
      case '3': {
        form.blessingDisplayRule = String(rule.blessingDisplayRule ?? '1')
        quotasList.value = []
        break
      }
      default:
        quotasList.value = []
    }
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
    Object.assign(form, emptyForm())
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
          fillQuotasFromDetail([], n)
        }
      } else if (p === '2') {
        form.needVote = '0'
        form.votePerAttemptCount = 0
        form.prizeCount = 0
        const act = findActivity(activityRows.value, form.activityId)
        form.voteStartTime =
          act && act.activityStartTime != null ? String(act.activityStartTime) : ''
        form.voteEndTime =
          act && act.activityEndTime != null ? String(act.activityEndTime) : ''
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
      const act = findActivity(activityRows.value, aid)
      if (act) {
        form.voteStartTime =
          act.activityStartTime != null ? String(act.activityStartTime) : ''
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
      const qerr = validateQuotas(quotasList.value, form.prizeCount, tr)
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

    const payload = buildSubmitPayload(form, quotasList.value)
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
    bodyLocked
  }
}
