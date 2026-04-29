import type { ColProps, FormItemRule, FormProps, RowProps } from "element-plus";

export type Recordable = Record<string, unknown>;
export type MaybePromise<T> = T | Promise<T>;
export type OptionValue = string | number | boolean;

export interface UniOption {
  label: string;
  value: OptionValue;
  type?: string;
  color?: string;
  disabled?: boolean;
  children?: UniOption[];
}

export interface UniPaginationConfig {
  enabled?: boolean;
  pageNo?: number;
  pageSize?: number;
  total?: number;
  pageSizes?: number[];
  layout?: string;
  background?: boolean;
  hideOnSinglePage?: boolean;
  position?: "left" | "center" | "right";
}

export interface UniTableToolbarConfig {
  enabled?: boolean;
  refresh?: boolean;
  density?: boolean;
  columnSetting?: boolean;
  fullscreen?: boolean;
  export?: boolean;
  print?: boolean;
  exportFileName?: string;
}

export type UniTableColumnType =
  | "text"
  | "number"
  | "date"
  | "datetime"
  | "time"
  | "relativeTime"
  | "money"
  | "percent"
  | "boolean"
  | "switch"
  | "image"
  | "images"
  | "video"
  | "videos"
  | "enum"
  | "tag"
  | "tags"
  | "array"
  | "json"
  | "copy"
  | "link"
  | "links"
  | "slot";

export interface UniTableColumn {
  prop: string;
  label: string;
  type?: UniTableColumnType;
  width?: string | number;
  minWidth?: string | number;
  fixed?: true | "left" | "right";
  align?: "left" | "center" | "right";
  showOverflowTooltip?: boolean;
  sortable?: boolean | "custom";
  formatter?: (
    row: Recordable,
    column: UniTableColumn,
    value: unknown,
    index: number,
  ) => string;
  options?: UniOption[];
  valueEnum?: Record<string, string | UniOption>;
  image?: {
    width?: number;
    height?: number;
    preview?: boolean;
    fallback?: string;
  };
  video?: {
    width?: number;
    height?: number;
    poster?: string | ((row: Recordable) => string);
    preview?: boolean;
  };
  date?: {
    inputFormat?: "timestamp" | "iso" | "string";
    format?: string;
    timezone?: string;
    placeholder?: string;
  };
  array?: {
    itemLabel?: string;
    separator?: string;
    max?: number;
    collapseText?: string;
    renderMode?: "text" | "tag";
  };
  link?: {
    href?: string | ((row: Recordable, value: unknown) => string);
    target?: "_blank" | "_self";
    onClick?: (row: Recordable, value: unknown) => void;
    copyable?: boolean;
  };
  switch?: {
    activeValue?: OptionValue;
    inactiveValue?: OptionValue;
    disabled?: boolean | ((row: Recordable) => boolean);
    beforeChange?: (
      row: Recordable,
      nextValue: unknown,
    ) => MaybePromise<boolean>;
  };
  copyable?: boolean;
  slot?: string;
}

export interface UniTableRequestParams {
  pageNo: number;
  pageSize: number;
  sort?: unknown;
  filters?: Recordable;
}

export interface UniTableRequestResult<T = Recordable> {
  records: T[];
  total: number;
}

export type UniTableRequest<T = Recordable> = (
  params: UniTableRequestParams,
) => MaybePromise<UniTableRequestResult<T>>;

export interface UniTableAction<T = Recordable> {
  label: string;
  code?: string | string[];
  type?: "primary" | "success" | "warning" | "danger" | "info";
  disabled?: boolean | ((row: T) => boolean);
  visible?: boolean | ((row: T) => boolean);
  onClick: (row: T, index: number) => void;
}

export type UniFormMode = "view" | "edit";

export interface UniFormActions {
  setValue: (field: string, value: unknown) => void;
  clearValue: (field: string) => void;
  resetField: (field: string) => void;
  setVisible: (field: string, visible: boolean) => void;
  setDisabled: (field: string, disabled: boolean) => void;
  setOptions: (field: string, options: UniOption[]) => void;
  validateField: (field: string) => void;
}

export interface UniFormContext {
  model: Recordable;
  field: UniFormField;
  value: unknown;
  actions: UniFormActions;
}

export interface UniFormField {
  field: string;
  label: string;
  component: string;
  defaultValue?: unknown;
  options?: UniOption[];
  loadOptions?: (model: Recordable) => MaybePromise<UniOption[]>;
  dependencies?: string[];
  visible?: boolean | ((context: UniFormContext) => boolean);
  hidden?: boolean | ((context: UniFormContext) => boolean);
  disabled?: boolean | ((context: UniFormContext) => boolean);
  readonly?: boolean | ((context: UniFormContext) => boolean);
  required?: boolean | ((context: UniFormContext) => boolean);
  onChange?: (context: UniFormContext) => void | Promise<void>;
  onHidden?: (context: UniFormContext) => void;
  viewRender?: (context: UniFormContext) => unknown;
  viewType?: UniTableColumnType;
  emptyText?: string;
  formItemProps?: Recordable & { rules?: FormItemRule | FormItemRule[] };
  componentProps?: Recordable;
  colProps?: Partial<ColProps>;
  slot?: string;
}

export interface UniFormSection {
  title: string;
  description?: string;
  fields: string[];
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  colProps?: Partial<ColProps>;
}

export interface UniFormConfig {
  mode?: UniFormMode;
  schema: UniFormField[];
  sections?: UniFormSection[];
  formProps?: Partial<FormProps>;
  rowProps?: Partial<RowProps>;
  colProps?: Partial<ColProps>;
  rules?: Record<string, FormItemRule | FormItemRule[]>;
  disabled?: boolean;
  readonly?: boolean;
  view?: {
    labelSuffix?: string;
    emptyText?: string;
    showColon?: boolean;
  };
  linkage?: Recordable;
}
