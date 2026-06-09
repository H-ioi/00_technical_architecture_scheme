import type { PageResult } from '@/types/api'
import type { DormFloorBrief, DormFloorRecord } from '@/types/modules/dorm-building'
import type { DormFloorFormModel } from '@/types/modules/dorm-floor'
import type { DormFloorPageParams, DormFloorWithRooms } from '@/types/modules/dorm-room'
import { request } from 'uni-ui-lib'

const base = '/isacommunity/dormitory/floor'

export default {
  page: {
    url: `${base}/page`,
    name: '楼层分页',
    get: async function (this: { url: string }, params: DormFloorPageParams) {
      return await request.get<PageResult<DormFloorWithRooms>, PageResult<DormFloorWithRooms>>(
        this.url,
        { params }
      )
    }
  },

  list: {
    url: `${base}/list`,
    name: '楼层下拉',
    get: async function (this: { url: string }, params?: { buildingId?: string | number }) {
      return await request.get<DormFloorBrief[], DormFloorBrief[]>(this.url, { params })
    }
  },

  detail: {
    url: base,
    name: '楼层详情',
    get: async function (this: { url: string }, id: string | number) {
      return await request.get<DormFloorRecord, DormFloorRecord>(`${this.url}/${id}`)
    }
  },

  create: {
    url: `${base}/create`,
    name: '新增楼层',
    post: async function (this: { url: string }, data: DormFloorFormModel) {
      return await request.post(this.url, data)
    }
  },

  update: {
    url: `${base}/update`,
    name: '更新楼层',
    post: async function (this: { url: string }, data: DormFloorFormModel) {
      return await request.post(this.url, data)
    }
  },

  delete: {
    url: `${base}/delete`,
    name: '删除楼层',
    post: async function (this: { url: string }, params: { id?: string | number }) {
      return await request.post(this.url, undefined, { params })
    }
  },

  activate: {
    url: `${base}/activate`,
    name: '启用楼层',
    post: async function (this: { url: string }, params: { id?: string | number }) {
      return await request.post(this.url, undefined, { params })
    }
  },

  deactivate: {
    url: `${base}/deactivate`,
    name: '禁用楼层',
    post: async function (this: { url: string }, params: { id?: string | number }) {
      return await request.post(this.url, undefined, { params })
    }
  }
}
