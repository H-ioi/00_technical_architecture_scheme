export interface ContentDiscussionLikeSaveRecord {
  id: string | number
  discussionId?: string | number
  parentId?: string | number
  like?: boolean
  favor?: boolean
  createdAt?: string
  updatedAt?: string
}

export interface ContentDiscussionLikeSaveListParams {
  current?: number
  size?: number
}

export interface ContentDiscussionLikeSaveFormModel {
  id?: string | number
  discussionId?: string | number
  parentId?: number
  like?: boolean
  favor?: boolean
}
