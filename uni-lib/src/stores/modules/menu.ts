import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import type { UniLayoutMenuRecord } from '@/types/uni-layout'

/** 侧栏菜单树（与后端菜单对齐后的结构，不含路由守卫里的路径白名单 / 权限码）。 */
export const useMenuStore = defineStore('shellMenu', () => {
  const menus = ref<UniLayoutMenuRecord[]>([])

  const menuRoutes = computed(() => menus.value.filter((route) => !route.meta?.hidden))

  const setMenus = (nextMenus?: UniLayoutMenuRecord[]) => {
    menus.value = Array.isArray(nextMenus) ? nextMenus : []
  }

  const reset = () => {
    menus.value = []
  }

  return {
    menus,
    menuRoutes,
    setMenus,
    reset
  }
})
