import type { PageResult } from '@/types/api'
import type { StudentListParams, StudentRecord } from '@/types/modules/member-student'
import { request } from 'uni-ui-lib'

const membershipBase = '/isacommunity/membership'

export default {
  page: {
    url: `${membershipBase}/getStudentPage`,
    name: '学生分页',
    get: async function (this: { url: string }, params: StudentListParams) {
      return await request.get<PageResult<StudentRecord>, PageResult<StudentRecord>>(this.url, {
        params
      })
    }
  },

  yearGroup: {
    url: `${membershipBase}/getYeargroupList`,
    name: '年级列表',
    get: async function (this: { url: string }) {
      return await request.get<string[], string[]>(this.url)
    }
  },

  form: {
    url: `${membershipBase}/getFormList`,
    name: '班级列表',
    get: async function (this: { url: string }) {
      return await request.get<string[], string[]>(this.url)
    }
  }
}
