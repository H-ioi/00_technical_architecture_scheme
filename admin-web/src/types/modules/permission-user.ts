import type { PageQuery } from '@/types/api'

export type PermissionUserListParams = Partial<PageQuery> & {
  username?: string
  nickname?: string
  deptId?: string | number
}

export interface PermissionUserRoleItem {
  roleId?: string | number
  roleName?: string
}

export interface PermissionUserRecord {
  userId?: string | number
  username?: string
  nickname?: string
  email?: string
  phone?: string
  deptId?: string | number
  deptName?: string
  roleList?: PermissionUserRoleItem[]
  superiorUser?: { userId?: string | number }
  lockFlag?: string
  createTime?: string
}
