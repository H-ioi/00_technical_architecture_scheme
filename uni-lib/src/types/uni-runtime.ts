import type { UniRequestOptions } from './uni-request'
import type { UniThemeOptions } from './uni-theme'

import type { UniUserProfile } from './user-profile'

export interface UniChangePasswordRuntime {
  api: {
    path: string
    method?: 'put' | 'post'
  }
  /** HTTP 成功并提示后调用（如跳转登录） */
  onSuccess?: () => void | Promise<void>
}

export interface UniHttpMessages {
  badResponse?: string
  unauthorized?: string
  forbidden?: string
  networkError?: string
}

export interface UniLoginSnapshot {
  accessToken: string
  refreshToken?: string
  user: UniUserProfile
  permissions: string[]
}

export interface UniLibConfigAuth {
  login: (params: unknown) => Promise<UniLoginSnapshot>
  logoutRequest?: () => Promise<void>
}

export interface UniConfigShell {
  /** 退出登录或 HTTP 401 后的登录页路径，默认 <code>/login</code>（整页跳转，与改密成功登出逻辑一致）。 */
  logoutRedirect?: string
  themeStorageKey?: string
  defaultTheme?: UniThemeOptions
}

export interface UniLibConfig {
  /** 项目名称：localStorage、主题持久化键等命名空间（如 `admin-web:access-token`） */
  name: string
  defaultLocale: string
  /** 布局壳：主题持久化键、默认主题、登出跳转等 */
  shell?: UniConfigShell
  /** HTTP 客户端：由 {@link createUniRequest} 构建，支持在 install 时合并业务壳解析等 */
  request: Omit<
    UniRequestOptions,
    'getAccessToken' | 'getTenantId' | 'onRequest' | 'parseResponseData'
  > &
    Pick<Partial<UniRequestOptions>, 'getTenantId' | 'onRequest' | 'parseResponseData'> & {
      /** 为 true 时按 <code>{ code, message|msg, data }</code> 解包 */
      unwrapApiEnvelope?: boolean
      /** 与 <code>apiSuccessCodes</code> 二选一；默认与 200 一起视为成功见解析实现 */
      apiSuccessCode?: number
      /** 业务成功时的 <code>code</code> 取值列表；若未设置则默认为 <code>0</code> 与 <code>200</code> */
      apiSuccessCodes?: number[]
    }
  auth: UniLibConfigAuth
  changePassword?: UniChangePasswordRuntime
  httpMessages?: UniHttpMessages
}

export type UniLibConfigInput = Pick<UniLibConfig, 'name' | 'auth' | 'request'> &
  Partial<Pick<UniLibConfig, 'defaultLocale' | 'shell' | 'changePassword' | 'httpMessages'>>
