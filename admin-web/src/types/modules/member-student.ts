import type { PageQuery } from '@/types/api'

export interface StudentListParams extends PageQuery {
  name?: string
  grade?: string
  className?: string
  parentName?: string
  phone?: string
  status?: number
  schoolIds?: Array<string | number>
}

export interface StudentRecord {
  id: string | number
  school?: string | number
  name: string
  grade: string
  className: string
  parentName: string
  phone: string
  status: number
  createTime?: string
}

export type StudentDetail = StudentRecord

export interface StudentCreateParams {
  school?: string | number
  name: string
  grade: string
  className: string
  parentName: string
  phone: string
  status: number
}

export interface StudentUpdateParams extends StudentCreateParams {
  id: string | number
}

export interface StudentExportParams {
  name?: string
  grade?: string
  className?: string
  parentName?: string
  phone?: string
  status?: number
  schoolIds?: Array<string | number>
}
