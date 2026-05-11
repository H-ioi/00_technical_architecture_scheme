import { API_PATHS } from '@/api/constants'
import type { AttendanceAccessListParams } from '@/types/modules/attendance-access'
import { request } from 'uni-ui-lib'

/** 门禁记录（旧 `api/isacommunity/attendance.js`，`/union/*`）。 */
export default {
  unionPage: {
    url: `${API_PATHS.attendance}/union/page`,
    name: '门禁记录分页',
    get: async function (this: { url: string }, params: AttendanceAccessListParams) {
      return await request.get(this.url, { params })
    }
  },
  unionExport: {
    url: `${API_PATHS.attendance}/union/export`,
    name: '导出门禁记录',
    get: async function (this: { url: string }, params: Record<string, unknown>) {
      return await request.get<Blob, Blob>(this.url, {
        params,
        responseType: 'blob'
      })
    }
  }
}
