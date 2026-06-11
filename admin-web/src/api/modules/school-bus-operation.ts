import type { OperationFormModel, OperationListParams } from '@/types/modules/school-bus-operation'
import { downloadResponseBlob } from '@/utils/download'
import type { AxiosResponse } from 'axios'
import { request } from 'uni-ui-lib'

const base = '/isacommunity/busoperation'

/** 校车路线运营（旧 `api/isacommunity/busoperation.js`）。 */
export default {
  page: {
    url: `${base}/getOperationPage`,
    get: async function (this: { url: string }, params: OperationListParams) {
      return await request.get(this.url, { params })
    }
  },
  detail: {
    url: `${base}/get`,
    get: async function (this: { url: string }, id: string | number) {
      return await request.get(`${this.url}/${id}`)
    }
  },
  add: {
    url: `${base}/add`,
    post: async function (this: { url: string }, data: OperationFormModel) {
      return await request.post(this.url, data)
    }
  },
  edit: {
    url: `${base}/edit`,
    post: async function (this: { url: string }, data: OperationFormModel) {
      return await request.post(this.url, data)
    }
  },
  delete: {
    url: `${base}/del`,
    delete: async function (this: { url: string }, ids: Array<string | number>) {
      return await request.delete(this.url, {
        params: { ids }
      })
    }
  },
  import: {
    url: `${base}/import`,
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
    url: `${base}/export`,
    get: async function (this: { url: string }, params: Record<string, unknown>) {
      return await request.get<Blob, AxiosResponse<Blob>>(this.url, {
        params,
        responseType: 'blob',
        rawResponse: true
      })
    }
  },
  template: {
    url: `${base}/download`,
    download: async function (this: { url: string }, filename = 'operation-import-template.xlsx') {
      const response = await request.get<Blob, AxiosResponse<Blob>>(this.url, {
        responseType: 'blob',
        rawResponse: true
      })

      downloadResponseBlob(response, filename)
    }
  }
}
