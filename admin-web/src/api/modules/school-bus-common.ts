import { API_PATHS } from '@/api/constants'
import { request } from 'uni-ui-lib'

/** 校车公共接口（旧 `api/isacommunity/buscommon.js`）。 */
export default {
  driverList: {
    url: `${API_PATHS.schoolBusCommon}/getDriverList`,
    get: async function (this: { url: string }, params?: Record<string, unknown>) {
      return await request.get(this.url, { params })
    }
  },
  teacherList: {
    url: `${API_PATHS.schoolBusCommon}/getTeacherList`,
    get: async function (this: { url: string }, params?: Record<string, unknown>) {
      return await request.get(this.url, { params })
    }
  },
  carinfoList: {
    url: `${API_PATHS.schoolBusCommon}/getCarinfoList`,
    get: async function (this: { url: string }, params?: Record<string, unknown>) {
      return await request.get(this.url, { params })
    }
  },
  lineList: {
    url: `${API_PATHS.schoolBusCommon}/getLineList`,
    get: async function (this: { url: string }, params?: Record<string, unknown>) {
      return await request.get(this.url, { params })
    }
  },
  stationList: {
    url: `${API_PATHS.schoolBusCommon}/getStationList`,
    get: async function (this: { url: string }, params?: Record<string, unknown>) {
      return await request.get(this.url, { params })
    }
  },
  sectionList: {
    url: `${API_PATHS.schoolBusCommon}/getSectionList`,
    get: async function (this: { url: string }, params?: Record<string, unknown>) {
      return await request.get(this.url, { params })
    }
  },
  pickupMethodList: {
    url: `${API_PATHS.schoolBusCommon}/getPickupMethodList`,
    get: async function (this: { url: string }) {
      return await request.get(this.url)
    }
  },
  orderStationList: {
    url: `${API_PATHS.schoolBusCommon}/getOrderStationList`,
    get: async function (this: { url: string }, params?: Record<string, unknown>) {
      return await request.get(this.url, { params })
    }
  }
}
