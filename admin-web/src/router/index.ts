import { createRouter, createWebHistory } from 'vue-router'

import { fetchMenuPermissions } from '@/api/modules/menu'
import {
  useMenuStore,
  usePermissionCodeStore,
  useRouteAccessStore,
  useUserStore
} from 'uni-ui-lib'

import { constantRoutes } from './modules/constant'

// 白名单
const whiteList = ['/login']

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: constantRoutes,
  scrollBehavior: () => ({ left: 0, top: 0 })
})

router.beforeEach(async (to) => {
  const userStore = useUserStore()
  const menuStore = useMenuStore()
  const routeAccessStore = useRouteAccessStore()
  const permissionCodeStore = usePermissionCodeStore()
  document.title = String(to.meta.title ?? '')

  if (whiteList.includes(to.path)) {
    return userStore.isLoggedIn ? '/' : true
  }

  if (!userStore.isLoggedIn) {
    return {
      path: '/login',
      query: {
        redirect: to.fullPath
      }
    }
  }

  if (!routeAccessStore.accessHydrated) {
    try {
      const result = await fetchMenuPermissions(router.getRoutes())

      menuStore.setMenus(result?.menus)
      routeAccessStore.setAllowedPaths(result?.paths)

      if (Array.isArray(result?.permissions) && result.permissions.length) {
        permissionCodeStore.setPermissionCodes(result.permissions)
      }

      routeAccessStore.markAccessHydrated()
    } catch (error: unknown) {
      routeAccessStore.markAccessHydrated()

      const status =
        typeof error === 'object' &&
        error !== null &&
        'response' in error &&
        typeof (error as { response?: { status?: unknown } }).response?.status === 'number'
          ? (error as { response: { status: number } }).response.status
          : undefined

      if (status === 401) {
        userStore.resetAuth()

        return {
          path: '/login',
          query: { redirect: to.fullPath }
        }
      }

      console.error('[router] fetchMenuPermissions failed', error)

      return '/403'
    }
  }

  const routePermissions = to.meta.permission as string[] | undefined
  const leaf = to.matched[to.matched.length - 1]
  const accessPath = leaf.meta.activeMenu || (leaf.meta.hidden ? undefined : to.path)

  if (
    !permissionCodeStore.hasPermission(routePermissions) ||
    !routeAccessStore.canAccessPath(accessPath as string | undefined)
  ) {
    return '/403'
  }

  return true
})