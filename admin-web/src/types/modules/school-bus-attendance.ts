export type BusAttendanceListParams = {
  current?: number
  size?: number
  schoolIds?: Array<string | number>
  keyword?: string
  formCode?: string
  lineId?: string | number
  stationId?: string | number
  attendanceStatus?: number
  attendanceDateStart?: string
  attendanceDateEnd?: string
}

export type BusAttendanceRecord = {
  id: string | number
  schoolId?: string | number
  schoolName?: string
  admissionNo?: string
  studentName?: string
  grade?: string
  studentGrade?: string
  formCode?: string
  attendanceDate?: string
  lineId?: string | number
  lineName?: string
  buslineCnName?: string
  buslineEnName?: string
  stationId?: string | number
  stationName?: string
  busStationCnName?: string
  busStationEnName?: string
  rideType?: number
  attendanceStatus?: number
  operator?: string
  createBy?: string
  creator?: string
  createTime?: string
  remark?: string
}

export type BusAttendanceFormModel = {
  id?: string | number
  schoolId?: string | number
  admissionNo?: string
  studentName?: string
  studentGrade?: string
  grade?: string
  formCode?: string
  attendanceDate?: string
  lineId?: string | number
  stationId?: string | number
  rideType?: number
  attendanceStatus?: number
  remark?: string
}
