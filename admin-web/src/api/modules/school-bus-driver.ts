import { API_PATHS } from '@/api/constants'
import type { PageResult } from '@/types/api'
import type { DriverFormModel, DriverListParams, DriverRecord } from '@/types/modules/school-bus-driver'
import { downloadBlob } from '@/utils/download'
import { request } from 'uni-ui-lib'

export default {
  page: {
    url: `${API_PATHS.schoolBusDriver}/getDriverPage`,
    name: '司机分页',
    get: async function (this: { url: string }, params: DriverListParams) {
      return await request.get<PageResult<DriverRecord>, PageResult<DriverRecord>>(this.url, {
        params
      })
    }
  },

  detail: {
    url: `${API_PATHS.schoolBusDriver}/get`,
    name: '司机详情',
    get: async function (this: { url: string }, id: string | number) {
      return await request.get<DriverRecord, DriverRecord>(`${this.url}/${id}`)
    }
  },

  add: {
    url: `${API_PATHS.schoolBusDriver}/add`,
    name: '新增司机',
    post: async function (this: { url: string }, data: DriverFormModel) {
      return await request.post(this.url, data)
    }
  },

  edit: {
    url: `${API_PATHS.schoolBusDriver}/edit`,
    name: '编辑司机',
    post: async function (this: { url: string }, data: DriverFormModel) {
      return await request.post(this.url, data)
    }
  },

  delete: {
    url: `${API_PATHS.schoolBusDriver}/del`,
    name: '删除司机',
    delete: async function (this: { url: string }, ids: Array<string | number>) {
      return await request.delete(this.url, {
        params: { ids }
      })
    }
  },

  import: {
    url: `${API_PATHS.schoolBusDriver}/import`,
    name: '导入司机',
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
    url: `${API_PATHS.schoolBusDriver}/download`,
    name: '下载导入模板',
    download: async function (this: { url: string }, filename = 'driver-import-template.xlsx') {
      const blob = await request.get<Blob, Blob>(this.url, {
        responseType: 'blob'
      })

      downloadBlob(blob, filename)
    }
  }
}
