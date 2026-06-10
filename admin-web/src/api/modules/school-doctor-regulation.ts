import type { PageResult } from '@/types/api'
import type {
  SchoolDoctorRegulationFormModel,
  SchoolDoctorRegulationListRow,
  SchoolDoctorRegulationPageParams
} from '@/types/modules/school-doctor-regulation'
import { request } from 'uni-ui-lib'

const base = '/isacommunity/clinic/regulation'

export default {
  page: {
    name: '规章制度分页',
    get: async (params: SchoolDoctorRegulationPageParams) =>
      await request.get<PageResult<SchoolDoctorRegulationListRow>, PageResult<SchoolDoctorRegulationListRow>>(
        `${base}/paginate`,
        { params }
      )
  },

  detail: {
    name: '规章制度详情',
    get: async (id: string | number) =>
      await request.get<SchoolDoctorRegulationFormModel, SchoolDoctorRegulationFormModel>(`${base}/get/${id}`)
  },

  add: {
    name: '新增规章制度',
    post: async (data: SchoolDoctorRegulationFormModel) => await request.post(`${base}/add`, data)
  },

  edit: {
    name: '更新规章制度',
    post: async (data: SchoolDoctorRegulationFormModel) => await request.post(`${base}/edit`, data)
  },

  deleteBatch: {
    name: '批量删除规章制度',
    delete: async (ids: string) => await request.delete(`${base}/del`, { params: { ids } })
  }
}
