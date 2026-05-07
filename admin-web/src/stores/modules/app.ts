import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import type { AppLocale } from '@/types/i18n'
import { storage } from '@/utils/storage'

const SIDEBAR_COLLAPSED_KEY = 'admin-web:sidebar-collapsed'
const LOCALE_KEY = 'admin-web:locale'
const THEME_COLOR_KEY = 'admin-web:theme-color'
const DEFAULT_THEME_COLOR = '#1677ff'

const applyThemeColor = (color: string) => {
  document.documentElement.style.setProperty('--app-primary-color', color)
  document.documentElement.style.setProperty('--el-color-primary', color)
}

export const useAppStore = defineStore('app', () => {
  const sidebarCollapsed = ref(storage.get<boolean>(SIDEBAR_COLLAPSED_KEY) ?? false)
  const themeColor = ref(storage.get<string>(THEME_COLOR_KEY) ?? DEFAULT_THEME_COLOR)
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

  const setThemeColor = (color: string) => {
    themeColor.value = color
    storage.set(THEME_COLOR_KEY, color)
    applyThemeColor(color)
  }

  const resetThemeColor = () => {
    setThemeColor(DEFAULT_THEME_COLOR)
  }

  applyThemeColor(themeColor.value)

  return {
    sidebarCollapsed,
    sidebarWidth,
    locale,
    themeColor,
    setLocale,
    setThemeColor,
    resetThemeColor,
    toggleSidebar
  }
})
