export type OptionSource = Record<string, unknown>;

export interface ToUniOptionsConfig<T extends OptionSource> {
  valueKey?: keyof T;
  labelKeys?: Array<keyof T>;
  typeKey?: keyof T;
  colorKey?: keyof T;
}
