/** 活动项目编辑表单（前端态，提交前再组装 rule / quotas）。 */
export interface ActivityProgramFormModel {
  id?: string | number
  cnName: string
  enName: string
  activityId: string | number | undefined
  backgroundImage: string
  programType: string
  sortOrder: number
  /** 抽奖 programType=1 */
  totalRounds: number
  createLotteryPool: string
  lotteryIdentifierType: string
  lotteryParticipantScope: string
  needCheckin: string
  needPayment: string
  prizeCount: number
  checkinEndOffsetMinutes: number
  checkinStartOffsetMinutes: number
  /** 比赛 programType=2 */
  needVote: string
  votePerAttemptCount: number
  voteStartTime: string
  voteEndTime: string
  /** 祝福 programType=3 */
  blessingDisplayRule: string
  /** 占位字段，仅用于 UniForm 插槽挂载「每轮配额」 */
  programQuotasMarker: string
}

export interface ActivityProgramQuotaRow {
  roundNo: number
  quotaCount: number
}
