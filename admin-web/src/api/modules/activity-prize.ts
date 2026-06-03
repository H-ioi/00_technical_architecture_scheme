import { API_PATHS } from '@/api/constants'
import { request } from 'uni-ui-lib'

import type {
  ActivityPrizeListParams,
  ActivityPrizeUploadResult
} from '@/types/modules/activity-prize'

const path = API_PATHS.activityPrize
const uploadUrl = import.meta.env.VITE_UPLOAD_URL?.trim() || 'https://upload.isagzth.com/upload/'

const repeatQuery = (key: string, values: Array<string | number>) =>
  values.map((v) => `${key}=${encodeURIComponent(String(v))}`).join('&')

const toBrowserUploadUrl = (url: string) => {
  if (!url || /^https?:\/\//i.test(url)) {
    return url
  }
  if (typeof window === 'undefined') {
    return url
  }
  return url.startsWith('/')
    ? `${window.location.origin}${url}`
    : `${window.location.origin}/${url}`
}

export default {
  page: {
    name: '奖品分页',
    get: async (params: ActivityPrizeListParams) =>
      await request.get(`${path}/getPrizePage`, { params })
  },
  detail: {
    name: '奖品详情',
    get: async (id: string | number) => await request.get(`${path}/get/${id}`)
  },
  add: {
    name: '新增奖品',
    post: async (data: Record<string, unknown>) => await request.post(`${path}/add`, data)
  },
  edit: {
    name: '编辑奖品',
    post: async (data: Record<string, unknown>) => await request.post(`${path}/edit`, data)
  },
  remove: {
    name: '删除奖品',
    delete: async (ids: Array<string | number>) =>
      await request.delete(`${path}/del?${repeatQuery('ids', ids)}`)
  },
  listByProgram: {
    name: '按项目获取奖品',
    get: async (params: { programId: string | number }) =>
      await request.get(`${path}/listByProgram`, { params })
  },
  uploadImage: {
    name: '上传奖品图片',
    post: async (file: File) => {
      const fd = new FormData()
      fd.append('prefix', 'parent_weapp_upload')
      fd.append('file', file)
      const raw = await request.post<ActivityPrizeUploadResult, ActivityPrizeUploadResult>(
        toBrowserUploadUrl(uploadUrl),
        fd,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      )
      return raw.url ?? raw.data?.url ?? ''
    }
  }
}
