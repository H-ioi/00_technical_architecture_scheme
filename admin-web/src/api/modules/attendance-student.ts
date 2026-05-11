import { API_PATHS } from '@/api/constants'
import type { AttendanceStudentListParams } from '@/types/modules/attendance-student'
import { request } from 'uni-ui-lib'

/** 学生考勤（旧 `api/isacommunity/attendance.js`）。 */
export default {
  gradeList: {
    url: `${API_PATHS.attendanceCommon}/getGradeList`,
    name: '考勤年级下拉',
    get: async function (this: { url: string }) {
      return await request.get<string[], string[]>(this.url)
    }
  },
  studentPage: {
    url: `${API_PATHS.attendance}/student/page`,
    name: '学生考勤分页',
    get: async function (this: { url: string }, params: AttendanceStudentListParams) {
      return await request.get(this.url, { params })
    }
  },
  studentExport: {
    url: `${API_PATHS.attendance}/student/export`,
    name: '导出学生考勤',
    get: async function (this: { url: string }, params: Record<string, unknown>) {
      return await request.get<Blob, Blob>(this.url, {
        params,
        responseType: 'blob'
      })
    }
  }
}
