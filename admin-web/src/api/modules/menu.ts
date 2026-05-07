import type { MenuPermissionResult } from '@/types/permission'
import type { AppMenuRecord } from '@/types/route'
import { request } from '@/utils/request'

interface BackendMenuRecord {
  id?: string | number
  path?: string
  name?: string
  label?: string
  icon?: string
  permission?: string | string[]
  permissions?: string | string[]
  children?: BackendMenuRecord[]
}

const normalizePermission = (menu: BackendMenuRecord) => {
  const permission = menu.permission ?? menu.permissions

  return Array.isArray(permission) ? permission : permission ? [permission] : undefined
}

const normalizeMenus = (menus: BackendMenuRecord[] = []): AppMenuRecord[] =>
  menus
    .filter((menu) => menu.path)
    .map((menu) => ({
      path: String(menu.path),
      name: String(menu.name || menu.label || menu.id || menu.path),
      meta: {
        title: String(menu.label || menu.name || ''),
        icon: menu.icon,
        permission: normalizePermission(menu)
      },
      children: normalizeMenus(menu.children)
    }))

/** 查询菜单和权限码。 */
export const fetchMenuPermissions = async (): Promise<MenuPermissionResult> => {
  const menus = await request.get<BackendMenuRecord[], BackendMenuRecord[]>('/upms/menu/user')

  return {
    menus: normalizeMenus(menus),
    permissions: []
  }
}
