import type { Router } from 'vue-router'

import { fetchMenuPermissions } from '@/api/modules/menu'
import { getLocalizedDocumentTitle } from '@/locales'
import { usePermissionStore, useTagsViewStore, useUserStore } from '@/stores'

const whiteList = ['/login']

export const setupRouterGuards = (router: Router) => {
  router.beforeEach(async (to) => {
    const userStore = useUserStore()
    const permissionStore = usePermissionStore()
    document.title = getLocalizedDocumentTitle(
      to.meta.titleKey as string | undefined,
      String(to.meta.title ?? '')
    )

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
      const result = await fetchMenuPermissions()

      permissionStore.setMenus(result?.menus)

      if (Array.isArray(result?.permissions) && result.permissions.length) {
        permissionStore.setPermissionCodes(result.permissions)
      }

      permissionStore.markDynamicRoutesLoaded()
    }

    const routePermissions = to.meta.permission as string[] | undefined

    if (!permissionStore.hasPermission(routePermissions)) {
      return '/403'
    }

    return true
  })

  router.afterEach((to) => {
    const tagsViewStore = useTagsViewStore()
    // 使用叶子路由 meta：父级 layout 常带 hidden，合并后 to.meta.hidden 会误判
    const leaf = to.matched[to.matched.length - 1]

    const shouldAddTag = !leaf.meta.hidden || Boolean(leaf.meta.activeMenu)

    if (shouldAddTag && leaf.name) {
      tagsViewStore.addTag({
        path: to.fullPath,
        title: String(leaf.meta.title || leaf.name),
        titleKey: leaf.meta.titleKey as string | undefined,
        affix: Boolean(leaf.meta.affix)
      })
    }
  })
}
