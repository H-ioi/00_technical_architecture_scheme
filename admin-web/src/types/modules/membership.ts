export interface SchoolOptionRecord {
  id: string | number
  name?: string
  cnName?: string
  enName?: string
  /** 外部系统编码（若司机接口将来改用 externId，可把 `toUniOptions` 的 valueKey 指向此字段） */
  externId?: string
}
