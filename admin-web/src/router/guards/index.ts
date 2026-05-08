import type { Router } from 'vue-router'

import { fetchMenuPermissions } from '@/api/modules/menu'
import { getLocalizedDocumentTitle, translateAppMessage } from '@/locales'
import { usePermissionStore, useTagsViewStore, useUserStore } from '@/stores'

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

    // hidden 控制菜单显示；带 activeMenu 的详情页仍需要生成 tag 并高亮父菜单。
    const shouldAddTag = !leaf.meta.hidden || Boolean(leaf.meta.activeMenu)

    if (shouldAddTag && leaf.name) {
      // 详情页 tag 需要带业务 id，避免多个详情页在标签栏中无法区分。
      const detailId = leaf.name === 'ProtocolDetail' ? getRouteParamText(to.params.id as string | string[] | undefined) : ''
      const titleKey = detailId ? undefined : (leaf.meta.titleKey as string | undefined)
      const title = detailId
        ? `${translateAppMessage(leaf.meta.titleKey as string | undefined, String(leaf.meta.title || leaf.name))}_${detailId}`
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
