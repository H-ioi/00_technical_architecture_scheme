export interface ApiResponse<T = unknown> {
  code: number
  message: string
  data: T
}

export interface PageQuery {
  pageNo: number
  pageSize: number
}

export interface PageResult<T> {
  records: T[]
  total: number
}
