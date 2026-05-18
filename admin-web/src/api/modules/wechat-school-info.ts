import { API_PATHS } from '@/api/constants'
import type { WechatSchoolInfoListParams } from '@/types/modules/wechat-school-info'
import { request } from 'uni-ui-lib'

const path = API_PATHS.wechatSchoolInfo
const repeatQuery = (key: string, values: Array<string | number>) =>
  values.map((v) => `${key}=${encodeURIComponent(String(v))}`).join('&')

export default {
  page: {
    name: '校区微信配置分页',
    get: async (params: WechatSchoolInfoListParams) =>
      await request.get(`${path}/getWechatInfoPage`, { params })
  },
  detail: {
    name: '校区微信配置详情',
    get: async (id: string | number) => await request.get(`${path}/get/${id}`)
  },
  add: {
    name: '新增校区微信配置',
    post: async (data: Record<string, unknown>) => await request.post(`${path}/add`, data)
  },
  edit: {
    name: '编辑校区微信配置',
    post: async (data: Record<string, unknown>) => await request.post(`${path}/edit`, data)
  },
  remove: {
    name: '删除校区微信配置',
    delete: async (ids: Array<string | number>) =>
      await request.delete(`${path}/del?${repeatQuery('ids', ids)}`)
  }
}
