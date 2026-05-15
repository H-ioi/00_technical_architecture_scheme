import type { DesignerField, DesignerOption, FieldProperties } from './types'

const EDITABLE_TYPES = new Set([
  'input',
  'textarea',
  'radio',
  'checkbox',
  'select',
  'datetimepicker'
])

type Loose = Record<string, unknown>

export function createFontId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `f_${crypto.randomUUID()}`
  }
  return `f_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}

export function newTemplateFieldId(): string {
  return `-${Math.random().toString(36).slice(2, 11)}`
}

export function deserializeTemplateFields(rows: Loose[]): DesignerField[] {
  const sorted = [...rows].sort((a, b) => Number(a.sort ?? 0) - Number(b.sort ?? 0))
  const out: DesignerField[] = []

  for (const item of sorted) {
    const type = String(item.type ?? '')
    if (!EDITABLE_TYPES.has(type)) {
      const row = { ...(item as Loose) }
      delete row.sort
      out.push({ kind: 'raw', fontId: createFontId(), backendRow: row })
      continue
    }

    const propArr = Array.isArray(item.properties) ? (item.properties as Loose[]) : []
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
      props.option_default =
        optionDefaultMarks.length !== 0 ? String(optionDefaultMarks[0]) : ''
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

    const regexHintFromProps =
      typeof props.regexHint === 'string' ? props.regexHint : undefined

    out.push({
      kind: 'known',
      fontId: createFontId(),
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
      regexHint:
        typeof item.regexHint === 'string'
          ? item.regexHint
          : regexHintFromProps ?? '',
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

function pushKv(arr: Loose[], key: string, value: unknown): void {
  if (value === undefined || value === null) {
    return
  }

  arr.push({ key, value })
}

export function serializeFieldForApi(f: DesignerField, sortIndex: number): Loose {
  if (f.kind === 'raw') {
    return { ...f.backendRow, sort: sortIndex }
  }

  const props: Loose[] = []
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
      pushKv(props, key, val)
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

export function serializeTemplateBundle(
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
