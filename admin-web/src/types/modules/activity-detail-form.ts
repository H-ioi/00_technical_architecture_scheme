/** 活动详情 / 编辑表单模型（与 POST /add、/edit 字段对齐）。 */
export interface ActivityDetailFormModel {
  id?: string | number
  publisher?: string
  activityCnName: string
  activityEnName: string
  introCn?: string
  introEn?: string
  imageUrl?: string
  addressCn?: string
  addressEn?: string
  tipsCn?: string
  tipsEn?: string
  /** 内部绑定：拆成 activityStartTime / activityEndTime 提交 */
  activityTime: string[] | [string, string]
  registrationTime: string[] | [string, string]
  schoolIds: Array<string | number>
  checkinMethod: string
  ticketPrice?: number | string
  recommended: string
  banner: string
  needFeedback: string
  wechatNotify?: string
  registrationUnlimited: boolean
  registrationLimit?: number
  visibleScope: number
  visibleScopeFileName?: string
  emailConfigIds: Array<string | number>
  ticketNotifyEmailEnabled?: string
  ticketNotifyEmails?: unknown
  ticketNotifyEmailsLabel?: string
  wechatPushSchoolIds: Array<string | number>
  wechatPushContent?: string
  wechatPushRemark?: string
  activityStatus?: string
  detailCn?: string
  detailEn?: string
  visibleScopeFile?: Record<string, unknown> | null
  /** 详情回显，提交时不写入 payload（见 buildPayload 解构）。 */
  magicNo?: string
}
