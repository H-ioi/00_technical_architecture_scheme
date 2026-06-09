export type FoodWeeklyListParams = {
  current?: number
  size?: number
  schoolId?: string | number
}

export type FoodWeeklyRecord = {
  id: string | number
  schoolNames?: string
  schoolEnNames?: string
  wechatUrl?: string
  status?: string | number
  cnContent?: string
  enContent?: string
  schoolId?: string | number
  createdAt?: string
  updatedAt?: string
}

export type FoodWeeklyFormModel = {
  id?: string | number
  schoolId?: string | number
  wechatUrl?: string
  cnContent?: string
  enContent?: string
}
