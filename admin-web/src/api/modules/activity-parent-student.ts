import { API_PATHS } from '@/api/constants'
import type { ActivityParentStudentLookupParams } from '@/types/modules/activity-parent-student'
import { request } from 'uni-ui-lib'

const path = API_PATHS.activity

export default {
  lookupByPhone: {
    name: '家长学生关联查询',
    get: async (params: ActivityParentStudentLookupParams) =>
      await request.get(`${path}/parentstudent/lookupByPhone`, { params })
  }
}
