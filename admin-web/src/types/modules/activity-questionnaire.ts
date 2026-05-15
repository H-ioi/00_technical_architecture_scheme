import type { Ref } from 'vue'

// --- 答卷表格（列元数据、行形态）---

export type SubmissionColumnMeta = {
  prop: string
  label: string
  /** 题库字段原始 type */
  kind: string
  /** `/template/dynamic/form/get/:id` 里 `properties` 数组形态 */
  properties: Record<string, unknown>[]
}

export type SubmissionAnswerField = {
  templateFormFieldId?: string | number
  value?: unknown
}

export type SubmissionRowMap = Record<string, unknown> & {
  fields?: SubmissionAnswerField[]
  __attachmentIds?: number[]
}

// --- 问卷列表 composable（弹窗 ref）---

export type QuestionnaireListDialogRefs = {
  metaDlg: Ref<{ open: (mode: 'add' | 'edit', row?: Record<string, unknown>) => void | Promise<void> } | null>
  copyDlg: Ref<{ open: (row: Record<string, unknown>) => void | Promise<void> } | null>
  batchDlg: Ref<{ open: (kind: 'status' | 'frozen', ids: Array<string | number>) => void } | null>
}

// --- 问卷设计器字段（模板编解码 / builder）---

export type DesignerOption = {
  label: string
  id: number
  value?: string
  isHide?: number
}

export type FieldProperties = {
  placeholder?: string
  ciphertext?: boolean
  text_num_line?: number
  text_num_column?: number
  option?: DesignerOption[]
  option_default?: string | number | number[]
  option_multi?: boolean
  searchable?: boolean
  datetime_type?: string
  datetime_pattern?: string
  regexpattern?: string
  regexHint?: string
  format?: unknown
  [key: string]: unknown
}

export type DesignerFieldKnown = {
  kind: 'known'
  fontId: string
  id: string
  type: string
  label: string
  required: boolean
  readonly: boolean
  disabled: boolean
  isHide: boolean
  regex?: string
  regexHint?: string
  mark?: string
  datetimeTypeKey?: string
  properties: FieldProperties
  /** 问卷设计器 UniForm 插槽占位，不参与序列化 */
  _qbEditor?: string
}

export type DesignerFieldRaw = {
  kind: 'raw'
  fontId: string
  backendRow: Record<string, unknown>
}

export type DesignerField = DesignerFieldKnown | DesignerFieldRaw
