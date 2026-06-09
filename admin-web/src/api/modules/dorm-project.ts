import type { PageResult } from '@/types/api'
import type { DormProjectBrief } from '@/types/modules/dorm-room'
import type {
  DormProjectDetail,
  DormProjectFormModel,
  DormProjectPageParams,
  DormProjectRecord
} from '@/types/modules/dorm-project'
import { request } from 'uni-ui-lib'

const base = '/isacommunity/dormitory/project'

export default {
  page: {
    url: `${base}/page`,
    name: '宿舍属性分页',
    get: async function (this: { url: string }, params: DormProjectPageParams) {
      return await request.get<PageResult<DormProjectRecord>, PageResult<DormProjectRecord>>(
        this.url,
        { params }
      )
    }
  },

  list: {
    url: `${base}/list`,
    name: '宿舍属性下拉',
    get: async function (this: { url: string }, params?: { schoolId?: string | number }) {
      return await request.get<DormProjectBrief[], DormProjectBrief[]>(this.url, { params })
    }
  },

  detail: {
    url: base,
    name: '宿舍属性详情',
    get: async function (this: { url: string }, id: string | number) {
      return await request.get<DormProjectDetail, DormProjectDetail>(`${this.url}/${id}`)
    }
  },

  create: {
    url: `${base}/create`,
    name: '新增宿舍属性',
    post: async function (this: { url: string }, data: DormProjectFormModel) {
      return await request.post(this.url, data)
    }
  },

  update: {
    url: `${base}/update`,
    name: '更新宿舍属性',
    post: async function (this: { url: string }, data: DormProjectFormModel) {
      return await request.post(this.url, data)
    }
  },

  deleteBatch: {
    url: `${base}/deleteBatch`,
    name: '批量删除宿舍属性',
    post: async function (this: { url: string }, params: { ids: string }) {
      return await request.post(this.url, undefined, { params })
    }
  }
}
