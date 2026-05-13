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
  /** 是否流程已结束（单独拆页 `holiday/index` 撤回条件 `!isEnd`；聚合 Tab 内请假列表以 `leaveManage` 为准） */
  isEnd?: boolean
  /** 数据来源：旧 `leaveManage.vue` 撤销按钮排除 `MB` */
  dataFrom?: string
  [key: string]: unknown
}

/** 请假模块-邮箱/年级配置（旧 `GET /attendance/sys/config/list`）。 */
export interface AttendanceHolidaySysConfigRecord {
  id?: string | number
  school?: string
  grades?: string[]
  department?: string
  email?: string
  [key: string]: unknown
}

/** 放行条分页查询（旧 `GET /attendance/leave/pass/page`，`size`/`current`）。 */
export interface AttendanceLeavePassListParams extends PageQuery {
  keyword?: string
  studentSchool?: string
  isDormitory?: string | number
}

/** 放行条行。 */
export interface AttendanceLeavePassRecord {
  id?: string | number
  studentNo?: string
  studentName?: string
  studentSchool?: string
  studentGrade?: string
  studentClass?: string
  studentDormitoryStatus?: number
  way?: string
  beginTime?: string
  endTime?: string
  passTime?: string
  isLeave?: number
  dateLimit?: string[] | string
  status?: number
  memo?: string
  createdAt?: string
  createdBy?: string
  [key: string]: unknown
}

/** 流程定义分页（旧 `flow/flwdemodel/list`，`page`/`limit`/`key`）。 */
export interface AttendanceFlowDefListParams extends PageQuery {
  key?: string
}

export interface AttendanceFlowDefRecord {
  id?: string | number
  name?: string
  modelKey?: string
  leaveType?: string
  school?: string
  needApproval?: string
  createdBy?: string
  created?: string
  [key: string]: unknown
}

/** 流程部署列表（旧 `flow/deploy/listProcDef`，`page`/`limit`）。 */
export interface AttendanceProcDefListParams extends PageQuery {
  page?: number
  limit?: number
}
