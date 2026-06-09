import type { PageResult } from '@/types/api'
import type {
  BusAttendanceFormModel,
  BusAttendanceListParams,
  BusAttendanceRecord
} from '@/types/modules/school-bus-attendance'
import { request } from 'uni-ui-lib'

const base = '/isacommunity/busattendance'

export default {
  page: {
    url: `${base}/getAttendancePage`,
    name: '校巴考勤分页',
    get: async function (this: { url: string }, params: BusAttendanceListParams) {
      return await request.get<PageResult<BusAttendanceRecord>, PageResult<BusAttendanceRecord>>(
        this.url,
        { params }
      )
    }
  },

  detail: {
    url: `${base}/get`,
    name: '校巴考勤详情',
    get: async function (this: { url: string }, id: string | number) {
      return await request.get<BusAttendanceRecord, BusAttendanceRecord>(`${this.url}/${id}`)
    }
  },

  add: {
    url: `${base}/add`,
    name: '新增校巴考勤',
    post: async function (this: { url: string }, data: BusAttendanceFormModel) {
      return await request.post(this.url, data)
    }
  },

  edit: {
    url: `${base}/edit`,
    name: '编辑校巴考勤',
    post: async function (this: { url: string }, data: BusAttendanceFormModel) {
      return await request.post(this.url, data)
    }
  },

  delete: {
    url: `${base}/del`,
    name: '删除校巴考勤',
    delete: async function (this: { url: string }, ids: Array<string | number>) {
      return await request.delete(this.url, { params: { ids } })
    }
  }
}
