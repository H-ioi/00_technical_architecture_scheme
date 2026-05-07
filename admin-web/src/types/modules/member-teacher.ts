import type { PageQuery } from '@/types/api'

export interface TeacherListParams extends PageQuery {
  nickname?: string
  department?: string
  phone?: string
  email?: string
  modules?: number[]
  roles?: number[]
  status?: number
  schoolIds?: Array<string | number>
}

export interface TeacherRecord {
  id: string | number
  school?: string | number
  nickname: string
  department: string
  email: string
  phone: string
  modules: number[]
  roles: number[]
  status: number
  lastLoginTime?: string
  createTime?: string
}

export type TeacherDetail = TeacherRecord

export interface TeacherCreateParams {
  school?: string | number
  nickname: string
  department: string
  email: string
  phone: string
  modules: number[]
  roles: number[]
  password: string
  status: number
}

export interface TeacherUpdateParams extends TeacherCreateParams {
  id: string | number
}

export interface TeacherExportParams {
  nickname?: string
  department?: string
  phone?: string
  email?: string
  modules?: number[]
  roles?: number[]
  status?: number
  schoolIds?: Array<string | number>
}

export interface SchoolOptionRecord {
  id: string | number
  name: string
  enName: string
}
