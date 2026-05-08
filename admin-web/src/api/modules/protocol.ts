import type { PageResult } from '@/types/api'
import type {
  ProtocolDict,
  ProtocolFormModel,
  ProtocolListParams,
  ProtocolRecord,
  ProtocolSignListParams,
  ProtocolSignRecord,
  SchoolOptionRecord,
  UploadFileResult
} from '@/types/modules/protocol'
import { request } from '@/utils/request'

interface LegacyPageResult<T> {
  data: T[]
  total: number
  current: number
}

const PROTOCOL_PATH = '/isacommunity/protocol'
const PROTOCOL_SIGN_PATH = '/isacommunity/protocolsign'
const MEMBERSHIP_PATH = '/isacommunity/membership'

const resolveUploadUrl = () => {
  const uploadUrl = import.meta.env.VITE_UPLOAD_URL || '/files/upload'
  const baseURL = request.defaults.baseURL

  if (baseURL && uploadUrl.startsWith(baseURL)) {
    return uploadUrl.slice(baseURL.length) || '/'
  }

  return uploadUrl
}

const toPageParams = <T extends ProtocolListParams | ProtocolSignListParams>(params: T) => {
  const { pageNo, pageSize, ...rest } = params

  return {
    ...rest,
    current: params.current ?? pageNo,
    size: params.size ?? pageSize
  }
}

/** 分页查询协议列表。 */
export const fetchProtocolPage = async (params: ProtocolListParams): Promise<PageResult<ProtocolRecord>> => {
  const result = await request.get<LegacyPageResult<ProtocolRecord>, LegacyPageResult<ProtocolRecord>>(
    `${PROTOCOL_PATH}/getProtocolPage`,
    {
      params: toPageParams(params)
    }
  )

  return {
    records: result.data,
    total: result.total
  }
}

/** 查询协议类型和所属模块字典。 */
export const fetchProtocolDict = async () => {
  const result = await request.get<ProtocolDict, ProtocolDict>(`${PROTOCOL_PATH}/getDictList`)

  return result
}

/** 查询协议详情。 */
export const fetchProtocolDetail = async (id: string | number) => {
  const result = await request.get<ProtocolRecord, ProtocolRecord>(`${PROTOCOL_PATH}/get/${id}`)

  return result
}

/** 新增协议。 */
export const addProtocol = (data: ProtocolFormModel) => request.post(`${PROTOCOL_PATH}/add`, data)

/** 编辑协议。 */
export const updateProtocol = (data: ProtocolFormModel) => request.post(`${PROTOCOL_PATH}/edit`, data)

/** 删除协议。 */
export const deleteProtocol = (ids: Array<string | number>) =>
  request.delete(`${PROTOCOL_PATH}/del`, {
    params: { ids }
  })

/** 查询签署记录。 */
export const fetchProtocolSignPage = async (
  params: ProtocolSignListParams
): Promise<PageResult<ProtocolSignRecord>> => {
  const result = await request.get<LegacyPageResult<ProtocolSignRecord>, LegacyPageResult<ProtocolSignRecord>>(
    `${PROTOCOL_SIGN_PATH}/getProtocolSignPage`,
    {
      params: toPageParams(params)
    }
  )

  return {
    records: result.data,
    total: result.total
  }
}

/** 查询学校选项。 */
export const fetchProtocolSchoolOptions = async () => {
  const result = await request.get<SchoolOptionRecord[], SchoolOptionRecord[]>(`${MEMBERSHIP_PATH}/getSchoolList`)

  return result
}

/** 上传协议 PDF 文档。 */
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
