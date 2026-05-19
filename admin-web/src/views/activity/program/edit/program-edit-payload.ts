import type { ActivityProgramFormModel } from '@/types/modules/activity-program-form'
import type { ActivityProgramQuotaRow } from '@/types/modules/activity-program-form'
import type { Translate } from '@/types/i18n'

type Loose = Record<string, unknown>

/** 节目编辑页空表单 */
export function emptyProgramForm(): ActivityProgramFormModel {
  return {
    cnName: '',
    enName: '',
    activityId: undefined,
    backgroundImage: '',
    programType: '',
    sortOrder: 0,
    totalRounds: 0,
    createLotteryPool: '0',
    lotteryIdentifierType: '0',
    lotteryParticipantScope: '0',
    needCheckin: '0',
    needPayment: '0',
    prizeCount: 0,
    checkinEndOffsetMinutes: 0,
    checkinStartOffsetMinutes: 0,
    needVote: '0',
    votePerAttemptCount: 0,
    voteStartTime: '',
    voteEndTime: '',
    blessingDisplayRule: '1',
    programQuotasMarker: ''
  }
}

/** 新建抽奖节目时写入 rule 默认值 */
export function applyLotteryDefaults(f: ActivityProgramFormModel) {
  f.createLotteryPool = '0'
  f.lotteryIdentifierType = '0'
  f.lotteryParticipantScope = '0'
  f.needCheckin = '0'
  f.needPayment = '0'
}

export function findActivityRow(looseRows: Loose[], id: unknown): Loose | undefined {
  if (id == null || id === '') {
    return undefined
  }
  return looseRows.find((x) => String(x.id) === String(id))
}

export function validateProgramQuotas(
  quotas: ActivityProgramQuotaRow[],
  prizeCount: number,
  t: Translate
): string | null {
  if (!quotas.length) {
    return null
  }
  for (const item of quotas) {
    if (!item.quotaCount || item.quotaCount <= 0) {
      return t('activity.quotaMustPositive')
    }
  }
  let totalQuota = 0
  for (const item of quotas) {
    totalQuota += parseInt(String(item.quotaCount), 10) || 0
  }
  const pc = parseInt(String(prizeCount), 10) || 0
  if (pc > 0 && totalQuota > pc) {
    return t('activity.quotaExceedPrize')
  }
  return null
}

/** 组装节目保存 payload */
export function buildProgramSubmitPayload(
  m: ActivityProgramFormModel,
  quotas: ActivityProgramQuotaRow[]
): Record<string, unknown> {
  const data: Record<string, unknown> = {
    activityId: m.activityId,
    cnName: m.cnName,
    enName: m.enName,
    backgroundImage: m.backgroundImage,
    programType: m.programType,
    rule: {},
    sortOrder: m.sortOrder != null && m.sortOrder !== ('' as unknown as number) ? Number(m.sortOrder) : 0
  }

  switch (m.programType) {
    case '1':
      data.totalRounds = m.totalRounds
      data.rule = {
        createLotteryPool: m.createLotteryPool,
        lotteryIdentifierType: m.lotteryIdentifierType,
        lotteryParticipantScope: m.lotteryParticipantScope,
        needCheckin: m.needCheckin,
        needPayment: m.needPayment,
        prizeCount: m.prizeCount,
        checkinEndOffsetMinutes: m.checkinEndOffsetMinutes,
        checkinStartOffsetMinutes: m.checkinStartOffsetMinutes
      }
      data.quotas = quotas.map((item) => ({
        roundNo: item.roundNo,
        quotaCount: item.quotaCount
      }))
      break
    case '2':
      data.totalRounds = 1
      data.rule = {
        needVote: m.needVote,
        votePerAttemptCount: m.votePerAttemptCount,
        voteStartTime: m.voteStartTime,
        voteEndTime: m.voteEndTime,
        prizeCount: m.prizeCount
      }
      break
    case '3':
      data.totalRounds = 1
      data.rule = {
        blessingDisplayRule: m.blessingDisplayRule
      }
      break
    default:
      break
  }

  if (m.id != null && m.id !== '') {
    data.id = m.id
  }

  return data
}
