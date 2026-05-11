import type { PageQuery } from '@/types/api'

/** 分页查询（对齐旧页 `getWechatOpenidPage`）。 */
export interface AttendanceWechatOpenidListParams extends PageQuery {
  schoolIds?: string | number
  admissionNo?: string
  nickname?: string
  openId?: string
  /** 状态（旧 `wechatOpenidType`，`0` 使用中 `1` 归档） */
  status?: string
  beginDate?: string
  endDate?: string
}

export interface AttendanceWechatOpenidRecord {
  id: string | number
  schoolName?: string
  admissionNo?: string
  nickname?: string
  status?: string
  encryptedOpenId?: string
  updateTime?: string
  createTime?: string
  [key: string]: unknown
}
