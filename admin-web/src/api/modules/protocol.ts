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
    url: import.meta.env.VITE_UPLOAD_URL || '/files/upload',
    name: '上传协议',
    post: async function (this: { url: string }, file: File) {
      const formData = new FormData()
      formData.append('file', file)

      const result = await request.post<UploadFileResult, UploadFileResult>(resolveUploadUrl(this.url), formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      return result.url ?? result.data?.url ?? ''
    }
  }
}
