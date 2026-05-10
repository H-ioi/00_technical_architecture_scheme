import { API_PATHS } from '@/api/constants'
import type { CarFormModel, CarListParams } from '@/types/modules/school-bus-car'
import { downloadBlob } from '@/utils/download'
import { request } from 'uni-ui-lib'

/** 校车车辆（旧 `api/isacommunity/car.js`）。 */
export default {
  page: {
    url: `${API_PATHS.schoolBusCarInfo}/getCarinfoPage`,
    name: '车辆分页',
    get: async function (this: { url: string }, params: CarListParams) {
      return await request.get(this.url, { params })
    }
  },
  detail: {
    url: `${API_PATHS.schoolBusCarInfo}/get`,
    name: '车辆详情',
    get: async function (this: { url: string }, id: string | number) {
      return await request.get(`${this.url}/${id}`)
    }
  },
  add: {
    url: `${API_PATHS.schoolBusCarInfo}/add`,
    name: '新增车辆',
    post: async function (this: { url: string }, data: CarFormModel) {
      return await request.post(this.url, data)
    }
  },
  edit: {
    url: `${API_PATHS.schoolBusCarInfo}/edit`,
    name: '编辑车辆',
    post: async function (this: { url: string }, data: CarFormModel) {
      return await request.post(this.url, data)
    }
  },
  delete: {
    url: `${API_PATHS.schoolBusCarInfo}/del`,
    name: '删除车辆',
    delete: async function (this: { url: string }, ids: Array<string | number>) {
      return await request.delete(this.url, {
        params: { ids }
      })
    }
  },
  batchUpdateStatus: {
    url: `${API_PATHS.schoolBusCarInfo}/batchUpdateStatus`,
    name: '批量更新车辆状态',
    post: async function (this: { url: string }, data: Record<string, unknown>) {
      return await request.post(this.url, data)
    }
  },
  import: {
    url: `${API_PATHS.schoolBusCarInfo}/import`,
    name: '导入车辆',
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
  template: {
    url: `${API_PATHS.schoolBusCarInfo}/download`,
    name: '下载车辆导入模板',
    download: async function (this: { url: string }, filename = 'car-import-template.xlsx') {
      const blob = await request.get<Blob, Blob>(this.url, {
        responseType: 'blob'
      })
      downloadBlob(blob, filename)
    }
  }
}
