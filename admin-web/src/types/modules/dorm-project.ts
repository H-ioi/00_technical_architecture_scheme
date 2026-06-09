import type { DormBuildingSchool } from '@/types/modules/dorm-building'

export interface DormProjectRecord {
  id: string | number
  name?: string
  is_active?: string | number
  creatorName?: string
  school?: DormBuildingSchool
}

export interface DormProjectPageParams {
  current?: number
  size?: number
  schoolId?: string | number
  keyword?: string
}

export interface DormProjectFormModel {
  id?: string | number
  schoolId?: string | number
  name?: string
  isActive?: string
}

export interface DormProjectDetail extends DormProjectRecord {
  school?: DormBuildingSchool
}
