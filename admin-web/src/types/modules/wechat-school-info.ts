import type { PageQuery } from '@/types/api'

/** 微信配置分页参数（旧 `getWechatInfoPage`）。 */
export interface WechatSchoolInfoListParams extends PageQuery {
  schoolId?: string | number
  keyword?: string
}

export interface WechatSchoolInfoFormModel {
  id?: string | number
  schoolId?: string | number
  wechatAppid: string
  wechatSecret: string
  msgTemplateId: string
  verifyToken: string
  active: string
}

export type WechatSchoolInfoRow = Record<string, unknown>
