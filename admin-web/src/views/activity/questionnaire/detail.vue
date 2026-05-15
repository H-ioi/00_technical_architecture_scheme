<template>
  <section class="uni-list-page">
    <div class="uni-list-page__header">
      <div>
        <h1>{{ $t('route.activityQuestionnaireDetail') }}</h1>
        <p class="uni-list-page__description">{{ $t('activity.qDetailPageDesc') }}</p>
      </div>
      <div class="uni-list-page__header-actions">
        <el-button @click="goBack">{{ $t('activity.back') }}</el-button>
        <el-button @click="copySignup">{{ $t('activity.copySignupLink') }}</el-button>
        <el-button
          v-uni-permission="'busdriver_edit'"
          @click="openDesigner">{{ $t('activity.questionnaireDesigner') }}</el-button>
        <el-button @click="openSubmissions">{{ $t('activity.questionnaireSubmissions') }}</el-button>
        <el-button :loading="exporting" @click="doExport">{{ $t('activity.exportQuestionnaire') }}</el-button>
      </div>
    </div>
    <el-card v-loading="loading" shadow="never">
      <template v-if="detail">
        <h3 class="q-detail__subtitle">{{ $t('activity.qDetailMetaSection') }}</h3>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="ID">{{ cell(r.id) }}</el-descriptions-item>
          <el-descriptions-item :label="$t('activity.questionnaireName')">{{
            cell(r.name)
          }}</el-descriptions-item>
          <el-descriptions-item :label="$t('activity.colActivityName')">{{
            cell(r.activityName)
          }}</el-descriptions-item>
          <el-descriptions-item :label="$t('activity.colSchool')">{{
            schoolCsv
          }}</el-descriptions-item>
          <el-descriptions-item :label="$t('activity.questionnaireValid')">{{
            ynLab(r.status)
          }}</el-descriptions-item>
          <el-descriptions-item :label="$t('activity.questionnaireFrozen')">{{
            ynLab(r.frozen)
          }}</el-descriptions-item>
          <el-descriptions-item :label="$t('activity.questionnaireNeedStudent')">{{
            ynLab(r.needStudentInfo)
          }}</el-descriptions-item>
          <el-descriptions-item :label="$t('activity.colInstructions')" :span="2">{{
            cell(r.instructions)
          }}</el-descriptions-item>
          <el-descriptions-item :label="$t('activity.colCreated')">{{
            cell(r.createTime)
          }}</el-descriptions-item>
          <el-descriptions-item :label="$t('activity.colUpdated')">{{
            cell(r.updateTime)
          }}</el-descriptions-item>
        </el-descriptions>

        <h3 class="q-detail__subtitle q-detail__subtitle--q">{{ $t('activity.qDetailQuestionsSection') }}</h3>
        <div v-loading="templateLoading" class="q-detail__tpl">
          <el-empty
            v-if="!templateLoading && !fields.length"
            :description="$t('activity.qDetailNoTemplate')" />
          <ol v-else-if="fields.length" class="q-detail__qlist">
            <li v-for="(f, ix) in fields" :key="f.fontId" class="q-detail__qrow">
              <span class="q-detail__qidx">{{ ix + 1 }}</span>
              <el-tag size="small" type="info" effect="plain">{{ fieldTypeLabel(f) }}</el-tag>
              <span class="q-detail__qtitle">{{ fieldTitle(f) }}</span>
              <template v-if="f.kind === 'known'">
                <el-tag v-if="f.required" size="small" type="warning" effect="plain">
                  {{ $t('activity.qbRequired') }}
                </el-tag>
                <el-tag v-if="f.isHide" size="small" effect="plain">{{ $t('activity.qbHide') }}</el-tag>
              </template>
            </li>
          </ol>
        </div>
      </template>
    </el-card>
  </section>
</template>

<script setup lang="ts">
import { activityQuestionnaireApi } from '@/api'
import templateDynamicApi, {
  ISA_COMMUNITY_QUESTIONNAIRE_SCENE as Q_SCENE
} from '@/api/modules/template-dynamic'
import type { Translate } from '@/types/i18n'
import { normalizeArray, normalizeEnvelope } from '@/utils/api-response-normalize'
import { downloadBlob } from '@/utils/download'
import { computed, ref, watch } from 'vue'

import { useRoute, useRouter } from 'vue-router'

import { ElMessage } from 'element-plus'

import { useUniI18n } from 'uni-ui-lib'

import { fmtTs, labelForValue, yesNoOptions } from '@/views/activity/format-labels'

import { useMembershipSchoolOptions } from '@/views/activity/use-membership-school-options'

