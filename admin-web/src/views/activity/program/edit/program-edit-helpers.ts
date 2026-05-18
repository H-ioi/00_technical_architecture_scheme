import type { UniOption } from 'uni-ui-lib'

import type { Translate } from '@/types/i18n'

export function isLotterySingleRoundRow(item: Record<string, unknown>): boolean {
  const raw =
    item.totalRounds != null
      ? item.totalRounds
      : item.total_rounds != null
        ? item.total_rounds
        : null
  if (raw === '' || raw === undefined || raw === null) {
    return false
  }
  const n = Number(raw)
  return Number.isFinite(n) && n === 1
}

/** 待开始可全量编辑；进行中仅单轮抽奖可限编辑；已结束不可编辑 */
export function canEditProgramRow(item: Record<string, unknown>): boolean {
  const ps = String(item.programStatus != null ? item.programStatus : '')
  const pt = String(item.programType != null ? item.programType : '')
  if (ps === '2') {
    return false
  }
  if (ps === '1' && pt !== '1') {
    return false
  }
  if (ps === '1' && pt === '1' && !isLotterySingleRoundRow(item)) {
    return false
  }
  return true
}

export function isPrizeCountOnlyEdit(item: Record<string, unknown>): boolean {
  return (
    String(item.programStatus != null ? item.programStatus : '') === '1' &&
    String(item.programType != null ? item.programType : '') === '1' &&
    isLotterySingleRoundRow(item)
  )
}

export function labelFromOptions(
  value: unknown,
  options: UniOption[],
  _locale: string
): string {
  const v = value == null ? '' : String(value)
  const hit = options.find((o) => String(o.value) === v)
  if (!hit) {
    return v || '—'
  }
  return String(hit.label ?? v)
}

export function programStatusOptionsForRow(t: Translate): UniOption[] {
  return [
    { label: t('activity.programStatusPending'), value: '0' },
    { label: t('activity.programStatusProgress'), value: '1' },
    { label: t('activity.programStatusEnded'), value: '2' }
  ]
}

export function programTypeOptionsForRow(t: Translate): UniOption[] {
  return [
    { label: t('activity.programTypeLottery'), value: '1' },
    { label: t('activity.programTypeCompetition'), value: '2' },
    { label: t('activity.programTypeBlessing'), value: '3' }
  ]
}
