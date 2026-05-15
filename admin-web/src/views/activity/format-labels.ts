import type { UniOption } from 'uni-ui-lib'
import dayjs from 'dayjs'

type Tr = (k: string) => string

export const yesNoOptions = (t: Tr): UniOption[] => [
  { label: t('activity.yes'), value: '1' },
  { label: t('activity.no'), value: '0' }
]

export const labelForValue = (opts: UniOption[], v: unknown) => {
  const s = v == null || v === '' ? '' : String(v)
  return opts.find((o) => String(o.value) === s)?.label ?? '—'
}

export const fmtTs = (v: unknown, empty = '—') => {
  if (v == null || v === '') {
    return empty
  }
  const d = dayjs(String(v))
  return d.isValid() ? d.format('YYYY-MM-DD HH:mm') : String(v)
}
