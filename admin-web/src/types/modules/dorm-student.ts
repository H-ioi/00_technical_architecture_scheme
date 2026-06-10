import type { PageResult } from '@/types/api'

export interface DormStudentSchool {
  en_name?: string
  cn_name?: string
  extern_id?: string
}

export interface DormStudentListRow {
  id?: string | number
  admission_no?: string
  en_name?: string
  grade_code?: string
  form_code?: string
  nationality?: string
  gender?: string | number
  birthdate?: string
  has_bed?: boolean
  project_name?: string
  floor_name?: string
  room_room?: string
  bed_label?: string
  checkin_date?: string
  planned_checkout_date?: string
  payment_status?: string | number
  school?: DormStudentSchool
}

export interface DormStudentHistoryRow {
  id?: string | number
  admission_no?: string
  checkin_date?: string
  checkout_date?: string
  operator_name?: string
  created_at?: string
  updated_at?: string
  student?: DormStudentListRow & { school?: DormStudentSchool; parent_info?: DormParentInfo[] }
}

export interface DormParentInfo {
  relationship?: string
  phone?: string
  email_address?: string
}

export interface DormStudentPageParams {
  current?: number
  size?: number
  schoolId?: string | number
  keyword?: string
  hasBed?: string | boolean
  buildingId?: string | number
  floorId?: string | number
  roomId?: string | number
  projectId?: string | number
  checkinDateStart?: string
  checkinDateEnd?: string
  plannedCheckoutDateStart?: string
  plannedCheckoutDateEnd?: string
  checkoutDateStart?: string
  checkoutDateEnd?: string
  gender?: string
}

export interface DormStudentInfoLookup {
  school_name?: string
  show_name?: string
  grade_code?: string
  form_code?: string
  gender?: string
  show_nationality?: string
}

export interface DormStudentAddModel {
  schoolId?: string | number
  admissionNo?: string
  type?: string
}

export interface DormStudentEditModel {
  admissionNo?: string
  school?: string | number
  buildingId?: string | number
  floorId?: string | number
  bedId?: string | number
  projectId?: string | number
  checkinDate?: string
  plannedCheckoutDate?: string
  paymentStatus?: number
}

export type DormStudentPageResult = PageResult<DormStudentListRow>
export type DormStudentHistoryPageResult = PageResult<DormStudentHistoryRow>

/** 兼容 checkin 弹窗沿用的简要行类型 */
export interface DormStudentRow {
  admission_no: string
  en_name?: string
  cn_name?: string
}
