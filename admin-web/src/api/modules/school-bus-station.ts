import { API_PATHS } from '@/api/constants'
import { downloadBlob } from '@/utils/download'
import { request } from 'uni-ui-lib'

/** 站点配置（旧 `api/isacommunity/station.js`，`/isacommunity/busstation`）。 */
export default {
  page: {
    url: `${API_PATHS.schoolBusStation}/getStationPage`,
    get: async function (this: { url: string }, params: Record<string, unknown>) {
      return await request.get(this.url, { params })
    }
  },
  detail: {
    url: `${API_PATHS.schoolBusStation}/get`,
    get: async function (this: { url: string }, id: string | number) {
      return await request.get(`${this.url}/${id}`)
    }
  },
  add: {
    url: `${API_PATHS.schoolBusStation}/add`,
    post: async function (this: { url: string }, data: Record<string, unknown>) {
      return await request.post(this.url, data)
    }
  },
  edit: {
    url: `${API_PATHS.schoolBusStation}/edit`,
    post: async function (this: { url: string }, data: Record<string, unknown>) {
      return await request.post(this.url, data)
    }
  },
  delete: {
    url: `${API_PATHS.schoolBusStation}/del`,
    delete: async function (this: { url: string }, ids: Array<string | number>) {
      return await request.delete(this.url, {
        params: { ids }
      })
    }
  },
  import: {
    url: `${API_PATHS.schoolBusStation}/import`,
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
    url: `${API_PATHS.schoolBusStation}/download`,
    download: async function (this: { url: string }, filename = 'station-import-template.xlsx') {
      const blob = await request.get<Blob, Blob>(this.url, {
        responseType: 'blob'
      })

      downloadBlob(blob, filename)
    }
  }
}
