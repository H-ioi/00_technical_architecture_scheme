import type { PageQuery } from '@/types/api'

export interface ProtocolListParams extends PageQuery {
  schoolIds?: string | number | Array<string | number>
  cnName?: string
  enName?: string
  protocolType?: string | number
  module?: string | number
  status?: string | number
}

export interface ProtocolRecord {
  id: string | number
  schoolEnNames?: string
  schoolCnNames?: string
  schoolIds?: Array<string | number>
  cnName?: string
  enName?: string
  protocolType?: string | number
  protocolTypeCnName?: string
  protocolTypeEnName?: string
  module?: string | number
  moduleCnName?: string
  moduleEnName?: string
  needSign?: string | number
  status?: string | number
  documentUrl?: string
  createTime?: string
  updateTime?: string
  [key: string]: unknown
}

export interface ProtocolDictItem {
  id: string | number
  cnName?: string
  enName?: string
  name?: string
}

export interface ProtocolDict {
  protocolTypeList?: ProtocolDictItem[]
  moduleList?: ProtocolDictItem[]
}

export interface ProtocolFormModel {
  id?: string | number
  schoolIds?: Array<string | number>
  cnName?: string
  enName?: string
  protocolType?: string | number
  module?: string | number
  needSign?: string | number
  status?: string | number
  documentUrl?: string
}

export interface ProtocolSignListParams extends PageQuery {
  protocolId: string | number
  schoolIds?: Array<string | number>
}

export interface ProtocolSignRecord {
  id: string | number
  studentName?: string
  admissionNo?: string
  grade?: string
  signImageUrl?: string
  updateTime?: string
  [key: string]: unknown
}

export interface UploadFileResult {
  url?: string
  data?: {
    url?: string
  }
}
