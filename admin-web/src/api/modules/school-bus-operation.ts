import { API_PATHS } from '@/api/constants'
import type { OperationFormModel, OperationListParams } from '@/types/modules/school-bus-operation'
import { downloadBlob } from '@/utils/download'
import { request } from 'uni-ui-lib'

/** 校车路线运营（旧 `api/isacommunity/busoperation.js`）。 */
export default {
  page: {
    url: `${API_PATHS.schoolBusOperation}/getOperationPage`,
    get: async function (this: { url: string }, params: OperationListParams) {
      return await request.get(this.url, { params })
    }
  },
  detail: {
    url: `${API_PATHS.schoolBusOperation}/get`,
    get: async function (this: { url: string }, id: string | number) {
      return await request.get(`${this.url}/${id}`)
    }
  },
  add: {
    url: `${API_PATHS.schoolBusOperation}/add`,
    post: async function (this: { url: string }, data: OperationFormModel) {
      return await request.post(this.url, data)
    }
  },
  edit: {
    url: `${API_PATHS.schoolBusOperation}/edit`,
    post: async function (this: { url: string }, data: OperationFormModel) {
      return await request.post(this.url, data)
    }
  },
  delete: {
    url: `${API_PATHS.schoolBusOperation}/del`,
    delete: async function (this: { url: string }, ids: Array<string | number>) {
      return await request.delete(this.url, {
        params: { ids }
      })
    }
  },
  import: {
    url: `${API_PATHS.schoolBusOperation}/import`,
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
  export: {
    url: `${API_PATHS.schoolBusOperation}/export`,
    get: async function (this: { url: string }, params: Record<string, unknown>) {
      return await request.get<Blob, Blob>(this.url, {
        params,
        responseType: 'blob'
      })
    }
  },
  template: {
    url: `${API_PATHS.schoolBusOperation}/download`,
    download: async function (this: { url: string }, filename = 'operation-import-template.xlsx') {
      const blob = await request.get<Blob, Blob>(this.url, {
        responseType: 'blob'
      })

      downloadBlob(blob, filename)
    }
  }
}
