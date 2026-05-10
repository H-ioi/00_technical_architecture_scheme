import type { PageQuery } from '@/types/api'

/** 列表查询（对齐旧 `getTeacherPage`）。 */
export interface FollowTeacherListParams extends PageQuery {
  schoolIds?: string | number | Array<string | number>
  keyword?: string
}

export interface FollowTeacherRecord {
  id: string | number
  nickname?: string
  school?: string | number
  schoolLabel?: string
  department?: string
  email?: string
  phone?: string
  status?: string | number
  statusLabel?: string
  lastLoginTime?: string
  createTime?: string
  [key: string]: unknown
}

export interface FollowTeacherFormModel {
  id?: string | number
  school?: string | number
  nickname?: string
  department?: string
  email?: string
  phone?: string
  password?: string
  status?: string | number
}
