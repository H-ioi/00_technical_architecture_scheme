// 正式机使用
import UniLib, { registerServiceWorker } from 'uni-ui-lib'
// import 'uni-ui-lib/style.css'

// 本地组件库开发
import '../../uni-lib/dist/index.css'

import type { App } from 'vue'

import { authApi } from '@/api'

/** 解析 .env 布尔开关（兼容 true / 1 / yes，忽略行内注释污染） */
const isEnvEnabled = (value?: string) => {
  const normalized = value?.trim().split(/\s+/)[0]?.toLowerCase()
  return normalized === 'true' || normalized === '1' || normalized === 'yes'
}

/** 注册 PWA Service Worker，复用组件库统一的新版本更新提示 */
const initPwa = () => {
  void import('virtual:pwa-register')
    .then(({ registerSW }) => {
      registerServiceWorker(registerSW)
    })
    .catch((error) => {
      console.error('PWA 模块加载失败:', error)
    })
}

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

  // vite-plugin-pwa 在 dev 且未开启 devOptions.enabled 时，registerSW 为空实现，回调不会触发
  if (import.meta.env.PROD || isEnvEnabled(import.meta.env.VITE_PWA_DEV)) {
    initPwa()
  }
}
