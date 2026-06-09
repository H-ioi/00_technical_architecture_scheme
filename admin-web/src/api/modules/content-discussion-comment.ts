import type { PageResult } from '@/types/api'
import type {
  ContentDiscussionCommentFormModel,
  ContentDiscussionCommentListParams,
  ContentDiscussionCommentRecord
} from '@/types/modules/content-discussion-comment'
import { request } from 'uni-ui-lib'

const base = '/isacommunity/content/comment'

export default {
  page: {
    url: `${base}/page`,
    name: '讨论评论分页',
    get: async function (this: { url: string }, params: ContentDiscussionCommentListParams) {
      return await request.get<
        PageResult<ContentDiscussionCommentRecord>,
        PageResult<ContentDiscussionCommentRecord>
      >(this.url, { params })
    }
  },

  detail: {
    url: base,
    name: '讨论评论详情',
    get: async function (this: { url: string }, id: string | number) {
      return await request.get<ContentDiscussionCommentRecord, ContentDiscussionCommentRecord>(
        `${this.url}/detail/${id}`
      )
    }
  },

  create: {
    url: `${base}/create`,
    name: '新增讨论评论',
    post: async function (this: { url: string }, data: ContentDiscussionCommentFormModel) {
      return await request.post(this.url, data)
    }
  },

  update: {
    url: `${base}/update`,
    name: '编辑讨论评论',
    post: async function (this: { url: string }, data: ContentDiscussionCommentFormModel) {
      return await request.post(this.url, data)
    }
  },

  delete: {
    url: base,
    name: '删除讨论评论',
    post: async function (this: { url: string }, id: string | number) {
      return await request.post(`${this.url}/${id}`)
    }
  }
}
