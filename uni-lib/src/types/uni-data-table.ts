import type { UniTableColumn } from "./shared";

export type UniTableSize = "large" | "default" | "small";
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
