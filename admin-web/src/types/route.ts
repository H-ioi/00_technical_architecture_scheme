import type { RouteRecordRaw } from 'vue-router'

/** 应用路由 meta（与侧栏、权限守卫约定一致） */
export interface AppRouteMeta {
  title: string
  titleKey?: string
  icon?: string
  hidden?: boolean
  keepAlive?: boolean
  affix?: boolean
  permission?: string[]
  activeMenu?: string
  /** 标签栏展示时附加的动态路由参数名（如 `id`），与路径里 `:id` 对应 */
  tagDetailParam?: string
}

export type AppRouteRecord = RouteRecordRaw & {
  meta: AppRouteMeta
  children?: AppRouteRecord[]
}

/** 与服务端菜单对齐后的侧栏树（由 `fetchMenuPermissions` 等写入 permission store） */
export interface AppMenuRecord {
  path: string
  name: string
  meta: AppRouteMeta
  children?: AppMenuRecord[]
}
