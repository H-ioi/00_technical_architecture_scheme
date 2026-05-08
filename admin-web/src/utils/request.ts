import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { ElMessage } from 'element-plus'

import { useUserStore } from '@/stores'
import type { ApiResponse } from '@/types/api'

export const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 60000
})

request.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const userStore = useUserStore()
  const isToken = config.headers?.isToken === false

  if (userStore.accessToken && !isToken) {
    config.headers.Authorization = `Bearer ${userStore.accessToken}`
  }

  if (isToken) {
    delete config.headers.isToken
  }

  config.headers['TENANT-ID'] = import.meta.env.VITE_TENANT_ID
  config.headers.version = import.meta.env.VITE_API_VERSION

  if (config.method?.toLowerCase() === 'get') {
    // 兼容旧接口数组参数格式：a=1&a=2。
    config.paramsSerializer = {
      serialize: (params) => {
        const searchParams = new URLSearchParams()

        Object.entries(params || {}).forEach(([key, value]) => {
          if (value === undefined || value === null || value === '') {
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
    }
  }

  return config
})

request.interceptors.response.use(
  (response) => {
    const result = response.data as ApiResponse

    if (typeof result?.code === 'number' && result.code !== 0) {
      ElMessage.error(result.message || '请求处理失败')
      return Promise.reject(new Error(result.message || '请求处理失败'))
    }

    return result?.data ?? response.data
  },
  (error: AxiosError) => {
    const status = error.response?.status
    const userStore = useUserStore()

    if (status === 401) {
      userStore.resetAuth()
      ElMessage.error('登录已过期，请重新登录')
    } else if (status === 403) {
      ElMessage.error('没有权限访问该资源')
    } else {
      ElMessage.error(error.message || '网络异常，请稍后重试')
    }

    return Promise.reject(error)
  }
)
