export interface InfectiousDiseasePageParams {
  current?: number
  size?: number
  status?: number
  keyword?: string
  discoveryDateStart?: string
  discoveryDateEnd?: string
}

export interface InfectiousDiseaseListRow {
  id?: string | number
  schoolName?: string
  admissionNo?: string
  admissonNo?: string
  fullName?: string
  studentName?: string
  cnFullName?: string
  grade?: string
  gradeName?: string
  formCode?: string
  className?: string
  diseaseName?: string
  discoveryDate?: string
  status?: number
  createTime?: string
  updateTime?: string
}

export interface InfectiousDiseaseAttachment {
  id?: string | number
  infectiousDiseaseId?: string | number
  attachmentUrl?: string
  name?: string
}

export interface InfectiousDiseaseFormModel {
  id?: string | number
  admissionNo?: string
  studentName?: string
  schoolId?: string | number
  gradeName?: string
  className?: string
  diseaseName?: string
  discoveryDate?: string
  status?: number
  remark?: string
  attachmentList?: InfectiousDiseaseAttachment[]
}
