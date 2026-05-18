import { API_PATHS } from '@/api/constants'
import { normalizeArray } from '@/utils/api-response-normalize'
import { request } from 'uni-ui-lib'

const path = API_PATHS.schoolEmailConfig

/** 活动等业务下拉：校区邮箱配置列表。 */
export default {
  list: {
    name: '校区邮箱配置列表',
    get: async (params: Record<string, unknown>) =>
      await request.get<unknown>(`${path}/list`, { params })
  },
  detail: {
    name: '校区邮箱配置详情',
    get: async (id: string | number) => await request.get(`${path}/get/${id}`)
  }
}

/** 将列表接口结果规范为行数组。 */
export const normalizeSchoolEmailConfigList = (raw: unknown) => normalizeArray(raw)
