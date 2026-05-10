import type { PageQuery } from '@/types/api'

/** 列表查询（对齐旧页：`schoolIds`、`keyword`、`status`，分页 `current`/`size`）。 */
export interface DriverListParams extends PageQuery {
  schoolIds?: string | number
  keyword?: string
  status?: string | number
}

export interface DriverRecord {
  id: string | number
  /** 所属校区 id 列表 */
  schoolIds?: Array<string | number>
  /** 列表展示用校区名称 */
  schoolNames?: string
  schoolName?: string
  name?: string
  employeeNo?: string
  contact?: string
  age?: number | string
  licenseType?: string
  status?: string | number | boolean
  [key: string]: unknown
}

export interface DriverFormModel {
  id?: string | number
  schoolIds?: Array<string | number>
  name?: string
  employeeNo?: string
  contact?: string
  age?: number
  licenseType?: string
  status?: string | number
}
