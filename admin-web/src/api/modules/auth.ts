import CryptoJS from 'crypto-js'

import type { LoginParams, OAuthTokenResult, OAuthTokenUserInfo } from '@/types/auth'
import { request, type UniLoginSnapshot, type UniUserProfile } from 'uni-ui-lib'

const LOGIN_PASSWORD_KEY = 'unixunixunixunix'

const flatAuth = (authorities?: OAuthTokenUserInfo['authorities']) =>
  (authorities ?? [])
    .map((item) => (typeof item === 'string' ? item : item.authority))
    .filter(Boolean) as string[]

const toProfile = (user?: OAuthTokenUserInfo, roles: string[] = []): UniUserProfile => ({
  id: String(user?.userId ?? user?.id ?? ''),
  username: user?.username,
  name: user?.nickname || user?.username || '',
  avatar: user?.avatar,
  roles
})

const encPwd = (password: string) => {
  const key = CryptoJS.enc.Latin1.parse(LOGIN_PASSWORD_KEY)

  return CryptoJS.AES.encrypt(password, key, {
    iv: key,
    mode: CryptoJS.mode.CFB,
    padding: CryptoJS.pad.NoPadding
  }).toString()
}

const fetchLogin = async (params: LoginParams): Promise<UniLoginSnapshot> => {
  const data = new URLSearchParams()
  const url = '/auth/oauth/token'

  data.append('username', params.username)
  data.append('password', encPwd(params.password))

  const result = await request.post<OAuthTokenResult, OAuthTokenResult>(url, data, {
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

  const permissions = flatAuth(result.user_info?.authorities)
  const roles = permissions.filter((item) => item.startsWith('ROLE_'))

  return {
    accessToken: result.access_token,
    refreshToken: result.refresh_token,
    user: toProfile(result.user_info, roles),
    permissions
  }
}

const snapLogin = async (params: LoginParams): Promise<UniLoginSnapshot> => {
  const result = await fetchLogin(params)

  return {
    accessToken: result.accessToken,
    refreshToken: result.refreshToken,
    user: result.user,
    permissions: result.permissions
  }
}

export default {
  login: {
    url: '/auth/oauth/token',
    name: '登录',
    post: async function (_params: unknown): Promise<UniLoginSnapshot> {
      return await snapLogin(_params as LoginParams)
    }
  },

  logout: {
    url: '/auth/token/logout',
    name: '退出登录',
    delete: async function (this: { url: string }) {
      await request.delete(this.url)
    }
  }
}
