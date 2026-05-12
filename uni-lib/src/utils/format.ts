import type { UniOption } from '@/types/shared'
import type { UniTableColumn } from '@/types/uni-table'
import type { UniTranslate } from '@/types/i18n'
import { uniLibTranslate } from '@/locales/create-i18n'

export const isEmptyValue = (value: unknown) =>
  value === undefined || value === null || value === ''

export const isBlankValue = (value: unknown) =>
  isEmptyValue(value) ||
  (typeof value === 'string' && value.trim() === '') ||
  (Array.isArray(value) && value.length === 0)

export const omitBlankValues = (model: Record<string, unknown>) =>
  Object.entries(model).reduce<Record<string, unknown>>((result, [key, value]) => {
    if (isBlankValue(value)) {
      return result
    }

    result[key] = typeof value === 'string' ? value.trim() : value
    return result
  }, {})

export const formatEmpty = (value: unknown, emptyText = '--') =>
  isEmptyValue(value) ? emptyText : String(value)

/** `schoolIds` → `school_ids` */
export const propToSnakeCase = (prop: string): string =>
  prop.replace(/([a-z0-9])([A-Z])/g, '$1_$2').toLowerCase()

/** 优先 camelCase，再 snake_case，再 `schoolIds`→`schoolId` 等常见别名 */
export const resolveRowCellValue = (row: Record<string, unknown>, prop: string): unknown => {
  const snakeKey = propToSnakeCase(prop)
  const singularKey = prop.length > 3 && prop.endsWith('Ids') ? `${prop.slice(0, -3)}Id` : undefined

  const keys = [
    prop,
    ...(snakeKey !== prop ? [snakeKey] : []),
    ...(singularKey && singularKey !== prop ? [singularKey] : [])
  ]

  for (const key of keys) {
    const val = row[key]
    if (!isBlankValue(val)) {
      return val
    }
  }

  return undefined
}

const normalizeLookupArrayItems = (items: unknown[]): unknown[] =>
  items.map((item) => (typeof item === 'string' ? item.trim() : item))

/** JSON 数组字符串或已为数组时规范化 */
export const normalizeLookupRawValue = (value: unknown): unknown => {
  if (Array.isArray(value)) {
    return normalizeLookupArrayItems(value)
  }

  if (typeof value !== 'string') {
    return value
  }

  const trimmed = value.trim()

  if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    try {
      const parsed = JSON.parse(trimmed) as unknown

      if (Array.isArray(parsed)) {
        return normalizeLookupArrayItems(parsed)
      }
    } catch {
      /* ignore */
    }
  }

  return value
}

export const formatDate = (
  value: unknown,
  format = 'YYYY-MM-DD HH:mm:ss',
  emptyText = '--',
  inputFormat?: 'timestamp' | 'iso' | 'string'
) => {
  if (isEmptyValue(value)) {
    return emptyText
  }

  const timestampValue = Number(value)
  const date =
    inputFormat === 'timestamp' && !Number.isNaN(timestampValue)
      ? new Date(
          Math.abs(timestampValue) < 1_000_000_000_000 ? timestampValue * 1000 : timestampValue
        )
      : typeof value === 'number'
        ? new Date(value)
        : new Date(String(value))

  if (Number.isNaN(date.getTime())) {
    return String(value)
  }

  const pad = (nextValue: number) => String(nextValue).padStart(2, '0')
  const tokens: Record<string, string> = {
    YYYY: String(date.getFullYear()),
    MM: pad(date.getMonth() + 1),
    DD: pad(date.getDate()),
    HH: pad(date.getHours()),
    mm: pad(date.getMinutes()),
    ss: pad(date.getSeconds())
  }

  return Object.entries(tokens).reduce(
    (result, [token, tokenValue]) => result.replace(token, tokenValue),
    format
  )
}

