import type { Ref } from 'vue'

import type { ActivityProgramFormModel } from '@/types/modules/activity-program-form'
import type { ActivityProgramQuotaRow } from '@/types/modules/activity-program-form'

type Loose = Record<string, unknown>

export function fillQuotasFromDetail(
  quotasList: Ref<ActivityProgramQuotaRow[]>,
  q: unknown,
  totalRounds: number
) {
  const list: ActivityProgramQuotaRow[] = []
  if (Array.isArray(q) && q.length > 0) {
    for (const item of q) {
      const o = item as Loose
      list.push({
        roundNo: parseInt(String(o.roundNo), 10),
        quotaCount: parseInt(String(o.quotaCount), 10)
      })
    }
  } else if (totalRounds > 0) {
    for (let i = 0; i < totalRounds; i++) {
      list.push({ roundNo: i + 1, quotaCount: 1 })
    }
  }
  quotasList.value = list
}

/** 详情回填到编辑表单 */
export function applyProgramDetailToForm(
  form: ActivityProgramFormModel,
  quotasList: Ref<ActivityProgramQuotaRow[]>,
  serverStatus: Ref<string>,
  serverType: Ref<string>,
  serverTotalRounds: Ref<number | string>,
  d: Loose
) {
  const rule =
    d.rule && typeof d.rule === 'object' && !Array.isArray(d.rule) ? (d.rule as Loose) : {}
  const sortFromApi = d.sortOrder
  const sortFromRule = rule.sortOrder
  let soRaw = 0
  if (sortFromApi != null && sortFromApi !== '') {
    soRaw = Number(sortFromApi)
  } else if (sortFromRule != null && sortFromRule !== '') {
    soRaw = Number(sortFromRule)
  }
  const sortOrderVal = Number.isFinite(soRaw) ? soRaw : 0

  form.id = d.id as string | number | undefined
  form.activityId = d.activityId as string | number | undefined
  form.cnName = String(d.cnName ?? '')
  form.enName = String(d.enName ?? '')
  form.backgroundImage = String(d.backgroundImage ?? '')
  form.programType = d.programType != null ? String(d.programType) : ''
  form.sortOrder = sortOrderVal

  const trn = Number(d.totalRounds)
  const totalRounds = Number.isFinite(trn) ? trn : 0
  form.totalRounds = totalRounds

  serverStatus.value = d.programStatus != null ? String(d.programStatus) : ''
  serverType.value = form.programType
  serverTotalRounds.value = d.totalRounds ?? totalRounds

  switch (form.programType) {
    case '1': {
      form.createLotteryPool = String(rule.createLotteryPool ?? '0')
      form.lotteryIdentifierType = String(rule.lotteryIdentifierType ?? '0')
      form.lotteryParticipantScope = String(rule.lotteryParticipantScope ?? '0')
      form.needCheckin = String(rule.needCheckin ?? '0')
      form.needPayment = String(rule.needPayment ?? '0')
      form.prizeCount = parseInt(String(rule.prizeCount ?? 0), 10) || 0
      form.checkinEndOffsetMinutes = parseInt(String(rule.checkinEndOffsetMinutes ?? 0), 10) || 0
      form.checkinStartOffsetMinutes =
        parseInt(String(rule.checkinStartOffsetMinutes ?? 0), 10) || 0
      fillQuotasFromDetail(quotasList, d.quotas, totalRounds)
      break
    }
    case '2': {
      form.needVote = String(rule.needVote ?? '0')
      form.votePerAttemptCount = parseInt(String(rule.votePerAttemptCount ?? 0), 10) || 0
      form.voteStartTime = rule.voteStartTime != null ? String(rule.voteStartTime) : ''
      form.voteEndTime = rule.voteEndTime != null ? String(rule.voteEndTime) : ''
      form.prizeCount = parseInt(String(rule.prizeCount ?? 0), 10) || 0
      quotasList.value = []
      break
    }
    case '3': {
      form.blessingDisplayRule = String(rule.blessingDisplayRule ?? '1')
      quotasList.value = []
      break
    }
    default:
      quotasList.value = []
  }
}
