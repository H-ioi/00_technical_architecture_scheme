import { API_PATHS } from '@/api/constants'
import type { PageResult } from '@/types/api'
import type {
  ProtocolDict,
  ProtocolFormModel,
  ProtocolListParams,
  ProtocolRecord,
  ProtocolSignListParams,
  ProtocolSignRecord,
  UploadFileResult
} from '@/types/modules/protocol'
import { request } from 'uni-ui-lib'

const resolveUploadUrl = (uploadUrl: string) => {
  const baseURL = request.defaults.baseURL

  if (baseURL && uploadUrl.startsWith(baseURL)) {
    return uploadUrl.slice(baseURL.length) || '/'
  }

  return uploadUrl
}

/**
 * 相对路径上传地址（如 /isa-file-upload/upload/）需拼成浏览器绝对 URL，
 * 否则 axios 会与实例 baseURL（/api）拼成错误路径。
 */
const toAbsoluteUploadUrlIfNeeded = (uploadUrl: string): string => {
  const u = uploadUrl.trim()
  if (!u || /^https?:\/\//i.test(u)) {
    return u
  }
  if (typeof window === 'undefined') {
    return u
  }
  return u.startsWith('/') ? `${window.location.origin}${u}` : `${window.location.origin}/${u}`
}

export default {
  page: {
    url: `${API_PATHS.protocol}/getProtocolPage`,
    name: '协议分页',
    get: async function (this: { url: string }, params: ProtocolListParams) {
      return await request.get<PageResult<ProtocolRecord>, PageResult<ProtocolRecord>>(this.url, {
        params
      })
    }
  },

  dict: {
    url: `${API_PATHS.protocol}/getDictList`,
    name: '协议字典',
    get: async function (this: { url: string }) {
      return await request.get<ProtocolDict, ProtocolDict>(this.url)
    }
  },

  info: {
    url: `${API_PATHS.protocol}/get`,
    name: '协议详情',
    get: async function (this: { url: string }, id: string | number) {
      return await request.get<ProtocolRecord, ProtocolRecord>(`${this.url}/${id}`)
    }
  },

  add: {
    url: `${API_PATHS.protocol}/add`,
    name: '新增协议',
    post: async function (this: { url: string }, data: ProtocolFormModel) {
      return await request.post(this.url, data)
    }
  },

  edit: {
    url: `${API_PATHS.protocol}/edit`,
    name: '编辑协议',
    post: async function (this: { url: string }, data: ProtocolFormModel) {
      return await request.post(this.url, data)
    }
  },

  delete: {
    url: `${API_PATHS.protocol}/del`,
    name: '删除协议',
    delete: async function (this: { url: string }, ids: Array<string | number>) {
      return await request.delete(this.url, {
        params: { ids }
      })
    }
  },

  signPage: {
    url: `${API_PATHS.protocolSign}/getProtocolSignPage`,
    name: '签署分页',
    get: async function (this: { url: string }, params: ProtocolSignListParams) {
      return await request.get<PageResult<ProtocolSignRecord>, PageResult<ProtocolSignRecord>>(this.url, {
        params
      })
    }
  },

  upload: {
    url:
      import.meta.env.VITE_UPLOAD_URL?.trim() ||
      'https://upload.isagzth.com/upload/',
    name: '上传协议',
    post: async function (this: { url: string }, file: File) {
      const formData = new FormData()
      formData.append('file', file)

      const result = await request.post<UploadFileResult, UploadFileResult>(
        toAbsoluteUploadUrlIfNeeded(resolveUploadUrl(this.url)),
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      )

      return result.url ?? result.data?.url ?? ''
    }
  }
}
