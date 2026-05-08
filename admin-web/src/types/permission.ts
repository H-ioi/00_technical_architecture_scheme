import type { AppMenuRecord } from './route'

export interface MenuPermissionResult {
  menus: AppMenuRecord[]
  permissions: string[]
  paths: string[]
}
