import type { OptionValue, UniOption } from '@/types/shared'
import type { OptionSource, ToUniOptionsConfig } from '@/types/uni-options'

export type { OptionSource, ToUniOptionsConfig } from '@/types/uni-options'

const toOptionValue = (value: unknown): OptionValue =>
  typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean'
    ? value
    : String(value ?? '')

const getFirstText = <T extends OptionSource>(item: T, keys: Array<keyof T>) => {
  for (const key of keys) {
    const value = item[key]

    if (value !== undefined && value !== null && String(value) !== '') {
      return String(value)
    }
  }

  return ''
}

/**
 * Convert backend dictionary records into `UniOption[]`.
 *
 * Defaults match common admin dictionaries: `{ id, label/name/cnName/enName }`.
 */
export const toUniOptions = <T extends OptionSource>(
  items: T[] = [],
  config: ToUniOptionsConfig<T> = {}
): UniOption[] => {
  const valueKey = config.valueKey ?? ('id' as keyof T)
  const labelKeys = config.labelKeys ?? (['label', 'name', 'cnName', 'enName'] as Array<keyof T>)

  return items.map((item) => {
    const value = toOptionValue(item[valueKey])
    const label = getFirstText(item, labelKeys) || String(value)
    const type = config.typeKey ? item[config.typeKey] : undefined
    const color = config.colorKey ? item[config.colorKey] : undefined

    return {
      label,
      value,
      ...(typeof type === 'string' ? { type: type as UniOption['type'] } : {}),
      ...(typeof color === 'string' ? { color } : {})
    }
  })
}
