export interface UniApiEnvelope<T = unknown> {
  code: number
  message?: string
  /** 部分后端用 <code>msg</code> 表示提示文案 */
  msg?: string
  data: T
}

/** 与 {@link request} 分页请求参数常见字段对齐（宿主可按后端字段扩展）。 */
export interface UniPageQuery {
  current: number
  size: number
}

/** 分页列表接口返回体中 <code>data</code> 的常见形状（解包 envelope 之后）。 */
export interface UniPageResult<T> {
  data: T[]
  total: number
}
