import type { MaybePromise, OptionValue, Recordable, UniOption } from './shared'

export interface UniPaginationConfig {
  enabled?: boolean
  pageNo?: number
  pageSize?: number
  total?: number
  pageSizes?: number[]
  layout?: string
  background?: boolean
  hideOnSinglePage?: boolean
  position?: 'left' | 'center' | 'right'
}

export interface UniTableToolbarConfig {
  enabled?: boolean
  refresh?: boolean
  density?: boolean
  columnSetting?: boolean
  fullscreen?: boolean
  export?: boolean
  print?: boolean
  exportFileName?: string
}

export interface UniTableActionColumnConfig {
  label?: string
  width?: string | number
  minWidth?: string | number
  fixed?: 'left' | 'right' | false
}

export type UniTableColumnType =
  | 'text'
  | 'number'
  | 'date'
  | 'datetime'
  | 'time'
  | 'relativeTime'
  | 'money'
  | 'percent'
  | 'boolean'
  | 'switch'
  | 'image'
  | 'images'
  | 'video'
  | 'videos'
  | 'enum'
  | 'tag'
  | 'tags'
  | 'array'
  | 'json'
  | 'copy'
  | 'link'
  | 'links'
  | 'slot'

export interface UniTableColumn {
  prop: string
  label: string
  type?: UniTableColumnType
  width?: string | number
  minWidth?: string | number
  fixed?: true | 'left' | 'right'
  align?: 'left' | 'center' | 'right'
  showOverflowTooltip?: boolean
  sortable?: boolean | 'custom'
  formatter?: (row: Recordable, column: UniTableColumn, value: unknown, index: number) => string
  options?: UniOption[]
  valueEnum?: Record<string, string | UniOption>
  image?: {
    width?: number
    height?: number
    preview?: boolean
    fallback?: string
  }
  video?: {
    width?: number
    height?: number
    poster?: string | ((row: Recordable) => string)
    preview?: boolean
  }
  date?: {
    inputFormat?: 'timestamp' | 'iso' | 'string'
    format?: string
    timezone?: string
    placeholder?: string
  }
  percent?: {
    /** 数据缩放比例，默认 100。若后端返回 50 表示 50%，可设为 1。 */
    scale?: number
    digits?: number
    suffix?: string
  }
  /**
   * `text` / `number` / `array`：存在列 `options` 或 `valueEnum` 时，
   * 将 id / 数组 id / 逗号串映射为文案；`false` 关闭。
   */
  lookup?:
    | false
    | {
        separator?: string
        splitValues?: boolean | RegExp
      }
  array?: {
    itemLabel?: string
    separator?: string
    max?: number
    collapseText?: string
    renderMode?: 'text' | 'tag'
  }
  link?: {
    href?: string | ((row: Recordable, value: unknown) => string)
    target?: '_blank' | '_self'
    onClick?: (row: Recordable, value: unknown) => void
    copyable?: boolean
  }
  switch?: {
    activeValue?: OptionValue
    inactiveValue?: OptionValue
    disabled?: boolean | ((row: Recordable) => boolean)
    beforeChange?: (row: Recordable, nextValue: unknown) => MaybePromise<boolean>
  }
  copyable?: boolean
  slot?: string
}

export interface UniTableRequestParams {
  pageNo: number
  pageSize: number
  sort?: unknown
  filters?: Recordable
}

export interface UniTableRequestResult<T = Recordable> {
  data?: T[]
  records?: T[]
  total: number
}

export type UniTableRequest<T = Recordable> = (
  params: UniTableRequestParams
) => MaybePromise<UniTableRequestResult<T>>

export interface UniTableAction<T = Recordable> {
  label: string
  code?: string | string[]
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
  disabled?: boolean | ((row: T) => boolean)
  visible?: boolean | ((row: T) => boolean)
  onClick: (row: T, index: number) => void
}
