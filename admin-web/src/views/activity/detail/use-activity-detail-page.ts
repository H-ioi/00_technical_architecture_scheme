import type { UniForm, UniOption } from 'uni-ui-lib'
import { toUniOptions, useUniI18n } from 'uni-ui-lib'
import { ElMessage } from 'element-plus'
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { activityApi, membershipApi, protocolApi, schoolEmailConfigApi } from '@/api'
import { normalizeSchoolEmailConfigList } from '@/api/modules/school-email-config'
import type { Translate } from '@/types/i18n'
import type { ActivityDetailFormModel } from '@/types/modules/activity-detail-form'
import { normalizeEnvelope, normalizePayload } from '@/utils/api-response-normalize'
import { downloadBlob } from '@/utils/download'

import { activityStatusOptions, checkinMethodOptions } from '../list/list.config'
import { buildActivityDetailFormConfig } from './detail-form.config'

type Loose = Record<string, unknown>

function yesNo(t: Translate): UniOption[] {
  return [
    { label: t('activity.yes'), value: '1' },
    { label: t('activity.no'), value: '0' }
  ]
}

function normalizeIdArray(raw: unknown): Array<string | number> {
  if (!Array.isArray(raw)) {
    if (raw == null || raw === '') {
      return []
    }
    return [raw as string | number]
  }
  return raw.filter((x) => x != null && x !== '') as Array<string | number>
}

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
    registrationUnlimited: true,
    registrationLimit: 1,
    visibleScope: 0,
    emailConfigIds: [],
    wechatPushSchoolIds: [],
    wechatPushContent: '',
    wechatPushRemark: '',
    activityStatus: '0',
    detailCn: '',
    detailEn: '',
    visibleScopeFile: null
  }
}

function rowToModel(d: Loose): ActivityDetailFormModel {
  const regRaw = Number(d.registrationLimit)
  const reg = Number.isFinite(regRaw) ? regRaw : 0
  return {
    id: d.id as string | number | undefined,
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
    schoolIds: normalizeIdArray(d.schoolIds),
    checkinMethod: d.checkinMethod != null ? String(d.checkinMethod) : '0',
    ticketPrice: d.ticketPrice ?? 0,
    recommended: d.recommended != null ? String(d.recommended) : '0',
    banner: d.banner != null ? String(d.banner) : '0',
    needFeedback: d.needFeedback != null ? String(d.needFeedback) : '0',
    registrationUnlimited: reg === 0,
    registrationLimit: reg === 0 ? 1 : reg,
    visibleScope: d.visibleScope != null && d.visibleScope !== '' ? Number(d.visibleScope) : 0,
    emailConfigIds: normalizeIdArray(d.emailConfigIds),
    wechatPushSchoolIds: normalizeIdArray(d.wechatPushSchoolIds),
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
    magicNo: _mn,
    ...rest
  } = m
  void _vf
  void _mn
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
  const tr = t as Translate
  const route = useRoute()
  const router = useRouter()

  const uniFormRef = ref<InstanceType<typeof UniForm> | null>(null)
  const loading = ref(false)
  const saving = ref(false)
  const schoolOptions = ref<UniOption[]>([])
  const emailConfigOptions = ref<UniOption[]>([])
  const lockedSchool = ref<string | number | undefined>(undefined)
  const form = reactive<ActivityDetailFormModel>(emptyModel())

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
      ? tr('activity.eventCreateTitle')
      : isEditRoute.value
        ? tr('activity.eventDetailEditTitle')
        : tr('activity.eventDetailTitle')
  )

  const uniMode = computed<'view' | 'edit'>(() => (isEditRoute.value ? 'edit' : 'view'))

  const ynOpts = computed(() => yesNo(tr))
  const statusOpts = computed(() => activityStatusOptions(tr))
  const checkinOpts = computed(() => checkinMethodOptions(tr))
  const visibleScopeOpts = computed<UniOption[]>(() => [
    { label: tr('activity.visibleScopePublic'), value: 0 },
    { label: tr('activity.visibleScopeRestricted'), value: 1 }
  ])

  const showActivityStatus = computed(() => !isCreate.value)

  const formConfig = computed(() =>
    buildActivityDetailFormConfig(tr, {
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

  const meaningfulHtml = (raw?: string) => {
    if (raw == null || raw === '') {
      return ''
    }
    const text = String(raw).replace(/<[^>]+>/g, '').trim()
    if (!text) {
      return ''
    }
    return String(raw)
  }

  const detailHtmlCn = computed(() => meaningfulHtml(form.detailCn))
  const detailHtmlEn = computed(() => meaningfulHtml(form.detailEn))

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
    Object.assign(form, rowToModel(row))
    if (String(row.activityStatus ?? '') === '3' && isEditRoute.value) {
      ElMessage.warning(tr('activity.eventEndedNoEdit'))
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
        ElMessage.error(tr('activity.loadDetailFail'))
        return
      }
      applyDetail(row)
      await loadEmailOptions()
    } catch {
      ElMessage.error(tr('activity.loadDetailFail'))
    } finally {
      loading.value = false
    }
  }

  const goBack = () => {
    void router.push({ name: 'ActivityEventList' })
  }

  const goEdit = () => {
    void router.replace({ query: { ...route.query, mode: 'edit' } })
  }

  const onCoverBeforeUpload = (rawFile: File) => {
    void (async () => {
      try {
        form.imageUrl = await protocolApi.upload.post(rawFile)
      } catch {
        ElMessage.error(tr('activity.coverUploadFail'))
      }
    })()
    return false
  }

  const downloadVisibleTpl = async () => {
    try {
      const blob = await activityApi.visibleScopeTemplate.get()
      downloadBlob(blob as Blob, 'visible-scope-template.xlsx')
    } catch {
      ElMessage.error(tr('activity.exportFail'))
    }
  }

  const onVisibleScopeFile = async (file: File) => {
    if (!form.id) {
      ElMessage.warning(tr('activity.visibleScopeNeedSave'))
      return
    }
    try {
      await activityApi.visibleScopeImport.post(form.id as string | number, file)
      ElMessage.success(tr('activity.saveOk'))
      await loadDetail()
    } catch {
      ElMessage.error(tr('activity.visibleScopeImportFail'))
    }
  }

  const submit = async () => {
    if (!isEditRoute.value) {
      return
    }
    if (
      !form.registrationUnlimited &&
      (!form.registrationLimit || Number(form.registrationLimit) < 1)
    ) {
      ElMessage.warning(tr('activity.registrationLimitInvalid'))
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
        ElMessage.success(tr('activity.saveOk'))
        if (newId != null && newId !== '') {
          void router.replace({ query: { id: String(newId), mode: 'edit' } })
        } else {
          void router.push({ name: 'ActivityEventList' })
        }
      } else {
        await activityApi.edit.post(payload)
        ElMessage.success(tr('activity.saveOk'))
        await loadDetail()
      }
    } finally {
      saving.value = false
    }
  }

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
    formConfig,
    uniFormRef,
    loading,
    saving,
    uniMode,
    pageTitle,
    detailId,
    isCreate,
    isEditRoute,
    canEdit,
    goBack,
    goEdit,
    submit,
    onCoverBeforeUpload,
    downloadVisibleTpl,
    onVisibleScopeFile,
    loadDetail
  }
}
