/** 学生每日考勤列表请求（旧页 spread `pagination` + `dataForm`，日期区间拆为 beginTime/endTime）。 */
export interface AttendanceDailyListParams {
  current: number
  size: number
  schoolName?: string
  admissionNo?: string
  busStatus?: string | number
  dormitoryStatus?: string | number
  beginTime?: string
  endTime?: string
  dataFrom?: string
  status?: string
}

/** 列表行（展示字段由 use-list 补齐 Label 列）。 */
export interface AttendanceDailyRecord {
  /** 表格 `row-key`，兼容无 `id` 行 */
  _key?: string
  id?: string | number
  schoolName?: string
  admissionNo?: string
  studentName?: string
  grade?: string
  form?: string
  busStatus?: unknown
  dormitoryStatus?: unknown
  date?: string
  date2?: unknown
  status?: string
  dataFrom?: string
  comment?: string
  createdAt?: string
  busStatusLabel?: string
  dormitoryStatusLabel?: string
  attendanceTimeLabel?: string
  statusLabel?: string
  dataFromLabel?: string
}
