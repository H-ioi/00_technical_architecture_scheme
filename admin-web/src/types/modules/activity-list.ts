import type { PageQuery } from '@/types/api'

/** 活动分页查询参数（字段名与旧 `getActivityPage` 一致）。 */
export interface ActivityListParams extends PageQuery {
  activityCnName?: string
  activityEnName?: string
  schoolIds?: string | number
  activityStatus?: string | number
  isBanner?: string | number
  recommended?: string | number
  activityStartTime?: string
  activityEndTime?: string
}
