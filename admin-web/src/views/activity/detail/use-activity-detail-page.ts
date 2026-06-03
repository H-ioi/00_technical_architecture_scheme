import type { UniForm, UniOption } from 'uni-ui-lib'
import { toUniOptions, useUniI18n } from 'uni-ui-lib'
import { ElMessage } from 'element-plus'
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { activityApi, membershipApi, protocolApi, schoolEmailConfigApi } from '@/api'
import { useActivityYesNoOptions } from '@/composables/use-activity-yes-no-options'
import { normalizeSchoolEmailConfigList } from '@/api/modules/school-email-config'
import type { Translate } from '@/types/i18n'
import type { ActivityDetailFormModel } from '@/types/modules/activity-detail-form'
import { normalizeEnvelope, normalizePayload } from '@/utils/api-response-normalize'
import { downloadResponseBlob } from '@/utils/download'
import { coerceIdList } from '@/utils/tool'

import { activityStatusOptions, checkinMethodOptions } from '../list/list.config'
import { buildActivityDetailFormConfig } from './detail-form.config'

type Loose = Record<string, unknown>

function emptyModel(defaultSchool?: string | number): ActivityDetailFormModel {
  return {
    activityCnName: '',
    activityEnName: '',
    introCn: '',
    introEn: '',
    imageUrl: '',
    addressCn: '',
    addressEn: '',
    tipsCn: '',
    tipsEn: '',
    activityTime: [],
    registrationTime: [],
    schoolIds: defaultSchool != null ? [defaultSchool] : [],
    checkinMethod: '0',
    ticketPrice: 0,
    recommended: '0',
    banner: '0',
    needFeedback: '0',
    wechatNotify: '0',
    registrationUnlimited: true,
    registrationLimit: 1,
    visibleScope: 0,
    visibleScopeFileName: '',
    emailConfigIds: [],
    ticketNotifyEmailEnabled: '0',
    ticketNotifyEmails: [],
    ticketNotifyEmailsLabel: '',
    wechatPushSchoolIds: [],
    wechatPushContent: '',
    wechatPushRemark: '',
    activityStatus: '0',
    detailCn: '',
    detailEn: '',
    visibleScopeFile: null
  }
}

function formatTicketNotifyEmails(d: Loose, disabledText: string): string {
  if (Number(d.ticketPrice) <= 0 || String(d.ticketNotifyEmailEnabled ?? '0') !== '1') {
    return disabledText
  }
  const raw = d.ticketNotifyEmails
  if (Array.isArray(raw)) {
    return raw
      .map((x) => String(x ?? '').trim())
      .filter(Boolean)
      .join(', ')
  }
  return String(raw ?? '').trim()
}

function rowToModel(d: Loose, ticketNotifyDisabledText: string): ActivityDetailFormModel {
  const regRaw = Number(d.registrationLimit)
  const reg = Number.isFinite(regRaw) ? regRaw : 0
  const vf = d.visibleScopeFile as Record<string, unknown> | undefined

  return {
    id: d.id as string | number | undefined,
    publisher: String(d.publisher ?? ''),
    activityCnName: String(d.activityCnName ?? ''),
    activityEnName: String(d.activityEnName ?? ''),
    introCn: String(d.introCn ?? ''),
    introEn: String(d.introEn ?? ''),
    imageUrl: String(d.imageUrl ?? ''),
    addressCn: String(d.addressCn ?? ''),
    addressEn: String(d.addressEn ?? ''),
    tipsCn: String(d.tipsCn ?? ''),
    tipsEn: String(d.tipsEn ?? ''),
    activityTime:
      d.activityStartTime && d.activityEndTime
        ? [String(d.activityStartTime), String(d.activityEndTime)]
        : [],
    registrationTime:
      d.registrationStartTime && d.registrationEndTime
        ? [String(d.registrationStartTime), String(d.registrationEndTime)]
        : [],
    schoolIds: coerceIdList(d.schoolIds),
    checkinMethod: d.checkinMethod != null ? String(d.checkinMethod) : '0',
    ticketPrice: d.ticketPrice ?? 0,
    recommended: d.recommended != null ? String(d.recommended) : '0',
    banner: d.banner != null ? String(d.banner) : '0',
    needFeedback: d.needFeedback != null ? String(d.needFeedback) : '0',
    wechatNotify: d.wechatNotify != null ? String(d.wechatNotify) : '0',
    registrationUnlimited: reg === 0,
    registrationLimit: reg === 0 ? 1 : reg,
    visibleScope: d.visibleScope != null && d.visibleScope !== '' ? Number(d.visibleScope) : 0,
    visibleScopeFileName: vf?.fileName != null ? String(vf.fileName) : '',
    emailConfigIds: coerceIdList(d.emailConfigIds),
    ticketNotifyEmailEnabled:
      d.ticketNotifyEmailEnabled != null ? String(d.ticketNotifyEmailEnabled) : '0',
    ticketNotifyEmails: d.ticketNotifyEmails,
    ticketNotifyEmailsLabel: formatTicketNotifyEmails(d, ticketNotifyDisabledText),
    wechatPushSchoolIds: coerceIdList(d.wechatPushSchoolIds),
    wechatPushContent: String(d.wechatPushContent ?? ''),
    wechatPushRemark: String(d.wechatPushRemark ?? ''),
    activityStatus:
      d.activityStatus != null && d.activityStatus !== '' ? String(d.activityStatus) : '0',
    detailCn: String(d.detailCn ?? ''),
    detailEn: String(d.detailEn ?? ''),
    magicNo: d.magicNo != null ? String(d.magicNo) : undefined,
    visibleScopeFile:
      d.visibleScopeFile && typeof d.visibleScopeFile === 'object'
        ? (d.visibleScopeFile as Record<string, unknown>)
        : null
  }
}

