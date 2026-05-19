import type { PageQuery } from '@/types/api'

/** 活动项目分页参数（与旧 `getActivityProgramPage` 一致）。 */
export interface ActivityProgramListParams extends PageQuery {
  schoolIds?: string | number
  activityId?: string | number
  activityKeyword?: string
  programKeyword?: string
  programStatus?: string | number
  programType?: string | number
}
