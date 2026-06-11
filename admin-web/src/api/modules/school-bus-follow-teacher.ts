import type {
  FollowTeacherFormModel,
  FollowTeacherListParams
} from '@/types/modules/school-bus-follow-teacher'
import { downloadResponseBlob } from '@/utils/download'
import type { AxiosResponse } from 'axios'
import { request } from 'uni-ui-lib'

const base = '/isacommunity/teacher/user'

/** 跟车老师账号（旧 `api/isacommunity/user.js`，`/isacommunity/teacher/user`）。 */
export default {
  page: {
    url: `${base}/paginate`,
    name: '跟车老师分页',
    get: async function (this: { url: string }, params: FollowTeacherListParams) {
      return await request.get(this.url, { params })
    }
  },
  detail: {
    url: `${base}/get`,
    name: '跟车老师详情',
    get: async function (this: { url: string }, id: string | number) {
      return await request.get(`${this.url}/${id}`)
    }
  },
  add: {
    url: `${base}/add`,
    name: '新增跟车老师',
    post: async function (this: { url: string }, data: FollowTeacherFormModel) {
      return await request.post(this.url, data)
    }
  },
  edit: {
    url: `${base}/edit`,
    name: '编辑跟车老师',
    post: async function (this: { url: string }, data: FollowTeacherFormModel) {
      return await request.post(this.url, data)
    }
  },
  delete: {
    url: `${base}/del`,
    name: '删除跟车老师',
    delete: async function (this: { url: string }, ids: Array<string | number>) {
      return await request.delete(this.url, {
        params: { ids }
      })
    }
  },
  enable: {
    url: `${base}/enable`,
    name: '批量启用跟车老师',
    post: async function (this: { url: string }, ids: Array<string | number>) {
      return await request.post(this.url, null, {
        params: { ids: ids.join(',') }
      })
    }
  },
  disable: {
    url: `${base}/disable`,
    name: '批量禁用跟车老师',
    post: async function (this: { url: string }, ids: Array<string | number>) {
      return await request.post(this.url, null, {
        params: { ids: ids.join(',') }
      })
    }
  },
  import: {
    url: `${base}/import`,
    name: '导入跟车老师',
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
    name: '导出跟车老师',
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
    name: '下载跟车老师导入模板',
    download: async function (this: { url: string }, filename = 'follow-teacher-template.xlsx') {
      const response = await request.get<Blob, AxiosResponse<Blob>>(this.url, {
        responseType: 'blob',
        rawResponse: true
      })
      downloadResponseBlob(response, filename)
    }
  }
}
