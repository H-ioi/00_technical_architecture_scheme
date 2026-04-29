import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import { storage } from '@/utils/storage'

const SIDEBAR_COLLAPSED_KEY = 'admin-web:sidebar-collapsed'

export const useAppStore = defineStore('app', () => {
  const sidebarCollapsed = ref(storage.get<boolean>(SIDEBAR_COLLAPSED_KEY) ?? false)
  const themeColor = ref('#1677ff')

  const sidebarWidth = computed(() => (sidebarCollapsed.value ? '64px' : '220px'))

  const toggleSidebar = () => {
    sidebarCollapsed.value = !sidebarCollapsed.value
    storage.set(SIDEBAR_COLLAPSED_KEY, sidebarCollapsed.value)
  }

  return {
    sidebarCollapsed,
    sidebarWidth,
    themeColor,
    toggleSidebar
  }
})
