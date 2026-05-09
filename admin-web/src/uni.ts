import UniLib from 'uni-ui-lib'
import 'uni-ui-lib/style.css'
import type { App } from 'vue'

import { authApi } from '@/api'

export const initUniLib = (app: App) => {
  app.use(UniLib, {
    config: {
      name: 'uni-admin-web',
      request: {
        baseURL: import.meta.env.VITE_API_BASE_URL as string,
        getTenantId: () => import.meta.env.VITE_TENANT_ID as string,
        commonHeaders: {
          version: import.meta.env.VITE_API_VERSION as string
        }
      },
      auth: {
        login: (params) => authApi.login.post(params),
        logoutRequest: () => authApi.logout.delete()
      }
    }
  })
}
