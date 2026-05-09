import type { Recordable } from "./shared";

export interface UniListTableExpose {
  refresh: () => void;
}

export interface UniListStateOptions {
  initialFilters: Recordable;
}
