import type { PageQuery } from '@/types/api'

/** 路线运营列表查询（与旧「路线运营」页一致）。 */
export interface OperationListParams extends PageQuery {
  schoolIds?: string | number | Array<string | number>
  lineIds?: string | number | Array<string | number>
  stationId?: string | number
  status?: string | number
  rideDateStart?: string
  rideDateEnd?: string
}

export interface OperationRecord {
  id: string | number
  status?: string | number
  statusLabel?: string
  arrivalStatus?: string | number
  arrivalStatusLabel?: string
  /** 接口可能返回的英文校区名；列表展示用 `schoolIds` + 表格列 options 映射 */
  schoolEnNames?: string
  sectionName?: string
  carNumber?: string
  carTeacher?: string
  lineName?: string
  stationName?: string
  rideDate?: string
  arrivalTime?: string
  createTime?: string
  updateTime?: string
  remark?: string
  [key: string]: unknown
}

/** 提交路线运营。 */
export interface OperationFormModel {
  id?: string | number
  school?: Array<string | number>
  sectionId?: string | number
  lineId?: string | number
  stationId?: string | number
  schoolTimeType?: string
  carId?: string | number
  carTeacher?: string
  driver?: string
  seatNumber?: string | number
  rideDate?: string
  arrivalTime?: string
  remark?: string
  status?: string
  [key: string]: unknown
}
