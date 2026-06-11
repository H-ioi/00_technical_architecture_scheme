import { downloadResponseBlob } from '@/utils/download'
import type { AxiosResponse } from 'axios'
import { request } from 'uni-ui-lib'

const base = '/isacommunity/busline'

/** 路线规划-线路（旧 `api/isacommunity/route.js`，`/isacommunity/busline`）。 */
export default {
  page: {
    url: `${base}/getLinePage`,
    get: async function (this: { url: string }, params: Record<string, unknown>) {
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
    post: async function (this: { url: string }, data: Record<string, unknown>) {
      return await request.post(this.url, data)
    }
  },
  edit: {
    url: `${base}/edit`,
    post: async function (this: { url: string }, data: Record<string, unknown>) {
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
  batchCopy: {
    url: `${base}/batchCopy`,
    get: async function (this: { url: string }, params: Record<string, unknown>) {
      return await request.get(this.url, { params })
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
  template: {
    url: `${base}/download`,
    download: async function (this: { url: string }, filename = 'route-import-template.xlsx') {
      const response = await request.get<Blob, AxiosResponse<Blob>>(this.url, {
        responseType: 'blob',
        rawResponse: true
      })

      downloadResponseBlob(response, filename)
    }
  }
}
