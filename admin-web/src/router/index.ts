import { createRouter, createWebHistory } from 'vue-router'

import { menuApi } from '@/api'
import { useMenuStore, usePermissionCodeStore, useRouteAccessStore, useUserStore } from 'uni-ui-lib'

import { routes } from './routes'

/** 免登录路径 */
const pub = ['/login']

function shouldForceLoginOnMenuFetchFailure(error: unknown): boolean {
  if (typeof error !== 'object' || error === null) {
    return false
  }
  const ax = error as { response?: { status?: number; data?: unknown }; message?: string }
  if (typeof ax.response?.status === 'number' && ax.response.status === 401) {
    return true
  }
  const msg = typeof ax.message === 'string' ? ax.message : ''
  if (/invalid\s*token|token\s*invalid|登录已过期|未登录|unauthorized/i.test(msg)) {
    return true
  }
  const data = ax.response?.data
  if (data && typeof data === 'object' && !Array.isArray(data)) {
    const d = data as Record<string, unknown>
    const bodyMsg =
      (typeof d.msg === 'string' ? d.msg : '') || (typeof d.message === 'string' ? d.message : '')
    if (/invalid\s*token|token\s*invalid/i.test(bodyMsg)) {
      return true
    }
    const code = d.code
    const c = typeof code === 'number' ? code : typeof code === 'string' ? Number(code) : NaN
    if (c === 401) {
      return true
    }
  }
  return false
}

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior: () => ({ left: 0, top: 0 })
})

router.beforeEach(async (to) => {
  const userStore = useUserStore()
  const menuStore = useMenuStore()
  const routeAccessStore = useRouteAccessStore()
  const permissionCodeStore = usePermissionCodeStore()
  document.title = String(to.meta.title ?? '')

  if (pub.includes(to.path)) {
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
      const result = await menuApi.user.get(router.getRoutes())

      menuStore.setMenus(result?.menus)
      routeAccessStore.setAllowedPaths(result?.paths)

      if (Array.isArray(result?.permissions) && result.permissions.length) {
        const cached = permissionCodeStore.permissionCodes
        const merged = [
          ...new Set([...(Array.isArray(cached) ? cached : []), ...result.permissions])
        ]
        permissionCodeStore.setPermissionCodes(merged)
      }

      routeAccessStore.markAccessHydrated()
    } catch (error: unknown) {
      routeAccessStore.markAccessHydrated()

      if (shouldForceLoginOnMenuFetchFailure(error)) {
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
