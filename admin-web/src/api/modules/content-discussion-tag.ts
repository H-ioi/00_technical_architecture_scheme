import type { PageResult } from '@/types/api'
import type {
  ContentDiscussionTagFormModel,
  ContentDiscussionTagListParams,
  ContentDiscussionTagRecord
} from '@/types/modules/content-discussion-tag'
import { request } from 'uni-ui-lib'

const base = '/isacommunity/content/discussion-tag'

export default {
  page: {
    url: `${base}/page`,
    name: '讨论标签分页',
    get: async function (this: { url: string }, params: ContentDiscussionTagListParams) {
      return await request.get<
        PageResult<ContentDiscussionTagRecord>,
        PageResult<ContentDiscussionTagRecord>
      >(this.url, { params })
    }
  },

  list: {
    url: `${base}/list`,
    name: '讨论标签列表',
    get: async function (this: { url: string }) {
      return await request.get<ContentDiscussionTagRecord[], ContentDiscussionTagRecord[]>(this.url)
    }
  },

  detail: {
    url: base,
    name: '讨论标签详情',
    get: async function (this: { url: string }, id: string | number) {
      return await request.get<ContentDiscussionTagRecord, ContentDiscussionTagRecord>(
        `${this.url}/${id}`
      )
    }
  },

  create: {
    url: `${base}/create`,
    name: '新增讨论标签',
    post: async function (this: { url: string }, data: ContentDiscussionTagFormModel) {
      return await request.post(this.url, data)
    }
  },

  update: {
    url: `${base}/update`,
    name: '编辑讨论标签',
    put: async function (this: { url: string }, data: ContentDiscussionTagFormModel) {
      return await request.put(this.url, data)
    }
  },

  delete: {
    url: `${base}/delete`,
    name: '删除讨论标签',
    post: async function (this: { url: string }, id: string | number) {
      return await request.post(`${this.url}?id=${id}`)
    }
  }
}
