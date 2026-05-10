import type { PageQuery } from '@/types/api'

/** 列表查询（对齐旧页，分页 `current`/`size`）。 */
export interface BusOrderListParams extends PageQuery {
  schoolIds?: string | number | Array<string | number>
  approvalStatus?: string | number
  sectionId?: string | number
  lineIds?: Array<string | number>
  stationIds?: Array<string | number>
  keyword?: string
  carInfoId?: string | number
}

export interface BusOrderRecord {
  id: string | number
  createTime?: string
  approvalStatus?: string | number
  paymentStatus?: string | number
  pickupMethod?: string | number
  schoolEnName?: string
  admissionNo?: string
  studentName?: string
  studentGrade?: string
  buslineCnName?: string
  buslineEnName?: string
  sectionCnName?: string
  sectionEnName?: string
  busStationCnName?: string
  busStationEnName?: string
  [key: string]: unknown
}

/** 新增/编辑订单提交体（字段以旧 `busorder` 接口为准）。 */
export interface BusOrderFormModel extends Record<string, unknown> {
  id?: string | number
}
