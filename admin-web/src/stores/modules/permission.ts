import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import type { AppRouteRecord } from '@/types/route'

export const usePermissionStore = defineStore('permission', () => {
  const menus = ref<AppRouteRecord[]>([])
  const permissionCodes = ref<string[]>([])
  const dynamicRoutesLoaded = ref(false)

  const menuRoutes = computed(() => menus.value.filter((route) => !route.meta.hidden))

  const setMenus = (nextMenus: AppRouteRecord[]) => {
    menus.value = nextMenus
  }

  const setPermissionCodes = (nextCodes: string[]) => {
    permissionCodes.value = nextCodes
  }

  const hasPermission = (permission?: string | string[]) => {
    if (!permission) {
      return true
    }

    const requiredPermissions = Array.isArray(permission) ? permission : [permission]

    return requiredPermissions.some((code) => permissionCodes.value.includes(code))
  }

  const markDynamicRoutesLoaded = () => {
    dynamicRoutesLoaded.value = true
  }

  const resetPermission = () => {
    menus.value = []
    permissionCodes.value = []
    dynamicRoutesLoaded.value = false
  }

  return {
    menus,
    menuRoutes,
    permissionCodes,
    dynamicRoutesLoaded,
    hasPermission,
    markDynamicRoutesLoaded,
    resetPermission,
    setMenus,
    setPermissionCodes
  }
})
