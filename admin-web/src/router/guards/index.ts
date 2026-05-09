import type { Router } from 'vue-router'

import { fetchMenuPermissions } from '@/api/modules/menu'
import { usePermissionStore, useUserStore } from '@/stores'
import { useUniTagsViewStore } from 'uni-ui-lib'

const whiteList = ['/login']

const getRouteParamText = (value: string | string[] | undefined) => {
  if (Array.isArray(value)) {
    return value[0] ?? ''
  }

  return value ?? ''
}

export const setupRouterGuards = (router: Router) => {
  router.beforeEach(async (to) => {
    const userStore = useUserStore()
    const permissionStore = usePermissionStore()
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

    if (!permissionStore.dynamicRoutesLoaded) {
      try {
        const result = await fetchMenuPermissions(router.getRoutes())

        permissionStore.setMenus(result?.menus)
        permissionStore.setAllowedPaths(result?.paths)

        if (Array.isArray(result?.permissions) && result.permissions.length) {
          permissionStore.setPermissionCodes(result.permissions)
        }

        permissionStore.markDynamicRoutesLoaded()
      } catch (error: unknown) {
        permissionStore.markDynamicRoutesLoaded()

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

    if (!permissionStore.hasPermission(routePermissions) || !permissionStore.canAccessPath(accessPath as string | undefined)) {
      return '/403'
    }

    return true
  })

  router.afterEach((to) => {
    const tagsViewStore = useUniTagsViewStore()
    // 使用叶子路由 meta：父级 layout 常带 hidden，合并后 to.meta.hidden 会误判
    const leaf = to.matched[to.matched.length - 1]

    // hidden 控制菜单显示；带 activeMenu 的详情页仍需要生成 tag 并高亮父菜单。
    const shouldAddTag = !leaf.meta.hidden || Boolean(leaf.meta.activeMenu)

    if (shouldAddTag && leaf.name) {
      // 详情页 tag 需要带业务 id，避免多个详情页在标签栏中无法区分。
      const detailId = leaf.name === 'ProtocolDetail' ? getRouteParamText(to.params.id as string | string[] | undefined) : ''
      const titleKey = detailId ? undefined : (leaf.meta.titleKey as string | undefined)
      const title = detailId
        ? `${String(leaf.meta.title || leaf.name)}_${detailId}`
        : String(leaf.meta.title || leaf.name)

      tagsViewStore.addTag({
        path: to.fullPath,
        title,
        titleKey,
        affix: Boolean(leaf.meta.affix)
      })
    }
  })
}