import { deserializeTemplateFields } from '@/views/activity/questionnaire/builder/template-codec'
import type { DesignerField, DesignerFieldKnown, DesignerFieldRaw } from '@/views/activity/questionnaire/builder/types'
import { buildQuestionnaireSignupUrl } from '@/views/activity/questionnaire/utils/questionnaire-external-urls'

type Row = Record<string, unknown>

const route = useRoute()
const router = useRouter()
const { t } = useUniI18n()
const tr = t as Translate
const { schoolIdsCsv, loadSchoolOptions } = useMembershipSchoolOptions()

const loading = ref(false)
const templateLoading = ref(false)
const exporting = ref(false)

const detail = ref<Row | null>(null)
const fields = ref<DesignerField[]>([])

const qid = computed(() => String(route.params.id ?? '').trim())
const r = computed(() => detail.value ?? ({} as Row))

const cell = (v: unknown) => (v == null || v === '' ? '—' : String(v))
const yn = () => yesNoOptions(tr)

const ynLab = (v: unknown) => labelForValue(yn(), v)

function rawType(row: DesignerFieldRaw): string {
  return String(row.backendRow.type ?? '?')
}

function fieldTitle(row: DesignerField): string {
  return row.kind === 'known' ? row.label : `[${rawType(row as DesignerFieldRaw)}]`
}

function fieldTypeLabel(row: DesignerField): string {
  return row.kind === 'raw'
    ? `${tr('activity.qbRawPrefix')} (${rawType(row as DesignerFieldRaw)})`
    : tr(`activity.qbTypes.${(row as DesignerFieldKnown).type}`)
}

async function loadTemplateFields(outerId: string): Promise<void> {
  fields.value = []
  try {
    const listRaw = await templateDynamicApi.listByOuterId.get({
      outerId,
      scene: Q_SCENE
    })
    const tplList = normalizeArray(listRaw) as Row[]
    if (!tplList.length) {
      return
    }
    const tid = tplList[0]?.id as string | number | undefined
    if (tid == null) {
      return
    }
    const detRaw = await templateDynamicApi.templateDetail.get(tid)
    const det = normalizeEnvelope(detRaw) as Row
    fields.value = deserializeTemplateFields(Array.isArray(det.fields) ? (det.fields as Row[]) : [])
  } catch {
    /** 未绑定模板或接口异常：详情页仍展示档案 */
  }
}

const schoolCsv = computed(() => schoolIdsCsv(r.value.schoolIds))
watch(
  qid,
  async (id) => {
    detail.value = null
    fields.value = []
    await loadSchoolOptions()

    if (!id) {
      await router.replace('/activity/questionnaire')
      return
    }
    loading.value = true
    detail.value = null
    fields.value = []
    templateLoading.value = false
    try {
      await loadSchoolOptions()
      const raw = await activityQuestionnaireApi.detail.get(id)
      const row = normalizeEnvelope(raw) as Row

      row.createTime = fmtTs(row.createTime)
      row.updateTime = fmtTs(row.updateTime)

      detail.value = row
    } catch {
      detail.value = null
      fields.value = []

      ElMessage.error(tr('activity.loadDetailFail'))
    } finally {
      loading.value = false
    }

    if (!detail.value) {
      return
    }

    templateLoading.value = true
    try {
      await loadTemplateFields(id)
    } finally {
      templateLoading.value = false
    }
  },

  { immediate: true }
)

const goBack = () => {
  router.push({ path: '/activity/questionnaire' })
}

const copySignup = async () => {
  const id = qid.value
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

const openDesigner = () => {
  const id = qid.value
  if (!id) {
    return
  }

  router.push({ name: 'ActivityQuestionnaireDesign', params: { id } })
}

const openSubmissions = () => {
  const id = qid.value

  if (!id) {


    return
  }





  router.push({ name: 'ActivityQuestionnaireSubmissions', params: { id } })

}

const doExport = async () => {
  const id = qid.value
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
</script>

<style scoped lang="scss">
.q-detail__subtitle {
  margin: 0 0 12px;
  font-size: 15px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.q-detail__subtitle--q {
  margin-top: 22px;
  padding-top: 18px;
  border-top: 1px solid var(--el-border-color-extra-light);
}

.q-detail__tpl {
  min-height: 72px;
}

.q-detail__qlist {
  margin: 0;
  padding: 0;
  list-style: none;
}

.q-detail__qrow {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 10px;
  padding: 10px 0;
  border-bottom: 1px solid var(--el-border-color-lighter);

  &:last-child {
    border-bottom: none;
  }
}

.q-detail__qidx {
  flex: none;
  min-width: 22px;
  font-size: 12px;
  font-weight: 700;
  color: var(--el-text-color-secondary);
}

.q-detail__qtitle {
  flex: 1;
  min-width: 140px;
  font-size: 13px;
  color: var(--el-text-color-primary);
  word-break: break-word;
}
</style>
