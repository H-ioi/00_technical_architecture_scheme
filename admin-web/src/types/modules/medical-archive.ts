export interface MedicalArchivePageParams {
  current?: number
  size?: number
  schoolId?: string | number
  keyword?: string
  hasAllergen?: number
  regularMedication?: number
  hasDisease?: number
  status?: number
}

export interface MedicalArchiveListRow {
  id?: string | number
  schoolName?: string
  admissionNo?: string
  fullName?: string
  grade?: string
  formCode?: string
  dormitoryStatus?: number
  hasAllergen?: number
  regularMedication?: number
  hasDisease?: number
  status?: number
  statusName?: string
  creator?: string
  createTime?: string
  updateTime?: string
}

export interface MedicalArchiveParentInfo {
  relationships?: string
  mobilePhoneNumber?: string
  emailAddress?: string
}

export interface MedicalArchiveStudentInfo {
  schoolName?: string
  admissionNo?: string
  fullName?: string
  grade?: string
  formCode?: string
  dormitoryStatus?: number
  roomNum?: string
  busInfo?: string
  parents?: MedicalArchiveParentInfo[]
}

export interface MedicalArchiveDiseaseItem {
  diseaseId?: string | number
  diseaseName?: string
  diseaseNameOther?: string
  conditionStatus?: number
  medicationUsage?: string
  attackTimeDetail?: string
  measures?: string
  diagnosisAndTreatment?: string
}

export interface MedicalArchiveHealthHistory {
  id?: string | number
  height?: string | number
  weight?: string | number
  leftVision?: string | number
  rightVision?: string | number
  leftEar?: string | number
  rightEar?: string | number
  nurseRemark?: string
  foodAllergy?: string
  drugAllergy?: string
  contactAllergy?: string
  otherAllergy?: string
  diseaseList?: MedicalArchiveDiseaseItem[]
}

export interface MedicalArchiveVaccineExam {
  latestVaccine?: { attachUrl?: string }
  latestHealthExam?: { attachUrl?: string }
}

export interface MedicalArchiveVisitRecord {
  id?: string | number
  visitTime?: string
  chiefComplaint?: string
  remark?: string
  physicalExam?: string
  diagnosisAdvice?: string
  leaveDestination?: number
  contactParent?: number
  creator?: string
  createTime?: string
}

export interface MedicalArchiveDetail {
  student?: MedicalArchiveStudentInfo
  creator?: string
  createTime?: string
  updateTime?: string
  status?: number
  healthHistory?: MedicalArchiveHealthHistory
  vaccineAndExam?: MedicalArchiveVaccineExam
  visitRecords?: MedicalArchiveVisitRecord[]
}

export interface MedicalArchiveHealthEditModel {
  id?: string | number
  height?: number
  weight?: number
  leftVision?: number
  rightVision?: number
  leftEar?: number
  rightEar?: number
  nurseRemark?: string
}
