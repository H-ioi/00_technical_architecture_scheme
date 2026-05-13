import type { PageQuery } from '@/types/api'

/** 请假列表查询（对齐旧 `holiday/index.vue` → `listHoliday` 参数）。 */
export interface AttendanceHolidayListParams extends PageQuery {
  keyword?: string
  /** 请假类型：101 事假 / 102 病假 */
  type?: string
  /** 校区筛选（旧下拉值为校区 `enName`） */
  studentSchool?: string
  /** 请假范围：course / dorm / bus */
  scp?: string
  beginTime?: string
  endTime?: string
}

/** 销假列表查询（旧销假页 → `GET /holiday-return/return-page`）；筛选项：学校 + 学号/姓名。 */
export interface AttendanceHolidayReturnListParams extends PageQuery {
  keyword?: string
  studentSchool?: string
}

/** 请假列表行（字段名对齐旧列表接口；部分列为展示用格式化字段）。 */
export interface AttendanceHolidayRecord {
  id?: string | number
  procId?: string | number | null
  /** 销假列表常与外层 `id` 并存，详情接口需传请假主键时使用 */
  holidayId?: string | number
  holiday_id?: string | number
  /** 旧接口字段拼写 */
  admissonNo?: string
  studentName?: string
  studentSchool?: string
  studentGrade?: string
  studentClass?: string
  type?: string
  scope?: unknown
  reason?: string
  dateString?: string
  dateLimit?: unknown
  isInfectious?: string
  fixed?: string
  weekDays?: unknown
  status?: string
  createdAt?: string
  /** 是否流程已结束（旧撤回按钮条件 `!scope.row.isEnd`） */
  isEnd?: boolean
  [key: string]: unknown
}
