import type { UniOption } from 'uni-ui-lib'
import { toUniOptions } from 'uni-ui-lib'

import type { ProtocolDictItem, ProtocolRecord } from '@/types/modules/protocol'

const labelKeysForLocale = (locale: string): Array<keyof ProtocolDictItem> =>
  locale === 'en' ? ['enName', 'name', 'cnName'] : ['name', 'cnName', 'enName']

/**
 * 协议字典转下拉/表格映射选项。
 * 若列表行上的 protocolType、module 与字典 id 不一致（例如存的是 code），
 * 可为字典项配置 `code`，会额外生成一条同文案、值为 code 的选项。
 */
export const buildProtocolDictOptions = (
  items: ProtocolDictItem[] | undefined,
  locale: string
): UniOption[] => {
  const list = items ?? []
  const labelKeys = labelKeysForLocale(locale)
  const result: UniOption[] = []

  for (const item of list) {
    const row = toUniOptions([item], { labelKeys, valueKey: 'id' })
    const base = row[0]

    if (!base) {
      continue
    }

    result.push(base)

    const code = item.code

    if (code != null && String(code) !== String(base.value)) {
      result.push({ ...base, value: code })
    }
  }

  return result
}

const numberishEqual = (a: unknown, b: unknown): boolean => {
  if (a === b) {
    return true
  }

  if (String(a) === String(b)) {
    return true
  }

  const na = Number(a)
  const nb = Number(b)

  return Number.isFinite(na) && Number.isFinite(nb) && na === nb
}

type NameFields = {
  zh: keyof ProtocolRecord
  en: keyof ProtocolRecord
}

/** 用字典选项解析单元格展示文案（表格列 formatter） */
export const resolveProtocolDictCellLabel = (
  row: Record<string, unknown>,
  value: unknown,
  options: UniOption[],
  locale: string,
  nameFields: NameFields
): string => {
  const r = row as ProtocolRecord
  const fromApi = locale === 'en' ? r[nameFields.en] : r[nameFields.zh]

  if (fromApi != null && String(fromApi).trim() !== '') {
    return String(fromApi)
  }

  const hit = options.find((item) => numberishEqual(item.value, value))

  if (hit?.label) {
    return hit.label
  }

  if (value === undefined || value === null || value === '') {
    return '--'
  }

  return String(value)
}
