import type { PageResult } from '@/types/api'
import type {
  SchoolDoctorDiseaseOption,
  SchoolDoctorDiseaseSettingFormModel,
  SchoolDoctorDiseaseSettingListRow,
  SchoolDoctorDiseaseSettingPageParams
} from '@/types/modules/school-doctor-disease-setting'
import { request } from 'uni-ui-lib'

const base = '/isacommunity/clinic/disease-setting'

export type { SchoolDoctorDiseaseOption }

export default {
  page: {
    name: '疾病设置分页',
    get: async (params: SchoolDoctorDiseaseSettingPageParams) =>
      await request.get<
        PageResult<SchoolDoctorDiseaseSettingListRow>,
        PageResult<SchoolDoctorDiseaseSettingListRow>
      >(`${base}/paginate`, { params })
  },

  detail: {
    name: '疾病设置详情',
    get: async (id: string | number) =>
      await request.get<SchoolDoctorDiseaseSettingFormModel, SchoolDoctorDiseaseSettingFormModel>(
        `${base}/get/${id}`
      )
  },

  add: {
    name: '新增疾病设置',
    post: async (data: SchoolDoctorDiseaseSettingFormModel) =>
      await request.post(`${base}/add`, data)
  },

  edit: {
    name: '更新疾病设置',
    post: async (data: SchoolDoctorDiseaseSettingFormModel) =>
      await request.post(`${base}/edit`, data)
  },

  deleteBatch: {
    name: '批量删除疾病设置',
    delete: async (ids: string) => await request.delete(`${base}/del`, { params: { ids } })
  }
}
