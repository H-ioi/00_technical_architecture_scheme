export interface ApiResponse<T = unknown> {
  code: number
  message: string
  data: T
}

export interface PageQuery {
  current: number
  size: number
}

export interface PageResult<T> {
  data: T[]
  total: number
}
