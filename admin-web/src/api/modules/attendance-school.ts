import type { AttendanceSchoolListParams } from '@/types/modules/attendance-school'
import { request } from 'uni-ui-lib'

const attendanceCommonBase = '/isacommunity/attendance/common'
const attendanceBase = '/isacommunity/attendance'

/** 校园考勤（旧 `api/isacommunity/attendance.js`）。 */
export default {
  departmentList: {
    url: `${attendanceCommonBase}/getDepartmentList`,
    name: '考勤部门下拉',
    get: async function (this: { url: string }) {
      return await request.get<string[], string[]>(this.url)
    }
  },
  schoolPage: {
    url: `${attendanceBase}/school/page`,
    name: '校园考勤分页',
    get: async function (this: { url: string }, params: AttendanceSchoolListParams) {
      return await request.get(this.url, { params })
    }
  },
  schoolExport: {
    url: `${attendanceBase}/school/export`,
    name: '导出校园考勤',
    get: async function (this: { url: string }, params: Record<string, unknown>) {
      return await request.get<Blob, Blob>(this.url, {
        params,
        responseType: 'blob'
      })
    }
  }
}
