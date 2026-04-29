import type { Router } from 'vue-router'

import { fetchMenuPermissions } from '@/api/modules/menu'
import { usePermissionStore, useTagsViewStore, useUserStore } from '@/stores'
import { getAppTitle } from '@/utils'

const whiteList = ['/login']

export const setupRouterGuards = (router: Router) => {
  router.beforeEach(async (to) => {
    const userStore = useUserStore()
    const permissionStore = usePermissionStore()

    document.title = `${to.meta.title ? `${String(to.meta.title)} - ` : ''}${getAppTitle()}`

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
      const { menus, permissions } = await fetchMenuPermissions()

      permissionStore.setMenus(menus)
      permissionStore.setPermissionCodes(permissions)
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

    if (!leaf.meta.hidden && leaf.name) {
      tagsViewStore.addTag({
        path: to.fullPath,
        title: String(leaf.meta.title || leaf.name),
        affix: Boolean(leaf.meta.affix)
      })
    }
  })
}
