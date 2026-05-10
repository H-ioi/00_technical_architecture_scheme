import type { PageQuery } from '@/types/api'

/** 列表查询（对齐旧 `getCarinfoPage`）。 */
export interface CarListParams extends PageQuery {
  schoolIds?: string | number
  carNumber?: string
  driver?: string
  carTeacher?: string
  status?: string | number
}

export interface CarRecord {
  id: string | number
  schoolEnNames?: string
  schoolIds?: Array<string | number>
  carNumber?: string
  carTeacher?: string
  driverName?: string
  driverInfo?: { name?: string }
  seatNumber?: number
  carImageUrl?: string
  status?: string | number
  statusLabel?: string
  carTeacherId?: string | number
  driverId?: string | number
  createTime?: string
  updateTime?: string
  [key: string]: unknown
}

export interface CarFormModel {
  id?: string | number
  schoolIds?: Array<string | number>
  carNumber?: string
  carTeacherId?: string | number
  seatNumber?: number
  driverId?: string | number
  status?: string | number
  carImageUrl?: string
}
