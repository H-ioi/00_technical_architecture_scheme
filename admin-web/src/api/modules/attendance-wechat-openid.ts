import type { AttendanceWechatOpenidListParams } from '@/types/modules/attendance-wechat-openid'
import { request } from 'uni-ui-lib'

const attendanceBase = '/isacommunity/attendance'

/** 考勤微信 OpenId（旧 `api/isacommunity/attendance.js`，`/wechatOpenid/*`）。 */
export default {
  openidPage: {
    url: `${attendanceBase}/wechatOpenid/page`,
    name: '微信 OpenId 分页',
    get: async function (this: { url: string }, params: AttendanceWechatOpenidListParams) {
      return await request.get(this.url, { params })
    }
  },
  batchUpdateStatus: {
    url: `${attendanceBase}/wechatOpenid/batchUpdateStatus`,
    name: '批量更新 OpenId 状态',
    post: async function (this: { url: string }, ids: Array<string | number>, status: number) {
      const fd = new FormData()
      fd.append('ids', ids.map(String).join(','))
      fd.append('status', String(status))
      return await request.post(this.url, fd, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
    }
  }
}
