import { API_PATHS } from '@/api/constants'
import type { AttendanceDailyListParams } from '@/types/modules/attendance-daily'
import { request } from 'uni-ui-lib'

/** 学生每日考勤（旧 `holiday.js`：`getAttendanceData`、`exportAttendanceData`、`getSchoolList`）。 */
export default {
  /** 旧页校区下拉：`/isacommunity/attendance/common/getSchoolList`，筛选提交字段 `schoolName` = `enName`。 */
  commonSchoolList: {
    url: `${API_PATHS.attendanceCommon}/getSchoolList`,
    name: '考勤公共校区列表（每日考勤）',
    get: async function (this: { url: string }) {
      return await request.get<unknown>(this.url)
    }
  },
  dailyPage: {
    url: `${API_PATHS.attendanceHolidayRest}/holiday/getData`,
    name: '学生每日考勤分页',
    get: async function (this: { url: string }, params: AttendanceDailyListParams) {
      return await request.get(this.url, { params })
    }
  },
  dailyExport: {
    url: `${API_PATHS.attendanceHolidayRest}/holiday/getData2`,
    name: '导出学生每日考勤',
    get: async function (this: { url: string }, params: Record<string, unknown>) {
      return await request.get<Blob, Blob>(this.url, {
        params,
        responseType: 'blob'
      })
    }
  }
}
