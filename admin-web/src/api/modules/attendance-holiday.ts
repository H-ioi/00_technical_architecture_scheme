import { API_PATHS } from '@/api/constants'
import type { AttendanceHolidayListParams, AttendanceHolidayReturnListParams } from '@/types/modules/attendance-holiday'
import { request } from 'uni-ui-lib'

/** 请假管理、流程与放行条等（旧 `api/isacommunity/holiday.js`，`baseUrl` `/attendance`）。 */
export default {
  holidayPage: {
    url: `${API_PATHS.attendanceHolidayRest}/holiday/page`,
    name: '请假分页',
    get: async function (this: { url: string }, params: AttendanceHolidayListParams) {
      return await request.get(this.url, { params })
    }
  },
  /** 销假分页（旧 `listHolidayEnd`）。 */
  holidayReturnPage: {
    url: `${API_PATHS.attendanceHolidayRest}/holiday-return/return-page`,
    name: '销假分页',
    get: async function (this: { url: string }, params: AttendanceHolidayReturnListParams) {
      return await request.get(this.url, { params })
    }
  },
  /** 请假详情（旧 `getHolidayInfo`）。 */
  holidayDetail: {
    name: '请假详情',
    get: async (id: string | number) => {
      return await request.get(`${API_PATHS.attendanceHolidayRest}/holiday/${id}`)
    }
  },
  /** 撤回流程（旧 `cancelFlow(procId, id)` GET `/holiday/back/:procId/:id`）。 */
  holidayCancelFlow: {
    name: '撤回请假流程',
    get: async (procId: string | number, id: string | number) => {
      return await request.get(
        `${API_PATHS.attendanceHolidayRest}/holiday/back/${procId}/${id}`
      )
    }
  }
}
