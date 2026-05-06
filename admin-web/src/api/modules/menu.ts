import type { MenuPermissionResult } from '@/types/permission'

export const fetchMenuPermissions = async (): Promise<MenuPermissionResult> => ({
  menus: [],
  permissions: ['dashboard:view', 'uni-lib:demo:view']
})
