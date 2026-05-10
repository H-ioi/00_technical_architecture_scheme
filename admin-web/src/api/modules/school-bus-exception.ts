import { API_PATHS } from '@/api/constants'
import type { ExceptionFormModel, ExceptionListParams } from '@/types/modules/school-bus-exception'
import { downloadBlob } from '@/utils/download'
import { request } from 'uni-ui-lib'

/** 校车异常上报（旧 `api/isacommunity/busexception.js`）。 */
export default {
  page: {
    url: `${API_PATHS.schoolBusException}/getExceptionPage`,
    get: async function (this: { url: string }, params: ExceptionListParams) {
      return await request.get(this.url, { params })
    }
  },
  detail: {
    url: `${API_PATHS.schoolBusException}/get`,
    get: async function (this: { url: string }, id: string | number) {
      return await request.get(`${this.url}/${id}`)
    }
  },
  add: {
    url: `${API_PATHS.schoolBusException}/add`,
    post: async function (this: { url: string }, data: ExceptionFormModel) {
      return await request.post(this.url, data)
    }
  },
  edit: {
    url: `${API_PATHS.schoolBusException}/edit`,
    post: async function (this: { url: string }, data: ExceptionFormModel) {
      return await request.post(this.url, data)
    }
  },
  delete: {
    url: `${API_PATHS.schoolBusException}/del`,
    delete: async function (this: { url: string }, ids: Array<string | number>) {
      return await request.delete(this.url, {
        params: { ids }
      })
    }
  },
  import: {
    url: `${API_PATHS.schoolBusException}/import`,
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
    url: `${API_PATHS.schoolBusException}/export`,
    get: async function (this: { url: string }, params: Record<string, unknown>) {
      return await request.get<Blob, Blob>(this.url, {
        params,
        responseType: 'blob'
      })
    }
  },
  template: {
    url: `${API_PATHS.schoolBusException}/download`,
    download: async function (this: { url: string }, filename = 'exception-import-template.xlsx') {
      const blob = await request.get<Blob, Blob>(this.url, {
        responseType: 'blob'
      })

      downloadBlob(blob, filename)
    }
  }
}
