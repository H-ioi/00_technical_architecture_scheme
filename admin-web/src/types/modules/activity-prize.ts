import type { PageQuery } from '@/types/api'

/** 奖品分页参数（与旧 `getPrizePage` 保持一致）。 */
export interface ActivityPrizeListParams extends PageQuery {
  keyword?: string
  programId?: string | number
}

export interface ActivityPrizeFormModel {
  id?: string | number
  cnName: string
  enName: string
  amount: number | undefined
  prizeCount: number
  imageUrl: string
  programId?: string | number
}

export type ActivityPrizeRow = Record<string, unknown>

export interface ActivityPrizeUploadResult {
  url?: string
  data?: {
    url?: string
  }
}
