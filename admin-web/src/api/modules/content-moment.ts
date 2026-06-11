import type { PageResult } from '@/types/api'
import type {
  ContentMomentFormModel,
  ContentMomentListParams,
  ContentMomentRecord
} from '@/types/modules/content-moment'
import { request } from 'uni-ui-lib'

const base = '/isacommunity/content/moment'
const uploadUrl = import.meta.env.VITE_UPLOAD_URL?.trim() || 'https://upload.isagzth.com/upload/'

const toBrowserUploadUrl = (url: string) => {
  if (!url || /^https?:\/\//i.test(url)) {
    return url
  }
  if (typeof window === 'undefined') {
    return url
  }
  return url.startsWith('/')
    ? `${window.location.origin}${url}`
    : `${window.location.origin}/${url}`
}

export default {
  page: {
    url: `${base}/page`,
    name: '校园动态分页',
    get: async function (this: { url: string }, params: ContentMomentListParams) {
      return await request.get<PageResult<ContentMomentRecord>, PageResult<ContentMomentRecord>>(
        this.url,
        { params }
      )
    }
  },

  detail: {
    url: base,
    name: '校园动态详情',
    get: async function (this: { url: string }, id: string | number) {
      return await request.get<ContentMomentRecord, ContentMomentRecord>(`${this.url}/${id}`)
    }
  },

  create: {
    url: `${base}/create`,
    name: '新增校园动态',
    post: async function (this: { url: string }, data: ContentMomentFormModel) {
      return await request.post(this.url, data)
    }
  },

  update: {
    url: `${base}/update`,
    name: '编辑校园动态',
    post: async function (this: { url: string }, data: ContentMomentFormModel) {
      return await request.post(this.url, data)
    }
  },

  delete: {
    url: `${base}/delete`,
    name: '删除校园动态',
    post: async function (this: { url: string }, data: { id?: string | number }) {
      return await request.post(this.url, data)
    }
  },

  uploadFile: {
    name: '上传动态附件',
    post: async (file: File) => {
      const fd = new FormData()
      fd.append('prefix', 'parent_weapp_upload')
      fd.append('file', file)
      const raw = await request.post<{ url?: string; data?: { url?: string } }>(
        toBrowserUploadUrl(uploadUrl),
        fd,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      )
      return raw.url ?? raw.data?.url ?? ''
    }
  }
}
