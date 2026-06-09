export interface DormFloorFormModel {
  id?: string | number
  /** 后端字段名为 school（externId），非 schoolId */
  school?: string | number
  buildingId?: string | number
  name?: string
}
