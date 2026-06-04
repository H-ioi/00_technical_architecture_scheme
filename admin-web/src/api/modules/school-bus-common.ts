import { request } from 'uni-ui-lib'

const base = '/isacommunity/buscommon'

/** 校车公共接口（旧 `api/isacommunity/buscommon.js`）。 */
export default {
  driverList: {
    url: `${base}/getDriverList`,
    get: async function (this: { url: string }, params?: Record<string, unknown>) {
      return await request.get(this.url, { params })
    }
  },
  teacherList: {
    url: `${base}/getTeacherList`,
    get: async function (this: { url: string }, params?: Record<string, unknown>) {
      return await request.get(this.url, { params })
    }
  },
  carinfoList: {
    url: `${base}/getCarinfoList`,
    get: async function (this: { url: string }, params?: Record<string, unknown>) {
      return await request.get(this.url, { params })
    }
  },
  lineList: {
    url: `${base}/getLineList`,
    get: async function (this: { url: string }, params?: Record<string, unknown>) {
      return await request.get(this.url, { params })
    }
  },
  stationList: {
    url: `${base}/getStationList`,
    get: async function (this: { url: string }, params?: Record<string, unknown>) {
      return await request.get(this.url, { params })
    }
  },
  sectionList: {
    url: `${base}/getSectionList`,
    get: async function (this: { url: string }, params?: Record<string, unknown>) {
      return await request.get(this.url, { params })
    }
  },
  pickupMethodList: {
    url: `${base}/getPickupMethodList`,
    get: async function (this: { url: string }) {
      return await request.get(this.url)
    }
  },
  orderStationList: {
    url: `${base}/getOrderStationList`,
    get: async function (this: { url: string }, params?: Record<string, unknown>) {
      return await request.get(this.url, { params })
    }
  }
}
