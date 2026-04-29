<script setup lang="ts">
/**
 * 数据表格：列定义驱动渲染 + 可选前端分页或 `request` 远程分页/排序。
 * 支持多选、行操作列、`hasUniPermission` 控制的操作按钮显隐及 `@switch-change` 等事件。
 */
import { computed, onMounted, reactive, ref, watch } from "vue";
import type { Sort } from "element-plus";

import { hasUniPermission } from "@/directives/permission";
import type {
  Recordable,
  UniPaginationConfig,
  UniTableAction,
  UniTableColumn,
  UniTableRequest,
} from "@/types/shared";
import UniTableCell from "./uni-table-cell.vue";

const props = withDefaults(
  defineProps<{
    columns: UniTableColumn[];
    data?: Recordable[];
    request?: UniTableRequest;
    loading?: boolean;
    pagination?: UniPaginationConfig | false;
    rowKey?: string;
    selection?: boolean | "multiple" | "single";
    actions?: UniTableAction[];
    emptyText?: string;
    valueEnums?: Record<string, import("@/types/shared").UniOption[]>;
  }>(),
  {
    data: () => [],
    rowKey: "id",
    emptyText: "暂无数据",
  },
);

const emit = defineEmits<{
  "update:pageNo": [value: number];
  "update:pageSize": [value: number];
  "selection-change": [selection: Recordable[]];
  "sort-change": [sort: Sort];
  "row-click": [row: Recordable];
  refresh: [];
  "request-error": [error: unknown];
  "switch-change": [row: Recordable, column: UniTableColumn, value: unknown];
}>();

const innerLoading = ref(false);
const tableData = ref<Recordable[]>([]);
const sortState = ref<Sort>();
const paginationState = reactive({
  pageNo: 1,
  pageSize: 10,
  total: 0,
});

const paginationConfig = computed(() => {
  if (props.pagination === false) {
    return false;
  }

  return {
    enabled: true,
    background: true,
    layout: "total, sizes, prev, pager, next, jumper",
    pageSizes: [10, 20, 50, 100],
    position: "right" as const,
    ...props.pagination,
  };
});

const actualLoading = computed(() => props.loading || innerLoading.value);
const actualData = computed(() =>
  props.request ? tableData.value : props.data,
);

const loadData = async () => {
  if (!props.request) {
    return;
  }

  innerLoading.value = true;

  try {
    const result = await props.request({
      pageNo: paginationState.pageNo,
      pageSize: paginationState.pageSize,
      sort: sortState.value,
    });
    tableData.value = result.records;
    paginationState.total = result.total;
    emit("refresh");
  } catch (error) {
    emit("request-error", error);
  } finally {
    innerLoading.value = false;
  }
};

const handleCurrentChange = (pageNo: number) => {
  paginationState.pageNo = pageNo;
  emit("update:pageNo", pageNo);
  loadData();
};

const handleSizeChange = (pageSize: number) => {
  paginationState.pageSize = pageSize;
  paginationState.pageNo = 1;
  emit("update:pageSize", pageSize);
  loadData();
};

const handleSortChange = (sort: Sort) => {
  sortState.value = sort;
  emit("sort-change", sort);
  loadData();
};

const isActionVisible = (action: UniTableAction, row: Recordable) => {
  const visible =
    typeof action.visible === "function" ? action.visible(row) : action.visible;
  const permitted = action.code ? hasUniPermission(action.code) : true;

  return visible !== false && permitted;
};

const isActionDisabled = (action: UniTableAction, row: Recordable) =>
  typeof action.disabled === "function"
    ? action.disabled(row)
    : Boolean(action.disabled);

watch(
  () => props.pagination,
  (pagination) => {
    if (pagination && typeof pagination === "object") {
      paginationState.pageNo = pagination.pageNo ?? paginationState.pageNo;
      paginationState.pageSize =
        pagination.pageSize ?? paginationState.pageSize;
      paginationState.total = pagination.total ?? paginationState.total;
    }
  },
  { immediate: true, deep: true },
);

onMounted(loadData);

defineExpose({
  refresh: loadData,
});
</script>

<template>
  <div class="uni-data-table">
    <div v-if="$slots.toolbar" class="uni-data-table__toolbar">
      <slot name="toolbar" />
    </div>

    <el-table v-loading="actualLoading" :data="actualData" :row-key="rowKey" :empty-text="emptyText" @selection-change="
      (selection: Recordable[]) => emit('selection-change', selection)
    " @sort-change="handleSortChange" @row-click="(row: Recordable) => emit('row-click', row)">
      <el-table-column v-if="selection === true || selection === 'multiple'" type="selection" width="48" />

      <el-table-column v-for="column in columns" :key="column.prop" :prop="column.prop" :label="column.label"
        :width="column.width" :min-width="column.minWidth" :fixed="column.fixed" :align="column.align"
        :sortable="column.sortable" :show-overflow-tooltip="column.showOverflowTooltip">
        <template #header>
          <slot :name="`header-${column.prop}`" :column="column">{{
            column.label
            }}</slot>
        </template>
        <template #default="{ row, $index }">
          <slot v-if="$slots[`column-${column.prop}`]" :name="`column-${column.prop}`" :row="row"
            :value="row[column.prop]" :index="$index" />
          <UniTableCell v-else :row="row" :column="column" :value="row[column.prop]" :row-index="$index"
            :value-enums="valueEnums" @switch-change="
              (nextRow, nextColumn, value) =>
                emit('switch-change', nextRow, nextColumn, value)
            " />
        </template>
      </el-table-column>

      <el-table-column v-if="actions?.length || $slots.actions" label="操作" fixed="right" width="180">
        <template #default="{ row, $index }">
          <slot name="actions" :row="row" :index="$index">
            <template v-for="action in actions" :key="action.label">
              <el-button v-if="isActionVisible(action, row)" link :type="action.type ?? 'primary'"
                :disabled="isActionDisabled(action, row)" @click="action.onClick(row, $index)">
                {{ action.label }}
              </el-button>
            </template>
          </slot>
        </template>
      </el-table-column>

      <template #empty>
        <slot name="empty">{{ emptyText }}</slot>
      </template>
    </el-table>

    <div v-if="paginationConfig && paginationConfig.enabled !== false" class="uni-data-table__pagination"
      :class="`is-${paginationConfig.position}`">
      <el-pagination :background="paginationConfig.background" :layout="paginationConfig.layout"
        :page-sizes="paginationConfig.pageSizes" :hide-on-single-page="paginationConfig.hideOnSinglePage"
        :current-page="paginationState.pageNo" :page-size="paginationState.pageSize"
        :total="paginationConfig.total ?? paginationState.total" @current-change="handleCurrentChange"
        @size-change="handleSizeChange" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.uni-data-table {
  width: 100%;

  :deep(.el-table) {
    width: 100%;
  }

  &__toolbar {
    margin-bottom: 12px;
  }

  &__pagination {
    display: flex;
    margin-top: 16px;

    &.is-left {
      justify-content: flex-start;
    }

    &.is-center {
      justify-content: center;
    }

    &.is-right {
      justify-content: flex-end;
    }
  }
}
</style>
