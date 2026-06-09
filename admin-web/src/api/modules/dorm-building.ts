import type { PageResult } from '@/types/api'
import type {
  DormBuildingBrief,
  DormBuildingFormModel,
  DormBuildingListParams,
  DormBuildingRecord
} from '@/types/modules/dorm-building'
import { request } from 'uni-ui-lib'

const base = '/isacommunity/dormitory/building'

export default {
  page: {
    url: `${base}/page`,
    name: '楼栋分页',
    get: async function (this: { url: string }, params: DormBuildingListParams) {
      return await request.get<PageResult<DormBuildingRecord>, PageResult<DormBuildingRecord>>(
        this.url,
        { params }
      )
    }
  },

  list: {
    url: `${base}/list`,
    name: '楼栋下拉',
    get: async function (this: { url: string }, params?: { schoolId?: string | number }) {
      return await request.get<DormBuildingBrief[], DormBuildingBrief[]>(this.url, { params })
    }
  },

  detail: {
    url: base,
    name: '楼栋详情',
    get: async function (this: { url: string }, id: string | number) {
      return await request.get<DormBuildingRecord, DormBuildingRecord>(`${this.url}/${id}`)
    }
  },

  create: {
    url: `${base}/create`,
    name: '新增楼栋',
    post: async function (this: { url: string }, data: DormBuildingFormModel) {
      return await request.post(this.url, data)
    }
  },

  update: {
    url: `${base}/update`,
    name: '更新楼栋',
    post: async function (this: { url: string }, data: DormBuildingFormModel) {
      return await request.post(this.url, data)
    }
  },

  delete: {
    url: `${base}/delete`,
    name: '删除楼栋',
    post: async function (this: { url: string }, params: { id?: string | number }) {
      return await request.post(this.url, undefined, { params })
    }
  },

  activate: {
    url: `${base}/activate`,
    name: '启用楼栋',
    post: async function (this: { url: string }, params: { id?: string | number }) {
      return await request.post(this.url, undefined, { params })
    }
  },

  deactivate: {
    url: `${base}/deactivate`,
    name: '禁用楼栋',
    post: async function (this: { url: string }, params: { id?: string | number }) {
      return await request.post(this.url, undefined, { params })
    }
  }
}
