export interface ContentDiscussionCommentRecord {
  id: string | number
  discussionId?: string | number
  parentId?: string | number
  content?: string
  visible?: boolean
  createdAt?: string
}

export interface ContentDiscussionCommentListParams {
  current?: number
  size?: number
}

export interface ContentDiscussionCommentFormModel {
  id?: string | number
  discussionId?: string | number
  parentId?: string | number
  content?: string
  visible?: boolean
}
