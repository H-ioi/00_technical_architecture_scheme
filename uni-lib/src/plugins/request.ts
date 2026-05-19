import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig
} from 'axios'
import { ElMessage } from 'element-plus'

import { getUniConfig } from '@/plugins/config'
import { useUserStore } from '@/stores'
import type { UniRequestOptions } from '@/types/uni-request'

export type { UniRequestOptions, UniRequestProgress } from '@/types/uni-request'

type UniInternalRequestConfig = InternalAxiosRequestConfig & {
  __uniRequestKey?: string
  /** Per-request escape hatch for download APIs that need response headers. */
  rawResponse?: boolean
}

export type UniRawResponseRequestConfig = AxiosRequestConfig & {
  rawResponse: true
}

type HeaderMap = Record<string, unknown>

const DEFAULT_TIMEOUT = 15000
const DEFAULT_TENANT_HEADER = 'X-Tenant-Id'
const DEFAULT_SUCCESS_CODES = [0, 200]
const DEFAULT_MESSAGES = {
  badResponse: '请求处理失败',
  unauthorized: '登录已过期，请重新登录',
  forbidden: '没有权限访问该资源',
  networkError: '网络异常，请稍后重试'
}

/** 并发 401 时只处理一次，避免多次提示与重复跳转 */
let handlingHttp401 = false

/**
 * 与 {@link shell.logoutRedirect} 一致：整页跳转登录（SPA 路由由浏览器重新加载）。
 * 附带 redirect 供登录成功后回到当前页（路径与 admin-web router 约定对齐）。
 */
