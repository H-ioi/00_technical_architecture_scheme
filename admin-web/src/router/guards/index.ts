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

    if (!to.meta.hidden && to.name) {
      tagsViewStore.addTag({
        path: to.fullPath,
        title: String(to.meta.title || to.name),
        affix: Boolean(to.meta.affix)
      })
    }
  })
}
