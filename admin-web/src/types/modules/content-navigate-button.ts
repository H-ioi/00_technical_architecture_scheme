export type ContentNavigateButtonListParams = {
  current?: number
  size?: number
  schoolIds?: string | number
}

export type ContentNavigateButtonRecord = {
  id: string | number
  cnName?: string
  enName?: string
  index?: number
  active?: boolean
  activeLabel?: string
  icon?: string
  chosenArticleId?: string
}

export type ContentNavigateButtonFormModel = {
  id?: string | number
  cnName?: string
  enName?: string
  icon?: string
  index?: number
  active?: boolean | string
  chosenArticleId?: Array<string | number> | string
}

export type ContentArticleVisibleRecord = {
  id: string | number
  cnTitle?: string
  enTitle?: string
}
