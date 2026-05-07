import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import type { AppMenuRecord } from '@/types/route'
import { storage } from '@/utils/storage'

const PERMISSION_CODES_KEY = 'admin-web:permission-codes'

export const usePermissionStore = defineStore('permission', () => {
  const menus = ref<AppMenuRecord[]>([])
  const permissionCodes = ref<string[]>(storage.get<string[]>(PERMISSION_CODES_KEY) ?? [])
  const dynamicRoutesLoaded = ref(false)
  const permissionVersion = ref(0)

  const menuRoutes = computed(() => menus.value.filter((route) => !route.meta?.hidden))

  const setMenus = (nextMenus?: AppMenuRecord[]) => {
    menus.value = Array.isArray(nextMenus) ? nextMenus : []
  }

  const setPermissionCodes = (nextCodes?: string[]) => {
    permissionCodes.value = Array.isArray(nextCodes) ? nextCodes : []
    permissionVersion.value += 1
    storage.set(PERMISSION_CODES_KEY, permissionCodes.value)
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
    permissionVersion.value += 1
    storage.remove(PERMISSION_CODES_KEY)
  }

  return {
    menus,
    menuRoutes,
    permissionCodes,
    permissionVersion,
    dynamicRoutesLoaded,
    hasPermission,
    markDynamicRoutesLoaded,
    resetPermission,
    setMenus,
    setPermissionCodes
  }
})
