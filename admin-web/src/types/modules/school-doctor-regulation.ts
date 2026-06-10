export interface SchoolDoctorRegulationPageParams {
  current?: number
  size?: number
  schoolIds?: Array<string | number>
  type?: number
  status?: number
  keyword?: string
}

export interface SchoolDoctorRegulationListRow {
  id?: string | number
  schoolName?: string
  attachmentName?: string
  cnTitle?: string
  name?: string
  type?: number
  status?: number
  creator?: string
  createTime?: string
  updateTime?: string
}

export interface SchoolDoctorRegulationFormModel {
  id?: string | number
  schoolId?: string | number
  cnTitle?: string
  enTitle?: string
  cnIntro?: string
  enIntro?: string
  type?: number
  status?: number
  remark?: string
  attachmentUrl?: string
  attachmentName?: string
}
