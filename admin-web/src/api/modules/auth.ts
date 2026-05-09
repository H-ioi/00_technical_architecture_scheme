import CryptoJS from 'crypto-js'
import { request, type UniLoginSnapshot, type UniUserProfile } from 'uni-ui-lib'

import type { LoginParams } from '@/types/auth'

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

const normalizeProfile = (user?: OAuthTokenResult['user_info'], roles: string[] = []): UniUserProfile => ({
  id: String(user?.userId ?? user?.id ?? ''),
  username: user?.username,
  name: user?.nickname || user?.username || '',
  avatar: user?.avatar,
  roles
})

const encryptLoginPassword = (password: string) => {
  const key = CryptoJS.enc.Latin1.parse(LOGIN_PASSWORD_KEY)

  return CryptoJS.AES.encrypt(password, key, {
    iv: key,
    mode: CryptoJS.mode.CFB,
    padding: CryptoJS.pad.NoPadding
  }).toString()
}

const requestLogin = async (params: LoginParams): Promise<UniLoginSnapshot> => {
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

export const fetchLoginSnapshot = async (params: unknown): Promise<UniLoginSnapshot> => {
  const result = await requestLogin(params as LoginParams)

  return {
    accessToken: result.accessToken,
    refreshToken: result.refreshToken,
    user: result.user,
    permissions: result.permissions
  }
}

export const submitLogoutRequest = async () => {
  await request.delete('/auth/token/logout')
}
