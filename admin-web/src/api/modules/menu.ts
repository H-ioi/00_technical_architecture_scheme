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
  '/isacommunity/base': '/base',
  '/isacommunity/base/school/index': '/base/school',
  '/isacommunity/base/school': '/base/school',
  '/isacommunity/base/grade/index': '/base/grade',
  '/isacommunity/base/grade': '/base/grade',
  '/isacommunity/protocol': '/protocol',
  '/isacommunity/protocol/index': '/protocol',
  '/isacommunity/schoolbus': '/school-bus',
  '/isacommunity/schoolbus/route': '/school-bus/route',
  '/isacommunity/schoolbus/route/plan/index': '/school-bus/route/plan',
  '/isacommunity/schoolbus/route/plan': '/school-bus/route/plan',
  '/isacommunity/schoolbus/route/operation/index': '/school-bus/route/operation',
  '/isacommunity/schoolbus/route/operation': '/school-bus/route/operation',
  '/isacommunity/schoolbus/route/exception/index': '/school-bus/route/exception',
  '/isacommunity/schoolbus/route/exception': '/school-bus/route/exception',
  '/isacommunity/schoolbus/student': '/school-bus/student',
  '/isacommunity/schoolbus/student/apply/index': '/school-bus/student/apply',
  '/isacommunity/schoolbus/student/apply': '/school-bus/student/apply',
  '/isacommunity/schoolbus/student/order/index': '/school-bus/student/order',
  '/isacommunity/schoolbus/student/order': '/school-bus/student/order',
  '/isacommunity/schoolbus/driver/index': '/school-bus/driver',
  '/isacommunity/schoolbus/driver': '/school-bus/driver',
  '/isacommunity/user/teacher/index': '/school-bus/follow-teacher',
  '/isacommunity/user/teacher': '/school-bus/follow-teacher',
  '/isacommunity/schoolbus/car/index': '/school-bus/car',
  '/isacommunity/schoolbus/car': '/school-bus/car',
  '/isacommunity/attendance': '/attendance',
  '/isacommunity/attendance/student/index': '/attendance/student',
  '/isacommunity/attendance/student': '/attendance/student',
  '/isacommunity/attendance/school/index': '/attendance/school',
  '/isacommunity/attendance/school': '/attendance/school',
  '/isacommunity/attendance/access/index': '/attendance/access',
  '/isacommunity/attendance/access': '/attendance/access',
  '/isacommunity/attendance/wechat/index': '/attendance/wechat',
  '/isacommunity/attendance/wechat': '/attendance/wechat',
  '/isacommunity/attendance/wechatnotice/index': '/attendance/wechat-notice',
  '/isacommunity/attendance/wechatnotice': '/attendance/wechat-notice',
  '/isacommunity/attendance/index': '/attendance/daily',
  '/isacommunity/attendance/holiday/index': '/attendance/holiday',
  '/isacommunity/attendance/holiday': '/attendance/holiday',
  '/isacommunity/attendance/holiday/flow': '/attendance/holiday/flow',
  '/isacommunity/attendance/holiday/task': '/attendance/holiday/task',
  '/isacommunity/attendance/holiday/config': '/attendance/holiday/config',
  '/isacommunity/attendance/holiday/pass': '/attendance/holiday/pass',
  '/admin': '/permission',
  '/admin/menu': '/permission/menu',
  '/admin/menu/index': '/permission/menu',
  '/admin/role': '/permission/role',
  '/admin/role/index': '/permission/role',
  '/admin/dept': '/permission/dept',
  '/admin/dept/index': '/permission/dept',
  '/admin/isauser': '/permission/user',
  '/admin/isauser/index': '/permission/user'
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
