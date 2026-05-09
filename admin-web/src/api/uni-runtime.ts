import type { UniLibRuntimeOptions } from 'uni-ui-lib'
import { UNI_DEFAULT_LOCALE, useUniTagsViewStore } from 'uni-ui-lib'

import { fetchLoginSnapshot, submitLogoutRequest } from '@/api/modules/auth'
import { DEFAULT_THEME, STORAGE_PREFIX } from '@/config'
import { router } from '@/router'
import { useUserStore } from '@/stores'

export const buildAdminUniRuntime = (): UniLibRuntimeOptions => ({
  storagePrefix: STORAGE_PREFIX,
  defaultLocale: UNI_DEFAULT_LOCALE,
  shell: {
    logoutRedirect: '/login',
    themeStorageKey: `${STORAGE_PREFIX}:theme`,
    defaultTheme: { ...DEFAULT_THEME }
  },
  request: {
    baseURL: import.meta.env.VITE_API_BASE_URL as string,
    timeout: 60000,
    unwrapApiEnvelope: true,
    getTenantId: () => import.meta.env.VITE_TENANT_ID as string,
    tenantIdHeaderName: 'TENANT-ID',
    commonHeaders: {
      version: import.meta.env.VITE_API_VERSION as string
    }
  },
  auth: {
    login: (params) => fetchLoginSnapshot(params),
    logoutRequest: submitLogoutRequest
  },
  changePassword: {
    api: { path: '/upms/user/edit', method: 'put' },
    onSuccess: async () => {
      const userStore = useUserStore()
      const tagsViewStore = useUniTagsViewStore()

      await userStore.logout()
      tagsViewStore.resetTags()
      router.replace('/login')
    }
  },
  httpMessages: {
    badResponse: '请求处理失败',
    unauthorized: '登录已过期，请重新登录',
    forbidden: '没有权限访问该资源',
    networkError: '网络异常，请稍后重试'
  }
})
