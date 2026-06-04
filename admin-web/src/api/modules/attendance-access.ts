import type { AttendanceAccessListParams } from '@/types/modules/attendance-access'
import { request } from 'uni-ui-lib'

const attendanceBase = '/isacommunity/attendance'

/** 门禁记录（旧 `api/isacommunity/attendance.js`，`/union/*`）。 */
export default {
  unionPage: {
    url: `${attendanceBase}/union/page`,
    name: '门禁记录分页',
    get: async function (this: { url: string }, params: AttendanceAccessListParams) {
      return await request.get(this.url, { params })
    }
  },
  unionExport: {
    url: `${attendanceBase}/union/export`,
    name: '导出门禁记录',
    get: async function (this: { url: string }, params: Record<string, unknown>) {
      return await request.get<Blob, Blob>(this.url, {
        params,
        responseType: 'blob'
      })
    }
  }
}
