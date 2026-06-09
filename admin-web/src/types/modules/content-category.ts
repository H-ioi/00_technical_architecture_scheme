export type ContentCategoryListParams = {
  current?: number
  size?: number
}

export type ContentCategoryRecord = {
  id: string | number
  cnName?: string
  enName?: string
  index?: number
  visible?: boolean
  visibleLabel?: string
}

export type ContentCategoryFormModel = {
  id?: string | number
  cnName?: string
  enName?: string
  index?: number
  visible?: boolean | string
}
