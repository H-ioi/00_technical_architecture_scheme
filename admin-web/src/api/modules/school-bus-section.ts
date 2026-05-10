import { API_PATHS } from '@/api/constants'
import { request } from 'uni-ui-lib'

/** 学期配置（旧 `api/isacommunity/term.js`，`/isacommunity/bussection`）。 */
export default {
  page: {
    url: `${API_PATHS.schoolBusSection}/getSectionPage`,
    get: async function (this: { url: string }, params: Record<string, unknown>) {
      return await request.get(this.url, { params })
    }
  },
  detail: {
    url: `${API_PATHS.schoolBusSection}/get`,
    get: async function (this: { url: string }, id: string | number) {
      return await request.get(`${this.url}/${id}`)
    }
  },
  add: {
    url: `${API_PATHS.schoolBusSection}/add`,
    post: async function (this: { url: string }, data: Record<string, unknown>) {
      return await request.post(this.url, data)
    }
  },
  edit: {
    url: `${API_PATHS.schoolBusSection}/edit`,
    post: async function (this: { url: string }, data: Record<string, unknown>) {
      return await request.post(this.url, data)
    }
  },
  delete: {
    url: `${API_PATHS.schoolBusSection}/del`,
    delete: async function (this: { url: string }, ids: Array<string | number>) {
      return await request.delete(this.url, {
        params: { ids }
      })
    }
  }
}