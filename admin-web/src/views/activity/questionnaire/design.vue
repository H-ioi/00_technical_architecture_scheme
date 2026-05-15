<template>
  <section class="q-design uni-list-page">
    <div class="uni-list-page__header">
      <div>
        <h1>{{ $t('route.activityQuestionnaireDesign') }}</h1>
        <p class="uni-list-page__description">{{ $t('activity.questionnaireDesignPageDesc') }}</p>
      </div>
      <div class="uni-list-page__header-actions q-design__header-actions">
        <el-button
          v-uni-permission="'busdriver_edit'"
          type="primary"
          :loading="saving"
          :disabled="!outerReady"
          @click="saveQuestions">
          {{ $t('activity.questionnaireSaveQuestions') }}
        </el-button>
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

      <QuestionnaireBuilder v-if="outerReady" :key="builderTick" v-model="fields" />
    </el-card>
  </section>
</template>

<script setup lang="ts">
import { activityApi, activityQuestionnaireApi } from '@/api'
import templateDynamicApi, {
  ISA_COMMUNITY_QUESTIONNAIRE_SCENE as Q_SCENE
} from '@/api/modules/template-dynamic'
import type { Translate } from '@/types/i18n'

import {

  normalizeArray,
  normalizeEnvelope,
  normalizePayload
} from '@/utils/api-response-normalize'




import QuestionnaireBuilder from '@/views/activity/questionnaire/components/questionnaire-builder.vue'
import { deserializeTemplateFields, serializeTemplateBundle } from '@/views/activity/questionnaire/builder/template-codec'
import type { DesignerField } from '@/views/activity/questionnaire/builder/types'



import { yesNoOptions, labelForValue } from '@/views/activity/format-labels'
import { useMembershipSchoolOptions } from '@/views/activity/use-membership-school-options'

import { ElMessage } from 'element-plus'

import { useUniI18n } from 'uni-ui-lib'
import { computed, reactive, ref, watch } from 'vue'

import { useRoute, useRouter } from 'vue-router'

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

const builderTick = ref(0)

function bumpBuilder(): void {
  builderTick.value++
}

const outerId = computed(() => String(route.params.id ?? '').trim())

const outerReady = computed(() => {
  const id = outerId.value
  return id !== '' && id !== 'new'
})

const { loadSchoolOptions, schoolIdsCsv } = useMembershipSchoolOptions()

const ynSel = computed(() => yesNoOptions(tr))

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

const metaSchoolDisplay = computed(() => schoolIdsCsv(form.schoolIds))

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
      ? row.activityEnName ?? row.activityCnName ?? row.activityName ?? row.name ?? row.id
      : row.activityCnName ?? row.activityEnName ?? row.activityName ?? row.name ?? row.id

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

const metaNeedStudentDisplay = computed(() => labelForValue(ynSel.value, form.needStudentInfo))

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

    form.schoolIds = Array.isArray(d.schoolIds) ? (d.schoolIds as unknown[]).map((x) => x as string | number) : []

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



const goBack = () => {
  router.push({ path: '/activity/questionnaire' })
}


const saveQuestions = async () => {
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
.q-design__header-actions {
  align-items: center;
}

.q-design__header-divider {
  margin: 0 8px;
  height: 1.25em;
  border-color: var(--el-border-color);
}

.q-design__card {
  border-radius: 12px;
  border: 1px solid var(--el-border-color-lighter);
}

.q-design__card :deep(.el-card__body) {
  padding: 16px 20px 28px;
}

.q-design__banner {
  margin: 0 0 18px;
  padding: 8px 12px;
  border-radius: 10px;
  align-items: flex-start;
}

.q-design__banner :deep(.el-alert__description) {
  margin-top: 0;
  font-size: 13px;
  line-height: 1.5;
}

.q-design__banner--warn {
  margin-bottom: 14px;
}

.q-design__meta-block {
  padding: 0 0 20px;
  margin-bottom: 8px;
  border-bottom: 1px solid var(--el-border-color-extra-light);
}

.q-design__subtitle {
  margin: 0 0 12px;
  padding: 0;
  font-size: 15px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  letter-spacing: 0.02em;
}

.q-design__meta-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px 20px;
}

@media (max-width: 1080px) {
  .q-design__meta-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .q-design__meta-grid {
    grid-template-columns: 1fr;
  }
}

.q-design__meta-item--full {
  grid-column: 1 / -1;
}

.q-design__meta-lbl {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  margin-bottom: 6px;
  line-height: 1.3;
}

.q-design__meta-val {
  font-size: 14px;
  color: var(--el-text-color-primary);
  line-height: 1.5;
  word-break: break-word;
}

.q-design__builder-head {
  margin: 22px 0 12px;
}

.q-design__builder-head .q-design__subtitle {
  margin-bottom: 0;
}

.q-design__inst-text {
  white-space: pre-wrap;
  word-break: break-word;
}
</style>
