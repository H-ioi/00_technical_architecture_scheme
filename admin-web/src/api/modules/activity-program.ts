import { API_PATHS } from '@/api/constants'
import type { ActivityProgramListParams } from '@/types/modules/activity-program-list'
import { request } from 'uni-ui-lib'

const path = API_PATHS.activityProgram

const repeatQuery = (key: string, values: Array<string | number>) =>
  values.map((v) => `${key}=${encodeURIComponent(String(v))}`).join('&')

export default {
  page: {
    name: '活动项目分页',
    get: async (params: ActivityProgramListParams) =>
      await request.get(`${path}/getProgramPage`, { params })
  },
  detail: {
    name: '活动项目详情',
    get: async (id: string | number) => await request.get(`${path}/get/${id}`)
  },
  listBrief: {
    name: '活动项目简要列表',
    get: async (params?: Record<string, unknown>) => await request.get(`${path}/list`, { params })
  },
  add: {
    name: '新增活动项目',
    post: async (data: Record<string, unknown>[]) => await request.post(`${path}/add`, data)
  },
  edit: {
    name: '编辑活动项目',
    post: async (data: Record<string, unknown>[]) => await request.post(`${path}/edit`, data)
  },
  remove: {
    name: '删除活动项目',
    delete: async (ids: Array<string | number>) =>
      await request.delete(`${path}/del?${repeatQuery('ids', ids)}`)
  },
  copyBatch: {
    name: '批量复制活动项目',
    post: async (data: {
      sourceProgramIds: Array<string | number>
      namePrefix: string
      targetActivityId: string | number
    }) => await request.post(`${path}/copyBatch`, data)
  },
  editStatus: {
    name: '切换活动项目状态',
    post: async (data: { id: string | number; startFlag: boolean }) => {
      const formData = new FormData()
      formData.append('id', String(data.id))
      formData.append('startFlag', String(data.startFlag))

      return await request.post(`${path}/editStatus`, formData)
    }
  }
}
