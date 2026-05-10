import { API_PATHS } from '@/api/constants'
import type { BusOrderFormModel, BusOrderListParams } from '@/types/modules/school-bus-order'
import { downloadBlob } from '@/utils/download'
import { request } from 'uni-ui-lib'

/** 校车乘车订单 / 申请意向（旧 `api/isacommunity/busorder.js`）。 */
export default {
  intentionPage: {
    url: `${API_PATHS.schoolBusOrder}/getIntentionOrderPage`,
    name: '申请意向分页',
    get: async function (this: { url: string }, params: BusOrderListParams) {
      return await request.get(this.url, { params })
    }
  },
  orderPage: {
    url: `${API_PATHS.schoolBusOrder}/getOrderPage`,
    name: '乘车学生分页',
    get: async function (this: { url: string }, params: BusOrderListParams) {
      return await request.get(this.url, { params })
    }
  },
  detail: {
    url: `${API_PATHS.schoolBusOrder}/get`,
    name: '订单详情',
    get: async function (this: { url: string }, id: string | number) {
      return await request.get(`${this.url}/${id}`)
    }
  },
  add: {
    url: `${API_PATHS.schoolBusOrder}/add`,
    name: '新增订单',
    post: async function (this: { url: string }, data: BusOrderFormModel) {
      return await request.post(this.url, data)
    }
  },
  edit: {
    url: `${API_PATHS.schoolBusOrder}/edit`,
    name: '编辑订单',
    post: async function (this: { url: string }, data: BusOrderFormModel) {
      return await request.post(this.url, data)
    }
  },
  delIntentionOrder: {
    url: `${API_PATHS.schoolBusOrder}/delIntentionOrder`,
    name: '删除意向订单',
    delete: async function (this: { url: string }, ids: Array<string | number>) {
      return await request.delete(this.url, {
        params: { ids }
      })
    }
  },
  delOrder: {
    url: `${API_PATHS.schoolBusOrder}/delOrder`,
    name: '删除正式订单',
    delete: async function (this: { url: string }, ids: Array<string | number>) {
      return await request.delete(this.url, {
        params: { ids }
      })
    }
  },
  batchApprove: {
    url: `${API_PATHS.schoolBusOrder}/batchApprove`,
    name: '批量同意意向',
    get: async function (this: { url: string }, params: { ids: Array<string | number> }) {
      return await request.get(this.url, { params })
    }
  },
  batchDeny: {
    url: `${API_PATHS.schoolBusOrder}/batchDeny`,
    name: '批量拒绝意向',
    get: async function (
      this: { url: string },
      params: { ids: Array<string | number>; denyReason: string }
    ) {
      return await request.get(this.url, { params })
    }
  },
  batchUpdatePaymentStatus: {
    url: `${API_PATHS.schoolBusOrder}/batchUpdatePaymentStatus`,
    name: '批量标记已缴费',
    get: async function (this: { url: string }, params: { ids: Array<string | number> }) {
      return await request.get(this.url, { params })
    }
  },
  importIntentionOrder: {
    url: `${API_PATHS.schoolBusOrder}/importIntentionOrder`,
    name: '导入意向订单',
    post: async function (this: { url: string }, file: File) {
      const formData = new FormData()
      formData.append('file', file)
      return await request.post(this.url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
    }
  },
  downloadIntentionOrder: {
    url: `${API_PATHS.schoolBusOrder}/downloadIntentionOrder`,
    name: '下载意向导入模板',
    download: async function (this: { url: string }, filename = 'intention-order-template.xlsx') {
      const blob = await request.get<Blob, Blob>(this.url, {
        responseType: 'blob'
      })
      downloadBlob(blob, filename)
    }
  },
  importOrder: {
    url: `${API_PATHS.schoolBusOrder}/importOrder`,
    name: '导入乘车学生',
    post: async function (this: { url: string }, file: File) {
      const formData = new FormData()
      formData.append('file', file)
      return await request.post(this.url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
    }
  },
  downloadOrder: {
    url: `${API_PATHS.schoolBusOrder}/downloadOrder`,
    name: '下载乘车学生导入模板',
    download: async function (this: { url: string }, filename = 'bus-order-template.xlsx') {
      const blob = await request.get<Blob, Blob>(this.url, {
        responseType: 'blob'
      })
      downloadBlob(blob, filename)
    }
  },
  exportOrder: {
    url: `${API_PATHS.schoolBusOrder}/exportOrder`,
    name: '导出乘车学生',
    get: async function (this: { url: string }, params: Record<string, unknown>) {
      return await request.get<Blob, Blob>(this.url, {
        params,
        responseType: 'blob'
      })
    }
  },
  getStudentInfo: {
    url: `${API_PATHS.schoolBusOrder}/getStudentInfo`,
    name: '学生精确查询',
    get: async function (this: { url: string }, params: Record<string, unknown>) {
      return await request.get(this.url, { params })
    }
  },
  getStudentInfoList: {
    url: `${API_PATHS.schoolBusOrder}/getStudentInfoList`,
    name: '学生模糊查询',
    get: async function (this: { url: string }, params: Record<string, unknown>) {
      return await request.get(this.url, { params })
    }
  },
  getLineStationPrice: {
    url: `${API_PATHS.schoolBusOrder}/getLineStationPrice`,
    name: '线路站点价格',
    post: async function (this: { url: string }, data: Record<string, unknown>) {
      return await request.post(this.url, data)
    }
  }
}
