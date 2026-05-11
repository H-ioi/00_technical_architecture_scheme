import type { Recordable } from "./shared";
import type { UniTableColumn } from "./uni-table";

export type UniTableSize = "large" | "default" | "small";

/** 对齐 Element Plus `el-table` 的 `tree-props`：`children`、`hasChildren` 字段名。 */
export interface UniDataTableTreeFieldProps {
  children?: string;
  hasChildren?: string;
}

/**
 * `tree.lazy === true` 时按需加载子节点；`load` 签名与 EP `ElTable` 一致。
 *
 * @see https://element-plus.org/zh-CN/component/table.html
 */
export type UniDataTableTreeLoad = (
  row: Recordable,
  treeNode: unknown,
  resolve: (data: Recordable[]) => void,
) => void;

export interface UniDataTableTreeConfig {
  props?: UniDataTableTreeFieldProps;
  /** 是否默认展开所有行，对应 EP `default-expand-all`。 */
  defaultExpandAll?: boolean;
  lazy?: boolean;
  load?: UniDataTableTreeLoad;
}

/** `true` 启用树表并使用默认 `{ children: 'children', hasChildren: 'hasChildren' }`。 */
export type UniDataTableTree = boolean | UniDataTableTreeConfig;
export type UniTableColumnFixed = "left" | "right" | undefined;

export interface UniTableColumnState {
  prop: string;
  label: string;
  visible: boolean;
  fixed?: UniTableColumnFixed;
}

export type UniTableColumnWithState = UniTableColumn & {
  fixed?: UniTableColumnFixed;
};
