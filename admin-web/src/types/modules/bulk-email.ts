/** 群发邮件模块类型（对齐 `test/old-test` `api/isacommunity/mail.js` 入参；响应由页面层解包）。 */

export type MailGroupListParams = {
  current?: number
  size?: number
  keyword?: string
  status?: string | number
  includeParentMails?: string | number
  includeStudentMails?: string | number
  beginCreateDate?: string
  endCreateDate?: string
}

export type MailUserMailinfoListParams = {
  current?: number
  size?: number
  keyword?: string
  status?: string | number
}

export type MailSendRecordListParams = {
  current?: number
  size?: number
  keyword?: string
  /** 0 草稿 1 已发（与旧 `outgo/index.vue` 一致） */
  status?: number
  beginCreateDate?: string
  endCreateDate?: string
}

export type MailStudentSearchBody = {
  schoolName?: string
  admissionNo?: string
}
