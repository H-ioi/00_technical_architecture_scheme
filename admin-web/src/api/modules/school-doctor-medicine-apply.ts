import type { PageResult } from '@/types/api'
import type {
  MedicineApplyFormModel,
  MedicineApplyListRow,
  MedicineApplyPageParams
} from '@/types/modules/school-doctor-medicine-apply'
import { request } from 'uni-ui-lib'

const base = '/isacommunity/clinic/medication-application'

export default {
  page: {
    name: '用药申请分页',
    get: async (params: MedicineApplyPageParams) =>
      await request.get<PageResult<MedicineApplyListRow>, PageResult<MedicineApplyListRow>>(
        `${base}/paginate`,
        { params }
      )
  },

  detail: {
    name: '用药申请详情',
    get: async (id: string | number) =>
      await request.get<MedicineApplyFormModel, MedicineApplyFormModel>(`${base}/get/${id}`)
  },

  add: {
    name: '新增用药申请',
    post: async (data: MedicineApplyFormModel) => await request.post(`${base}/add`, data)
  },

  edit: {
    name: '更新用药申请',
    post: async (data: MedicineApplyFormModel) => await request.post(`${base}/edit`, data)
  },

  deleteBatch: {
    name: '批量删除用药申请',
    delete: async (ids: string) => await request.delete(`${base}/del`, { params: { ids } })
  }
}
