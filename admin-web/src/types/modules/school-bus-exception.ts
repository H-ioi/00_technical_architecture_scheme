import type { PageQuery } from '@/types/api'

/** 异常上报列表查询（与旧「异常上报」页一致）。 */
export interface ExceptionListParams extends PageQuery {
  schoolIds?: string | number | Array<string | number>
  sectionId?: string | number
  lineIds?: string | number | Array<string | number>
  carId?: string | number
  exceptionType?: string | number
  needDispatch?: string | number
  exceptionDateStart?: string
  exceptionDateEnd?: string
}

export interface ExceptionRecord {
  id: string | number
  /** 接口可能返回的英文校区名拼接；列表展示用 `schoolIds` + 表格列 options 映射 */
  schoolEnNames?: string
  sectionName?: string
  lineName?: string
  carNumber?: string
  driver?: string
  teacher?: string
  exceptionTypeLabel?: string
  exceptionDate?: string
  needDispatchLabel?: string
  dispatchCarNumber?: string
  dispatchDriver?: string
  createTime?: string
  details?: string
  [key: string]: unknown
}

/** 提交异常上报。 */
export interface ExceptionFormModel {
  id?: string | number
  school?: Array<string | number>
  sectionId?: string | number
  lineId?: string | number
  carId?: string | number
  carTeacher?: string
  driver?: string
  exceptionDate?: string
  exceptionType?: string
  needDispatch?: string | number
  dispatchCarId?: string | number
  dispatchDriver?: string
  details?: string
  [key: string]: unknown
}
