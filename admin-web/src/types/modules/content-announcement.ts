export type ContentAnnouncementListParams = {
  current?: number
  size?: number
  schoolId?: string | number
}

export type ContentAnnouncementRecord = {
  id: string | number
  schoolId?: string | number
  schoolNames?: string
  schoolEnNames?: string
  schoolName?: string
  cnContent?: string
  enContent?: string
  urgencyLevel?: number
  urgencyLevelLabel?: string
  active?: boolean
  activeLabel?: string
  updatedAt?: string
}

export type ContentAnnouncementFormModel = {
  id?: string | number
  schoolId?: string | number
  cnContent?: string
  enContent?: string
  urgencyLevel?: number
  active?: boolean | string
}
