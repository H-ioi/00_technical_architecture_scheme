import { API_PATHS } from '@/api/constants'
import { request } from 'uni-ui-lib'

const path = API_PATHS.activity

/** 问卷等下拉：`GET /list`（旧 `getActivityList`） */
export default {
  listBrief: {
    name: '活动简要列表',
    get: async (params?: Record<string, unknown>) =>
      await request.get<unknown[]>(`${path}/list`, { params })
  }
}
