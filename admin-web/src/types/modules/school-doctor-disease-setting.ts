export interface SchoolDoctorDiseaseOption {
  id?: string | number
  cnName?: string
  enName?: string
  name?: string
  type?: number
  status?: number
}

export interface SchoolDoctorDiseaseSettingPageParams {
  current?: number
  size?: number
  type?: number
  status?: number
  keyword?: string
}

export interface SchoolDoctorDiseaseSettingListRow {
  id?: string | number
  cnName?: string
  enName?: string
  name?: string
  type?: number
  status?: number
  creator?: string
  createTime?: string
  updateTime?: string
}

export interface SchoolDoctorDiseaseSettingFormModel {
  id?: string | number
  cnName?: string
  enName?: string
  type?: number
  status?: number
  remark?: string
}
