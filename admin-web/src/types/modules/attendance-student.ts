import type { PageQuery } from '@/types/api'

/** 分页查询（对齐旧页 `getAttendanceStudentPage`，分页 `current`/`size`）。 */
export interface AttendanceStudentListParams extends PageQuery {
  schoolIds?: string | number
  admissionNo?: string
  grade?: string
  /** 是否住宿（旧 `onBoarding`，枚举 `yesOrno`） */
  onBoarding?: string
  /** 是否坐校巴（旧 `onBus`，枚举 `yesOrno`） */
  onBus?: string
  /** 考勤状态（旧 `schoolStatus`，枚举 `attendanceSchoolType`） */
  schoolStatus?: string
  beginDate?: string
  endDate?: string
}

/** 表格行（列表接口原始字段 + 展示用格式化字段）。 */
export interface AttendanceStudentRecord {
  id: string | number
  schoolName?: string
  studentName?: string
  admissionNo?: string
  grade?: string
  form?: string
  boarding?: string
  schoolBus?: string
  schoolStatus?: string
  attendanceDate?: string
  entryTime?: string
  leavingTime?: string
  updatedAt?: string
  createdAt?: string
  [key: string]: unknown
}
