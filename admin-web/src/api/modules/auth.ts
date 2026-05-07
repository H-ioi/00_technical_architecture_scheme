import { createUniAuth } from 'uni-ui-lib'

import type { LoginParams, LoginResult, UserPermissionResult, UserProfile } from '@/types/auth'
import { request } from '@/utils/request'

interface OAuthTokenResult {
  access_token: string
  refresh_token?: string
  user_info?: {
    userId?: string | number
    id?: string | number
    username?: string
    nickname?: string
    avatar?: string
    authorities?: Array<{ authority?: string } | string>
  }
}

interface UserInfoResult {
  sysUser?: {
    userId?: string | number
    id?: string | number
    username?: string
    nickname?: string
    avatar?: string
  }
  roles?: string[]
  permissions?: string[]
}

const normalizeProfile = (
  user?: OAuthTokenResult['user_info'] | UserInfoResult['sysUser'],
  roles: string[] = []
): UserProfile => ({
  id: String(user?.userId ?? user?.id ?? ''),
  name: user?.nickname || user?.username || '',
  avatar: user?.avatar,
  roles
})

/** 请求登录接口。 */
const requestLogin = async (params: LoginParams): Promise<LoginResult> => {
  const data = new URLSearchParams()

  data.append('username', params.username)
  data.append('password', params.password)

  const result = await request.post<OAuthTokenResult, OAuthTokenResult>('/auth/oauth/token', data, {
    headers: {
      isToken: false,
      Authorization: 'Basic dW5pOnVuaQ==',
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    params: {
      grant_type: 'password',
      ...(params.code ? { code: params.code } : {}),
      ...(params.randomStr ? { randomStr: params.randomStr } : {})
    }
  })

  const roles: string[] = []

  return {
    accessToken: result.access_token,
    refreshToken: result.refresh_token,
    user: normalizeProfile(result.user_info, roles)
  }
}

export const authService = createUniAuth<LoginParams, LoginResult['user']>({
  login: async (params) => {
    const result = await requestLogin(params)

    return {
      tokens: {
        accessToken: result.accessToken
      },
      user: result.user
    }
  }
})

/** 登录系统。 */
export const loginApi = async (params: LoginParams): Promise<LoginResult> => {
  const result = await authService.login(params)

  return {
    accessToken: result.tokens.accessToken,
    user: result.user
  }
}

/** 查询当前用户和权限。 */
export const fetchUserPermissions = async (): Promise<UserPermissionResult> => {
  const result = await request.get<UserInfoResult, UserInfoResult>('/admin/user/info')
  const roles = Array.isArray(result.roles) ? result.roles : []

  return {
    user: normalizeProfile(result.sysUser, roles),
    roles,
    permissions: Array.isArray(result.permissions) ? result.permissions : []
  }
}

/** 退出系统。 */
export const logoutApi = async () => {
  await request.delete<void, void>('/auth/token/logout')
  await authService.logout()
}
