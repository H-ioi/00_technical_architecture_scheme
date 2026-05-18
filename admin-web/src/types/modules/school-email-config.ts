import type { PageQuery } from '@/types/api'

/** 邮箱配置分页参数（旧 `getEmailConfigPage`）。 */
export interface SchoolEmailConfigListParams extends PageQuery {
  schoolId?: string | number
  keyword?: string
}

export interface SchoolEmailConfigFormModel {
  id?: string | number
  schoolId?: string | number
  email: string
  appModule: string
}

export type SchoolEmailConfigRow = Record<string, unknown>
