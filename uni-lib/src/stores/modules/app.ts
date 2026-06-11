import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import { tryGetUniConfig } from '@/plugins/config'
import { storage } from '@/plugins/storage'

export const useAppStore = defineStore('app', () => {
  const sidebarCollapsed = ref(storage.get<boolean>('sidebar-collapsed') ?? false)
  const darkMode = ref(storage.get<boolean>('dark-mode') ?? false)
  const showTags = ref(storage.get<boolean>('show-tags') ?? true)
  const frameworkLayout = ref(storage.get<string>('framework-layout') ?? '')

  const locale = ref<string>(
    storage.get<string>('locale') ?? tryGetUniConfig()?.defaultLocale ?? 'zh-CN'
  )

  const sidebarWidth = computed(() => (sidebarCollapsed.value ? '64px' : '220px'))

  const toggleSidebar = () => {
    sidebarCollapsed.value = !sidebarCollapsed.value
    storage.set('sidebar-collapsed', sidebarCollapsed.value)
  }

  const setSidebarCollapsed = (nextCollapsed: boolean) => {
    sidebarCollapsed.value = nextCollapsed
    storage.set('sidebar-collapsed', nextCollapsed)
  }

  const setDarkMode = (nextDarkMode: boolean) => {
    darkMode.value = nextDarkMode
    storage.set('dark-mode', nextDarkMode)

    if (typeof document !== 'undefined') {
      document.documentElement.dataset.themeMode = nextDarkMode ? 'dark' : 'light'
    }
  }

  const setShowTags = (nextShowTags: boolean) => {
    showTags.value = nextShowTags
    storage.set('show-tags', nextShowTags)
  }

  const setFrameworkLayout = (nextFrameworkLayout: string) => {
    frameworkLayout.value = nextFrameworkLayout
    storage.set('framework-layout', nextFrameworkLayout)

    if (typeof document !== 'undefined') {
      document.documentElement.dataset.frameworkLayout = nextFrameworkLayout
      document.documentElement.dataset.layout = nextFrameworkLayout
    }
  }

  const setLocale = (nextLocale: string) => {
    locale.value = nextLocale
    storage.set('locale', nextLocale)
  }

  setDarkMode(darkMode.value)
  if (frameworkLayout.value) {
    setFrameworkLayout(frameworkLayout.value)
  }

  return {
    darkMode,
    frameworkLayout,
    sidebarCollapsed,
    sidebarWidth,
    showTags,
    locale,
    setDarkMode,
    setFrameworkLayout,
    setLocale,
    setShowTags,
    setSidebarCollapsed,
    toggleSidebar
  }
})
