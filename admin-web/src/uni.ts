import type { App } from 'vue'
import UniLib, { createUniLibRuntime } from 'uni-ui-lib'
import 'uni-ui-lib/style.css'

import { fetchLoginSnapshot, submitLogoutRequest } from '@/api/modules/auth'

export const initUniLib = (app: App) => {
  app.use(UniLib, {
    runtime: createUniLibRuntime({
      name: 'uni-admin-web',
      request: {
        baseURL: import.meta.env.VITE_API_BASE_URL as string,
        getTenantId: () => import.meta.env.VITE_TENANT_ID as string,
        commonHeaders: {
          version: import.meta.env.VITE_API_VERSION as string
        }
      },
      auth: {
        login: (params) => fetchLoginSnapshot(params),
        logoutRequest: submitLogoutRequest
      }
    })
  })
}
