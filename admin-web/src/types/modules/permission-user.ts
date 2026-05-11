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

/** 用户新增/编辑弹窗（与 `permission/user/*` 表单一致） */
export interface PermissionUserFormModel {
  userId?: string | number
  username?: string
  nickname?: string
  password?: string
  email?: string
  phone?: string
  deptId?: string | number
  /** 提交给后端：角色 id 数组 */
  role: (string | number)[]
  lockFlag: string
}
