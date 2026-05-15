import { API_PATHS } from '@/api/constants'
import type { PageResult } from '@/types/api'
import { request } from 'uni-ui-lib'

const path = API_PATHS.activityQuestionnaire

export default {
  page: {
    name: '问卷分页',
    get: async (params: Record<string, unknown>) =>
      await request.get<PageResult<Record<string, unknown>>, PageResult<Record<string, unknown>>>(
        `${path}/getQuestionnairePage`,
        { params }
      )
  },
  detail: {
    name: '问卷详情',
    get: async (id: string | number) => await request.get(`${path}/get/${id}`)
  },
  add: {
    name: '新增问卷',
    post: async (data: Record<string, unknown>) => await request.post(`${path}/add`, data)
  },
  edit: {
    name: '编辑问卷',
    post: async (data: Record<string, unknown>) => await request.post(`${path}/edit`, data)
  },
  copy: {
    name: '复制问卷',
    post: async (data: Record<string, unknown>) => await request.post(`${path}/copy`, data)
  },
  editStatus: {
    name: '批量修改问卷有效状态',
    post: async (ids: Array<string | number>, status: string | number) => {
      const fd = new FormData()
      ids.forEach((id) => fd.append('ids', String(id)))
      fd.append('status', String(status))
      return await request.post(`${path}/editStatus`, fd)
    }
  },
  editFrozen: {
    name: '批量修改问卷冻结状态',
    post: async (ids: Array<string | number>, frozen: string | number) => {
      const fd = new FormData()
      ids.forEach((id) => fd.append('ids', String(id)))
      fd.append('frozen', String(frozen))
      return await request.post(`${path}/editFrozen`, fd)
    }
  },
  exportAnswersBlob: {
    name: '导出问卷',
    get: async (id: string | number) =>
      await request.get<Blob, Blob>(`${path}/export/${id}`, { responseType: 'blob' })
  },
  remove: {
    name: '删除问卷',
    delete: async (ids: Array<string | number>) => {
      const fd = new FormData()
      ids.forEach((id) => fd.append('ids', String(id)))
      return await request.delete(`${path}/del`, { data: fd })
    }
  },
  exportByActivityBlob: {
    name: '按活动导出问卷答案',
    get: async (activityId: string | number) =>
      await request.get<Blob, Blob>(`${path}/exportByActivity/${activityId}`, {
        responseType: 'blob'
      })
  }
}
