import type { RouteRecordNormalized } from 'vue-router'

import type { BackendMenuRecord } from '@/types/modules/menu'
import type { MenuPermissionResult } from '@/types/permission'
import type { AppMenuRecord, AppRouteMeta } from '@/types/route'
import { request } from 'uni-ui-lib'

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

const normPath = (path?: string) => {
  if (!path) {
    return ''
  }

  const normalizedPath = path.replace(/\/index$/, '/index')

  return MENU_PATH_ALIASES[normalizedPath] ?? normalizedPath
}

/** 接口可能直接返回数组，或未解包仍带 { data }；防止 allowedPaths 为空导致误跳 403 */
const parseTree = (raw: unknown): BackendMenuRecord[] => {
  if (Array.isArray(raw)) {
    return raw
  }
  if (raw && typeof raw === 'object' && 'data' in raw) {
    const inner = (raw as { data: unknown }).data
    if (Array.isArray(inner)) {
      return inner as BackendMenuRecord[]
    }
  }
  return []
}

const collectPermissions = (menu: BackendMenuRecord) =>
  [menu.permission, menu.permissions, menu.authority]
    .flatMap((value) => (Array.isArray(value) ? value : value ? [value] : []))
    .filter(Boolean)

const routeIdx = (routes: RouteRecordNormalized[]) =>
  new Map(routes.map((route) => [route.path, route]))

const buildMenus = (
  items: BackendMenuRecord[],
  routes: RouteRecordNormalized[]
): MenuPermissionResult => {
  const permissions = new Set<string>()
  const paths = new Set<string>()
  const routeMap = routeIdx(routes)

  const mapMenus = (menus: BackendMenuRecord[]): AppMenuRecord[] =>
    menus.flatMap((menu) => {
      collectPermissions(menu).forEach((code) => permissions.add(code))

      const children = mapMenus(menu.children ?? [])
      const routePath = normPath(menu.path ?? menu.url)
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

  const menus = mapMenus(items)

  return {
    menus,
    paths: [...paths],
    permissions: [...permissions]
  }
}

export default {
  user: {
    url: '/upms/menu/user',
    name: '用户菜单',
    get: async function (this: { url: string }, routes: RouteRecordNormalized[]): Promise<MenuPermissionResult> {
      const raw = await request.get<unknown>(this.url)

      return buildMenus(parseTree(raw), routes)
    }
  }
}
