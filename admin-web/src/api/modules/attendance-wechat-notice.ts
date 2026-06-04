import type { AttendanceWechatNoticeListParams } from '@/types/modules/attendance-wechat-notice'
import { request } from 'uni-ui-lib'

const attendanceBase = '/isacommunity/attendance'

/** 微信通知（旧 `api/isacommunity/attendance.js`，`/wechatNotice/*`）。 */
export default {
  noticePage: {
    url: `${attendanceBase}/wechatNotice/page`,
    name: '微信通知分页',
    get: async function (this: { url: string }, params: AttendanceWechatNoticeListParams) {
      return await request.get(this.url, { params })
    }
  }
}
