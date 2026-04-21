/** 示例文章（与 Nitro mock 数据一致，供前端类型与接口契约） */
export interface ExamplePost {
  id: number
  title: string
  excerpt: string
  body: string
}

export type ExamplePostSummary = Pick<ExamplePost, 'id' | 'title' | 'excerpt'>

export interface ExamplePostsListPayload {
  items: ExamplePostSummary[]
  total: number
}
