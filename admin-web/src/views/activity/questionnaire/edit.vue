<template>
  <section class="q-design uni-list-page">
    <div class="uni-list-page__header">
      <div>
        <h1>{{ pageTitle }}</h1>
        <p class="uni-list-page__description">{{ pageDesc }}</p>
      </div>
      <div class="uni-list-page__header-actions q-design__header-actions">
        <template v-if="isViewMode">
          <el-button :disabled="!outerReady" @click="copySignupForPage">
            {{ $t('activity.copySignupLink') }}
          </el-button>
          <el-button
            v-uni-permission="'questionnaire_edit'"
            :disabled="!outerReady"
            @click="goEditDesign">
            {{ $t('activity.questionnaireDesigner') }}
          </el-button>
          <el-button :disabled="!outerReady" @click="openSubmissions">
            {{ $t('activity.questionnaireSubmissions') }}
          </el-button>
          <el-button :loading="exporting" :disabled="!outerReady" @click="doExport">
            {{ $t('activity.exportQuestionnaire') }}
          </el-button>
        </template>
        <template v-else>
          <el-button
            v-uni-permission="'questionnaire_edit'"
            type="primary"
            :loading="saving"
            :disabled="!outerReady"
            @click="saveQuestions">
            {{ $t('activity.questionnaireSaveQuestions') }}
          </el-button>
        </template>
        <el-divider direction="vertical" class="q-design__header-divider" />
        <el-button plain @click="goBack">{{ $t('activity.back') }}</el-button>
      </div>
    </div>

    <el-card v-loading="loading" shadow="never" class="q-design__card">
      <div v-if="outerReady" class="q-design__meta-block">
        <h3 class="q-design__subtitle">{{ $t('activity.qMetaSectionTitle') }}</h3>
        <div class="q-design__meta-grid" role="list">
          <div class="q-design__meta-item" role="listitem">
            <div class="q-design__meta-lbl">{{ $t('activity.questionnaireName') }}</div>
            <div class="q-design__meta-val">{{ metaNameDisplay }}</div>
          </div>
          <div class="q-design__meta-item" role="listitem">
            <div class="q-design__meta-lbl">{{ $t('activity.colSchool') }}</div>
            <div class="q-design__meta-val">{{ metaSchoolDisplay }}</div>
          </div>
          <div class="q-design__meta-item" role="listitem">
            <div class="q-design__meta-lbl">{{ $t('activity.questionnaireActivity') }}</div>
            <div class="q-design__meta-val">{{ metaActivityDisplay }}</div>
          </div>
          <div class="q-design__meta-item" role="listitem">
            <div class="q-design__meta-lbl">{{ $t('activity.questionnaireValid') }}</div>
            <div class="q-design__meta-val">{{ metaStatusDisplay }}</div>
          </div>
          <div class="q-design__meta-item" role="listitem">
            <div class="q-design__meta-lbl">{{ $t('activity.questionnaireNeedStudent') }}</div>
            <div class="q-design__meta-val">{{ metaNeedStudentDisplay }}</div>
          </div>
          <div class="q-design__meta-item q-design__meta-item--full" role="listitem">
            <div class="q-design__meta-lbl">{{ $t('activity.colInstructions') }}</div>
            <div class="q-design__meta-val q-design__inst-text">{{ metaInstructionsDisplay }}</div>
          </div>
        </div>
      </div>

      <div v-if="outerReady" class="q-design__builder-head">
        <h3 class="q-design__subtitle">{{ $t('activity.qTemplateSection') }}</h3>
      </div>

      <QuestionnaireBuilder
        v-if="outerReady"
        :key="builderTick"
        v-model="fields"
        :readonly="isViewMode" />
    </el-card>
  </section>
</template>

<script setup lang="ts">
import { activityApi, activityQuestionnaireApi } from '@/api'
import { useActivityYesNoOptions } from '@/composables/use-activity-yes-no-options'
import { useMembershipSchoolOptions } from '@/composables/use-membership-school-options'
import templateDynamicApi, {
  ISA_COMMUNITY_QUESTIONNAIRE_SCENE as Q_SCENE
} from '@/api/modules/template-dynamic'
import type { Translate } from '@/types/i18n'

import { normalizeArray, normalizeEnvelope, normalizePayload } from '@/utils/api-response-normalize'

