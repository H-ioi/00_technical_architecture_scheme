import type { App } from 'vue'
import UniLib from 'uni-ui-lib'
import 'uni-ui-lib/style.css'

import { usePermissionStore } from '@/stores'

export const setupBusinessUi = (app: App) => {
  app.use(UniLib, {
    permission: {
      hasPermission: (code) => {
        const permissionStore = usePermissionStore()

        return permissionStore.hasPermission(code)
      }
    }
  })
}
