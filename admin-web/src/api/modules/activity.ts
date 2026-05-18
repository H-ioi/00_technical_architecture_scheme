import { API_PATHS } from '@/api/constants'
import type { PageResult } from '@/types/api'
import type { ActivityListParams } from '@/types/modules/activity-list'
import { request } from 'uni-ui-lib'

const path = API_PATHS.activity
const feedbackPath = API_PATHS.activityFeedback

const repeatQuery = (key: string, values: Array<string | number>) =>
  values.map((v) => `${key}=${encodeURIComponent(String(v))}`).join('&')

/** 问卷等下拉：`GET /list`（旧 `getActivityList`） */
export default {
  listBrief: {
    name: '活动简要列表',
    get: async (params?: Record<string, unknown>) =>
      await request.get<unknown[]>(`${path}/list`, { params })
  },
  page: {
    name: '活动分页',
    get: async (params: ActivityListParams) =>
      await request.get<PageResult<Record<string, unknown>>, PageResult<Record<string, unknown>>>(
        `${path}/getActivityPage`,
        { params }
      )
  },
  detail: {
    name: '活动详情',
    get: async (id: string | number) => await request.get(`${path}/get/${id}`)
  },
  add: {
    name: '新增活动',
    post: async (data: Record<string, unknown>) => await request.post(`${path}/add`, data)
  },
  edit: {
    name: '编辑活动',
    post: async (data: Record<string, unknown>) => await request.post(`${path}/edit`, data)
  },
  remove: {
    name: '删除活动',
    delete: async (ids: Array<string | number>) =>
      await request.delete(`${path}/del?${repeatQuery('ids', ids)}`)
  },
  batchPublish: {
    name: '批量发布活动',
    post: async (ids: Array<string | number>) =>
      await request.post(`${path}/batchPublishActivityStatus?${repeatQuery('ids', ids)}`)
  },
  sendWechat: {
    name: '发送活动到微信',
    post: async (activityId: string | number) =>
      await request.post(`${path}/sendWechatMessage`, undefined, { params: { activityId } })
  },
  sendWechatTest: {
    name: '发送活动到微信（测试）',
    post: async (activityId: string | number) =>
      await request.post(`${path}/sendWechatMessageTest`, undefined, { params: { activityId } })
  },
  feedbackExport: {
    name: '按活动导出反馈',
    get: async (activityId: string | number) =>
      await request.get<Blob, Blob>(`${feedbackPath}/exportFeedback/${activityId}`, {
        responseType: 'blob'
      })
  },
  visibleScopeTemplate: {
    name: '下载活动可见范围导入模板',
    get: async () =>
      await request.get<Blob, Blob>(`${path}/visibleScopeFile/download`, { responseType: 'blob' })
  },
  visibleScopeImport: {
    name: '导入活动可见范围名单',
    post: async (activityId: string | number, file: File) => {
      const fd = new FormData()
      fd.append('file', file)
      return await request.post(`${path}/visibleScopeFile/import`, fd, {
        params: { activityId }
      })
    }
  }
}
