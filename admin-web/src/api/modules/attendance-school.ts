import { API_PATHS } from '@/api/constants'
import type { AttendanceSchoolListParams } from '@/types/modules/attendance-school'
import { request } from 'uni-ui-lib'

/** 校园考勤（旧 `api/isacommunity/attendance.js`）。 */
export default {
  departmentList: {
    url: `${API_PATHS.attendanceCommon}/getDepartmentList`,
    name: '考勤部门下拉',
    get: async function (this: { url: string }) {
      return await request.get<string[], string[]>(this.url)
    }
  },
  schoolPage: {
    url: `${API_PATHS.attendance}/school/page`,
    name: '校园考勤分页',
    get: async function (this: { url: string }, params: AttendanceSchoolListParams) {
      return await request.get(this.url, { params })
    }
  },
  schoolExport: {
    url: `${API_PATHS.attendance}/school/export`,
    name: '导出校园考勤',
    get: async function (this: { url: string }, params: Record<string, unknown>) {
      return await request.get<Blob, Blob>(this.url, {
        params,
        responseType: 'blob'
      })
    }
  }
}
