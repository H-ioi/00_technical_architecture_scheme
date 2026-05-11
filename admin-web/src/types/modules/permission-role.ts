import type { PageQuery } from '@/types/api'

export type PermissionRoleListParams = Partial<PageQuery> & {
  roleName?: string
  roleCode?: string
  dpType?: number
}

export interface PermissionRoleRecord {
  roleId?: string | number
  roleName?: string
  roleCode?: string
  roleDesc?: string
  dpType?: number
  deptIds?: unknown[]
  dictItemMap?: Record<string, unknown>
  templateIds?: unknown[]
  createTime?: string
}
