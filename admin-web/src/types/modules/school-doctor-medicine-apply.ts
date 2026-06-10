export interface MedicineApplyContentItem {
  id?: string | number
  medicineName?: string
  bringQuantity?: string
  dosage?: string
  startDate?: string
  endDate?: string
  administrationTimeType?: number
  frequencyType?: number
  frequencyOther?: string
  routeType?: number
  routeOther?: string
  mealTiming?: number
  sideEffects?: string
  leftoverDisposal?: number
}

export interface MedicineApplyDiagnosisImage {
  id?: string | number
  imagePath?: string
  name?: string
}

export interface MedicineApplyPageParams {
  current?: number
  size?: number
  schoolId?: string | number
  schoolIds?: Array<string | number>
  keyword?: string
  applyMedication?: number
  status?: number
}

export interface MedicineApplyListRow {
  id?: string | number
  schoolName?: string
  admissionNo?: string
  fullName?: string
  grade?: string
  formCode?: string
  applyMedication?: number
  status?: number
  nurseApproval?: number
  applicant?: string
  operator?: string
  creator?: string
  source?: number | string
  sourceType?: number | string
  applicantType?: number | string
  createTime?: string
  updateTime?: string
}

export interface MedicineApplyFormModel {
  id?: string | number
  admissionNo?: string
  fullName?: string
  schoolId?: string | number
  grade?: string
  formCode?: string
  applyMedication?: number
  physicalCondition?: string
  diseaseId?: string | number
  symptomDetails?: string
  informedConsent?: number
  contentList?: MedicineApplyContentItem[]
  diagnosisImageList?: MedicineApplyDiagnosisImage[]
  parentName?: string
  parentContact?: string
  parentSignaturePath?: string
  leftoverDisposal?: number
  remark?: string
  nurseApproval?: number
  nurseOperator?: string
  status?: number
}

export interface MedicineApplyVisitDetailRow {
  rawRecord?: Record<string, unknown>
  pendingId?: string | number
  visitDate?: string
  visitTime?: string
  operateStatusText?: string
  specificSituation?: string
  operatorName?: string
  leaveTime?: string
  leaveDestinationText?: string
}
