import type { PageQuery } from '@/types/api'

/** 站点列表查询（`/busstation/getStationPage`）。 */
export interface StationListParams extends PageQuery {
  schoolIds?: string | number | Array<string | number>
  /** 站点名称（模糊） */
  cnName?: string
}
