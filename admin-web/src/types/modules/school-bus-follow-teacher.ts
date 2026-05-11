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
  /** 模块 id 列表，与旧版 modal `modules` 一致（多选） */
  modules?: Array<string | number>
  /** 角色 id 列表，与旧版 modal `roles` 一致（多选） */
  roles?: Array<string | number>
  password?: string
  status?: string | number
}
