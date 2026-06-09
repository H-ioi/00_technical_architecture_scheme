export interface ContentDiscussionTagRecord {
  id: string | number
  cnName?: string
  enName?: string
  createdAt?: string
  updatedAt?: string
}

export interface ContentDiscussionTagListParams {
  current?: number
  size?: number
}

export interface ContentDiscussionTagFormModel {
  id?: string | number
  cnName?: string
  enName?: string
}