const assignToLoginAfterUnauthorized = (loginPath: string) => {
  if (typeof window === 'undefined') {
    return
  }
  const normalized = loginPath.startsWith('/') ? loginPath : `/${loginPath}`

  try {
    const pathOnly = window.location.pathname
    if (pathOnly === normalized || pathOnly.endsWith(normalized)) {
      window.location.assign(normalized)
      return
    }

    const current =
      `${pathOnly}${window.location.search}${window.location.hash}`.replace(/[#?]$/, '') || '/'
    const url = new URL(normalized, window.location.origin)
    url.searchParams.set('redirect', current)
    window.location.assign(url.pathname + url.search + url.hash)
  } catch {
    window.location.assign(normalized)
  }
}

const isFilled = (value: unknown) => value !== undefined && value !== null && value !== ''

const getHeaders = (config: InternalAxiosRequestConfig): HeaderMap =>
  config.headers as unknown as HeaderMap

const serializeParams = (params: unknown) => {
  if (!params || typeof params !== 'object') {
    return ''
  }

  const searchParams = new URLSearchParams()
  Object.entries(params as Record<string, unknown>).forEach(([key, value]) => {
    if (!isFilled(value)) {
      return
    }

    if (Array.isArray(value)) {
      value.forEach((item) => searchParams.append(key, String(item)))
      return
    }

    searchParams.append(key, String(value))
  })

  return searchParams.toString()
}

const stringifyPayload = (value: unknown) => {
  if (value === undefined || value === null || typeof value === 'string') {
    return value ?? ''
  }

  try {
    return JSON.stringify(value)
  } catch {
    return String(value)
  }
}

const getDuplicateKey = (
  config: InternalAxiosRequestConfig,
  preventDuplicate: UniRequestOptions['preventDuplicate']
) => {
  if (typeof preventDuplicate === 'function') {
    return preventDuplicate(config)
  }

  return [
    config.method?.toUpperCase() ?? 'GET',
    config.baseURL ?? '',
    config.url ?? '',
    serializeParams(config.params),
    stringifyPayload(config.data)
  ].join('&')
}

const setCommonHeaders = (
  config: InternalAxiosRequestConfig,
  options: Pick<
    UniRequestOptions,
    'commonHeaders' | 'getAccessToken' | 'getTenantId' | 'tenantIdHeaderName'
  >
) => {
  const headers = getHeaders(config)
  const token = options.getAccessToken?.()
  const tenantId = options.getTenantId?.()

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }
  if (options.commonHeaders) {
    Object.assign(headers, options.commonHeaders)
  }
  if (isFilled(tenantId)) {
    headers[options.tenantIdHeaderName ?? DEFAULT_TENANT_HEADER] = String(tenantId)
  }
}

export const createUniRequest = (options: UniRequestOptions = {}): AxiosInstance => {
  const pendingRequests = new Map<string, AbortController>()
  const instance = axios.create({
    baseURL: options.baseURL,
    timeout: options.timeout ?? DEFAULT_TIMEOUT,
    headers: options.headers,
    paramsSerializer: options.paramsSerializer ?? {
      serialize: serializeParams
    },
    validateStatus: options.validateStatus,
    withCredentials: options.withCredentials
  })

  const clearPending = (config?: UniInternalRequestConfig) => {
    const key = config?.__uniRequestKey
    if (!key) {
      return
    }

    const controller = pendingRequests.get(key)
    if (!controller || controller.signal === config.signal) {
      pendingRequests.delete(key)
    }
  }

  instance.interceptors.request.use(
    async (config: UniInternalRequestConfig) => {
      options.progress?.start()
      setCommonHeaders(config, options)

      if (options.preventDuplicate) {
        const key = getDuplicateKey(config, options.preventDuplicate)
        pendingRequests.get(key)?.abort()

        const controller = new AbortController()
        pendingRequests.set(key, controller)
        config.signal = controller.signal
        config.__uniRequestKey = key
      }

      return options.onRequest ? options.onRequest(config) : config
    },
    (error: unknown) => {
      options.progress?.done()
      return Promise.reject(error)
    }
  )

  instance.interceptors.response.use(
    async (response: AxiosResponse) => {
      clearPending(response.config as UniInternalRequestConfig)
      options.progress?.done()

      /** 网关偶发仍进 2xx 的协商、或 validateStatus 放宽时，统一走错误链以触发 401 处理 */
      if (response.status === 401) {
        return Promise.reject(
          new AxiosError(
            'Request failed with status code 401',
            AxiosError.ERR_BAD_REQUEST,
            response.config,
            response.request,
            response
          )
        )
      }

      const next = {
        ...response,
        data: options.parseResponseData ? options.parseResponseData(response.data) : response.data
      }
      const resolved = options.onResponse ? await Promise.resolve(options.onResponse(next)) : next

      return (response.config as UniInternalRequestConfig).rawResponse ? resolved : resolved.data
    },
    (error: AxiosError) => {
      clearPending(error.config as UniInternalRequestConfig)
      options.progress?.done()

      const status = error.response?.status
      if (status === 401) {
        options.onUnauthorized?.()
      }
      if (status === 403) {
        options.onForbidden?.()
      }
      if (status === 503) {
        options.onServiceUnavailable?.()
      }

      options.onError?.(error)
      return Promise.reject(error)
    }
  )

  return instance
}

const coerceBusinessCode = (value: unknown): number | undefined => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }
  if (typeof value === 'string' && value.trim() !== '') {
    const n = Number(value)
    if (!Number.isNaN(n)) {
      return n
    }
  }
  return undefined
}

/** 业务壳表示登录态失效（HTTP 可能仍为 200，解包抛错后路由读不到 response.status） */
const isAuthBusinessFailure = (result: Record<string, unknown>, message: string): boolean => {
  const c = coerceBusinessCode(result.code)
  if (c === 401) {
    return true
  }
  const rawMsg = `${message} ${typeof result.msg === 'string' ? result.msg : ''} ${typeof result.message === 'string' ? result.message : ''}`
  const m = rawMsg.toLowerCase()
  return /invalid\s*token|token\s*invalid|token\s*expired|expired\s*token|登录已过期|未登录|请先登录|unauthorized|认证失败|鉴权失败/.test(
    m
  )
}