export const formatMoney = (value: unknown, emptyText = '--') => {
  if (isEmptyValue(value)) {
    return emptyText
  }

  const numberValue = Number(value)

  if (Number.isNaN(numberValue)) {
    return String(value)
  }

  return numberValue.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

/** 列上是否具备可用于映射的选项源（仅用列 `options` / `valueEnum`） */
export const hasLookupOptionSource = (column: UniTableColumn) =>
  Boolean(column.options?.length || (column.valueEnum && Object.keys(column.valueEnum).length > 0))

export const optionValuesLooselyEqual = (optionValue: unknown, cellValue: unknown): boolean => {
  if (optionValue === cellValue) {
    return true
  }

  const left = typeof cellValue === 'string' ? cellValue.trim() : cellValue
  const right = typeof optionValue === 'string' ? optionValue.trim() : optionValue

  if (left === right) {
    return true
  }

  const sl = String(left)
  const sr = String(right)

  if (sl === sr) {
    return true
  }

  const nl = Number(sl)
  const nr = Number(sr)

  if (sl !== '' && sr !== '' && Number.isFinite(nl) && Number.isFinite(nr) && nl === nr) {
    return true
  }

  return false
}

export const resolveOption = (value: unknown, column?: UniTableColumn) => {
  const key = String(typeof value === 'string' ? value.trim() : value)
  /** `[]` 对 `??` 为 truthy，视为未配置 options */
  const options = column?.options && column.options.length > 0 ? column.options : undefined

  if (options?.length) {
    return options.find((item) => optionValuesLooselyEqual(item.value, value))
  }

  const enumValue = column?.valueEnum?.[key]

  if (typeof enumValue === 'string') {
    return { label: enumValue, value: key }
  }

  return enumValue
}

export const toArray = (value: unknown): unknown[] => {
  if (Array.isArray(value)) {
    return value
  }

  if (isEmptyValue(value)) {
    return []
  }

  return [value]
}

const unwrapLookupItemValue = (raw: unknown): unknown => {
  if (raw === null || raw === undefined) {
    return raw
  }

  if (typeof raw !== 'object' || Array.isArray(raw)) {
    return raw
  }

  const o = raw as Record<string, unknown>
  const candidate = o.id ?? o.value ?? o.schoolId ?? o.campusId ?? o.code

  return candidate !== undefined && candidate !== null ? candidate : raw
}

/** `text`/`number`/`array`（有 lookup 数据源时）：id / 数组 / 逗号串 → label */
export const formatLookupCell = (value: unknown, column: UniTableColumn): string | undefined => {
  if (column.lookup === false || !hasLookupOptionSource(column)) {
    return undefined
  }

  if (isBlankValue(value)) {
    return formatEmpty(value)
  }

  const normalized = normalizeLookupRawValue(value)

  if (isBlankValue(normalized)) {
    return formatEmpty(normalized)
  }

  const separator = typeof column.lookup === 'object' ? (column.lookup.separator ?? '、') : '、'

  let items = toArray(normalized)

  const lookupCfg = typeof column.lookup === 'object' ? column.lookup : undefined

  if (lookupCfg?.splitValues && items.length === 1 && typeof items[0] === 'string') {
    const delimiter =
      lookupCfg.splitValues === true
        ? /[,，]/
        : lookupCfg.splitValues instanceof RegExp
          ? lookupCfg.splitValues
          : /[,，]/

    items = items[0]
      .split(delimiter)
      .map((item) => item.trim())
      .filter(Boolean)
  } else if (
    (column.lookup === undefined || typeof column.lookup === 'object') &&
    items.length === 1 &&
    typeof items[0] === 'string'
  ) {
    const raw = items[0]
    if (/[,，]/.test(raw) && !resolveOption(raw, column)?.label) {
      const parts = raw
        .split(/[,，]/)
        .map((item) => item.trim())
        .filter(Boolean)

      if (parts.length > 1 && parts.every((part) => Boolean(resolveOption(part, column)?.label))) {
        items = parts
      }
    }
  }

  const labels: string[] = []

  for (const rawItem of items) {
    const item = typeof rawItem === 'string' ? rawItem.trim() : unwrapLookupItemValue(rawItem)

    if (typeof item === 'object' && item !== null && !Array.isArray(item)) {
      continue
    }

    if (item === '' || item === undefined || item === null) {
      continue
    }

    const resolved = resolveOption(item, column)
    const label = resolved?.label

    if (label !== undefined && label !== '') {
      labels.push(String(label))
    }
  }

  if (labels.length > 0) {
    return labels.join(separator)
  }

  return undefined
}

export const formatRelativeTime = (
  value: unknown,
  emptyText = '--',
  t: UniTranslate = uniLibTranslate
) => {
  if (isEmptyValue(value)) {
    return emptyText
  }

  const date = new Date(String(value))

  if (Number.isNaN(date.getTime())) {
    return String(value)
  }

  const diffSeconds = Math.floor((Date.now() - date.getTime()) / 1000)
  const absSeconds = Math.abs(diffSeconds)
  const suffix = t(diffSeconds >= 0 ? 'relativeTime.ago' : 'relativeTime.later')

  if (absSeconds < 60) {
    return t('relativeTime.justNow')
  }

  if (absSeconds < 3600) {
    return t('relativeTime.minutes', {
      value: Math.floor(absSeconds / 60),
      suffix
    })
  }

  if (absSeconds < 86400) {
    return t('relativeTime.hours', {
      value: Math.floor(absSeconds / 3600),
      suffix
    })
  }

  return t('relativeTime.days', {
    value: Math.floor(absSeconds / 86400),
    suffix
  })
}

export const formatPercent = (value: unknown, column?: UniTableColumn, emptyText = '--') => {
  if (isEmptyValue(value)) {
    return emptyText
  }

  const numberValue = Number(value)

  if (Number.isNaN(numberValue)) {
    return String(value)
  }

  const scale = column?.percent?.scale ?? 100
  const suffix = column?.percent?.suffix ?? '%'
  const result = numberValue * scale

  return typeof column?.percent?.digits === 'number'
    ? `${result.toFixed(column.percent.digits)}${suffix}`
    : `${result}${suffix}`
}

export const formatTableCellText = (
  row: Record<string, unknown>,
  column: UniTableColumn,
  value: unknown,
  index: number,
  t: UniTranslate = uniLibTranslate
) => {
  if (column.formatter) {
    return column.formatter(row, column, value, index)
  }

  const columnType = column.type ?? 'text'

  if (columnType === 'text' || columnType === 'number') {
    const mapped = formatLookupCell(value, column)

    if (mapped !== undefined) {
      return mapped
    }
  }

  if (columnType === 'date' || columnType === 'datetime' || columnType === 'time') {
    return formatDate(
      value,
      column.date?.format ??
        (columnType === 'date'
          ? 'YYYY-MM-DD'
          : columnType === 'time'
            ? 'HH:mm:ss'
            : 'YYYY-MM-DD HH:mm:ss'),
      column.date?.placeholder,
      column.date?.inputFormat
    )
  }

  if (columnType === 'relativeTime') {
    return formatRelativeTime(value, column.date?.placeholder, t)
  }

  if (columnType === 'money') {
    return formatMoney(value)
  }

  if (columnType === 'percent') {
    return formatPercent(value, column)
  }

  if (columnType === 'boolean') {
    return value ? t('common.yes') : t('common.no')
  }

  if (columnType === 'enum' || columnType === 'tag') {
    return resolveOption(value, column)?.label ?? formatEmpty(value)
  }

  if (columnType === 'array') {
    if (column.lookup !== false && hasLookupOptionSource(column)) {
      const mapped = formatLookupCell(value, column)

      if (mapped !== undefined) {
        return mapped
      }
    }

    const key = column.array?.itemLabel

    return toArray(value)
      .map((item) => {
        if (key && typeof item === 'object' && item) {
          return formatEmpty((item as Record<string, unknown>)[key])
        }

        return formatEmpty(item)
      })
      .join(column.array?.separator ?? '、')
  }

  if (columnType === 'json') {
    return value === undefined || value === null ? '--' : JSON.stringify(value)
  }

  return formatEmpty(value)
}
