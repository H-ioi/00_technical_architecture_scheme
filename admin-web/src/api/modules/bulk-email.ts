import { API_PATHS } from '@/api/constants'
import type {
  MailGroupListParams,
  MailSendRecordListParams,
  MailStudentSearchBody,
  MailUserMailinfoListParams
} from '@/types/modules/bulk-email'
import { request } from 'uni-ui-lib'

const m = API_PATHS.mailing
const c = API_PATHS.attendanceCommon

/**
 * 群发邮件（旧 `test/old-test/src/api/isacommunity/mail.js`）。
 * `TENANT-ID` 由 `uni` 请求层按 `VITE_TENANT_ID` 注入，与旧版硬编码 5 对齐方式一致。
 */
export default {
  /** 旧 `getOldSchoolList` */
  commonOldSchoolList: {
    name: '邮件模块学校下拉',
    get: async () => await request.get<unknown[], unknown[]>(`${c}/getOldSchoolList`)
  },
  commonStudentList: {
    name: '邮件模块检索学生',
    post: async (data: MailStudentSearchBody) =>
      await request.post<unknown, unknown>(`${c}/getStudentList`, data)
  },
  commonBoardingHouseList: {
    name: '寄宿学院列表',
    post: async (data: { schoolName: string }) =>
      await request.post<unknown, unknown>(`${c}/getBoardingHouseList`, data)
  },
  commonDivisionNameList: {
    name: '学部名称列表',
    post: async (data: { schoolName: string }) =>
      await request.post<unknown, unknown>(`${c}/getDivisionNameList`, data)
  },

  groupPage: {
    name: '群组分页',
    get: async (params: MailGroupListParams) => await request.get(`${m}/group/page`, { params })
  },
  groupCreate: {
    name: '新增群组',
    post: async (data: Record<string, unknown>) => await request.post(`${m}/group/create`, data)
  },
  groupUpdate: {
    name: '更新群组',
    post: async (data: Record<string, unknown>) => await request.post(`${m}/group/update`, data)
  },
  groupDelete: {
    name: '删除群组',
    post: async (params: { id: string | number }) =>
      await request.post(`${m}/group/delete`, undefined, { params })
  },
  groupBatchStatus: {
    name: '群组批量状态',
    post: async (params: { ids: string; status: number }) =>
      await request.post(`${m}/group/batchUpdateStatus`, undefined, { params })
  },

  userMailinfoPage: {
    name: '发件邮箱分页',
    get: async (params: MailUserMailinfoListParams) =>
      await request.get(`${m}/userMailinfo/page`, { params })
  },
  userMailinfoAllUsers: {
    name: '租户可选用户邮箱',
    get: async () => await request.get(`${m}/userMailinfo/getAllUserEmailForTenant5`)
  },
  userMailinfoDetail: {
    name: '发件邮箱详情',
    get: async (params: { id: string | number }) =>
      await request.get(`${m}/userMailinfo/detail`, { params })
  },
  userMailinfoRemove: {
    name: '删除发件邮箱配置',
    post: async (params: { id: string | number }) =>
      await request.post(`${m}/userMailinfo/remove`, undefined, { params })
  },
  userMailinfoBatchStatus: {
    name: '发件邮箱批量状态',
    post: async (params: { ids: string; status: number }) =>
      await request.post(`${m}/userMailinfo/batchUpdateStatus`, undefined, { params })
  },
  /** 旧接口为 POST + URL query `params` */
  userMailinfoSaveRelations: {
    name: '保存发件邮箱及关联',
    post: async (params: Record<string, unknown>) =>
      await request.post(`${m}/userMailinfo/saveOrUpdateWithRelations`, undefined, { params })
  },

  sendRecordPage: {
    name: '发件记录分页',
    get: async (params: MailSendRecordListParams) =>
      await request.get(`${m}/sendRecord/page`, { params })
  },
  sendRecordDetail: {
    name: '发件记录详情',
    get: async (params: { id: string | number }) =>
      await request.get(`${m}/sendRecord/detail`, { params })
  },
  sendRecordCreate: {
    name: '新建发件记录',
    post: async (data: Record<string, unknown>) => await request.post(`${m}/sendRecord/create`, data)
  },
  sendRecordUpdate: {
    name: '更新发件记录',
    post: async (data: Record<string, unknown>) => await request.post(`${m}/sendRecord/update`, data)
  },
  sendRecordRemove: {
    name: '删除发件记录',
    post: async (params: { id: string | number }) =>
      await request.post(`${m}/sendRecord/remove`, undefined, { params })
  },
  sendRecordUpload: {
    name: '发件附件上传',
    post: async (data: FormData) => await request.post(`${m}/sendRecord/upload`, data)
  },
  sendRecordExportRecipients: {
    name: '导出收件状态',
    get: async (id: string | number) =>
      await request.get<Blob, Blob>(`${m}/sendRecord/exportRecipientStatus`, {
        params: { id },
        responseType: 'blob'
      })
  }
}
