import type { PageQuery } from '@/types/api'

/** 分页查询（对齐旧页 `getWechatNoticePage`）。 */
export interface AttendanceWechatNoticeListParams extends PageQuery {
  schoolId?: string | number
  admissionNo?: string
  personName?: string
  openId?: string
  /** 发送状态：旧页 `0` 成功、`1` 失败 */
  sendStatus?: number | string
  beginDate?: string
  endDate?: string
}

export interface AttendanceWechatNoticeRecord {
  id: string | number
  schoolId?: string | number
  schoolName?: string
  admissionNo?: string
  personName?: string
  sendStatus?: string
  sendOpenId?: string
  result?: string
  updateTime?: string
  createTime?: string
  [key: string]: unknown
}
