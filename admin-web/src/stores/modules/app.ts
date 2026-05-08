import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import { DEFAULT_LOCALE } from '@/config'
import type { AppLocale } from '@/types/i18n'
import { storage } from '@/utils/storage'

export const useAppStore = defineStore('app', () => {
  const sidebarCollapsed = ref(storage.get<boolean>('sidebar-collapsed') ?? false)
  const locale = ref<AppLocale>(storage.get<AppLocale>('locale') ?? DEFAULT_LOCALE)

  const sidebarWidth = computed(() => (sidebarCollapsed.value ? '64px' : '220px'))

  const toggleSidebar = () => {
    sidebarCollapsed.value = !sidebarCollapsed.value
    storage.set('sidebar-collapsed', sidebarCollapsed.value)
  }

  const setLocale = (nextLocale: AppLocale) => {
    locale.value = nextLocale
    storage.set('locale', nextLocale)
  }

  return {
    sidebarCollapsed,
    sidebarWidth,
    locale,
    setLocale,
    toggleSidebar
  }
})
