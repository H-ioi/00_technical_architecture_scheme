import type { PageResult } from '@/types/api'
import type {
  HealthReportFormModel,
  HealthReportListRow,
  HealthReportPageParams
} from '@/types/modules/school-doctor-health-report'
import { request } from 'uni-ui-lib'

const base = '/isacommunity/clinic/health/exam/report'

export default {
  page: {
    name: '体检报告分页',
    get: async (params: HealthReportPageParams) =>
      await request.get<PageResult<HealthReportListRow>, PageResult<HealthReportListRow>>(
        `${base}/paginate`,
        { params }
      )
  },

  detail: {
    name: '体检报告详情',
    get: async (id: string | number) =>
      await request.get<HealthReportFormModel, HealthReportFormModel>(`${base}/get/${id}`)
  },

  add: {
    name: '新增体检报告',
    post: async (data: HealthReportFormModel) => await request.post(`${base}/add`, data)
  },

  edit: {
    name: '更新体检报告',
    post: async (data: HealthReportFormModel) => await request.post(`${base}/edit`, data)
  },

  deleteBatch: {
    name: '批量删除体检报告',
    delete: async (ids: string) => await request.delete(`${base}/del`, { params: { ids } })
  },

  import: {
    name: '导入体检报告',
    post: async (file: File) => {
      const fd = new FormData()
      fd.append('file', file)
      return await request.post(`${base}/import`, fd, {
        headers: { 'Content-Type': 'multipart/form-data', VERSION: 'B' }
      })
    }
  },

  export: {
    name: '导出体检报告',
    get: async (params: HealthReportPageParams) =>
      await request.get<Blob, Blob>(`${base}/export`, { params, responseType: 'blob' })
  }
}
