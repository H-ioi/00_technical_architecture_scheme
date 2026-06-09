export interface DormBedStudent {
  gender?: number
  en_name?: string
  admission_no?: string
  grade_code?: string
  form_code?: string
}

export interface DormBedRecord {
  id: string | number
  label?: string
  schoolName?: string
  admissionNo?: string
  student?: DormBedStudent | null
}

export interface DormRoomWithBeds {
  id?: string | number
  number?: string
  beds?: DormBedRecord[]
}

export interface DormBedBrief {
  id?: string | number
  label?: string
}

export interface DormBedCreateModel {
  roomId: string | number
  label: string
  is_active: number
}

export interface DormBedAssignModel {
  room_id: string | number
  label?: string
  admission_no: string
}

export interface DormBedCheckoutModel {
  bed_id: number
  admission_no: string
}

export interface DormBedMoveModel {
  admission_no: string
  to_room_id: string | number
  to_label: string
}
