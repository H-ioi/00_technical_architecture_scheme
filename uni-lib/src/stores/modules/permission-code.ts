import { defineStore } from 'pinia'
import { ref } from 'vue'

import { storage } from '@/plugins/storage'

/**
 * 权限码列表（按钮、路由 meta.permission 等），持久化到 storage。
 * 菜单树、允许访问 path 见 {@link useMenuStore}、{@link useRouteAccessStore}。
 */
export const usePermissionCodeStore = defineStore('permissionCode', () => {
  const permissionCodes = ref<string[]>(storage.get<string[]>('permission-codes') ?? [])
  /** 权限码变更时递增，供依赖方做细粒度刷新 */
  const permissionVersion = ref(0)

  const setPermissionCodes = (nextCodes?: string[]) => {
    permissionCodes.value = Array.isArray(nextCodes) ? nextCodes : []
    permissionVersion.value += 1
    storage.set('permission-codes', permissionCodes.value)
  }

  const hasPermission = (permission?: string | string[]) => {
    if (!permission) {
      return true
    }

    const requiredPermissions = Array.isArray(permission) ? permission : [permission]
    const codes = Array.isArray(permissionCodes.value) ? permissionCodes.value : []

    return requiredPermissions.some((code) => codes.includes(code))
  }

  const reset = () => {
    permissionCodes.value = []
    permissionVersion.value += 1
    storage.remove('permission-codes')
  }

  return {
    permissionCodes,
    permissionVersion,
    setPermissionCodes,
    hasPermission,
    reset
  }
})
