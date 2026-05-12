import type { PageQuery } from '@/types/api'

/** 分页查询（对齐旧页 `getAccessRecordPage`，`/union/page`）。 */
export interface AttendanceAccessListParams extends PageQuery {
  schoolId?: string | number
  deptName?: string
  personName?: string
  personCode?: string
  cardNumber?: string
  acsChannelName?: string
  beginDate?: string
  endDate?: string
}

/** 表格行（列表原始字段 + 展示格式化）。 */
export interface AttendanceAccessRecord {
  id: string | number
  /** 与 `membershipApi.school` 的 `id` 对齐，表格用其映射中英校区名 */
  schoolId?: string | number
  schoolName?: string
  deptName?: string
  personCode?: string
  personName?: string
  acsChannelName?: string
  attendanceDate?: string
  enterOrExit?: string
  openType?: string
  openResult?: string
  cardNumber?: string
  deviceName?: string
  swingTime?: string
  createTime?: string
  [key: string]: unknown
}
