import type { ColProps, FormItemRule, FormProps, RowProps } from 'element-plus'

import type { MaybePromise, Recordable, UniOption } from './shared'
import type { UniTableColumnType } from './uni-table'

export type UniFormMode = 'view' | 'edit'

/** 查看态纯文本展示：默认单行省略，悬停可看全文；`wrap` 自动换行；`none` 不截断 */
export type UniFormViewOverflow = 'ellipsis' | 'wrap' | 'none'

export interface UniFormActions {
  setValue: (field: string, value: unknown) => void
  clearValue: (field: string) => void
  resetField: (field: string) => void
  setVisible: (field: string, visible: boolean) => void
  setDisabled: (field: string, disabled: boolean) => void
  setOptions: (field: string, options: UniOption[]) => void
  validateField: (field: string) => void
}

export interface UniFormContext {
  model: Recordable
  field: UniFormField
  value: unknown
  actions: UniFormActions
}

export interface UniFormField {
  field: string
  label: string
  component: string
  defaultValue?: unknown
  options?: UniOption[]
  loadOptions?: (model: Recordable) => MaybePromise<UniOption[]>
  dependencies?: string[]
  visible?: boolean | ((context: UniFormContext) => boolean)
  hidden?: boolean | ((context: UniFormContext) => boolean)
  disabled?: boolean | ((context: UniFormContext) => boolean)
  readonly?: boolean | ((context: UniFormContext) => boolean)
  required?: boolean | ((context: UniFormContext) => boolean)
  onChange?: (context: UniFormContext) => void | Promise<void>
  onHidden?: (context: UniFormContext) => void
  viewRender?: (context: UniFormContext) => unknown
  viewType?: UniTableColumnType
  /** 查看态文本排版；未设时使用 `config.view.viewOverflow`，默认 `ellipsis` */
  viewOverflow?: UniFormViewOverflow
  emptyText?: string
  formItemProps?: Recordable & { rules?: FormItemRule | FormItemRule[] }
  /**
   * 传给 Element Plus 控件的属性；`ElInputNumber` 时 UniForm 会先合并默认 `controlsPosition: 'right'`，
   * 再与本对象合并（同名字段以本对象为准）。
   */
  componentProps?: Recordable
  colProps?: Partial<ColProps>
  slot?: string
}

export interface UniFormSection {
  title: string
  description?: string
  fields: string[]
  collapsible?: boolean
  defaultCollapsed?: boolean
  colProps?: Partial<ColProps>
}

export interface UniFormConfig {
  mode?: UniFormMode
  schema: UniFormField[]
  sections?: UniFormSection[]
  formProps?: Partial<FormProps>
  rowProps?: Partial<RowProps>
  colProps?: Partial<ColProps>
  rules?: Record<string, FormItemRule | FormItemRule[]>
  disabled?: boolean
  readonly?: boolean
  view?: {
    labelSuffix?: string
    emptyText?: string
    showColon?: boolean
    /** 查看态默认文本排版；字段级 `viewOverflow` 可覆盖 */
    viewOverflow?: UniFormViewOverflow
  }
  linkage?: Recordable
}
