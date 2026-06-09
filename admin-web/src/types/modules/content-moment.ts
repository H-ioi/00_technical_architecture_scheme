export type MomentTypeRecord = {
  type: string | number
  name?: string
  enName?: string
}

export type ContentMomentListParams = {
  current?: number
  size?: number
  title?: string
  schoolId?: string | number
  type?: string | number
  visible?: boolean
}

export type MomentAttachment = {
  image?: string
  pdf?: string
  url?: string
}

export type ContentMomentRecord = {
  id: string | number
  schoolId?: string | number
  schoolNames?: string
  schoolEnNames?: string
  title?: string
  content?: string
  type?: string | number
  typeName?: string
  publisherUsername?: string
  visible?: boolean | string
  push?: boolean
  sendSms?: boolean
  pushed?: boolean
  images?: MomentAttachment[]
  pdfs?: MomentAttachment[]
  createdAt?: string
  updatedAt?: string
}

export type ContentMomentFormModel = {
  id?: string | number
  schoolId?: string | number
  type?: string | number
  title?: string
  content?: string
  visible?: boolean | string
  push?: boolean
  sendSms?: boolean
  images?: MomentAttachment[]
  pdfs?: MomentAttachment[]
}
