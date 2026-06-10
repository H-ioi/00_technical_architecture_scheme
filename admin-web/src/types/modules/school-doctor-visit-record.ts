export interface VisitRecordAttachment {
  id?: string | number
  name?: string
  url?: string
  attachmentUrl?: string
}

export interface VisitRecordPageParams {
  current?: number
  size?: number
  schoolId?: string | number
  schoolIds?: Array<string | number>
  keyword?: string
  leaveDestination?: number
  parentAgree?: number
  contactParent?: number
  visitDateStart?: string
  visitDateEnd?: string
}

export interface VisitRecordListRow {
  id?: string | number
  schoolName?: string
  admissionNo?: string
  fullName?: string
  grade?: string
  formCode?: string
  visitTime?: string
  specificSituation?: string
  remark?: string
  chiefComplaint?: string
  leaveDestination?: number
  executeOperation?: number
  contactParent?: number
  parentSignaturePath?: string
  creator?: string
  createTime?: string
  updateTime?: string
}

export interface VisitRecordFormModel {
  id?: string | number
  admissionNo?: string
  fullName?: string
  schoolId?: string | number
  schoolName?: string
  grade?: string
  formCode?: string
  drugAllergy?: string
  visitTime?: string
  leaveTime?: string
  chiefComplaint?: string
  physicalExam?: string
  diagnosisAdvice?: string
  remark?: string
  attachmentList?: VisitRecordAttachment[]
  leaveDestination?: number
  notifyParent?: number
  executeOperation?: number
  operator?: string
  contactParent?: number
  parentAgree?: number
  parentName?: string
  parentContact?: string
  parentSignaturePath?: string
}

export interface PendingMedicationPageParams {
  current?: number
  size?: number
  schoolId?: string | number
  schoolIds?: Array<string | number>
  keyword?: string
  status?: number
  applicationStatus?: number
  medicationApplicationId?: string | number
  applyMedicationDateStart?: string
  applyMedicationDateEnd?: string
}

export interface PendingMedicationListRow {
  id?: string | number
  applicationId?: string | number
  schoolName?: string
  admissionNo?: string
  fullName?: string
  grade?: string
  formCode?: string
  applyMedicationDate?: string
  applyMedicationDateStart?: string
  applyMedicationDateEnd?: string
  medicationTime?: number
  operationTime?: string
  status?: number
  applicationStatus?: number
  createTime?: string
  updateTime?: string
}

export interface PendingOperationAttachment {
  id?: string | number
  operationId?: string | number
  attachmentUrl?: string
  url?: string
  name?: string
}

export interface PendingOperationFormModel {
  operationId?: string | number
  operateTime?: string
  operateStatus?: number
  specificSituation?: string
  operator?: string
  notifyParent?: number
  attachmentList?: PendingOperationAttachment[]
  leaveTime?: string
  leaveDestination?: number
}

export interface PendingMedicationDetail {
  id?: string | number
  status?: number
  applicationId?: string | number
  application?: Record<string, unknown>
  applyInfo?: Record<string, unknown>
  studentMedicalInfo?: Record<string, unknown>
  operationList?: Array<Record<string, unknown>>
  operationRecordList?: Array<Record<string, unknown>>
}
