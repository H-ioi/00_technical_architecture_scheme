import type { PageResult } from '@/types/api'
import type {
  PendingMedicationDetail,
  PendingMedicationListRow,
  PendingMedicationPageParams,
  VisitRecordFormModel,
  VisitRecordListRow,
  VisitRecordPageParams
} from '@/types/modules/school-doctor-visit-record'
import { request } from 'uni-ui-lib'

const recordBase = '/isacommunity/clinic/visit/record'
const pendingBase = '/isacommunity/clinic/visit/pending-medication'

export default {
  recordPage: {
    name: '就诊记录分页',
    get: async (params: VisitRecordPageParams) =>
      await request.get<PageResult<VisitRecordListRow>, PageResult<VisitRecordListRow>>(
        `${recordBase}/paginate`,
        { params }
      )
  },

  recordDetail: {
    name: '就诊记录详情',
    get: async (id: string | number) =>
      await request.get<VisitRecordFormModel, VisitRecordFormModel>(`${recordBase}/get/${id}`)
  },

  recordAdd: {
    name: '新增就诊记录',
    post: async (data: VisitRecordFormModel) => await request.post(`${recordBase}/add`, data)
  },

  recordEdit: {
    name: '更新就诊记录',
    post: async (data: VisitRecordFormModel) => await request.post(`${recordBase}/edit`, data)
  },

  recordDeleteBatch: {
    name: '批量删除就诊记录',
    delete: async (ids: string) => await request.delete(`${recordBase}/del`, { params: { ids } })
  },

  pendingPage: {
    name: '待用药分页',
    get: async (params: PendingMedicationPageParams) =>
      await request.get<PageResult<PendingMedicationListRow>, PageResult<PendingMedicationListRow>>(
        `${pendingBase}/paginate`,
        { params }
      )
  },

  pendingDetail: {
    name: '待用药详情',
    get: async (id: string | number) =>
      await request.get<PendingMedicationDetail, PendingMedicationDetail>(
        `${pendingBase}/get/${id}`
      )
  },

  pendingOperate: {
    name: '操作待用药',
    post: async (data: Record<string, unknown>) =>
      await request.post(`${pendingBase}/operate`, data)
  },

  pendingOperationEdit: {
    name: '编辑待用药操作记录',
    post: async (data: Record<string, unknown>) =>
      await request.post(`${pendingBase}/operation/edit`, data)
  }
}
