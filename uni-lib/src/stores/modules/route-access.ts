import { defineStore } from 'pinia'
import { ref } from 'vue'

import { storage } from '@/plugins/storage'

/**
 * 路由可访问性：服务端对齐后的允许 path 列表，以及是否已完成首轮菜单/权限拉取。
 * 与「权限码 / 按钮」无关，见 {@link usePermissionCodeStore}。
 */
export const useRouteAccessStore = defineStore('shellRouteAccess', () => {
  const allowedPaths = ref<string[]>(storage.get<string[]>('allowed-paths') ?? [])
  /** 已尝试拉取菜单权限（成功或失败都会置 true，避免死循环） */
  const accessHydrated = ref(false)

  const setAllowedPaths = (nextPaths?: string[]) => {
    allowedPaths.value = Array.isArray(nextPaths) ? nextPaths : []
    storage.set('allowed-paths', allowedPaths.value)
  }

  const canAccessPath = (path?: string) => {
    if (!path) {
      return true
    }

    return allowedPaths.value.includes(path)
  }

  const markAccessHydrated = () => {
    accessHydrated.value = true
  }

  const reset = () => {
    allowedPaths.value = []
    accessHydrated.value = false
    storage.remove('allowed-paths')
  }

  return {
    allowedPaths,
    accessHydrated,
    setAllowedPaths,
    canAccessPath,
    markAccessHydrated,
    reset
  }
})
