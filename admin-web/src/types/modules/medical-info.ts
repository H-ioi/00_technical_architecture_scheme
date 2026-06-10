export interface MedicalInfoPageParams {
  current?: number
  size?: number
  schoolIds?: Array<string | number>
  keyword?: string
  hasAllergen?: number
  regularMedication?: number
  hasDisease?: number
}

export interface MedicalInfoListRow {
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
  operator?: string
  creator?: string
  source?: string | number
  sourceType?: string | number
  applicantType?: string | number
  createTime?: string
  updateTime?: string
}

export interface MedicalInfoDiseaseItem {
  diseaseId?: string | number
  diseaseNameOther?: string
  conditionStatus?: number
  needRegularMedicationSchool?: number
  medicationUsage?: string
  attackTimeDetail?: string
  measures?: string
  diagnosisAndTreatment?: string
}

export interface MedicalInfoAttachment {
  attachType?: number
  attachUrl?: string
  remark?: string
}

export interface MedicalInfoFormModel {
  id?: string | number
  schoolId?: string | number
  schoolName?: string
  admissionNo?: string
  fullName?: string
  grade?: string
  formCode?: string
  dormitoryStatus?: number
  height?: string
  weight?: string
  leftVision?: string
  rightVision?: string
  leftEar?: string
  rightEar?: string
  foodAllergy?: string
  drugAllergy?: string
  contactAllergy?: string
  otherAllergy?: string
  hasAllergen?: number
  hasDisease?: number
  regularMedication?: number
  diseaseList: MedicalInfoDiseaseItem[]
  attachmentList: MedicalInfoAttachment[]
}
