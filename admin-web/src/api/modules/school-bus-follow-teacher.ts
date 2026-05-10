import { API_PATHS } from '@/api/constants'
import type { FollowTeacherFormModel, FollowTeacherListParams } from '@/types/modules/school-bus-follow-teacher'
import { downloadBlob } from '@/utils/download'
import { request } from 'uni-ui-lib'

/** 跟车老师账号（旧 `api/isacommunity/user.js`，`/isacommunity/teacher/user`）。 */
export default {
  page: {
    url: `${API_PATHS.schoolBusFollowTeacher}/paginate`,
    name: '跟车老师分页',
    get: async function (this: { url: string }, params: FollowTeacherListParams) {
      return await request.get(this.url, { params })
    }
  },
  detail: {
    url: `${API_PATHS.schoolBusFollowTeacher}/get`,
    name: '跟车老师详情',
    get: async function (this: { url: string }, id: string | number) {
      return await request.get(`${this.url}/${id}`)
    }
  },
  add: {
    url: `${API_PATHS.schoolBusFollowTeacher}/add`,
    name: '新增跟车老师',
    post: async function (this: { url: string }, data: FollowTeacherFormModel) {
      return await request.post(this.url, data)
    }
  },
  edit: {
    url: `${API_PATHS.schoolBusFollowTeacher}/edit`,
    name: '编辑跟车老师',
    post: async function (this: { url: string }, data: FollowTeacherFormModel) {
      return await request.post(this.url, data)
    }
  },
  delete: {
    url: `${API_PATHS.schoolBusFollowTeacher}/del`,
    name: '删除跟车老师',
    delete: async function (this: { url: string }, ids: Array<string | number>) {
      return await request.delete(this.url, {
        params: { ids }
      })
    }
  },
  enable: {
    url: `${API_PATHS.schoolBusFollowTeacher}/enable`,
    name: '批量启用跟车老师',
    post: async function (this: { url: string }, ids: Array<string | number>) {
      return await request.post(this.url, null, {
        params: { ids: ids.join(',') }
      })
    }
  },
  disable: {
    url: `${API_PATHS.schoolBusFollowTeacher}/disable`,
    name: '批量禁用跟车老师',
    post: async function (this: { url: string }, ids: Array<string | number>) {
      return await request.post(this.url, null, {
        params: { ids: ids.join(',') }
      })
    }
  },
  import: {
    url: `${API_PATHS.schoolBusFollowTeacher}/import`,
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
    url: `${API_PATHS.schoolBusFollowTeacher}/export`,
    name: '导出跟车老师',
    get: async function (this: { url: string }, params: Record<string, unknown>) {
      return await request.get<Blob, Blob>(this.url, {
        params,
        responseType: 'blob'
      })
    }
  },
  template: {
    url: `${API_PATHS.schoolBusFollowTeacher}/download`,
    name: '下载跟车老师导入模板',
    download: async function (this: { url: string }, filename = 'follow-teacher-template.xlsx') {
      const blob = await request.get<Blob, Blob>(this.url, {
        responseType: 'blob'
      })
      downloadBlob(blob, filename)
    }
  }
}
