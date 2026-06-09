import type { PageResult } from '@/types/api'
import type {
  ContentDiscussionFormModel,
  ContentDiscussionListParams,
  ContentDiscussionRecord
} from '@/types/modules/content-discussion'
import type { ContentDiscussionTagRecord as TagRecord } from '@/types/modules/content-discussion-tag'
import { request } from 'uni-ui-lib'

const base = '/isacommunity/content/discussion'
const tagBase = '/isacommunity/content/discussion-tag'

const uploadUrl = import.meta.env.VITE_UPLOAD_URL as string

function toBrowserUploadUrl(url: string) {
  if (!url || url.startsWith('http')) {
    return url
  }
  return `${import.meta.env.VITE_API_BASE_URL || ''}${url}`
}

export default {
  page: {
    url: `${base}/page`,
    name: '讨论内容分页',
    get: async function (this: { url: string }, params: ContentDiscussionListParams) {
      return await request.get<PageResult<ContentDiscussionRecord>, PageResult<ContentDiscussionRecord>>(
        this.url,
        { params }
      )
    }
  },

  listAll: {
    url: `${base}/listAll`,
    name: '讨论内容全量列表',
    get: async function (this: { url: string }) {
      return await request.get<ContentDiscussionRecord[], ContentDiscussionRecord[]>(this.url)
    }
  },

  detail: {
    url: base,
    name: '讨论内容详情',
    get: async function (this: { url: string }, id: string | number) {
      return await request.get<ContentDiscussionRecord, ContentDiscussionRecord>(`${this.url}/${id}`)
    }
  },

  create: {
    url: `${base}/create`,
    name: '新增讨论内容',
    post: async function (this: { url: string }, data: ContentDiscussionFormModel) {
      return await request.post(this.url, data)
    }
  },

  update: {
    url: `${base}/update`,
    name: '编辑讨论内容',
    post: async function (this: { url: string }, data: ContentDiscussionFormModel) {
      return await request.post(this.url, data)
    }
  },

  delete: {
    url: `${base}/delete`,
    name: '删除讨论内容',
    post: async function (this: { url: string }, data: { id?: string | number }) {
      return await request.post(this.url, data)
    }
  },

  tagList: {
    url: `${tagBase}/list`,
    name: '讨论标签下拉',
    get: async function (this: { url: string }) {
      return await request.get<TagRecord[], TagRecord[]>(this.url)
    }
  },

  uploadFile: {
    name: '上传讨论附件',
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
