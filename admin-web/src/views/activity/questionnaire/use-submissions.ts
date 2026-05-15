import type { UniTableRequest } from 'uni-ui-lib'
import { useUniI18n, useUniListState } from 'uni-ui-lib'
import { ElMessage } from 'element-plus'
import { computed, nextTick, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { activityQuestionnaireApi, publicFileApi, templateDynamicApi } from '@/api'
import { ISA_COMMUNITY_QUESTIONNAIRE_SCENE as Q_SCENE } from '@/api/modules/template-dynamic'
import type { Translate } from '@/types/i18n'
import type {
  SubmissionAnswerField,
  SubmissionColumnMeta,
  SubmissionRowMap
} from '@/types/modules/activity-questionnaire'
import { normalizeArray, normalizeEnvelope, normalizePaged } from '@/utils/api-response-normalize'
import { downloadBlob } from '@/utils/download'

import {
  submissionAttachColumnProp,
  submissionDisplayProp,
  submissionTableCols
} from './submissions.config'

function submissionColumnsFromFields(
  fields: Record<string, unknown>[],
  labels: {
    submissionColCreateTime: string
    submissionColHiddenSuffix: string
    studentBirth: string
    studentGender: string
    studentSchool: string
    studentName: string
  },
  opts: { appendStudentCols: boolean }
): SubmissionColumnMeta[] {
  const rows = [...fields]
    .filter((field) => String(field.type ?? '') !== 'association')
    .sort((a, b) => Number(a.sort ?? 0) - Number(b.sort ?? 0))

  const base: SubmissionColumnMeta[] = rows.map((item) => {
    const hid = Boolean(item.isHide)
    const label = `${String(item.label ?? '')}${hid ? labels.submissionColHiddenSuffix : ''}`
    const propsRaw = Array.isArray(item.properties) ? (item.properties as Record<string, unknown>[]) : []
    return {
      prop: String(item.id ?? ''),
      label,
      kind: String(item.type ?? ''),
      properties: propsRaw
    }
  })

  const studentLeading: SubmissionColumnMeta[] = opts.appendStudentCols
    ? [
        {
          prop: 'studentBirthDate',
          label: labels.studentBirth,
          kind: '__student__',
          properties: []
        },
        {
          prop: 'studentGender',
          label: labels.studentGender,
          kind: '__student__',
          properties: []
        },
        {
          prop: 'studentSchool',
          label: labels.studentSchool,
          kind: '__student__',
          properties: []
        },
        {
          prop: 'studentName',
          label: labels.studentName,
          kind: '__student__',
          properties: []
        }
      ]
    : []

  return [
    ...studentLeading,
    ...base,
    {
      prop: 'createTime',
      label: labels.submissionColCreateTime,
      kind: '__meta__',
      properties: []
    }
  ].filter((c) => c.prop)
}

function parseJsonMaybe(value: unknown): unknown {
  if (value == null || value === '') {
    return null
  }
  if (typeof value !== 'string') {
    return value
  }
  try {
    return JSON.parse(value)
  } catch {
    return value
  }
}

function propsOptions(meta: SubmissionColumnMeta): { id: number; label?: string; value?: unknown }[] {
  const out: { id: number; label?: string; value?: unknown }[] = []
  for (const p of meta.properties) {
    if (String(p.key ?? '') !== 'option') {
      continue
    }
    out.push({
      id: typeof p.id === 'number' ? p.id : Number(p.id),
      label: p.label !== undefined ? String(p.label) : undefined,
      value: p.value
    })
  }
  return out
}

function formatSubmissionStudentGender(raw: unknown, labelMale: string, labelFemale: string): string {
  if (raw === true || raw === 'true' || raw === 1 || raw === '1') {
    return labelMale
  }
  if (raw === false || raw === 'false' || raw === 0 || raw === '0') {
    return labelFemale
  }
  return raw == null || raw === '' ? '—' : String(raw)
}

function formatSubmissionCellValue(meta: SubmissionColumnMeta, rawValue: unknown, uploadIds?: number[]): unknown {
  const v = rawValue
  switch (meta.kind) {
    case '__student__':
      return v == null || v === '' ? '—' : `${v}`
    case 'input':
    case 'textarea':
      return v == null || `${v}` === '' ? '—' : `${v}`
    case 'radio': {
      const props = propsOptions(meta)
      const idNum = typeof v === 'number' ? v : Number(v)
      const hit = props.find((o) => o.id === idNum || String(o.id) === String(v)) ?? null
      if (hit?.value !== undefined && hit.value !== '') {
        return String(hit.value)
      }
      if (hit?.label) {
        return hit.label
      }
      return v == null || v === '' ? '—' : String(v)
    }
    case 'checkbox':
    case 'select': {
      const props = propsOptions(meta)
      const parsed = parseJsonMaybe(v)
      let ids: number[] = []
      if (Array.isArray(parsed)) {
        ids = parsed.map((x) => Number(x))
      } else if (typeof parsed === 'number') {
        ids = [parsed]
      }
      const arr: string[] = []
      props.forEach((o) => {
        if (ids.includes(Number(o.id))) {
          arr.push(
            meta.kind === 'checkbox'
              ? String(o.value ?? o.label ?? o.id)
              : String(o.label ?? o.value ?? o.id)
          )
        }
      })
      return arr.length ? arr.join(',') : '—'
    }
    case 'datetimepicker': {
      const parsed = parseJsonMaybe(v)
      if (Array.isArray(parsed) && parsed.length) {
        const first = parsed[0]
        return first == null || first === '' ? '—' : `${first}`
      }
      return v == null || v === '' ? '—' : String(v)
    }
    case 'upload': {
      if (uploadIds && uploadIds.length) {
        return { __upload__: true as const, ids: uploadIds }
      }
      return '—'
    }
    default:
      return v == null || v === '' ? '—' : `${v}`
  }
}

function collectUploadNumericIds(rawValue: unknown): number[] {
  const parsed = parseJsonMaybe(rawValue)
  if (Array.isArray(parsed)) {
    return parsed.map((x) => Number(x)).filter((n) => Number.isFinite(n))
  }
  if (typeof rawValue === 'string') {
    const m = rawValue.match(/\d+/gu)
    if (m?.length) {
      return m.map((s) => Number(s)).filter((n) => Number.isFinite(n))
    }
  }
  if (typeof rawValue === 'number' && Number.isFinite(rawValue)) {
    return [rawValue]
  }
  return []
}

type SubmissionApiRow = Record<string, unknown>

export function useQuestionnaireSubmissions() {
  const route = useRoute()
  const router = useRouter()
  const { t } = useUniI18n()
  const tr = t as Translate

  const subtitle = ref('')
  const metaLoading = ref(false)
  const exporting = ref(false)
  const fileDialogVisible = ref(false)
  const fileRows = ref<Array<{ id: string | number; originalName?: string }>>([])

  const questionnaireId = computed(() => String(route.params.id ?? '').trim())

  const columnMetas = ref<SubmissionColumnMeta[]>([])

  const { filters, handleLoadSuccess, tableRef } = useUniListState({
    initialFilters: {} as Record<string, unknown>
  })

  const columns = computed(() =>
    submissionTableCols(columnMetas.value, tr('activity.qSubmissionAttach'))
  )

  const hasUploadCols = computed(() => columnMetas.value.some((col) => col.kind === 'upload'))

  function lookupField(formFields: SubmissionAnswerField[], fieldId: string): unknown {
    return formFields.find((field) => String(field.templateFormFieldId ?? '') === fieldId)?.value
  }

  function composeSubmissionRow(apiRow: SubmissionApiRow): SubmissionRowMap {
    const formFields = (Array.isArray(apiRow.fields)
      ? (apiRow.fields as SubmissionAnswerField[])
      : []) as SubmissionAnswerField[]
    const mapped: SubmissionRowMap = { ...apiRow, fields: formFields }

    const attach: number[] = []
    for (const col of columnMetas.value) {
      if (col.kind !== 'upload') continue
      attach.push(...collectUploadNumericIds(lookupField(formFields, col.prop)))
    }

    mapped.__attachmentIds = Array.from(new Set(attach))

    for (const meta of columnMetas.value) {
      const key = submissionDisplayProp(meta.prop)

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
            ? formatSubmissionStudentGender(
                raw,
                tr('activity.submissionGenderMale'),
                tr('activity.submissionGenderFemale')
              )
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

      mapped[key] = String(formatSubmissionCellValue(meta, rawAns))
    }

    return mapped
  }

  async function bootstrap() {
    columnMetas.value = []
    subtitle.value = ''

    const qid = questionnaireId.value
    if (!qid || qid === 'new') {
      await router.replace({ name: 'ActivityQuestionnaireList' })
      return
    }

    metaLoading.value = true
    try {
      const dRaw = await activityQuestionnaireApi.detail.get(qid)
      const meta = normalizeEnvelope(dRaw) as SubmissionApiRow
      subtitle.value = `${tr('activity.questionnaireName')}: ${String(meta.name ?? '')}`

      const needStu =
        meta.needStudentInfo === true ||
        meta.needStudentInfo === 1 ||
        String(meta.needStudentInfo) === '1'

      const columnLabels = {
        submissionColCreateTime: tr('activity.submissionColCreateTime'),
        submissionColHiddenSuffix: tr('activity.submissionColHiddenSuffix'),
        studentBirth: tr('activity.submissionStudentBirth'),
        studentGender: tr('activity.submissionStudentGender'),
        studentSchool: tr('activity.submissionStudentSchool'),
        studentName: tr('activity.submissionStudentName')
      }

      const listRaw = await templateDynamicApi.listByOuterId.get({ outerId: qid, scene: Q_SCENE })
      const tplList = normalizeArray(listRaw) as SubmissionApiRow[]
      let tableFields: SubmissionApiRow[] = []

      if (tplList.length && Array.isArray(tplList[0]?.fields)) {
        tableFields = tplList[0].fields as SubmissionApiRow[]
      }

      columnMetas.value = submissionColumnsFromFields(tableFields, columnLabels, {
        appendStudentCols: needStu
      })
      await nextTick()
      tableRef.value?.refresh()
    } catch {
      columnMetas.value = []
      ElMessage.error(tr('activity.loadDetailFail'))
    } finally {
      metaLoading.value = false
    }
  }

  watch(questionnaireId, () => void bootstrap(), { immediate: true })

  const loadData: UniTableRequest = async ({ pageNo: current, pageSize: size }) => {
    const qid = questionnaireId.value

    if (!qid || !columnMetas.value.length) {
      return { data: [], total: 0 }
    }

    const raw = await templateDynamicApi.paginateIsaCommunity.post({
      current,
      size,
      scene: Q_SCENE,
      outerId: qid
    })

    const { list, total } = normalizePaged(raw)

    const data = (list as SubmissionApiRow[]).map((row) => composeSubmissionRow(row))

    return { data, total }
  }

  function goBack() {
    router.back()
  }

  async function exportAnswers() {
    const qid = questionnaireId.value
    if (!qid) {
      return
    }

    exporting.value = true

    try {
      const blob = await activityQuestionnaireApi.exportAnswersBlob.get(qid)
      downloadBlob(blob as Blob, `questionnaire-${qid}.xlsx`)
      ElMessage.success(tr('email.opOk'))
    } catch {
      ElMessage.error(tr('activity.exportQuestionnaireFail'))
    } finally {
      exporting.value = false
    }
  }

  async function openFiles(row: SubmissionRowMap) {
    const ids = row.__attachmentIds ?? []

    if (!ids.length) {
      return
    }

    try {
      const raw = await publicFileApi.infoByIds.get(ids.join(','))
      const arr = normalizeArray(raw) as SubmissionApiRow[]

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

      fileDialogVisible.value = true
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

  return {
    columns,
    exportAnswers,
    downloadOne,
    exporting,
    fileDialogVisible,
    fileRows,
    filters,
    goBack,
    handleLoadSuccess,
    hasUploadCols,
    loadData,
    metaLoading,
    openFiles,
    questionnaireId,
    subtitle,
    tableRef
  }
}
