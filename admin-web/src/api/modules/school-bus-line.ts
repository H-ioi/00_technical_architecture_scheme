import { API_PATHS } from '@/api/constants'
import { downloadBlob } from '@/utils/download'
import { request } from 'uni-ui-lib'

/** 路线规划-线路（旧 `api/isacommunity/route.js`，`/isacommunity/busline`）。 */
export default {
  page: {
    url: `${API_PATHS.schoolBusLine}/getLinePage`,
    get: async function (this: { url: string }, params: Record<string, unknown>) {
      return await request.get(this.url, { params })
    }
  },
  detail: {
    url: `${API_PATHS.schoolBusLine}/get`,
    get: async function (this: { url: string }, id: string | number) {
      return await request.get(`${this.url}/${id}`)
    }
  },
  add: {
    url: `${API_PATHS.schoolBusLine}/add`,
    post: async function (this: { url: string }, data: Record<string, unknown>) {
      return await request.post(this.url, data)
    }
  },
  edit: {
    url: `${API_PATHS.schoolBusLine}/edit`,
    post: async function (this: { url: string }, data: Record<string, unknown>) {
      return await request.post(this.url, data)
    }
  },
  delete: {
    url: `${API_PATHS.schoolBusLine}/del`,
    delete: async function (this: { url: string }, ids: Array<string | number>) {
      return await request.delete(this.url, {
        params: { ids }
      })
    }
  },
  batchCopy: {
    url: `${API_PATHS.schoolBusLine}/batchCopy`,
    get: async function (this: { url: string }, params: Record<string, unknown>) {
      return await request.get(this.url, { params })
    }
  },
  import: {
    url: `${API_PATHS.schoolBusLine}/import`,
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
    url: `${API_PATHS.schoolBusLine}/download`,
    download: async function (this: { url: string }, filename = 'route-import-template.xlsx') {
      const blob = await request.get<Blob, Blob>(this.url, {
        responseType: 'blob'
      })

      downloadBlob(blob, filename)
    }
  }
}
