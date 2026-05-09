import type { App } from 'vue'

import { i18n } from '@/locales'
import { useAppStore } from '@/stores'

import { setupBusinessUi } from './business-ui'

export const setupPlugins = (app: App) => {
  const appStore = useAppStore()

  i18n.global.locale.value = appStore.locale
  document.documentElement.lang = appStore.locale

  app.use(i18n)
  setupBusinessUi(app)
}
