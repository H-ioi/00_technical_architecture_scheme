import CryptoJS from 'crypto-js'

import type { LoginParams, OAuthTokenResult, OAuthTokenUserInfo } from '@/types/auth'
import { request, type UniLoginSnapshot, type UniUserProfile } from 'uni-ui-lib'

const LOGIN_PASSWORD_KEY = 'unixunixunixunix'

const flatAuth = (authorities?: OAuthTokenUserInfo['authorities']) =>
  (authorities ?? [])
    .map((item) => {
      if (typeof item === 'string') {
        return item
      }

      return item.authority ?? item.permission
    })
    .filter(Boolean) as string[]

const pickUserInfo = (source?: Record<string, unknown>): OAuthTokenUserInfo | undefined => {
  let raw = source?.user_info ?? source?.userInfo

  if (!raw) {
    return undefined
  }

  if (typeof raw === 'string') {
    try {
      raw = JSON.parse(raw) as OAuthTokenUserInfo
    } catch {
      return undefined
    }
  }

  return raw as OAuthTokenUserInfo
}

/** OAuth 网关可能把 token 放在 data、user_info 放在外层，需合并后再读 authorities。 */
const normalizeOAuthToken = (raw: unknown): OAuthTokenResult => {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    throw new Error('Invalid OAuth token response')
  }

  const envelope = raw as Record<string, unknown>
  const code =
    typeof envelope.code === 'number'
      ? envelope.code
      : typeof envelope.code === 'string'
        ? Number(envelope.code)
        : undefined
  const inner =
    code !== undefined &&
    (code === 0 || code === 200) &&
    envelope.data &&
    typeof envelope.data === 'object' &&
    !Array.isArray(envelope.data)
      ? (envelope.data as Record<string, unknown>)
      : envelope
  const userInfo = pickUserInfo(inner) ?? pickUserInfo(envelope)

  return {
    access_token: String(inner.access_token ?? envelope.access_token ?? ''),
    refresh_token: (inner.refresh_token ?? envelope.refresh_token) as string | undefined,
    user_info: userInfo
  }
}

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
  const apiBase = (import.meta.env.VITE_API_BASE_URL as string).replace(/\/$/, '')

  data.append('username', params.username)
  data.append('password', encPwd(params.password))

  const query = new URLSearchParams({
    grant_type: 'password',
    ...(params.code ? { code: params.code } : {}),
    ...(params.randomStr ? { randomStr: params.randomStr } : {})
  })

  const response = await fetch(`${apiBase}${url}?${query.toString()}`, {
    method: 'POST',
    headers: {
      isToken: 'false',
      Authorization: 'Basic dW5pOnVuaQ==',
      'Content-Type': 'application/x-www-form-urlencoded',
      version: import.meta.env.VITE_API_VERSION as string,
      'TENANT-ID': import.meta.env.VITE_TENANT_ID as string
    },
    body: data
  })

  if (!response.ok) {
    const detail = await response.text()
    throw new Error(detail || `OAuth login failed (${response.status})`)
  }

  const result = normalizeOAuthToken(await response.json())

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
