import type { PageResult } from '@/types/api'
import type {
  InfectiousDiseaseFormModel,
  InfectiousDiseaseListRow,
  InfectiousDiseasePageParams
} from '@/types/modules/school-doctor-infectious-disease'
import { request } from 'uni-ui-lib'

const base = '/isacommunity/clinic/infectious'

export default {
  page: {
    name: '传染病分页',
    get: async (params: InfectiousDiseasePageParams) =>
      await request.get<PageResult<InfectiousDiseaseListRow>, PageResult<InfectiousDiseaseListRow>>(
        `${base}/paginate`,
        { params }
      )
  },

  detail: {
    name: '传染病详情',
    get: async (id: string | number) =>
      await request.get<InfectiousDiseaseFormModel, InfectiousDiseaseFormModel>(`${base}/get/${id}`)
  },

  add: {
    name: '新增传染病',
    post: async (data: InfectiousDiseaseFormModel) => await request.post(`${base}/add`, data)
  },

  edit: {
    name: '更新传染病',
    post: async (data: InfectiousDiseaseFormModel) => await request.post(`${base}/edit`, data)
  },

  deleteBatch: {
    name: '批量删除传染病',
    delete: async (ids: string) => await request.delete(`${base}/del`, { params: { ids } })
  },

  import: {
    name: '导入传染病',
    post: async (file: File) => {
      const fd = new FormData()
      fd.append('file', file)
      return await request.post(`${base}/import`, fd, {
        headers: { 'Content-Type': 'multipart/form-data', VERSION: 'B' }
      })
    }
  },

  export: {
    name: '导出传染病',
    get: async (params: InfectiousDiseasePageParams) =>
      await request.get<Blob, Blob>(`${base}/export`, { params, responseType: 'blob' })
  }
}