function buildPayload(m: ActivityDetailFormModel): Record<string, unknown> {
  const {
    activityTime,
    registrationTime,
    registrationUnlimited,
    visibleScopeFile: _vf,
    visibleScopeFileName: _vfn,
    magicNo: _mn,
    publisher: _publisher,
    wechatNotify: _wechatNotify,
    ticketNotifyEmailEnabled: _tne,
    ticketNotifyEmails: _tns,
    ticketNotifyEmailsLabel: _tnsl,
    ...rest
  } = m
  void _vf
  void _vfn
  void _mn
  void _publisher
  void _wechatNotify
  void _tne
  void _tns
  void _tnsl
  const out: Record<string, unknown> = { ...rest }
  if (activityTime.length === 2) {
    out.activityStartTime = activityTime[0]
    out.activityEndTime = activityTime[1]
  }
  if (registrationTime.length === 2) {
    out.registrationStartTime = registrationTime[0]
    out.registrationEndTime = registrationTime[1]
  }
  out.registrationLimit = registrationUnlimited ? 0 : Number(m.registrationLimit) || 0
  out.visibleScope = Number(m.visibleScope)
  return out
}

export function useActivityDetailPage() {
  const { t, locale } = useUniI18n()
  const route = useRoute()
  const router = useRouter()

  const uniFormRef = ref<InstanceType<typeof UniForm> | null>(null)
  const loading = ref(false)
  const saving = ref(false)
  const activeDetailTab = ref('base')
  const tabRefreshKeys = reactive<Record<string, number>>({
    program: 0,
    questionnaire: 0,
    registration: 0,
    checkin: 0,
    feedback: 0,
    blessing: 0,
    voteInfo: 0,
    winner: 0
  })
  const schoolOptions = ref<UniOption[]>([])
  const emailConfigOptions = ref<UniOption[]>([])
  const lockedSchool = ref<string | number | undefined>(undefined)
  const form = reactive<ActivityDetailFormModel>(emptyModel())
  const formModel = computed({
    get: () => form,
    set: (value: ActivityDetailFormModel) => {
      Object.assign(form, value)
    }
  })

  const detailId = computed(() => {
    const raw = route.query.id
    if (raw == null || raw === '') {
      return ''
    }
    return String(raw)
  })

  const isEditRoute = computed(() => route.query.mode === 'edit')
  const isCreate = computed(() => !detailId.value)
  const ynOpts = useActivityYesNoOptions()
  const statusOpts = computed(() => activityStatusOptions(t))
  const checkinOpts = computed(() => checkinMethodOptions(t))
  const visibleScopeOpts = computed<UniOption[]>(() => [
    { label: t('activity.visibleScopePublic'), value: 0 },
    { label: t('activity.visibleScopeRestricted'), value: 1 }
  ])

  const visibleScopeLabel = computed(() => {
    const v = Number(form.visibleScope)
    return visibleScopeOpts.value.find((item) => Number(item.value) === v)?.label ?? '—'
  })

  const isRestrictedVisibleScope = computed(() => Number(form.visibleScope) === 1)

  const visibleScopeFileId = computed(() => {
    const id = form.visibleScopeFile?.id
    if (id == null || id === '') {
      return ''
    }
    return id as string | number
  })

  const hasVisibleScopeFile = computed(() => visibleScopeFileId.value !== '')

  const visibleScopeDrawerVisible = ref(false)

  const openVisibleScopeDrawer = () => {
    if (!hasVisibleScopeFile.value) {
      ElMessage.warning(t('activity.visibleScopeNeedUpload'))
      return
    }
    visibleScopeDrawerVisible.value = true
  }

  const showActivityStatus = computed(() => !isCreate.value)

  const formConfig = computed(() =>
    buildActivityDetailFormConfig(t, {
      schoolOptions: schoolOptions.value,
      emailOptions: emailConfigOptions.value,
      ynOptions: ynOpts.value,
      statusOptions: statusOpts.value,
      checkinOptions: checkinOpts.value,
      visibleScopeOptions: visibleScopeOpts.value,
      showActivityStatus: showActivityStatus.value
    })
  )

  const canEdit = computed(() => {
    if (!detailId.value) {
      return true
    }
    return String(form.activityStatus ?? '') !== '3'
  })
  const canSubmit = computed(
    () => isEditRoute.value && (isCreate.value || !['2', '3'].includes(String(form.activityStatus)))
  )
  const relatedEntries = computed(() => {
    if (!detailId.value) {
      return []
    }

    return []
  })
  const pageTitle = computed(() =>
    isCreate.value
      ? t('activity.eventCreateTitle')
      : canSubmit.value
        ? t('activity.eventDetailEditTitle')
        : t('activity.eventDetailTitle')
  )

  const pageDesc = computed(() =>
    isCreate.value
      ? t('activity.eventCreateDesc')
      : canSubmit.value
        ? t('activity.eventDetailEditDesc')
        : t('activity.eventDetailViewDesc')
  )

  const uniMode = computed<'view' | 'edit'>(() => (canSubmit.value ? 'edit' : 'view'))

  const detailHtmlCn = computed(() => {
    const raw = form.detailCn
    if (raw == null || raw === '') {
      return ''
    }
    const text = String(raw)
      .replace(/<[^>]+>/g, '')
      .trim()
    if (!text) {
      return ''
    }
    return String(raw)
  })

  const detailHtmlEn = computed(() => {
    const raw = form.detailEn
    if (raw == null || raw === '') {
      return ''
    }
    const text = String(raw)
      .replace(/<[^>]+>/g, '')
      .trim()
    if (!text) {
      return ''
    }
    return String(raw)
  })

  const mergeEmailDetails = async () => {
    const selected = form.emailConfigIds.map((x) => String(x))
    const have = new Set(emailConfigOptions.value.map((o) => String(o.value)))
    const missing = selected.filter((id) => !have.has(id))
    if (!missing.length) {
      return
    }
    const rows: Record<string, unknown>[] = []
    for (const id of missing) {
      try {
        const raw = await schoolEmailConfigApi.detail.get(id)
        const row = normalizeEnvelope(raw) as Loose
        if (row && Object.keys(row).length) {
          rows.push(row)
        }
      } catch {
        //
      }
    }
    if (!rows.length) {
      return
    }
    const extra = toUniOptions(rows, {
      labelKeys: ['email', 'name', 'cnName', 'enName'],
      valueKey: 'id'
    })
    const merged = [...emailConfigOptions.value]
    for (const o of extra) {
      if (!merged.some((m) => String(m.value) === String(o.value))) {
        merged.push(o)
      }
    }
    emailConfigOptions.value = merged
  }

  const loadEmailOptions = async () => {
    const sid = form.schoolIds.filter((x) => x != null && x !== '')
    const params: Record<string, unknown> = { appModule: '1' }
    if (sid.length) {
      params.schoolIds = sid
    }
    try {
      const raw = await schoolEmailConfigApi.list.get(params)
      const rows = normalizeSchoolEmailConfigList(raw) as Record<string, unknown>[]
      emailConfigOptions.value = toUniOptions(rows, {
        labelKeys: ['email', 'name', 'cnName', 'enName'],
        valueKey: 'id'
      })
    } catch {
      emailConfigOptions.value = []
    }
    await mergeEmailDetails()
  }

  const loadSchools = async () => {
    const raw = await membershipApi.school.get()
    const list = Array.isArray(raw) ? raw : []
    schoolOptions.value = toUniOptions(list as Record<string, unknown>[], {
      labelKeys:
        locale.value === 'en' ? ['enName', 'name', 'cnName'] : ['cnName', 'name', 'enName'],
      valueKey: 'id'
    })
    if (schoolOptions.value.length === 1) {
      lockedSchool.value = schoolOptions.value[0].value as string | number
    }
  }

  const applyDetail = (row: Loose) => {
    Object.assign(form, rowToModel(row, t('activity.ticketNotifyDisabled')))
    if (String(row.activityStatus ?? '') === '3' && isEditRoute.value) {
      ElMessage.warning(t('activity.eventEndedNoEdit'))
      void router.replace({ query: { ...route.query, id: detailId.value, mode: 'view' } })
    }
  }

  const loadDetail = async () => {
    if (!detailId.value) {
      Object.assign(form, emptyModel(lockedSchool.value))
      await loadEmailOptions()
      return
    }
    loading.value = true
    try {
      const raw = await activityApi.detail.get(detailId.value)
      const row = normalizeEnvelope(raw) as Loose
      if (!row || !Object.keys(row).length) {
        ElMessage.error(t('activity.loadDetailFail'))
        return
      }
      applyDetail(row)
      await loadEmailOptions()
    } catch {
      ElMessage.error(t('activity.loadDetailFail'))
    } finally {
      loading.value = false
    }
  }

  const goBack = () => {
    void router.push({ name: 'ActivityEventList' })
  }

  const handleDetailTabChange = (name: string | number) => {
    const tabName = String(name)
    activeDetailTab.value = tabName
    if (tabName in tabRefreshKeys) {
      tabRefreshKeys[tabName] += 1
    }
  }

  const onCoverBeforeUpload = (rawFile: File) => {
    void (async () => {
      try {
        form.imageUrl = await protocolApi.upload.post(rawFile)
      } catch {
        ElMessage.error(t('activity.coverUploadFail'))
      }
    })()
    return false
  }

  const downloadVisibleTpl = async () => {
    try {
      const response = await activityApi.visibleScopeTemplate.get()
      downloadResponseBlob(response, 'visible-scope-template.xlsx')
    } catch {
      ElMessage.error(t('activity.exportFail'))
    }
  }

  const onVisibleScopeFile = async (file: File) => {
    if (!form.id) {
      ElMessage.warning(t('activity.visibleScopeNeedSave'))
      return
    }
    try {
      await activityApi.visibleScopeImport.post(form.id as string | number, file)
      ElMessage.success(t('activity.saveOk'))
      await loadDetail()
    } catch {
      ElMessage.error(t('activity.visibleScopeImportFail'))
    }
  }

  const submit = async () => {
    if (!isEditRoute.value) {
      return
    }
    if (!canSubmit.value) {
      ElMessage.warning(t('activity.eventEndedNoEdit'))
      return
    }
    if (
      !form.registrationUnlimited &&
      (!form.registrationLimit || Number(form.registrationLimit) < 1)
    ) {
      ElMessage.warning(t('activity.registrationLimitInvalid'))
      return
    }
    const valid = await uniFormRef.value?.validate().catch(() => false)
    if (!valid) {
      return
    }
    saving.value = true
    try {
      const payload = buildPayload(form)
      if (isCreate.value) {
        const raw = await activityApi.add.post(payload)
        let data = normalizePayload(raw) as Loose
        if (!data?.id && data?.data && typeof data.data === 'object') {
          data = data.data as Loose
        }
        const newId = data?.id
        ElMessage.success(t('activity.saveOk'))
        if (newId != null && newId !== '') {
          void router.replace({ query: { id: String(newId), mode: 'view' } })
        } else {
          void router.push({ name: 'ActivityEventList' })
        }
      } else {
        await activityApi.edit.post(payload)
        ElMessage.success(t('activity.saveOk'))
        await loadDetail()
      }
    } finally {
      saving.value = false
    }
  }

  watch(
    () => form.registrationUnlimited,
    (unlimited) => {
      if (unlimited) {
        return
      }
      const n = Number(form.registrationLimit)
      if (!Number.isFinite(n) || n < 1) {
        form.registrationLimit = 1
      }
    }
  )

  watch(
    () => [...form.schoolIds],
    () => {
      void loadEmailOptions()
    }
  )

  watch(isEditRoute, (edit) => {
    if (edit) {
      void loadEmailOptions()
    }
  })

  watch(detailId, () => {
    void loadDetail()
  })

  onMounted(async () => {
    await loadSchools()
    await loadDetail()
  })

  return {
    detailHtmlCn,
    detailHtmlEn,
    form,
    formModel,
    formConfig,
    uniFormRef,
    activeDetailTab,
    tabRefreshKeys,
    loading,
    saving,
    uniMode,
    pageTitle,
    pageDesc,
    detailId,
    isCreate,
    isEditRoute,
    canEdit,
    canSubmit,
    relatedEntries,
    handleDetailTabChange,
    goBack,
    submit,
    onCoverBeforeUpload,
    downloadVisibleTpl,
    onVisibleScopeFile,
    loadDetail,
    visibleScopeLabel,
    isRestrictedVisibleScope,
    visibleScopeFileId,
    hasVisibleScopeFile,
    visibleScopeDrawerVisible,
    openVisibleScopeDrawer
  }
}
