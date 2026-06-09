import type { PageResult } from '@/types/api'
import type {
  FoodWeeklyFormModel,
  FoodWeeklyListParams,
  FoodWeeklyRecord
} from '@/types/modules/content-food-weekly'
import { request } from 'uni-ui-lib'

const base = '/isacommunity/content/foodweekly'

export default {
  page: {
    url: `${base}/page`,
    name: '一周食谱分页',
    get: async function (this: { url: string }, params: FoodWeeklyListParams) {
      return await request.get<PageResult<FoodWeeklyRecord>, PageResult<FoodWeeklyRecord>>(
        this.url,
        { params }
      )
    }
  },

  detail: {
    url: base,
    name: '一周食谱详情',
    get: async function (this: { url: string }, id: string | number) {
      return await request.get<FoodWeeklyRecord, FoodWeeklyRecord>(`${this.url}/${id}`)
    }
  },

  create: {
    url: `${base}/create`,
    name: '新增一周食谱',
    post: async function (this: { url: string }, data: FoodWeeklyFormModel) {
      return await request.post(this.url, data)
    }
  },

  update: {
    url: `${base}/update`,
    name: '编辑一周食谱',
    post: async function (this: { url: string }, data: FoodWeeklyFormModel) {
      return await request.post(this.url, data)
    }
  },

  delete: {
    url: `${base}/delete`,
    name: '删除一周食谱',
    post: async function (this: { url: string }, data: { id?: string | number }) {
      return await request.post(this.url, data)
    }
  }
}
