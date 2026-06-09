import type { PageResult } from '@/types/api'
import type {
  DormStudentAddModel,
  DormStudentEditModel,
  DormStudentHistoryRow,
  DormStudentInfoLookup,
  DormStudentListRow,
  DormStudentPageParams
} from '@/types/modules/dorm-student'
import { request } from 'uni-ui-lib'

const base = '/isacommunity/dormitory/student'

export default {
  page: {
    url: `${base}/page`,
    name: '当前住宿生分页',
    get: async function (this: { url: string }, params: DormStudentPageParams) {
      return await request.get<PageResult<DormStudentListRow>, PageResult<DormStudentListRow>>(
        this.url,
        { params }
      )
    }
  },

  historyPage: {
    url: `${base}/history/page`,
    name: '历史住宿生分页',
    get: async function (this: { url: string }, params: DormStudentPageParams) {
      return await request.get<PageResult<DormStudentHistoryRow>, PageResult<DormStudentHistoryRow>>(
        this.url,
        { params }
      )
    }
  },

  detail: {
    url: `${base}/detail`,
    name: '住宿生详情',
    get: async function (this: { url: string }, params: { admissionNo?: string }) {
      return await request.get<Record<string, unknown>, Record<string, unknown>>(this.url, { params })
    }
  },

  historyDetail: {
    url: `${base}/history/detail`,
    name: '历史住宿生详情',
    get: async function (this: { url: string }, params: { admissionNo?: string }) {
      return await request.get<Record<string, unknown>, Record<string, unknown>>(this.url, { params })
    }
  },

  edit: {
    url: `${base}/edit`,
    name: '编辑住宿生',
    post: async function (this: { url: string }, data: DormStudentEditModel) {
      return await request.post(this.url, data)
    }
  },

  historyEditCheckoutDate: {
    url: `${base}/history/editCheckoutDate`,
    name: '编辑历史退宿日期',
    post: async function (this: { url: string }, data: { admissionNo?: string; checkoutDate?: string }) {
      return await request.post(this.url, undefined, { params: data })
    }
  },

  studentInfo: {
    url: `${base}/student-service/student-info`,
    name: '学号检索学生',
    get: async function (
      this: { url: string },
      params: { schoolId?: string | number; admissionNo?: string }
    ) {
      return await request.get<DormStudentInfoLookup, DormStudentInfoLookup>(this.url, { params })
    }
  },

  manualAdd: {
    url: `${base}/student-service/manual-add`,
    name: '手动新增住宿生',
    post: async function (this: { url: string }, params: DormStudentAddModel) {
      return await request.post(this.url, undefined, { params })
    }
  },

  plannedCheckout: {
    url: `${base}/planned-checkout`,
    name: '设置预计退宿日期',
    post: async function (
      this: { url: string },
      params: { admissionNos?: string; plannedCheckoutDate?: string }
    ) {
      return await request.post(this.url, undefined, { params })
    }
  }
}
