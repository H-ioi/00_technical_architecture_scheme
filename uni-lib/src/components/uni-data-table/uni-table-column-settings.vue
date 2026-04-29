<script setup lang="ts">
import { Rank } from "@element-plus/icons-vue";

import type { UniTableColumnState } from "@/types/uni-data-table";

defineProps<{
  columns: UniTableColumnState[];
}>();

const emit = defineEmits<{
  "drag-start": [prop: string];
  drop: [prop: string];
}>();
</script>

<template>
  <div class="uni-table-column-settings">
    <div class="uni-table-column-settings__title">列设置</div>
    <div
      v-for="column in columns"
      :key="column.prop"
      class="uni-table-column-settings__item"
      draggable="true"
      @dragstart="emit('drag-start', column.prop)"
      @dragover.prevent
      @drop="emit('drop', column.prop)"
    >
      <el-icon class="uni-table-column-settings__drag">
        <Rank />
      </el-icon>
      <el-checkbox v-model="column.visible">
        {{ column.label }}
      </el-checkbox>
      <el-select
        v-model="column.fixed"
        size="small"
        clearable
        placeholder="固定"
        style="width: 82px"
      >
        <el-option label="左" value="left" />
        <el-option label="右" value="right" />
      </el-select>
    </div>
  </div>
</template>

<style scoped lang="scss">
.uni-table-column-settings {
  &__title {
    margin-bottom: 8px;
    font-size: 13px;
    font-weight: 600;
    color: var(--el-text-color-regular);
  }

  &__item {
    display: flex;
    gap: 8px;
    align-items: center;
    padding: 6px 0;
    cursor: move;
  }

  &__item :deep(.el-checkbox) {
    flex: 1;
    min-width: 0;
  }

  &__drag {
    color: var(--el-text-color-secondary);
  }
}
</style>
