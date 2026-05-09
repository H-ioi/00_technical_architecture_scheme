import { UNI_DEFAULT_LOCALE } from '@/types/i18n'
import { useUniTagsViewStore } from '@/stores/modules/tags-view'
import { useUserStore } from '@/stores/modules/user'

import { getUniRuntimeConfig } from "./store";
import type {
  UniChangePasswordRuntime,
  UniHttpMessages,
  UniLibRuntimeOptions,
  UniRuntimeShell,
} from "@/types/uni-runtime";

/** 与 {@link createUniLibRuntime} 合并用的中文 HTTP 提示默认文案 */
export const UNI_DEFAULT_HTTP_MESSAGES_ZH: Required<UniHttpMessages> = {
  badResponse: '请求处理失败',
  unauthorized: '登录已过期，请重新登录',
  forbidden: '没有权限访问该资源',
  networkError: '网络异常，请稍后重试'
}

const shellLogoutDefault = '/login'

const defaultThemeTokens = {
  primaryColor: '#BA8E62'
} as const

const defaultChangePasswordOnSuccess = async () => {
  const userStore = useUserStore()
  const tagsViewStore = useUniTagsViewStore()

  await userStore.logout()
  tagsViewStore.resetTags()
  const redirect = getUniRuntimeConfig().shell?.logoutRedirect ?? shellLogoutDefault

  if (typeof window !== 'undefined') {
    window.location.assign(redirect)
  }
}

export type CreateUniLibRuntimeInput = Pick<UniLibRuntimeOptions, 'name' | 'auth' | 'request'> &
  Partial<Pick<UniLibRuntimeOptions, 'defaultLocale' | 'shell' | 'changePassword' | 'httpMessages'>>

/**
 * 合并组件库内置默认 runtime（壳主题键、HTTP 提示、改密接口与登出后的跳转等），
 * 宿主只需提供 `name`（项目名称）、`request`、`auth`。
 */
export const createUniLibRuntime = (input: CreateUniLibRuntimeInput): UniLibRuntimeOptions => {
  const shell: UniRuntimeShell = {
    logoutRedirect: shellLogoutDefault,
    ...input.shell,
    themeStorageKey: input.shell?.themeStorageKey ?? `${input.name}:theme`,
    defaultTheme: {
      ...defaultThemeTokens,
      ...input.shell?.defaultTheme
    }
  }

  const request: UniLibRuntimeOptions['request'] = {
    timeout: 60_000,
    unwrapApiEnvelope: true,
    tenantIdHeaderName: 'TENANT-ID',
    ...input.request
  }

  const changePassword: UniChangePasswordRuntime = {
    api: input.changePassword?.api ?? {
      path: '/upms/user/edit',
      method: 'put'
    },
    onSuccess: input.changePassword?.onSuccess ?? defaultChangePasswordOnSuccess
  }

  return {
    name: input.name,
    defaultLocale: input.defaultLocale ?? UNI_DEFAULT_LOCALE,
    shell,
    request,
    auth: input.auth,
    changePassword,
    httpMessages: {
      ...UNI_DEFAULT_HTTP_MESSAGES_ZH,
      ...input.httpMessages
    }
  }
}
