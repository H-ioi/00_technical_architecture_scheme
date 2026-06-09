import type { PageResult } from '@/types/api'
import type {
  ContentDiscussionLikeSaveFormModel,
  ContentDiscussionLikeSaveListParams,
  ContentDiscussionLikeSaveRecord
} from '@/types/modules/content-discussion-like-save'
import { request } from 'uni-ui-lib'

const base = '/isacommunity/content/like-and-favor'

export default {
  page: {
    url: `${base}/page`,
    name: '点赞收藏分页',
    get: async function (this: { url: string }, params: ContentDiscussionLikeSaveListParams) {
      return await request.get<
        PageResult<ContentDiscussionLikeSaveRecord>,
        PageResult<ContentDiscussionLikeSaveRecord>
      >(this.url, { params })
    }
  },

  detail: {
    url: base,
    name: '点赞收藏详情',
    get: async function (this: { url: string }, id: string | number) {
      return await request.get<ContentDiscussionLikeSaveRecord, ContentDiscussionLikeSaveRecord>(
        `${this.url}/${id}`
      )
    }
  },

  create: {
    url: `${base}/create`,
    name: '新增点赞收藏',
    post: async function (this: { url: string }, data: ContentDiscussionLikeSaveFormModel) {
      return await request.post(this.url, data)
    }
  },

  update: {
    url: `${base}/update`,
    name: '编辑点赞收藏',
    post: async function (this: { url: string }, data: ContentDiscussionLikeSaveFormModel) {
      return await request.post(this.url, data)
    }
  },

  delete: {
    url: `${base}/delete`,
    name: '删除点赞收藏',
    post: async function (this: { url: string }, data: { id?: string | number }) {
      return await request.post(this.url, data)
    }
  }
}
