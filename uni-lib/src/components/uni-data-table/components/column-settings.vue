<template>
  <div class="uni-table-column-settings__title">
    {{ $t('dataTable.columnSetting') }}
  </div>
  <div class="uni-table-column-settings">
    <div
      v-for="column in columns"
      :key="column.prop"
      class="uni-table-column-settings__item"
      draggable="true"
      @dragstart="emit('drag-start', column.prop)"
      @dragover.prevent
      @drop="emit('drop', column.prop)">
      <el-icon class="uni-table-column-settings__drag">
        <Rank />
      </el-icon>
      <el-checkbox v-model="column.visible">
        {{ column.label }}
      </el-checkbox>
      <el-select v-model="column.fixed" size="small" clearable :placeholder="$t('dataTable.fixed')" style="width: 72px">
        <el-option :label="$t('dataTable.fixedLeft')" value="left" />
        <el-option :label="$t('dataTable.fixedRight')" value="right" />
      </el-select>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Rank } from '@element-plus/icons-vue'

import type { UniTableColumnState } from '@/types/uni-data-table'

defineProps<{
  columns: UniTableColumnState[]
}>()

const emit = defineEmits<{
  'drag-start': [prop: string]
  drop: [prop: string]
}>()
</script>

<style scoped lang="scss">
.uni-table-column-settings {
  max-height: 280px;
  overflow-y: auto;

  &__title {
    position: sticky;
    top: 0;
    z-index: 1;
    padding-bottom: 4px;
    margin-bottom: 4px;
    font-size: 12px;
    font-weight: 600;
    color: var(--el-text-color-regular);
    background: var(--el-popover-bg-color);
  }

  &__item {
    display: flex;
    gap: 6px;
    align-items: center;
    min-height: 28px;
    padding: 2px 0;
    cursor: move;
  }

  &__item :deep(.el-checkbox) {
    flex: 1;
    min-width: 0;
    height: 24px;
  }

  &__item :deep(.el-checkbox__label) {
    overflow: hidden;
    font-size: 12px;
    line-height: 24px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__item :deep(.el-select__wrapper) {
    min-height: 24px;
    padding: 0 6px;
  }

  &__drag {
    font-size: 13px;
    color: var(--el-text-color-secondary);
  }
}
</style>
