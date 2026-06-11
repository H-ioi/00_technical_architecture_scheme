import type { PageResult } from '@/types/api'
import type {
  ContentCategoryFormModel,
  ContentCategoryListParams,
  ContentCategoryRecord
} from '@/types/modules/content-category'
import { request } from 'uni-ui-lib'

const base = '/isacommunity/content/category'

export default {
  page: {
    url: `${base}/page`,
    name: '内容分类分页',
    get: async function (this: { url: string }, params: ContentCategoryListParams) {
      return await request.get<
        PageResult<ContentCategoryRecord>,
        PageResult<ContentCategoryRecord>
      >(this.url, { params })
    }
  },

  list: {
    url: `${base}/list`,
    name: '内容分类列表',
    get: async function (this: { url: string }) {
      return await request.get<ContentCategoryRecord[], ContentCategoryRecord[]>(this.url)
    }
  },

  detail: {
    url: base,
    name: '内容分类详情',
    get: async function (this: { url: string }, id: string | number) {
      return await request.get<ContentCategoryRecord, ContentCategoryRecord>(`${this.url}/${id}`)
    }
  },

  create: {
    url: `${base}/create`,
    name: '新增内容分类',
    post: async function (this: { url: string }, data: ContentCategoryFormModel) {
      return await request.post(this.url, data)
    }
  },

  update: {
    url: `${base}/update`,
    name: '编辑内容分类',
    post: async function (this: { url: string }, data: ContentCategoryFormModel) {
      return await request.post(this.url, data)
    }
  },

  delete: {
    url: `${base}/delete`,
    name: '删除内容分类',
    post: async function (this: { url: string }, data: { id?: string | number; ids?: unknown[] }) {
      return await request.post(this.url, data)
    }
  }
}
