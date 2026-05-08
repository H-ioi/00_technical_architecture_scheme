import type { RouteRecordNormalized } from 'vue-router'

import type { MenuPermissionResult } from '@/types/permission'
import type { AppMenuRecord, AppRouteMeta } from '@/types/route'
import { request } from '@/utils/request'

interface BackendMenuRecord {
  path?: string
  url?: string
  name?: string
  label?: string
  title?: string
  icon?: string
  permission?: string | string[]
  permissions?: string | string[]
  authority?: string | string[]
  children?: BackendMenuRecord[]
}

const MENU_PATH_ALIASES: Record<string, string> = {
  '/isacommunity/home/index': '/dashboard',
  '/isacommunity/home': '/dashboard',
  '/isacommunity/member': '/member',
  '/isacommunity/member/student/index': '/member/student',
  '/isacommunity/member/student': '/member/student',
  '/isacommunity/member/teacher/index': '/member/teacher',
  '/isacommunity/member/teacher': '/member/teacher',
  '/isacommunity/protocol': '/protocol',
  '/isacommunity/protocol/index': '/protocol'
}

const normalizeBackendPath = (path?: string) => {
  if (!path) {
    return ''
  }

  const normalizedPath = path.replace(/\/index$/, '/index')

  return MENU_PATH_ALIASES[normalizedPath] ?? normalizedPath
}

const collectPermissions = (menu: BackendMenuRecord) =>
  [menu.permission, menu.permissions, menu.authority]
    .flatMap((value) => (Array.isArray(value) ? value : value ? [value] : []))
    .filter(Boolean)

const createRouteMap = (routes: RouteRecordNormalized[]) =>
  new Map(routes.map((route) => [route.path, route]))

const createMenuResult = (
  items: BackendMenuRecord[],
  routes: RouteRecordNormalized[]
): MenuPermissionResult => {
  const permissions = new Set<string>()
  const paths = new Set<string>()
  const routeMap = createRouteMap(routes)

  const createMenus = (menus: BackendMenuRecord[]): AppMenuRecord[] =>
    menus.flatMap((menu) => {
      collectPermissions(menu).forEach((code) => permissions.add(code))

      const children = createMenus(menu.children ?? [])
      const routePath = normalizeBackendPath(menu.path ?? menu.url)
      const route = routeMap.get(routePath)

      if (!route && children.length) {
        return children
      }

      if (!route || route.meta.hidden) {
        return []
      }

      paths.add(routePath)

      return {
        path: routePath,
        name: String(route.name ?? menu.name ?? routePath),
        meta: {
          ...(route.meta as AppRouteMeta),
          title: menu.label || menu.title || route.meta.title
        },
        ...(children.length ? { children } : {})
      }
    })

  const menus = createMenus(items)

  return {
    menus,
    paths: [...paths],
    permissions: [...permissions]
  }
}

// 旧菜单接口是权限源，本地路由只负责补充组件和前端 meta。
export const fetchMenuPermissions = async (
  routes: RouteRecordNormalized[]
): Promise<MenuPermissionResult> => {
  const menus = await request.get<BackendMenuRecord[], BackendMenuRecord[]>('/upms/menu/user')

  return createMenuResult(Array.isArray(menus) ? menus : [], routes)
}
