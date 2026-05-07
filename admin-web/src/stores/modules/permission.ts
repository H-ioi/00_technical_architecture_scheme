import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import type { AppMenuRecord } from '@/types/route'

export const usePermissionStore = defineStore('permission', () => {
  const menus = ref<AppMenuRecord[]>([])
  const permissionCodes = ref<string[]>([])
  const dynamicRoutesLoaded = ref(false)

  const menuRoutes = computed(() => menus.value.filter((route) => !route.meta?.hidden))

  const setMenus = (nextMenus?: AppMenuRecord[]) => {
    menus.value = Array.isArray(nextMenus) ? nextMenus : []
  }

  const setPermissionCodes = (nextCodes?: string[]) => {
    permissionCodes.value = Array.isArray(nextCodes) ? nextCodes : []
  }

  const hasPermission = (permission?: string | string[]) => {
    if (!permission) {
      return true
    }

    const requiredPermissions = Array.isArray(permission) ? permission : [permission]

    const codes = Array.isArray(permissionCodes.value) ? permissionCodes.value : []

    return requiredPermissions.some((code) => codes.includes(code))
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
