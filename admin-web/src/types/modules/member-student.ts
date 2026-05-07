import type { PageQuery } from '@/types/api'

export interface StudentListParams extends PageQuery {
  current?: number
  size?: number
  keywordssearch?: string
  schoolIds?: string | number
  yearGroupName?: string[]
  form?: string[]
  dormitoryStatus?: string
  busStatus?: string
  studentStatus?: string
}

export interface StudentRecord {
  id: string | number
  schoolName?: string
  admissonNo?: string
  cnFullName?: string
  fullName?: string
  grade?: string
  formCode?: string
  busStatus?: string
  dormitoryStatus?: string
  studentStatus?: string
  [key: string]: unknown
}

export type StudentDetail = StudentRecord
