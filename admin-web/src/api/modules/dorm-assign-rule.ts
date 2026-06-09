import type { PageResult } from '@/types/api'
import type {
  DormAssignRuleDetail,
  DormAssignRuleItemOption,
  DormAssignRulePageParams,
  DormAssignRulePayload,
  DormAssignRuleRecord
} from '@/types/modules/dorm-assign-rule'
import { request } from 'uni-ui-lib'

const base = '/isacommunity/dormitory/bed/assign-rule'

export default {
  page: {
    url: `${base}/page`,
    name: '床位分配规则分页',
    get: async function (this: { url: string }, params: DormAssignRulePageParams) {
      return await request.get<PageResult<DormAssignRuleRecord>, PageResult<DormAssignRuleRecord>>(
        this.url,
        { params }
      )
    }
  },

  detail: {
    url: base,
    name: '床位分配规则详情',
    get: async function (this: { url: string }, id: string | number) {
      return await request.get<DormAssignRuleDetail, DormAssignRuleDetail>(`${this.url}/${id}`)
    }
  },

  ruleItemList: {
    url: `${base}/ruleItemList`,
    name: '分配规则项下拉',
    get: async function (this: { url: string }) {
      return await request.get<DormAssignRuleItemOption[], DormAssignRuleItemOption[]>(this.url)
    }
  },

  create: {
    url: `${base}/create`,
    name: '新增分配规则',
    post: async function (this: { url: string }, data: DormAssignRulePayload) {
      return await request.post(this.url, data)
    }
  },

  update: {
    url: `${base}/update`,
    name: '更新分配规则',
    post: async function (this: { url: string }, data: DormAssignRulePayload) {
      return await request.post(this.url, data)
    }
  },

  deleteBatch: {
    url: `${base}/deleteBatch`,
    name: '批量删除分配规则',
    post: async function (this: { url: string }, params: { ids: string }) {
      return await request.post(this.url, undefined, { params })
    }
  }
}
