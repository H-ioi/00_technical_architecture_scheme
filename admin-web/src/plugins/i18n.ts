import type { App } from 'vue'
import { watch } from 'vue'

import { i18n, setI18nLocale } from '@/locales'
import { useAppStore } from '@/stores'

export const setupI18n = (app: App) => {
  const appStore = useAppStore()

  setI18nLocale(appStore.locale)
  app.use(i18n)

  watch(
    () => appStore.locale,
    (locale) => setI18nLocale(locale),
    { immediate: true }
  )
}
