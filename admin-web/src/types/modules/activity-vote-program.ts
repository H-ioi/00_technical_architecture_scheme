import type { PageQuery } from '@/types/api'

/** 投票节目分页参数（旧 `getVoteProgramPage`）。 */
export interface ActivityVoteProgramListParams extends PageQuery {
  keyword?: string
}

/** 投票节目表单模型。 */
export interface ActivityVoteProgramFormModel {
  id?: string | number
  cnName: string
  enName: string
  programId?: string | number
  performer: string
}
