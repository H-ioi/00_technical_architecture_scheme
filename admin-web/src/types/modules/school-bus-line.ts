import type { PageQuery } from '@/types/api'

/** 路线规划-线路列表查询（`/busline/getLinePage`）。字段名需与后端 DTO 一致，不符时只对齐此处。 */
export interface LineListParams extends PageQuery {
  schoolIds?: string | number | Array<string | number>
  sectionId?: string | number
  stationId?: string | number
  /** 可见 / 不可见 */
  visible?: boolean | string | number
  /** 路线名称（模糊） */
  cnName?: string
  /** 车牌号 */
  carNumber?: string
}
