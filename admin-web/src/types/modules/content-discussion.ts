export interface DiscussionTagBrief {
  id: string | number
  cnName?: string
  enName?: string
}

export interface DiscussionPdfItem {
  name?: string
  url?: string
  pdf?: string
}

export interface ContentDiscussionRecord {
  id: string | number
  schoolId?: string | number
  schoolNames?: string
  schoolEnNames?: string
  tagId?: string | number
  tagList?: DiscussionTagBrief[]
  cnContent?: string
  enContent?: string
  scope?: number
  active?: boolean
  recommended?: boolean
  top?: boolean
  mainImg?: string
  secondImg?: string
  thirdImg?: string
  fourthImage?: string
  fifthImage?: string
  sixthImage?: string
  seventhImage?: string
  eighthImage?: string
  ninthImage?: string
  pdfList?: DiscussionPdfItem[]
  createdAt?: string
  updatedAt?: string
  tagName?: string
  scopeLabel?: string
}

export interface ContentDiscussionListParams {
  current?: number
  size?: number
  keyword?: string
  schoolId?: string | number
  tagId?: string | number
  active?: boolean
  top?: boolean
  recommended?: boolean
}

export interface ContentDiscussionFormModel {
  id?: string | number
  schoolId?: string | number
  tagId?: string | number
  scope?: number
  active?: boolean
  recommended?: boolean
  top?: boolean
  cnContent?: string
  enContent?: string
  mainImg?: string
  secondImg?: string
  thirdImg?: string
  fourthImage?: string
  fifthImage?: string
  sixthImage?: string
  seventhImage?: string
  eighthImage?: string
  ninthImage?: string
  pdfList?: DiscussionPdfItem[]
}
