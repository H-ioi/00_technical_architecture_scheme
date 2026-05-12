export type Recordable = Record<string, unknown>
export type MaybePromise<T> = T | Promise<T>
export type OptionValue = string | number | boolean

export interface UniOption {
  label: string
  value: OptionValue
  type?: string
  color?: string
  disabled?: boolean
  children?: UniOption[]
}
