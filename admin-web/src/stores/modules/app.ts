import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import type { AppLocale } from '@/types/i18n'
import { storage } from '@/utils/storage'

const SIDEBAR_COLLAPSED_KEY = 'admin-web:sidebar-collapsed'
const LOCALE_KEY = 'admin-web:locale'

export const useAppStore = defineStore('app', () => {
  const sidebarCollapsed = ref(storage.get<boolean>(SIDEBAR_COLLAPSED_KEY) ?? false)
  const locale = ref<AppLocale>(storage.get<AppLocale>(LOCALE_KEY) ?? 'zh-CN')

  const sidebarWidth = computed(() => (sidebarCollapsed.value ? '64px' : '220px'))

  const toggleSidebar = () => {
    sidebarCollapsed.value = !sidebarCollapsed.value
    storage.set(SIDEBAR_COLLAPSED_KEY, sidebarCollapsed.value)
  }

  const setLocale = (nextLocale: AppLocale) => {
    locale.value = nextLocale
    storage.set(LOCALE_KEY, nextLocale)
  }

  return {
    sidebarCollapsed,
    sidebarWidth,
    locale,
    setLocale,
    toggleSidebar
  }
})
