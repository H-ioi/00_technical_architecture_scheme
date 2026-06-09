import type {
  DormBedAssignModel,
  DormBedBrief,
  DormBedCheckoutModel,
  DormBedCreateModel,
  DormBedMoveModel
} from '@/types/modules/dorm-bed'
import { request } from 'uni-ui-lib'

const base = '/isacommunity/dormitory/bed'
const assignmentBase = '/isacommunity/dormitory/bed/assignment'

export default {
  list: {
    url: `${base}/list`,
    name: '床位下拉',
    get: async function (this: { url: string }, params?: { roomId?: string | number }) {
      return await request.get<DormBedBrief[], DormBedBrief[]>(this.url, { params })
    }
  },

  create: {
    url: `${base}/create`,
    name: '新增床位',
    post: async function (this: { url: string }, data: DormBedCreateModel) {
      return await request.post(this.url, data)
    }
  },

  delete: {
    url: `${base}/delete`,
    name: '删除床位',
    post: async function (this: { url: string }, params: { id?: string | number }) {
      return await request.post(this.url, undefined, { params })
    }
  },

  assign: {
    url: `${assignmentBase}/assign`,
    name: '办理入住',
    post: async function (this: { url: string }, data: DormBedAssignModel) {
      return await request.post(this.url, data)
    }
  },

  checkout: {
    url: `${assignmentBase}/checkout`,
    name: '退宿',
    post: async function (this: { url: string }, data: DormBedCheckoutModel) {
      return await request.post(this.url, data)
    }
  },

  move: {
    url: `${assignmentBase}/move`,
    name: '换宿',
    post: async function (this: { url: string }, data: DormBedMoveModel) {
      return await request.post(this.url, data)
    }
  },

  autoAssign: {
    url: `${assignmentBase}/autoAssign`,
    name: '批量自动分配床位',
    post: async function (
      this: { url: string },
      data: { admissionNos?: string; dryRun?: boolean }
    ) {
      return await request.post(this.url, data)
    }
  },

  checkoutBatch: {
    url: `${assignmentBase}/checkoutBatch`,
    name: '批量退宿',
    post: async function (this: { url: string }, params: { admissionNos?: string }) {
      return await request.post(this.url, undefined, { params })
    }
  }
}
