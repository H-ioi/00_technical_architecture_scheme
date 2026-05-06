import type { AppRouteRecord } from './route'

export interface MenuPermissionResult {
  menus: AppRouteRecord[]
  permissions: string[]
}