import { downloadBlob } from '@/utils/download'
import { buildQuestionnaireSignupUrl } from '@/utils/questionnaire-url'

import QuestionnaireBuilder from '@/views/activity/questionnaire/components/questionnaire-builder.vue'
import type {
  DesignerField,
  DesignerOption,
  FieldProperties
} from '@/types/modules/activity-questionnaire'

import { ElMessage } from 'element-plus'

import { useUniI18n } from 'uni-ui-lib'
import { computed, reactive, ref, watch } from 'vue'

import { useRoute, useRouter } from 'vue-router'

/** 后端模板 JSON ↔ 设计器字段（原 template-codec.ts） */
type TemplateCodecLoose = Record<string, unknown>

const EDITABLE_TEMPLATE_TYPES = new Set([
  'input',
  'textarea',
  'radio',
  'checkbox',
  'select',
  'datetimepicker'
])

function codecCreateFontId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `f_${crypto.randomUUID()}`
  }
  return `f_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}

function deserializeTemplateFields(rows: TemplateCodecLoose[]): DesignerField[] {
  const sorted = [...rows].sort((a, b) => Number(a.sort ?? 0) - Number(b.sort ?? 0))
  const out: DesignerField[] = []

  for (const item of sorted) {
    const type = String(item.type ?? '')
    if (!EDITABLE_TEMPLATE_TYPES.has(type)) {
      const row = { ...item }
      delete row.sort
      out.push({ kind: 'raw', fontId: codecCreateFontId(), backendRow: row })
      continue
    }

    const propArr = Array.isArray(item.properties) ? (item.properties as TemplateCodecLoose[]) : []
    const props: FieldProperties = {}
    const option: DesignerOption[] = []
    const optionDefaultMarks: unknown[] = []

    for (const res of propArr) {
      const key = String(res.key ?? '')
      if (key === 'option') {
        option.push({
          label: String(res.label ?? ''),
          id: typeof res.id === 'number' ? res.id : Number(res.id),
          value:
            typeof res.value === 'string' || typeof res.value === 'number'
              ? String(res.value)
              : String(res.label ?? ''),
          isHide: typeof res.isHide === 'number' ? res.isHide : Number(res.isHide ?? 0)
        })
        continue
      }
      if (key === 'option_default') {
        optionDefaultMarks.push(res.value)
        continue
      }
      if (key === 'ciphertext') {
        props.ciphertext = res.value === true || res.value === 'true'
        continue
      }
      props[key] = res.value
    }

    if (option.length) {
      props.option = option
    }

    if (type === 'radio') {
      props.option_default = optionDefaultMarks.length !== 0 ? String(optionDefaultMarks[0]) : ''
    } else if (type === 'checkbox' || type === 'select') {
      const multi = props.option_multi === true || props.option_multi === 'true'
      if (multi || type === 'checkbox') {
        props.option_default = optionDefaultMarks.map((x) => Number(x)) as number[]
      } else if (optionDefaultMarks.length) {
        props.option_default = String(optionDefaultMarks[0])
      } else {
        props.option_default = ''
      }
    }

    if (type === 'datetimepicker') {
      const dtType = String(props.datetime_type ?? item.datetime_type ?? 'date')
      props.datetime_type = dtType
      props.datetime_pattern = String(props.datetime_pattern ?? props.format ?? 'yyyy-MM-dd')
    }

    const regexHintFromProps = typeof props.regexHint === 'string' ? props.regexHint : undefined

    out.push({
      kind: 'known',
      fontId: codecCreateFontId(),
      id: String(item.id ?? ''),
      type,
      label: String(item.label ?? ''),
      required: Boolean(item.required),
      readonly: Boolean(item.readonly),
      disabled: Boolean(item.disabled),
      isHide: Boolean(item.isHide),
      regex:
        typeof item.regex === 'string' && item.regex
          ? item.regex
          : typeof props.regexpattern === 'string'
            ? props.regexpattern
            : '',
      regexHint: typeof item.regexHint === 'string' ? item.regexHint : (regexHintFromProps ?? ''),
      mark: typeof item.mark === 'string' ? item.mark : undefined,
      datetimeTypeKey:
        typeof item.datetime_type === 'string'
          ? item.datetime_type
          : typeof props.datetime_type === 'string'
            ? props.datetime_type
            : '',
      properties: props
    })
  }

  return out
}

function pushTemplateKv(arr: TemplateCodecLoose[], key: string, value: unknown): void {
  if (value === undefined || value === null) {
    return
  }
  arr.push({ key, value })
}

function serializeFieldForApi(f: DesignerField, sortIndex: number): TemplateCodecLoose {
  if (f.kind === 'raw') {
    return { ...f.backendRow, sort: sortIndex }
  }

  const props: TemplateCodecLoose[] = []
  const p: FieldProperties = { ...f.properties }

  if (Array.isArray(p.option)) {
    for (const opt of p.option) {
      const valStr =
        typeof opt.value === 'string' || typeof opt.value === 'number'
          ? String(opt.value).trim()
          : ''
      props.push({
        key: 'option',
        label: opt.label,
        id: opt.id,
        value: valStr !== '' ? valStr : String(opt.label ?? ''),
        isHide: opt.isHide ?? 0
      })
    }
    delete p.option
  }

  if (
    f.type === 'radio' &&
    p.option_default !== undefined &&
    p.option_default !== null &&
    `${p.option_default}` !== ''
  ) {
    props.push({ key: 'option_default', value: Number(p.option_default) || p.option_default })
    delete p.option_default
  } else if (
    (f.type === 'checkbox' ||
      (f.type === 'select' && (p.option_multi === true || p.option_multi === 'true'))) &&
    Array.isArray(p.option_default)
  ) {
    for (const v of p.option_default) {
      props.push({ key: 'option_default', value: v })
    }
    delete p.option_default
  } else if (
    f.type === 'select' &&
    p.option_default !== undefined &&
    p.option_default !== null &&
    `${p.option_default}` !== ''
  ) {
    props.push({
      key: 'option_default',
      value: Number(p.option_default) || p.option_default
    })
    delete p.option_default
  }

  Object.entries(p).forEach(([key, val]) => {
    if (key !== 'regexpattern' && key !== 'regexHint') {
      pushTemplateKv(props, key, val)
    }
  })

  let regex = typeof f.regex === 'string' && f.regex.trim() ? f.regex : undefined
  const regexHint = typeof f.regexHint === 'string' && f.regexHint.trim() ? f.regexHint : undefined

  if (regexHint && !regex) {
    regex = '.*'
  }

  return {
    id: f.id,
    label: f.label,
    required: !!f.required,
    readonly: !!f.readonly,
    disabled: !!f.disabled,
    ...(f.datetimeTypeKey ? { datetime_type: f.datetimeTypeKey } : {}),
    ...(f.mark ? { mark: f.mark } : {}),
    ...(regex ? { regex, regexHint: regexHint ?? '' } : {}),
    ...(regexHint && !regex ? { regexHint } : {}),
    isHide: !!f.isHide,
    type: f.type,
    properties: props,
    sort: sortIndex
  }
}

function serializeTemplateBundle(
  label: string,
  fields: DesignerField[],
  templateFormId?: string | number | null
): Record<string, unknown> {
  const rows = fields.map((f, i) => serializeFieldForApi(f, i))
  const body: Record<string, unknown> = {
    label,
    fields: rows,
    structure: 'top'
  }
  if (templateFormId != null && templateFormId !== '') {
    body.id = templateFormId
  }
  return body
}

type Row = Record<string, unknown>

/** 后端新增主键常为 number/string/id 嵌套，统一收口。 */

function mutationId(raw: unknown): string | undefined {
  const env = normalizeEnvelope(raw) as Row
  if (env.id != null && `${env.id}` !== '') {
    return String(env.id)
  }

  const u = normalizePayload(raw)
  if (typeof u === 'string' || typeof u === 'number') {
    return String(u)
  }

  return undefined
}

const route = useRoute()

const router = useRouter()

const { t, locale } = useUniI18n()

const tr = t as Translate

const loading = ref(false)

const saving = ref(false)

const exporting = ref(false)

const builderTick = ref(0)

function bumpBuilder(): void {
  builderTick.value++
}

const outerId = computed(() => String(route.params.id ?? '').trim())

const outerReady = computed(() => {
  const id = outerId.value
  return id !== '' && id !== 'new'
})

const isViewMode = computed(() => String(route.query.mode ?? '') === 'view')

const pageTitle = computed(() =>
  isViewMode.value
    ? tr('route.activityQuestionnaireDetail')
    : tr('route.activityQuestionnaireDesign')
)

const pageDesc = computed(() =>
  isViewMode.value ? tr('activity.qDetailPageDesc') : tr('activity.questionnaireDesignPageDesc')
)

const { loadSchoolOptions, formatSchoolIdsCsv } = useMembershipSchoolOptions()

const ynSel = useActivityYesNoOptions()

const activityPool = ref<Row[]>([])

const form = reactive({
  name: '',
  schoolIds: [] as Array<string | number>,
  activityId: undefined as string | number | undefined,
  status: 1 as number,
  needStudentInfo: '0',
  instructions: ''
})

const metaNameDisplay = computed(() => {
  const s = String(form.name ?? '').trim()
  return s || '—'
})

const metaSchoolDisplay = computed(() => formatSchoolIdsCsv(form.schoolIds))

const metaActivityDisplay = computed(() => {
  const aid = form.activityId
  if (aid == null || aid === '') {
    return '—'
  }
  const rows = activityPool.value
  const row = rows.find((x) => String(x.id) === String(aid))
  if (!row) {
    return String(aid)
  }

  const label =
    locale.value === 'en'
      ? (row.activityEnName ?? row.activityCnName ?? row.activityName ?? row.name ?? row.id)
      : (row.activityCnName ?? row.activityEnName ?? row.activityName ?? row.name ?? row.id)

  return String(label ?? aid)
})

const metaStatusDisplay = computed(() => {
  if (form.status === 1) {
    return tr('activity.qStatusEffective')
  }

  if (form.status === 0) {
    return tr('activity.qStatusInactive')
  }

  return '—'
})

const metaNeedStudentDisplay = computed(() => {
  const v =
    form.needStudentInfo == null || form.needStudentInfo === '' ? '' : String(form.needStudentInfo)
  return ynSel.value.find((o) => String(o.value) === v)?.label ?? '—'
})

const metaInstructionsDisplay = computed(() => {
  const s = String(form.instructions ?? '').trim()
  return s || '—'
})

async function loadActivityPool(questionnaireId?: string) {
  const p: Record<string, unknown> = { questionnaireFlag: 1 }
  if (questionnaireId) {
    p.questionnaireId = questionnaireId
  }
  const raw = await activityApi.listBrief.get(p)
  activityPool.value = normalizeArray(raw) as Row[]
}

const templateFormId = ref<string | number | ''>('')

const fields = ref<DesignerField[]>([])

async function loadTemplateSide(qid: string) {
  templateFormId.value = ''
  fields.value = []
  bumpBuilder()

  const listRaw = await templateDynamicApi.listByOuterId.get({
    outerId: qid,
    scene: Q_SCENE
  })
  const tplList = normalizeArray(listRaw) as Row[]
  if (!tplList.length) {
    return
  }

  const head = tplList[0]

  const tid = head.id as string | number | undefined

  if (tid == null) {
    return
  }

  templateFormId.value = tid

  const detRaw = await templateDynamicApi.templateDetail.get(tid)

  const det = normalizeEnvelope(detRaw) as Row

  fields.value = deserializeTemplateFields(Array.isArray(det.fields) ? (det.fields as Row[]) : [])

  bumpBuilder()
}

async function loadQuestionnaire(qid: string) {
  loading.value = true
  try {
    await loadSchoolOptions()

    await loadActivityPool(qid)

    const raw = await activityQuestionnaireApi.detail.get(qid)

    const d = normalizeEnvelope(raw) as Row

    form.name = String(d.name ?? '')

    form.schoolIds = Array.isArray(d.schoolIds)
      ? (d.schoolIds as unknown[]).map((x) => x as string | number)
      : []

    form.activityId = d.activityId as string | number | undefined

    form.status = Number(d.status ?? 1)

    form.needStudentInfo = String(d.needStudentInfo ?? '0')

    form.instructions = String(d.instructions ?? '')
    await loadTemplateSide(qid)
  } catch {
    ElMessage.error(tr('activity.loadDetailFail'))
  } finally {
    loading.value = false
  }
}

function resetMeta() {
  form.name = ''
  form.schoolIds = []
  form.activityId = undefined
  form.status = 1
  form.needStudentInfo = '0'
  form.instructions = ''
  activityPool.value = []
  templateFormId.value = ''

  fields.value = []
  bumpBuilder()
}

watch(
  outerId,

  async (id) => {
    resetMeta()

    if (!id || id === 'new') {
      return
    }

    await loadQuestionnaire(id)
  },

  { immediate: true }
)

const copySignupForPage = async (): Promise<void> => {
  const id = outerId.value
  if (!id) {
    return
  }

  const url = buildQuestionnaireSignupUrl(id)
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

function goEditDesign(): void {
  router.push({
    name: 'ActivityQuestionnaireEdit',
    params: { id: outerId.value },
    query: {}
  })
}

function openSubmissions(): void {
  const id = outerId.value
  if (!id) {
    return
  }

  router.push({ name: 'ActivityQuestionnaireSubmissions', params: { id } })
}

const doExport = async (): Promise<void> => {
  const id = outerId.value
  if (!id) {
    return
  }

  exporting.value = true

  try {
    const blob = await activityQuestionnaireApi.exportAnswersBlob.get(id)

    downloadBlob(blob as Blob, `questionnaire-${id}.xlsx`)

    ElMessage.success(tr('email.opOk'))
  } catch {
    ElMessage.error(tr('activity.exportQuestionnaireFail'))
  } finally {
    exporting.value = false
  }
}

const goBack = () => {
  router.push({ path: '/activity/questionnaire' })
}

const saveQuestions = async () => {
  if (isViewMode.value) {
    return
  }

  if (!outerReady.value) {
    ElMessage.warning(tr('activity.qDesignNoQuestionnaire'))
    return
  }

  saving.value = true

  try {
    const targetOuter = outerId.value

    const label = String(form.name ?? '').trim()

    if (!label) {
      ElMessage.warning(tr('activity.qTemplateLabelRequired'))
      return
    }

    const bundle = serializeTemplateBundle(label, fields.value, templateFormId.value || null)

    if (templateFormId.value) {
      await templateDynamicApi.templateEdit.post(bundle)
    } else {
      const tid = mutationId(await templateDynamicApi.templateAdd.post(bundle))

      if (!tid) {
        ElMessage.error(tr('activity.qTemplateSaveFail'))
        return
      }

      templateFormId.value = tid

      await templateDynamicApi.bindOuterId.post(tid, targetOuter, Q_SCENE)
    }

    ElMessage.success(tr('activity.questionnaireQuestionsSaveOk'))

    await loadQuestionnaire(targetOuter)
  } catch {
    ElMessage.error(tr('activity.saveFail'))
  } finally {
    saving.value = false
  }
}
</script>

<style scoped lang="scss">
.q-design {
  &__header-actions {
    align-items: center;
  }

  &__header-divider {
    margin: 0 8px;
    height: 1.25em;
    border-color: var(--el-border-color);
  }

  &__card {
    border-radius: 12px;
    border: 1px solid var(--el-border-color-lighter);
  }

  &__card :deep(.el-card__body) {
    padding: 16px 20px 28px;
  }

  &__banner {
    margin: 0 0 18px;
    padding: 8px 12px;
    border-radius: 10px;
    align-items: flex-start;
  }

  &__banner :deep(.el-alert__description) {
    margin-top: 0;
    font-size: 13px;
    line-height: 1.5;
  }

  &__banner--warn {
    margin-bottom: 14px;
  }

  &__meta-block {
    padding: 0 0 20px;
    margin-bottom: 8px;
    border-bottom: 1px solid var(--el-border-color-extra-light);
  }

  &__subtitle {
    margin: 0 0 12px;
    padding: 0;
    font-size: 15px;
    font-weight: 600;
    color: var(--el-text-color-primary);
    letter-spacing: 0.02em;
  }

  &__meta-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 12px 20px;
  }

  @media (width <= 1080px) {
    &__meta-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (width <= 640px) {
    &__meta-grid {
      grid-template-columns: 1fr;
    }
  }

  &__meta-item--full {
    grid-column: 1 / -1;
  }

  &__meta-lbl {
    font-size: 12px;
    color: var(--el-text-color-secondary);
    margin-bottom: 6px;
    line-height: 1.3;
  }

  &__meta-val {
    font-size: 14px;
    color: var(--el-text-color-primary);
    line-height: 1.5;
    overflow-wrap: anywhere;
  }

  &__builder-head {
    margin: 22px 0 12px;
  }

  &__builder-head .q-design__subtitle {
    margin-bottom: 0;
  }

  &__inst-text {
    white-space: pre-wrap;
    overflow-wrap: anywhere;
  }
}
</style>
