import type { ColProps, FormItemRule, FormProps, RowProps } from "element-plus";

import type { MaybePromise, Recordable, UniOption } from "./shared";
import type { UniTableColumnType } from "./uni-table";

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
