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
