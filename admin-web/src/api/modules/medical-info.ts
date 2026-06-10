import type { PageResult } from '@/types/api'
import type {
  MedicalInfoFormModel,
  MedicalInfoListRow,
  MedicalInfoPageParams
} from '@/types/modules/medical-info'
import { request } from 'uni-ui-lib'

const base = '/isacommunity/clinic/medicalinfo'
const uploadUrl = import.meta.env.VITE_UPLOAD_URL?.trim() || 'https://upload.isagzth.com/upload/'

const toBrowserUploadUrl = (url: string) => {
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }
  if (url.startsWith('/')) {
    return url
  }
  return `/${url.replace(/^\//, '')}`
}

export default {
  page: {
    name: '学生医疗信息分页',
    get: async (params: MedicalInfoPageParams) =>
      await request.get<PageResult<MedicalInfoListRow>, PageResult<MedicalInfoListRow>>(
        `${base}/paginate`,
        { params }
      )
  },

  detail: {
    name: '学生医疗信息详情',
    get: async (id: string | number) =>
      await request.get<MedicalInfoFormModel, MedicalInfoFormModel>(`${base}/get/${id}`)
  },

  add: {
    name: '新增学生医疗信息',
    post: async (data: MedicalInfoFormModel) => await request.post(`${base}/add`, data)
  },

  edit: {
    name: '更新学生医疗信息',
    post: async (data: MedicalInfoFormModel | Record<string, unknown>) =>
      await request.post(`${base}/edit`, data)
  },

  deleteBatch: {
    name: '批量删除学生医疗信息',
    delete: async (ids: string) => await request.delete(`${base}/del`, { params: { ids } })
  },

  import: {
    name: '导入学生医疗信息',
    post: async (file: File) => {
      const fd = new FormData()
      fd.append('file', file)
      return await request.post(`${base}/import`, fd, {
        headers: { 'Content-Type': 'multipart/form-data', VERSION: 'B' }
      })
    }
  },

  export: {
    name: '导出学生医疗信息',
    get: async (params: MedicalInfoPageParams) =>
      await request.get<Blob, Blob>(`${base}/export`, { params, responseType: 'blob' })
  },

  uploadAttachment: {
    name: '上传医疗信息附件',
    post: async (file: File) => {
      const fd = new FormData()
      fd.append('prefix', 'parent_weapp_upload')
      fd.append('file', file)
      const raw = await request.post<{ url?: string; data?: { url?: string } }>(
        toBrowserUploadUrl(uploadUrl),
        fd,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      )
      return raw.url ?? raw.data?.url ?? ''
    }
  }
}
