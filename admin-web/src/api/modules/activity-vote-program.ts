import { API_PATHS } from '@/api/constants'
import type { ActivityVoteProgramListParams } from '@/types/modules/activity-vote-program'
import { request } from 'uni-ui-lib'

const path = API_PATHS.activityVoteProgram

const repeatQuery = (key: string, values: Array<string | number>) =>
  values.map((v) => `${key}=${encodeURIComponent(String(v))}`).join('&')

export default {
  page: {
    name: '投票节目分页',
    get: async (params: ActivityVoteProgramListParams) =>
      await request.get(`${path}/getVoteProgramPage`, { params })
  },
  detail: {
    name: '投票节目详情',
    get: async (id: string | number) => await request.get(`${path}/get/${id}`)
  },
  list: {
    name: '投票节目列表',
    get: async (params?: Record<string, unknown>) => await request.get(`${path}/list`, { params })
  },
  listByProgram: {
    name: '按活动项目获取投票节目',
    get: async (params: { programId: string | number }) =>
      await request.get(`${path}/listByprogram`, { params })
  },
  add: {
    name: '新增投票节目',
    post: async (data: Record<string, unknown>) => await request.post(`${path}/add`, data)
  },
  edit: {
    name: '编辑投票节目',
    post: async (data: Record<string, unknown>) => await request.post(`${path}/edit`, data)
  },
  remove: {
    name: '删除投票节目',
    delete: async (ids: Array<string | number>) =>
      await request.delete(`${path}/del?${repeatQuery('ids', ids)}`)
  },
  recordPage: {
    name: '投票记录分页',
    get: async (params: Record<string, unknown>) =>
      await request.get(`${path}/voteRecord/getVoteRecordPage`, { params })
  },
  recordAdd: {
    name: '新增投票记录',
    post: async (data: Record<string, unknown>) =>
      await request.post(`${path}/voteRecord/add`, data)
  },
  recordRemove: {
    name: '删除投票记录',
    delete: async (ids: Array<string | number>) =>
      await request.delete(`${path}/voteRecord/del?${repeatQuery('ids', ids)}`)
  }
}
