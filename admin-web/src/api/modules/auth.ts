import { createUniAuth } from 'uni-ui-lib'
import CryptoJS from 'crypto-js'

import type { ChangePasswordParams, LoginParams, LoginResult, UserProfile } from '@/types/auth'
import { request } from '@/utils/request'

const LOGIN_PASSWORD_KEY = 'unixunixunixunix'

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

const normalizeAuthorities = (authorities?: OAuthTokenResult['user_info']['authorities']) =>
  (authorities ?? [])
    .map((item) => (typeof item === 'string' ? item : item.authority))
    .filter(Boolean) as string[]

const normalizeProfile = (user?: OAuthTokenResult['user_info'], roles: string[] = []): UserProfile => ({
  id: String(user?.userId ?? user?.id ?? ''),
  username: user?.username,
  name: user?.nickname || user?.username || '',
  avatar: user?.avatar,
  roles
})

/** 加密登录密码。 */
const encryptLoginPassword = (password: string) => {
  const key = CryptoJS.enc.Latin1.parse(LOGIN_PASSWORD_KEY)

  return CryptoJS.AES.encrypt(password, key, {
    iv: key,
    mode: CryptoJS.mode.CFB,
    padding: CryptoJS.pad.NoPadding
  }).toString()
}

/** 请求登录接口。 */
const requestLogin = async (params: LoginParams): Promise<LoginResult> => {
  const data = new URLSearchParams()

  data.append('username', params.username)
  data.append('password', encryptLoginPassword(params.password))

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

  const permissions = normalizeAuthorities(result.user_info?.authorities)
  const roles = permissions.filter((item) => item.startsWith('ROLE_'))

  return {
    accessToken: result.access_token,
    refreshToken: result.refresh_token,
    user: normalizeProfile(result.user_info, roles),
    permissions
  }
}

export const authService = createUniAuth<LoginParams, LoginResult['user']>({
  login: async (params) => {
    const result = await requestLogin(params)

    return {
      tokens: {
        accessToken: result.accessToken,
        refreshToken: result.refreshToken
      },
      user: result.user
    }
  }
})

/** 登录系统。 */
export const loginApi = async (params: LoginParams): Promise<LoginResult> => {
  const result = await requestLogin(params)

  authService.setTokens({
    accessToken: result.accessToken,
    refreshToken: result.refreshToken
  })

  return result
}

/** 退出系统。 */
export const logoutApi = async () => {
  await request.delete<void, void>('/auth/token/logout')
  await authService.logout()
}

/** 修改当前用户密码。 */
export const changePasswordApi = async (data: ChangePasswordParams) => {
  await request.put<void, void>('/upms/user/edit', data)
}
