import type { PageResult } from '@/types/api'
import type {
  MedicalArchiveDetail,
  MedicalArchiveListRow,
  MedicalArchivePageParams
} from '@/types/modules/medical-archive'
import { request } from 'uni-ui-lib'

const base = '/isacommunity/clinic/medicalarchive'

export default {
  page: {
    name: '学生医疗档案分页',
    get: async (params: MedicalArchivePageParams) =>
      await request.get<PageResult<MedicalArchiveListRow>, PageResult<MedicalArchiveListRow>>(
        `${base}/paginate`,
        { params }
      )
  },

  detail: {
    name: '学生医疗档案详情',
    get: async (id: string | number) =>
      await request.get<MedicalArchiveDetail, MedicalArchiveDetail>(`${base}/get/${id}`)
  },

  deleteBatch: {
    name: '批量注销学生医疗档案',
    delete: async (ids: string) => await request.delete(`${base}/del`, { params: { ids } })
  }
}
