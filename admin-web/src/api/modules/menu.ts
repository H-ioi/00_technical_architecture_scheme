import type { AppRouteRecord } from '@/types/route'

export interface MenuPermissionResult {
  menus: AppRouteRecord[]
  permissions: string[]
}

export const fetchMenuPermissions = async (): Promise<MenuPermissionResult> => ({
  menus: [],
  permissions: ['dashboard:view', 'uni-lib:demo:view', 'system:user:view', 'system:user:create']
})
