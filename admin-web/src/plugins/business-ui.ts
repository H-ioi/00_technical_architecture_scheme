import type { App } from 'vue'
import { storeToRefs } from 'pinia'
import UniLib from 'uni-ui-lib'
import 'uni-ui-lib/style.css'

import { translateAppMessage } from '@/locales'
import { useAppStore, usePermissionStore } from '@/stores'

export const setupBusinessUi = (app: App) => {
  const appStore = useAppStore()
  const { locale } = storeToRefs(appStore)

  app.use(UniLib, {
    i18n: {
      t: (key) => translateAppMessage(key, key),
      locale: () => appStore.locale,
      localeRef: locale,
      setLocale: appStore.setLocale
    },
    permission: {
      hasPermission: (code) => {
        const permissionStore = usePermissionStore()

        return permissionStore.hasPermission(code)
      }
    }
  })
}
