import type { RouteRecordRaw } from 'vue-router'

export interface AppRouteMeta {
  title: string
  titleKey?: string
  icon?: string
  hidden?: boolean
  keepAlive?: boolean
  affix?: boolean
  permission?: string[]
  activeMenu?: string
}

export type AppRouteRecord = RouteRecordRaw & {
  meta: AppRouteMeta
  children?: AppRouteRecord[]
}

export interface AppMenuRecord {
  path: string
  name: string
  meta: AppRouteMeta
  children?: AppMenuRecord[]
}
