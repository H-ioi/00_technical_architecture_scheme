import type { DormBuildingRecord, DormBuildingSchool, DormFloorRecord } from '@/types/modules/dorm-building'

export interface DormProjectBrief {
  id: string | number
  name?: string
}

export interface DormRoomRecord {
  id: string | number
  number?: string
  gender?: string | number
  is_active?: number
  occupancy_status?: number
  created_at?: string
  updated_at?: string
  bed_usage_ratio?: string
  student_names?: string
  school_id?: string | number
  project?: DormProjectBrief
}

export interface DormFloorWithRooms extends DormFloorRecord {
  room?: DormRoomRecord[]
  building?: DormBuildingRecord & { school?: DormBuildingSchool }
  female_student_count?: number
  male_student_count?: number
}

export interface DormFloorPageParams {
  current?: number
  size?: number
  schoolId?: string | number
  buildingId?: string | number
  floorId?: string | number
  includeRoom?: boolean
  roomGender?: string | number
  studentNameKeyword?: string
  roomNumberKeyword?: string
}

export interface DormRoomFormModel {
  id?: string | number
  school?: string | number
  gender?: string
  buildingId?: string | number
  floorId?: string | number
  projectId?: string | number
  number?: string
  total_bed_count?: string | number
}

export interface DormRoomDetail extends DormRoomRecord {
  total_bed_count?: string | number
  floor?: {
    id?: string | number
    building?: { id?: string | number }
  }
}
