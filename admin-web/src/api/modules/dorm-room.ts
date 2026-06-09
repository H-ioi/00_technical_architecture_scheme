import type { DormRoomDetail, DormRoomFormModel, DormRoomRecord } from '@/types/modules/dorm-room'
import { request } from 'uni-ui-lib'

const base = '/isacommunity/dormitory/room'

export default {
  list: {
    url: `${base}/list`,
    name: '房间下拉',
    get: async function (this: { url: string }, params?: { floorId?: string | number }) {
      return await request.get<DormRoomRecord[], DormRoomRecord[]>(this.url, { params })
    }
  },

  detail: {
    url: base,
    name: '房间详情',
    get: async function (this: { url: string }, id: string | number) {
      return await request.get<DormRoomDetail, DormRoomDetail>(`${this.url}/${id}`)
    }
  },

  create: {
    url: `${base}/create`,
    name: '新增房间',
    post: async function (this: { url: string }, data: DormRoomFormModel) {
      return await request.post(this.url, data)
    }
  },

  update: {
    url: `${base}/update`,
    name: '更新房间',
    post: async function (this: { url: string }, data: DormRoomFormModel) {
      return await request.post(this.url, data)
    }
  },

  delete: {
    url: `${base}/delete`,
    name: '删除房间',
    post: async function (this: { url: string }, params: { id?: string | number }) {
      return await request.post(this.url, undefined, { params })
    }
  },

  activate: {
    url: `${base}/activate`,
    name: '启用房间',
    post: async function (this: { url: string }, params: { id?: string | number }) {
      return await request.post(this.url, undefined, { params })
    }
  },

  deactivate: {
    url: `${base}/deactivate`,
    name: '禁用房间',
    post: async function (this: { url: string }, params: { id?: string | number }) {
      return await request.post(this.url, undefined, { params })
    }
  }
}
