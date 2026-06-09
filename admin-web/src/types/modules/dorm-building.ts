export interface DormBuildingSchool {
  en_name?: string
  cn_name?: string
  extern_id?: string
}

export interface DormBuildingRecord {
  id: string | number
  name?: string
  is_active?: number
  created_at?: string
  updated_at?: string
  floor_count?: number
  total_room_count?: number
  used_room_count?: number
  room_occupancy_ratio?: number
  school?: DormBuildingSchool
}

export interface DormFloorRecord {
  id: string | number
  name?: string
  is_active?: number
  created_at?: string
  updated_at?: string
  total_room_count?: number
  total_bed_count?: number
  used_bed_count?: number
  bed_occupancy_ratio?: number
}

export interface DormFloorBrief {
  id: string | number
  name?: string
}

export interface DormBuildingWithFloors extends DormBuildingRecord {
  floor?: DormFloorRecord[]
  female_student_count?: number
  male_student_count?: number
}

export interface DormBuildingListParams {
  current?: number
  size?: number
  schoolId?: string | number
  buildingId?: string | number
  isActive?: string | number
  includeFloor?: boolean
  floorIsActive?: string | number
}

export interface DormBuildingBrief {
  id: string | number
  name?: string
}

export interface DormBuildingFormModel {
  id?: string | number
  schoolId?: string | number
  name?: string
}
