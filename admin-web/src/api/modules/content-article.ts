import type { PageResult } from '@/types/api'
import type {
  ContentArticleFormModel,
  ContentArticleListParams,
  ContentArticleRecord
} from '@/types/modules/content-article'
import { request } from 'uni-ui-lib'

const base = '/isacommunity/content/article'
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
    name: '文章分页',
    get: async function (this: { url: string }, params: ContentArticleListParams) {
      return await request.get<PageResult<ContentArticleRecord>, PageResult<ContentArticleRecord>>(
        this.url,
        { params }
      )
    }
  },

  detail: {
    url: base,
    name: '文章详情',
    get: async function (this: { url: string }, id: string | number) {
      return await request.get<ContentArticleRecord, ContentArticleRecord>(`${this.url}/${id}`)
    }
  },

  create: {
    url: `${base}/create`,
    name: '新增文章',
    post: async function (this: { url: string }, data: ContentArticleFormModel) {
      return await request.post(this.url, data)
    }
  },

  update: {
    url: `${base}/update`,
    name: '编辑文章',
    post: async function (this: { url: string }, data: ContentArticleFormModel) {
      return await request.post(this.url, data)
    }
  },

  delete: {
    url: `${base}/delete`,
    name: '删除文章',
    post: async function (this: { url: string }, data: { id?: string | number; ids?: unknown[] }) {
      return await request.post(this.url, data)
    }
  },

  uploadMainImage: {
    name: '上传文章主图',
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
