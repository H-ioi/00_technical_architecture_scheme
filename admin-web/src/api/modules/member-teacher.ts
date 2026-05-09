import { API_PATHS } from '@/api/constants'
import type { PageResult } from '@/types/api'
import type { TeacherListParams, TeacherRecord } from '@/types/modules/member-teacher'
import { request } from 'uni-ui-lib'

export default {
  page: {
    url: `${API_PATHS.membership}/getTeacherPage`,
    name: '教师分页',
    get: async function (this: { url: string }, params: TeacherListParams) {
      return await request.get<PageResult<TeacherRecord>, PageResult<TeacherRecord>>(this.url, {
        params
      })
    }
  },

  role: {
    url: `${API_PATHS.membership}/getTeacherRoleList`,
    name: '教师职位列表',
    get: async function (this: { url: string }) {
      return await request.get<string[], string[]>(this.url)
    }
  }
}