const createApiEnvelopeParser = (
  unwrap: boolean | undefined,
  successCode: number | undefined,
  successCodes: number[] | undefined,
  userParse: UniRequestOptions['parseResponseData'],
  messages: typeof DEFAULT_MESSAGES,
  onEnvelopeAuthFailure?: () => void
) => {
  if (userParse || !unwrap) {
    return userParse
  }

  const okCodes = successCodes?.length
    ? successCodes
    : successCode !== undefined
      ? [successCode]
      : DEFAULT_SUCCESS_CODES

  return (data: unknown) => {
    if (data === null || typeof data !== 'object' || Array.isArray(data)) {
      return data
    }

    const result = data as Record<string, unknown>
    const code = coerceBusinessCode(result.code)
    if (code === undefined) {
      return data
    }
    if (!okCodes.includes(code)) {
      const message =
        (typeof result.message === 'string' ? result.message : undefined) ??
        (typeof result.msg === 'string' ? result.msg : undefined) ??
        messages.badResponse

      if (onEnvelopeAuthFailure && isAuthBusinessFailure(result, message)) {
        onEnvelopeAuthFailure()
        throw new Error(message)
      }

      ElMessage.error(message)
      throw new Error(message)
    }

    return result.data !== undefined ? result.data : data
  }
}

let defaultClient: AxiosInstance | null = null

export const initUniHttpClient = () => {
  const runtime = getUniConfig()
  const messages = {
    ...DEFAULT_MESSAGES,
    ...runtime.httpMessages
  }
  const {
    unwrapApiEnvelope,
    apiSuccessCode,
    apiSuccessCodes,
    commonHeaders,
    getTenantId,
    tenantIdHeaderName,
    onRequest,
    parseResponseData,
    ...requestOptions
  } = runtime.request

  const triggerUnauthorized = () => {
    if (handlingHttp401) {
      return
    }
    handlingHttp401 = true
    useUserStore().resetAuth()
    ElMessage.error(messages.unauthorized)
    const loginPath = getUniConfig().shell?.logoutRedirect ?? '/login'
    assignToLoginAfterUnauthorized(loginPath)
    requestOptions.onUnauthorized?.()
  }

  defaultClient = createUniRequest({
    ...requestOptions,
    parseResponseData: createApiEnvelopeParser(
      unwrapApiEnvelope,
      apiSuccessCode,
      apiSuccessCodes,
      parseResponseData,
      messages,
      triggerUnauthorized
    ),
    onRequest: async (config) => {
      const next = onRequest ? await onRequest(config) : config
      const headers = getHeaders(next)
      const skipToken = headers.isToken === false
      const token = useUserStore().accessToken

      if (token && !skipToken) {
        headers.Authorization = `Bearer ${token}`
      }
      if (skipToken) {
        delete headers.isToken
      }

      setCommonHeaders(next, {
        commonHeaders,
        getTenantId,
        tenantIdHeaderName
      })

      return next
    },
    onUnauthorized: triggerUnauthorized,
    onForbidden: () => {
      ElMessage.error(messages.forbidden)
      requestOptions.onForbidden?.()
    },
    onError: (error) => {
      const status = (error as AxiosError).response?.status
      if (status === 401 || status === 403) {
        requestOptions.onError?.(error)
        return
      }
      ElMessage.error(error.message || messages.networkError)
      requestOptions.onError?.(error)
    }
  })
}

export const getUniRequest = (): AxiosInstance => {
  if (!defaultClient) {
    throw new Error(
      '[uni-ui-lib] HTTP client not initialized. Ensure app.use(UniLib) ran with options.config.'
    )
  }
  return defaultClient
}

export const http = {
  get<T = unknown>(
    url: string,
    params: Record<string, unknown> = {},
    config: AxiosRequestConfig = {}
  ): Promise<T> {
    return getUniRequest().get(url, { params, ...config })
  },

  post<T = unknown>(url: string, data: unknown = {}, config: AxiosRequestConfig = {}): Promise<T> {
    return getUniRequest().post(url, data, config)
  },

  put<T = unknown>(url: string, data: unknown = {}, config: AxiosRequestConfig = {}): Promise<T> {
    return getUniRequest().put(url, data, config)
  },

  patch<T = unknown>(url: string, data: unknown = {}, config: AxiosRequestConfig = {}): Promise<T> {
    return getUniRequest().patch(url, data, config)
  },

  delete<T = unknown>(
    url: string,
    data: unknown = {},
    config: AxiosRequestConfig = {}
  ): Promise<T> {
    return getUniRequest().delete(url, { data, ...config })
  }
}

export const request = new Proxy({} as AxiosInstance, {
  get(_target, prop, receiver) {
    return Reflect.get(getUniRequest(), prop, receiver)
  }
})
