import type { BusOrderFormModel, BusOrderListParams } from '@/types/modules/school-bus-order'
import { downloadBlob } from '@/utils/download'
import { request } from 'uni-ui-lib'

const base = '/isacommunity/busorder'

/** 校车乘车订单 / 申请意向（旧 `api/isacommunity/busorder.js`）。 */
export default {
  intentionPage: {
    url: `${base}/getIntentionOrderPage`,
    name: '申请意向分页',
    get: async function (this: { url: string }, params: BusOrderListParams) {
      return await request.get(this.url, { params })
    }
  },
  orderPage: {
    url: `${base}/getOrderPage`,
    name: '乘车学生分页',
    get: async function (this: { url: string }, params: BusOrderListParams) {
      return await request.get(this.url, { params })
    }
  },
  detail: {
    url: `${base}/get`,
    name: '订单详情',
    get: async function (this: { url: string }, id: string | number) {
      return await request.get(`${this.url}/${id}`)
    }
  },
  add: {
    url: `${base}/add`,
    name: '新增订单',
    post: async function (this: { url: string }, data: BusOrderFormModel) {
      return await request.post(this.url, data)
    }
  },
  edit: {
    url: `${base}/edit`,
    name: '编辑订单',
    post: async function (this: { url: string }, data: BusOrderFormModel) {
      return await request.post(this.url, data)
    }
  },
  delIntentionOrder: {
    url: `${base}/delIntentionOrder`,
    name: '删除意向订单',
    delete: async function (this: { url: string }, ids: Array<string | number>) {
      return await request.delete(this.url, {
        params: { ids }
      })
    }
  },
  delOrder: {
    url: `${base}/delOrder`,
    name: '删除正式订单',
    delete: async function (this: { url: string }, ids: Array<string | number>) {
      return await request.delete(this.url, {
        params: { ids }
      })
    }
  },
  batchApprove: {
    url: `${base}/batchApprove`,
    name: '批量同意意向',
    get: async function (this: { url: string }, params: { ids: Array<string | number> }) {
      return await request.get(this.url, { params })
    }
  },
  batchDeny: {
    url: `${base}/batchDeny`,
    name: '批量拒绝意向',
    get: async function (
      this: { url: string },
      params: { ids: Array<string | number>; denyReason: string }
    ) {
      return await request.get(this.url, { params })
    }
  },
  batchUpdatePaymentStatus: {
    url: `${base}/batchUpdatePaymentStatus`,
    name: '批量标记已缴费',
    get: async function (this: { url: string }, params: { ids: Array<string | number> }) {
      return await request.get(this.url, { params })
    }
  },
  importIntentionOrder: {
    url: `${base}/importIntentionOrder`,
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
    url: `${base}/downloadIntentionOrder`,
    name: '下载意向导入模板',
    download: async function (this: { url: string }, filename = 'intention-order-template.xlsx') {
      const blob = await request.get<Blob, Blob>(this.url, {
        responseType: 'blob'
      })
      downloadBlob(blob, filename)
    }
  },
  importOrder: {
    url: `${base}/importOrder`,
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
    url: `${base}/downloadOrder`,
    name: '下载乘车学生导入模板',
    download: async function (this: { url: string }, filename = 'bus-order-template.xlsx') {
      const blob = await request.get<Blob, Blob>(this.url, {
        responseType: 'blob'
      })
      downloadBlob(blob, filename)
    }
  },
  exportOrder: {
    url: `${base}/exportOrder`,
    name: '导出乘车学生',
    get: async function (this: { url: string }, params: Record<string, unknown>) {
      return await request.get<Blob, Blob>(this.url, {
        params,
        responseType: 'blob'
      })
    }
  },
  getStudentInfo: {
    url: `${base}/getStudentInfo`,
    name: '学生精确查询',
    get: async function (this: { url: string }, params: Record<string, unknown>) {
      return await request.get(this.url, { params })
    }
  },
  getStudentInfoList: {
    url: `${base}/getStudentInfoList`,
    name: '学生模糊查询',
    get: async function (this: { url: string }, params: Record<string, unknown>) {
      return await request.get(this.url, { params })
    }
  },
  getLineStationPrice: {
    url: `${base}/getLineStationPrice`,
    name: '线路站点价格',
    post: async function (this: { url: string }, data: Record<string, unknown>) {
      return await request.post(this.url, data)
    }
  }
}
