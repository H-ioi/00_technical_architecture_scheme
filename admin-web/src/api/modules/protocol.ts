import { API_PATHS } from '@/api/constants'
import type { PageResult } from '@/types/api'
import type {
  ProtocolDict,
  ProtocolFormModel,
  ProtocolListParams,
  ProtocolRecord,
  ProtocolSignListParams,
  ProtocolSignRecord,
  UploadFileResult
} from '@/types/modules/protocol'
import { request } from '@/utils/request'

const resolveUploadUrl = () => {
  const uploadUrl = import.meta.env.VITE_UPLOAD_URL || '/files/upload'
  const baseURL = request.defaults.baseURL

  if (baseURL && uploadUrl.startsWith(baseURL)) {
    return uploadUrl.slice(baseURL.length) || '/'
  }

  return uploadUrl
}

// 分页查询协议列表。
export const fetchProtocolPage = (params: ProtocolListParams) =>
  request.get<PageResult<ProtocolRecord>, PageResult<ProtocolRecord>>(`${API_PATHS.protocol}/getProtocolPage`, {
    params
  }
)

// 查询协议类型和所属模块字典。
export const fetchProtocolDict = () =>
  request.get<ProtocolDict, ProtocolDict>(`${API_PATHS.protocol}/getDictList`)

// 查询协议详情。
export const fetchProtocolDetail = (id: string | number) =>
  request.get<ProtocolRecord, ProtocolRecord>(`${API_PATHS.protocol}/get/${id}`)

// 新增协议。
export const addProtocol = (data: ProtocolFormModel) => request.post(`${API_PATHS.protocol}/add`, data)

// 编辑协议。
export const updateProtocol = (data: ProtocolFormModel) => request.post(`${API_PATHS.protocol}/edit`, data)

// 删除协议。
export const deleteProtocol = (ids: Array<string | number>) =>
  request.delete(`${API_PATHS.protocol}/del`, {
    params: { ids }
  })

// 查询签署记录。
export const fetchProtocolSignPage = (params: ProtocolSignListParams) =>
  request.get<PageResult<ProtocolSignRecord>, PageResult<ProtocolSignRecord>>(
    `${API_PATHS.protocolSign}/getProtocolSignPage`,
    {
      params
    }
  )

// 上传协议 PDF 文档。
export const uploadProtocolDocument = async (file: File) => {
  const formData = new FormData()
  formData.append('file', file)

  const result = await request.post<UploadFileResult, UploadFileResult>(
    resolveUploadUrl(),
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  )

  return result.url ?? result.data?.url ?? ''
}
