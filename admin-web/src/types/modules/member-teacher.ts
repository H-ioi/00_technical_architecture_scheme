import type { PageQuery } from '@/types/api'

export interface TeacherListParams extends PageQuery {
  current?: number
  size?: number
  keywordssearch?: string
  schoolIds?: string | number
  role?: string
  archived?: string
}

export interface TeacherRecord {
  id: string | number
  schoolName?: string
  isaTeacherCode?: string
  fullName?: string
  gender?: string
  nationalities?: string
  phoneNumber?: string
  email?: string
  role?: string
  archived?: string
  createTime?: string
  teacherIdInt?: string | number
  [key: string]: unknown
}

export interface SchoolOptionRecord {
  id: string | number
  name: string
  enName: string
}
