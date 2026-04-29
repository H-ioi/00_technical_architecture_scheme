import { computed, ref, watch } from "vue";

import type { UniTableColumn } from "@/types/shared";
import type {
  UniTableColumnState,
  UniTableColumnWithState,
} from "@/types/uni-data-table";

export function useUniTableColumns(getColumns: () => UniTableColumn[]) {
  const columnStates = ref<UniTableColumnState[]>([]);
  const draggingColumnProp = ref("");

  const visibleColumns = computed(
    () =>
      columnStates.value
        .filter((state) => state.visible)
        .map((state) => {
          const column = getColumns().find((item) => item.prop === state.prop);

          return column ? { ...column, fixed: state.fixed } : undefined;
        })
        .filter(Boolean) as UniTableColumnWithState[],
  );

  const syncColumnStates = () => {
    const previousStates = new Map(
      columnStates.value.map((state) => [state.prop, state]),
    );

    columnStates.value = getColumns().map((column) => {
      const previousState = previousStates.get(column.prop);

      return {
        prop: column.prop,
        label: column.label,
        visible: previousState?.visible ?? true,
        fixed:
          previousState?.fixed ??
          (column.fixed === true ? "left" : column.fixed),
      };
    });
  };

  const handleColumnDragStart = (prop: string) => {
    draggingColumnProp.value = prop;
  };

  const handleColumnDrop = (targetProp: string) => {
    const sourceProp = draggingColumnProp.value;

    if (!sourceProp || sourceProp === targetProp) {
      draggingColumnProp.value = "";
      return;
    }

    const nextStates = [...columnStates.value];
    const sourceIndex = nextStates.findIndex(
      (item) => item.prop === sourceProp,
    );
    const targetIndex = nextStates.findIndex(
      (item) => item.prop === targetProp,
    );

    if (sourceIndex >= 0 && targetIndex >= 0) {
      const [source] = nextStates.splice(sourceIndex, 1);
      nextStates.splice(targetIndex, 0, source);
      columnStates.value = nextStates;
    }

    draggingColumnProp.value = "";
  };

  watch(getColumns, syncColumnStates, { immediate: true, deep: true });

  return {
    columnStates,
    visibleColumns,
    handleColumnDragStart,
    handleColumnDrop,
  };
}
