<template>
  <section class="uni-list-page">
    <div class="uni-list-page__header">
      <div>
        <h1>{{ $t('route.activityQuestionnaireSubmissions') }}</h1>
        <p v-if="subtitle" class="uni-list-page__description">{{ subtitle }}</p>
      </div>
      <div class="uni-list-page__header-actions">
        <el-button @click="goBack">{{ $t('activity.back') }}</el-button>
        <el-button :loading="exporting" @click="doExport">{{ $t('activity.exportQuestionnaire') }}</el-button>
      </div>
    </div>

    <el-card v-loading="loading" shadow="never">
      <el-table stripe :data="rows" style="width: max-content">
        <el-table-column
          v-for="c in columns"
          :key="c.prop"
          :label="c.label"
          show-overflow-tooltip
          min-width="140">
          <template #default="{ row }">{{ displayCell(row as RowMap, c) }}</template>
        </el-table-column>
        <el-table-column
          v-if="hasUploadCols"
          :label="$t('activity.qSubmissionAttach')"
          width="160"
          fixed="right">
          <template #default="{ row }">
            <el-button
              type="primary"
              link
              :disabled="!(row as RowMap).__attachmentIds?.length"
              @click="openFiles(row as RowMap)">
              {{
                (row as RowMap).__attachmentIds?.length
                  ? $t('activity.qSubmissionAttachOpen', { n: (row as RowMap).__attachmentIds?.length })
                  : '—'
              }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="q-sub-pager">
        <el-pagination
          layout="prev, pager, next, jumper, sizes, total"
          background
          :page-sizes="[10, 20, 50, 100]"
          :current-page="page.current"
          :page-size="page.size"
          :total="page.total"
          @current-change="onPg"
          @size-change="onSz" />
      </div>
    </el-card>

    <el-dialog v-model="fileDlg" :title="$t('activity.qSubmissionAttachTitle')" width="520px">
      <div class="q-sub-files">
        <el-button
          v-for="f in fileRows"
          :key="String(f.id)"
          type="primary"
          link
          class="q-sub-file"
          @click="downloadOne(f.id, f.originalName ?? String(f.id))">
          {{ f.originalName ?? f.id }}
        </el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script setup lang="ts">
import { activityQuestionnaireApi, publicFileApi, templateDynamicApi } from '@/api'
import { ISA_COMMUNITY_QUESTIONNAIRE_SCENE as Q_SCENE } from '@/api/modules/template-dynamic'
import type { Translate } from '@/types/i18n'
import { normalizeArray, normalizeEnvelope, normalizePaged } from '@/utils/api-response-normalize'
import { downloadBlob } from '@/utils/download'
import {
  collectUploadNumericIds,
  fmtStudentGender,
  fmtSubmissionCell,
  submissionColumnsFromFields,
  type SubmissionColumnMeta
} from '@/views/activity/questionnaire/submission-display'
import { ElMessage } from 'element-plus'
import { useUniI18n } from 'uni-ui-lib'
import { computed, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

type Row = Record<string, unknown>
type AnsField = { templateFormFieldId?: string | number; value?: unknown }
type RowMap = Row & { fields?: AnsField[]; __attachmentIds?: number[] }

const route = useRoute()
const router = useRouter()
const { t } = useUniI18n()
const tr = t as Translate

function dkey(p: string): string {
  return `__d_${p}`
}

function lookupField(formFields: AnsField[], fieldId: string): unknown {
  return formFields.find((f) => String(f.templateFormFieldId ?? '') === fieldId)?.value
}

const subtitle = ref('')
const loading = ref(false)
const exporting = ref(false)
const fileDlg = ref(false)
const fileRows = ref<Array<{ id: string | number; originalName?: string }>>([])
const questionnaireId = computed(() => String(route.params.id ?? '').trim())
const columns = ref<SubmissionColumnMeta[]>([])
const rows = ref<RowMap[]>([])
const page = reactive({ current: 1, size: 10, total: 0 })
const hasUploadCols = computed(() => columns.value.some((c) => c.kind === 'upload'))

function composeRow(apiRow: Row): RowMap {
  const formFields = (Array.isArray(apiRow.fields) ? (apiRow.fields as AnsField[]) : []) as AnsField[]
  const mapped: RowMap = { ...apiRow, fields: formFields }
  const attach: number[] = []
  for (const col of columns.value) {
    if (col.kind !== 'upload') continue
    attach.push(...collectUploadNumericIds(lookupField(formFields, col.prop)))
  }
  mapped.__attachmentIds = Array.from(new Set(attach))

  for (const meta of columns.value) {
    const key = dkey(meta.prop)
    if (meta.kind === '__student__') {
      const raw =
        meta.prop === 'studentBirthDate'
          ? apiRow.studentBirthDate
          : meta.prop === 'studentGender'
            ? apiRow.studentGender
            : meta.prop === 'studentSchool'
              ? apiRow.studentSchool
              : apiRow.studentName
      mapped[key] =
        meta.prop === 'studentGender'
          ? fmtStudentGender(raw, tr('activity.submissionGenderMale'), tr('activity.submissionGenderFemale'))
          : raw == null || raw === ''
            ? '—'
            : String(raw)
      continue
    }
    if (meta.kind === '__meta__') {
      mapped[key] =
        apiRow.createTime == null || apiRow.createTime === '' ? '—' : String(apiRow.createTime)
      continue
    }
    const rawAns = lookupField(formFields, meta.prop)
    if (meta.kind === 'upload') {
      const ids = collectUploadNumericIds(rawAns)
      mapped[key] = ids.length ? tr('activity.qSubmissionFileCount', { n: ids.length }) : '—'
      continue
    }
    mapped[key] = String(fmtSubmissionCell(meta, rawAns))
  }
  return mapped
}

async function bootstrap() {
  rows.value = []
  page.total = 0
  subtitle.value = ''
  columns.value = []
  const qid = questionnaireId.value
  if (!qid || qid === 'new') {
    await router.replace('/activity/questionnaire')
    return
  }
  loading.value = true
  try {
    const dRaw = await activityQuestionnaireApi.detail.get(qid)
    const meta = normalizeEnvelope(dRaw) as Row
    subtitle.value = `${tr('activity.questionnaireName')}: ${String(meta.name ?? '')}`
    const needStu =
      meta.needStudentInfo === true ||
      meta.needStudentInfo === 1 ||
      String(meta.needStudentInfo) === '1'
    const tCols = {
      submissionColCreateTime: tr('activity.submissionColCreateTime'),
      submissionColHiddenSuffix: tr('activity.submissionColHiddenSuffix'),
      studentBirth: tr('activity.submissionStudentBirth'),
      studentGender: tr('activity.submissionStudentGender'),
      studentSchool: tr('activity.submissionStudentSchool'),
      studentName: tr('activity.submissionStudentName')
    }
    const listRaw = await templateDynamicApi.listByOuterId.get({ outerId: qid, scene: Q_SCENE })
    const tplList = normalizeArray(listRaw) as Row[]
    let tableFields: Row[] = []
    if (tplList.length && Array.isArray(tplList[0]?.fields)) {
      tableFields = tplList[0].fields as Row[]
    }
    columns.value = submissionColumnsFromFields(tableFields, tCols, { appendStudentCols: needStu })
    page.current = 1
    await fetchPage()
  } catch {
    columns.value = []
    ElMessage.error(tr('activity.loadDetailFail'))
  } finally {
    loading.value = false
  }
}

watch(questionnaireId, () => void bootstrap(), { immediate: true })

async function fetchPage() {
  loading.value = true
  try {
    const raw = await templateDynamicApi.paginateIsaCommunity.post({
      current: page.current,
      size: page.size,
      scene: Q_SCENE,
      outerId: questionnaireId.value
    })
    const { list, total } = normalizePaged(raw)
    page.total = total
    rows.value = (list as Row[]).map(composeRow)
  } finally {
    loading.value = false
  }
}

function displayCell(row: RowMap, c: SubmissionColumnMeta): string {
  const v = row[dkey(c.prop)]
  return v == null || v === '' ? '—' : String(v)
}

function goBack() {
  router.push({
    name: 'ActivityQuestionnaireDesign',
    params: { id: String(questionnaireId.value) },
    query: { mode: 'view' }
  })
}

async function doExport() {
  exporting.value = true
  try {
    const blob = await activityQuestionnaireApi.exportAnswersBlob.get(questionnaireId.value)
    downloadBlob(blob as Blob, `questionnaire-${questionnaireId.value}.xlsx`)
    ElMessage.success(tr('email.opOk'))
  } catch {
    ElMessage.error(tr('activity.exportQuestionnaireFail'))
  } finally {
    exporting.value = false
  }
}

async function openFiles(row: RowMap) {
  const ids = row.__attachmentIds ?? []
  if (!ids.length) return
  try {
    const raw = await publicFileApi.infoByIds.get(ids.join(','))
    const arr = normalizeArray(raw) as Row[]
    fileRows.value = arr
      .map((x) => ({
        id: x.id ?? x.fileId ?? x.file_id,
        originalName:
          typeof x.originalName === 'string'
            ? x.originalName
            : typeof x.fileName === 'string'
              ? x.fileName
              : undefined
      }))
      .filter((x) => x.id != null) as typeof fileRows.value
    fileDlg.value = true
  } catch {
    ElMessage.error(tr('activity.qSubmissionAttachFail'))
  }
}

async function downloadOne(fileId: string | number, name: string) {
  try {
    const blob = await publicFileApi.downloadBlob.get(fileId)
    downloadBlob(blob as Blob, name || String(fileId))
  } catch {
    ElMessage.error(tr('activity.qSubmissionDownloadFail'))
  }
}

function onPg(p: number) {
  page.current = p
  void fetchPage()
}

function onSz(sz: number) {
  page.size = sz
  page.current = 1
  void fetchPage()
}
</script>

<style scoped lang="scss">
.q-sub-pager {
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
}
.q-sub-files {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.q-sub-file {
  margin-bottom: 6px;
}
</style>
