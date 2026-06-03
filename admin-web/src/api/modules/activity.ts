import { API_PATHS } from '@/api/constants'
import type { PageResult } from '@/types/api'
import type { ActivityListParams } from '@/types/modules/activity-list'
import type { AxiosResponse } from 'axios'
import { request, type UniRawResponseRequestConfig } from 'uni-ui-lib'

const path = API_PATHS.activity
const feedbackPath = API_PATHS.activityFeedback
const blessingPath = `${API_PATHS.activityProgram}/blessing`
const prizeAwardPath = `${API_PATHS.activityPrize}/award`

const repeatQuery = (key: string, values: Array<string | number>) =>
  values.map((v) => `${key}=${encodeURIComponent(String(v))}`).join('&')

const blobResponseConfig = (params?: Record<string, unknown>): UniRawResponseRequestConfig => ({
  params,
  responseType: 'blob',
  rawResponse: true
})

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
      await request.get<Blob, AxiosResponse<Blob>>(
        `${feedbackPath}/exportFeedback/${activityId}`,
        blobResponseConfig()
      )
  },
  visibleScopeTemplate: {
    name: '下载活动可见范围导入模板',
    get: async () =>
      await request.get<Blob, AxiosResponse<Blob>>(
        `${path}/visibleScopeFile/download`,
        blobResponseConfig()
      )
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
  },
  visibleScopeListByFile: {
    name: '按文件分页查询活动可见范围名单',
    get: async (params: { fileId: string | number; current?: number; size?: number }) =>
      await request.get(`${path}/visibleScopeList/listByFile`, { params })
  },
  ticketPage: {
    name: '活动报名分页',
    get: async (params: Record<string, unknown>) =>
      await request.get(`${path}/ticket/getPage`, { params })
  },
  ticketEdit: {
    name: '编辑活动报名',
    post: async (data: Record<string, unknown>) => await request.post(`${path}/ticket/edit`, data)
  },
  ticketTemplate: {
    name: '下载活动报名导入模板',
    get: async () =>
      await request.get<Blob, AxiosResponse<Blob>>(`${path}/ticket/download`, blobResponseConfig())
  },
  ticketImport: {
    name: '导入活动报名',
    post: async (file: File) => {
      const fd = new FormData()
      fd.append('file', file)
      return await request.post(`${path}/ticket/import`, fd, {
        headers: { VERSION: 'B' }
      })
    }
  },
  ticketRemove: {
    name: '删除活动报名',
    delete: async (ids: Array<string | number>) =>
      await request.delete(`${path}/ticket/del?${repeatQuery('ids', ids)}`)
  },
  checkinPage: {
    name: '活动签到分页',
    get: async (params: Record<string, unknown>) =>
      await request.get(`${path}/checkin/getPage`, { params })
  },
  checkinEdit: {
    name: '编辑活动签到',
    post: async (data: Record<string, unknown>) => await request.post(`${path}/checkin/edit`, data)
  },
  feedbackPage: {
    name: '活动反馈分页',
    get: async (params: Record<string, unknown>) =>
      await request.get(`${feedbackPath}/getFeedbackPage`, { params })
  },
  feedbackDetail: {
    name: '活动反馈详情',
    get: async (id: string | number) => await request.get(`${feedbackPath}/get/${id}`)
  },
  feedbackEdit: {
    name: '编辑活动反馈',
    post: async (data: Record<string, unknown>) => await request.post(`${feedbackPath}/edit`, data)
  },
  feedbackRemove: {
    name: '删除活动反馈',
    delete: async (ids: Array<string | number>) =>
      await request.delete(`${feedbackPath}/del?${repeatQuery('ids', ids)}`)
  },
  blessingPage: {
    name: '祝福语分页',
    get: async (params: Record<string, unknown>) =>
      await request.get(`${blessingPath}/getBlessingPage`, { params })
  },
  blessingDetail: {
    name: '祝福语详情',
    get: async (id: string | number) => await request.get(`${blessingPath}/get/${id}`)
  },
  blessingAdd: {
    name: '新增祝福语',
    post: async (data: Record<string, unknown>) => await request.post(`${blessingPath}/add`, data)
  },
  blessingEdit: {
    name: '编辑祝福语',
    post: async (data: Record<string, unknown>) => await request.post(`${blessingPath}/edit`, data)
  },
  blessingRemove: {
    name: '删除祝福语',
    delete: async (ids: Array<string | number>) =>
      await request.delete(`${blessingPath}/del?${repeatQuery('ids', ids)}`)
  },
  prizeAwardLotteryPage: {
    name: '抽奖获奖分页',
    get: async (params: Record<string, unknown>) =>
      await request.get(`${prizeAwardPath}/getLotteryPage`, { params })
  },
  prizeAwardCompetitionPage: {
    name: '比赛获奖分页',
    get: async (params: Record<string, unknown>) =>
      await request.get(`${prizeAwardPath}/getCompetitionPage`, { params })
  },
  prizeAwardDetail: {
    name: '获奖详情',
    get: async (id: string | number) => await request.get(`${prizeAwardPath}/get/${id}`)
  },
  prizeAwardByTicketCode: {
    name: '按票码查询获奖人',
    get: async (ticketCode: string) =>
      await request.get(`${prizeAwardPath}/getByTicketCode`, { params: { ticketCode } })
  },
  prizeAwardAdd: {
    name: '新增获奖记录',
    post: async (data: Record<string, unknown>) => await request.post(`${prizeAwardPath}/add`, data)
  },
  prizeAwardEdit: {
    name: '编辑获奖记录',
    post: async (data: Record<string, unknown>) =>
      await request.post(`${prizeAwardPath}/edit`, data)
  },
  prizeAwardRemove: {
    name: '删除获奖记录',
    delete: async (ids: Array<string | number>) =>
      await request.delete(`${prizeAwardPath}/del?${repeatQuery('ids', ids)}`)
  },
  prizeAwardLotteryExport: {
    name: '导出抽奖获奖',
    get: async (params: Record<string, unknown>) =>
      await request.get<Blob, AxiosResponse<Blob>>(
        `${prizeAwardPath}/exportLottery`,
        blobResponseConfig(params)
      )
  },
  prizeAwardCompetitionExport: {
    name: '导出比赛获奖',
    get: async (params: Record<string, unknown>) =>
      await request.get<Blob, AxiosResponse<Blob>>(
        `${prizeAwardPath}/exportCompetition`,
        blobResponseConfig(params)
      )
  }
}
