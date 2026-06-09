import type { PageResult } from '@/types/api'
import type {
  ContentAnnouncementFormModel,
  ContentAnnouncementListParams,
  ContentAnnouncementRecord
} from '@/types/modules/content-announcement'
import { request } from 'uni-ui-lib'

const base = '/isacommunity/content/announcement'

export default {
  page: {
    url: `${base}/page`,
    name: '公告分页',
    get: async function (this: { url: string }, params: ContentAnnouncementListParams) {
      return await request.get<
        PageResult<ContentAnnouncementRecord>,
        PageResult<ContentAnnouncementRecord>
      >(this.url, { params })
    }
  },

  detail: {
    url: base,
    name: '公告详情',
    get: async function (this: { url: string }, id: string | number) {
      return await request.get<ContentAnnouncementRecord, ContentAnnouncementRecord>(
        `${this.url}/${id}`
      )
    }
  },

  create: {
    url: `${base}/create`,
    name: '新增公告',
    post: async function (this: { url: string }, data: ContentAnnouncementFormModel) {
      return await request.post(this.url, data)
    }
  },

  update: {
    url: `${base}/update`,
    name: '编辑公告',
    post: async function (this: { url: string }, data: ContentAnnouncementFormModel) {
      return await request.post(this.url, data)
    }
  },

  delete: {
    url: `${base}/delete`,
    name: '删除公告',
    post: async function (this: { url: string }, data: { id?: string | number; ids?: unknown[] }) {
      return await request.post(this.url, data)
    }
  }
}
