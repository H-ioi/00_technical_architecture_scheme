import type { App } from 'vue'
import UniLib from 'uni-ui-lib'
import 'uni-ui-lib/style.css'

import { buildAdminUniRuntime } from '@/api/uni-runtime'
import { DEFAULT_THEME, STORAGE_PREFIX } from '@/config'
import { usePermissionStore } from '@/stores'

export const setupBusinessUi = (app: App) => {
  app.use(UniLib, {
    runtime: buildAdminUniRuntime(),
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
}
