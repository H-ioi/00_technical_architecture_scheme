import { API_PATHS } from '@/api/constants'
import type {
  BaseDictFieldRecord,
  BaseDictFieldSavePayload,
  BaseDictItemAddPayload,
  BaseDictItemEditPayload,
  BaseDictItemRecord
} from '@/types/modules/base-dict'
import { request } from 'uni-ui-lib'

const baseUrl = API_PATHS.publicDictItem

const unwrapData = <T>(body: unknown): T | undefined => {
  if (body === null || body === undefined) {
    return undefined
  }

  if (
    typeof body === 'object' &&
    'data' in body &&
    (body as { data: unknown }).data !== undefined
  ) {
    return (body as { data: T }).data
  }

  return body as T
}

const unwrapItemList = (body: unknown): BaseDictItemRecord[] => {
  const inner = unwrapData<BaseDictItemRecord[]>(body)
  return Array.isArray(inner) ? inner : []
}

const unwrapFieldList = (body: unknown): BaseDictFieldRecord[] => {
  const inner = unwrapData<BaseDictFieldRecord[]>(body)
  return Array.isArray(inner) ? inner : []
}

export default {
  list: {
    url: `${baseUrl}/get`,
    name: '字典项列表',
    get: async function (this: { url: string }, type: string) {
      const res = await request.get<unknown>(`${this.url}/${encodeURIComponent(type)}`)
      return unwrapItemList(res)
    }
  },

  add: {
    url: `${baseUrl}/add`,
    name: '新增字典项',
    post: async function (this: { url: string }, data: BaseDictItemAddPayload) {
      return await request.post(this.url, data)
    }
  },

  disable: {
    url: `${baseUrl}/disable`,
    name: '禁用字典项',
    put: async function (this: { url: string }, id: string | number) {
      return await request.put(`${this.url}/${id}`)
    }
  },

  enable: {
    url: `${baseUrl}/enable`,
    name: '启用字典项',
    put: async function (this: { url: string }, id: string | number) {
      return await request.put(`${this.url}/${id}`)
    }
  },

  edit: {
    url: `${baseUrl}/edit`,
    name: '编辑字典项',
    put: async function (this: { url: string }, data: BaseDictItemEditPayload) {
      return await request.put(this.url, data)
    }
  },

  remove: {
    url: `${baseUrl}/del`,
    name: '删除字典项',
    delete: async function (this: { url: string }, id: string | number) {
      return await request.delete(`${this.url}/${id}`)
    }
  },

  fields: {
    url: `${baseUrl}/field`,
    name: '字典项附加字段',
    get: async function (this: { url: string }, id: string | number) {
      const res = await request.get<unknown>(`${this.url}/${id}`)
      return unwrapFieldList(res)
    }
  },

  fieldSave: {
    url: `${baseUrl}/field/handle`,
    name: '保存附加字段',
    post: async function (this: { url: string }, data: BaseDictFieldSavePayload) {
      return await request.post(this.url, data)
    }
  }
}
