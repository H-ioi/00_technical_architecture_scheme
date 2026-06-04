import type { PageResult } from '@/types/api'
import type { TeacherListParams, TeacherRecord } from '@/types/modules/member-teacher'
import { request } from 'uni-ui-lib'

const membershipBase = '/isacommunity/membership'

export default {
  page: {
    url: `${membershipBase}/getTeacherPage`,
    name: '教师分页',
    get: async function (this: { url: string }, params: TeacherListParams) {
      return await request.get<PageResult<TeacherRecord>, PageResult<TeacherRecord>>(this.url, {
        params
      })
    }
  },

  role: {
    url: `${membershipBase}/getTeacherRoleList`,
    name: '教师职位列表',
    get: async function (this: { url: string }) {
      return await request.get<string[], string[]>(this.url)
    }
  }
}
