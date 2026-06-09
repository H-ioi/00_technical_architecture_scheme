export type ContentArticleListParams = {
  current?: number
  size?: number
  title?: string
  schoolId?: string | number
  categoryId?: string | number
  importanceLevel?: number
  visible?: boolean
  isBanner?: boolean
  recommended?: boolean
}

export type ContentArticleRecord = {
  id: string | number
  schoolId?: string | number
  schoolNames?: string
  schoolEnNames?: string
  schoolName?: string
  cnTitle?: string
  enTitle?: string
  categoryId?: string | number
  categoryName?: string
  importanceLevel?: number
  publishStatus?: boolean
  visible?: boolean
  isBanner?: boolean
  recommended?: boolean
  isWechatPushed?: boolean
  wechatUrl?: string
  mainImage?: string
  content?: string
  updatedAt?: string
}

export type ContentArticleFormModel = {
  id?: string | number
  cnTitle?: string
  enTitle?: string
  schoolId?: string | number
  categoryId?: string | number
  mainImage?: string
  importanceLevel?: number
  visible?: boolean
  isBanner?: boolean
  recommended?: boolean
  wechatOption?: number | string
  wechatUrl?: string
  content?: string
  enContent?: string
}
