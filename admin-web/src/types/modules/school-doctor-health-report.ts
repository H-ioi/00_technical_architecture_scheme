export interface HealthReportPageParams {
  current?: number
  size?: number
  reportType?: number
  keyword?: string
}

export interface HealthReportListRow {
  id?: string | number
  schoolName?: string
  admissionNo?: string
  admissonNo?: string
  studentName?: string
  fullName?: string
  cnFullName?: string
  gradeName?: string
  grade?: string
  className?: string
  formCode?: string
  reportType?: number
  examYear?: string | number
  examDate?: string
  examOrg?: string
  institution?: string
  createTime?: string
  updateTime?: string
}

export interface HealthReportAttachment {
  id?: string | number
  reportId?: string | number
  attachmentUrl?: string
  name?: string
}

export interface HealthReportFormModel {
  id?: string | number
  admissionNo?: string
  studentName?: string
  schoolId?: string | number
  gradeName?: string
  className?: string
  formCode?: string
  reportType?: number
  examYear?: string
  examDate?: string
  examOrg?: string
  remark?: string
  attachmentList?: HealthReportAttachment[]
}
