import type { PageQuery } from '@/types/api'

/** 分页查询（对齐旧页 `getSchoolAttendancePage`）。 */
export interface AttendanceSchoolListParams extends PageQuery {
  schoolIds?: string | number
  deptName?: string
  personName?: string
  personCode?: string
  schoolStatus?: string
  cardNumber?: string
  entryAcsChannel?: string
  leavingAcsChannel?: string
  beginDate?: string
  endDate?: string
}

/** 表格行（列表原始字段 + 展示格式化）。 */
export interface AttendanceSchoolRecord {
  id: string | number
  schoolName?: string
  personCode?: string
  personName?: string
  deptName?: string
  cardNumber?: string
  schoolStatus?: string
  entryOpenType?: string
  entryTime?: string
  entryAcsChannel?: string
  leavingOpenType?: string
  leavingTime?: string
  leavingAcsChannel?: string
  attendanceDate?: string
  createdAt?: string
  [key: string]: unknown
}
