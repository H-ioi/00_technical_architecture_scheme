/** 公共字典项（旧系统 `/publik/dict/item/*`，校区 `order_school`、年级 `isacommunity_enroll_level`） */

/** 旧 `views/isacommunity/base/school/index.vue` 中 `contentType` */
export const BASE_DICT_TYPE_SCHOOL = 'order_school'

/** 旧 `views/isacommunity/base/grade/index.vue` 中 `contentType` */
export const BASE_DICT_TYPE_GRADE = 'isacommunity_enroll_level'

export interface BaseDictItemRecord {
  id: string | number
  label: string
  sort?: string | number | null
  status?: boolean
  archived?: boolean
  pid?: string | number | null
  type?: string
}

export interface BaseDictFieldRecord {
  dictItemLabel: string
  dictItemType: string
  dictItemValue: string
  isedit?: boolean
}

export interface BaseDictItemAddPayload {
  label: string
  sort: string | number | ''
  type: string
}

export interface BaseDictItemEditPayload {
  id: string | number
  label: string
  sort: string | number | ''
}

export interface BaseDictFieldSavePayload {
  dictItemId: string | number
  type: string
  value: string
}
