import type { SchoolEmailConfigListParams } from '@/types/modules/school-email-config'
import { normalizeArray } from '@/utils/api-response-normalize'
import { request } from 'uni-ui-lib'

const path = '/isacommunity/schoolEmailConfig'
const repeatQuery = (key: string, values: Array<string | number>) =>
  values.map((v) => `${key}=${encodeURIComponent(String(v))}`).join('&')

/** 活动等业务下拉：校区邮箱配置列表。 */
export default {
  page: {
    name: '校区邮箱配置分页',
    get: async (params: SchoolEmailConfigListParams) =>
      await request.get<unknown>(`${path}/getEmailConfigPage`, { params })
  },
  list: {
    name: '校区邮箱配置列表',
    get: async (params: Record<string, unknown>) =>
      await request.get<unknown>(`${path}/list`, { params })
  },
  detail: {
    name: '校区邮箱配置详情',
    get: async (id: string | number) => await request.get(`${path}/get/${id}`)
  },
  add: {
    name: '新增校区邮箱配置',
    post: async (data: Record<string, unknown>) => await request.post(`${path}/add`, data)
  },
  edit: {
    name: '编辑校区邮箱配置',
    post: async (data: Record<string, unknown>) => await request.post(`${path}/edit`, data)
  },
  remove: {
    name: '删除校区邮箱配置',
    delete: async (ids: Array<string | number>) =>
      await request.delete(`${path}/del?${repeatQuery('ids', ids)}`)
  },
  appModules: {
    name: '邮箱应用模块下拉',
    get: async () => await request.get(`${path}/appModules`)
  }
}

/** 将列表接口结果规范为行数组。 */
export const normalizeSchoolEmailConfigList = (raw: unknown) => normalizeArray(raw)
