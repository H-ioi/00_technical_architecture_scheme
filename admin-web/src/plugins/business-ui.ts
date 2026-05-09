import type { App } from 'vue'
import { storeToRefs } from 'pinia'
import UniLib, { patchUniI18nBridge, type UniAppLocale } from 'uni-ui-lib'
import 'uni-ui-lib/style.css'

import { buildAdminUniRuntime } from '@/api/uni-runtime'
import { DEFAULT_THEME, STORAGE_PREFIX } from '@/config'
import { translateAppMessage } from '@/locales'
import { useAppStore, usePermissionStore } from '@/stores'

export const setupBusinessUi = (app: App) => {
  app.use(UniLib, {
    runtime: buildAdminUniRuntime(),
    i18n: {
      t: (key, params) => translateAppMessage(key, key, params),
      locale: () => useAppStore().locale,
      setLocale: (locale) => useAppStore().setLocale(locale as UniAppLocale)
    },
    permission: {
      defaultMode: 'remove',
      hasPermission: (code) => {
        const permissionStore = usePermissionStore()

        return permissionStore.hasPermission(code)
      }
    },
    theme: {
      storageKey: `${STORAGE_PREFIX}:theme`,
      defaultTheme: { ...DEFAULT_THEME }
    }
  })

  const appStore = useAppStore()
  const { locale } = storeToRefs(appStore)

  patchUniI18nBridge({ localeRef: locale })
}
