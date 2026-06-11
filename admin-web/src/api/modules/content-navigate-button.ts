import type { PageResult } from '@/types/api'
import type {
  ContentArticleVisibleRecord,
  ContentNavigateButtonFormModel,
  ContentNavigateButtonListParams,
  ContentNavigateButtonRecord
} from '@/types/modules/content-navigate-button'
import { request } from 'uni-ui-lib'

const base = '/isacommunity/content/navigate-button'
const articleBase = '/isacommunity/content/article'
const uploadUrl = import.meta.env.VITE_UPLOAD_URL?.trim() || 'https://upload.isagzth.com/upload/'

const toBrowserUploadUrl = (url: string) => {
  if (!url || /^https?:\/\//i.test(url)) {
    return url
  }
  if (typeof window === 'undefined') {
    return url
  }
  return url.startsWith('/') ? `${window.location.origin}${url}` : `${window.location.origin}/${url}`
}

export default {
  page: {
    url: `${base}/page`,
    name: '导航按钮分页',
    get: async function (this: { url: string }, params: ContentNavigateButtonListParams) {
      return await request.get<
        PageResult<ContentNavigateButtonRecord>,
        PageResult<ContentNavigateButtonRecord>
      >(this.url, { params })
    }
  },

  detail: {
    url: base,
    name: '导航按钮详情',
    get: async function (this: { url: string }, id: string | number) {
      return await request.get<ContentNavigateButtonRecord, ContentNavigateButtonRecord>(
        `${this.url}/${id}`
      )
    }
  },

  create: {
    url: `${base}/create`,
    name: '新增导航按钮',
    post: async function (this: { url: string }, data: ContentNavigateButtonFormModel) {
      return await request.post(this.url, data)
    }
  },

  update: {
    url: `${base}/update`,
    name: '编辑导航按钮',
    post: async function (this: { url: string }, data: ContentNavigateButtonFormModel) {
      return await request.post(this.url, data)
    }
  },

  delete: {
    url: `${base}/delete`,
    name: '删除导航按钮',
    post: async function (this: { url: string }, data: { id?: string | number; ids?: unknown[] }) {
      return await request.post(this.url, data)
    }
  },

  articleVisibleList: {
    url: `${articleBase}/visible`,
    name: '可见文章列表',
    get: async function (this: { url: string }) {
      return await request.get<ContentArticleVisibleRecord[], ContentArticleVisibleRecord[]>(
        this.url
      )
    }
  },

  uploadIcon: {
    name: '上传导航按钮图标',
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
