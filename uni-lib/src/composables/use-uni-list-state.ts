import { nextTick, ref } from "vue";

import type { Recordable } from "@/types/shared";
import type { UniTableRequestResult } from "@/types/uni-table";

export interface UniListTableExpose {
  refresh: () => void;
}

export interface UniListStateOptions {
  initialFilters: Recordable;
}

/**
 * Standard state holder for search + data table pages.
 *
 * It keeps query model, effective filters, table ref and total count together,
 * and provides the common search/reset/refresh flow used by list pages.
 */
export const useUniListState = (options: UniListStateOptions) => {
  const queryModel = ref<Recordable>({ ...options.initialFilters });
  const filters = ref<Recordable>({});
  const tableRef = ref<UniListTableExpose | null>(null);
  const total = ref(0);

  const refreshTable = async () => {
    await nextTick();
    tableRef.value?.refresh();
  };

  const search = async (value: Recordable) => {
    filters.value = { ...value };
    await refreshTable();
  };

  const reset = async (value: Recordable = {}) => {
    filters.value = { ...value };
    await refreshTable();
  };

  const handleLoadSuccess = (result: UniTableRequestResult) => {
    total.value = result.total;
  };

  return {
    filters,
    handleLoadSuccess,
    queryModel,
    refreshTable,
    reset,
    search,
    tableRef,
    total,
  };
};
