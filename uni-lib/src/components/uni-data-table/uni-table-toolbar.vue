<script setup lang="ts">
import {
  Download,
  FullScreen,
  Printer,
  Refresh,
  Setting,
} from "@element-plus/icons-vue";

import type { UniTableToolbarConfig } from "@/types/shared";
import type { UniTableColumnState, UniTableSize } from "@/types/uni-data-table";
import UniTableColumnSettings from "./uni-table-column-settings.vue";

defineProps<{
  columnStates: UniTableColumnState[];
  config: Required<UniTableToolbarConfig>;
  fullscreen: boolean;
  loading: boolean;
  tableSize: UniTableSize;
}>();

const emit = defineEmits<{
  "column-drag-start": [prop: string];
  "column-drop": [prop: string];
  "update:fullscreen": [value: boolean];
  "update:tableSize": [value: UniTableSize];
  export: [];
  print: [];
  refresh: [];
}>();
</script>

<template>
  <el-popover placement="bottom-end" trigger="click" width="320">
    <template #reference>
      <el-button
        link
        class="uni-table-toolbar__trigger"
        :icon="Setting"
        aria-label="表格工具"
        title="表格工具"
      />
    </template>

    <div class="uni-table-toolbar__panel">
      <div class="uni-table-toolbar__header">表格工具</div>

      <div class="uni-table-toolbar__actions">
        <el-button
          v-if="config.refresh"
          :icon="Refresh"
          :loading="loading"
          @click="emit('refresh')"
        >
          刷新
        </el-button>
        <el-button
          v-if="config.fullscreen"
          :icon="FullScreen"
          @click="emit('update:fullscreen', !fullscreen)"
        >
          {{ fullscreen ? "退出最大化" : "最大化" }}
        </el-button>
        <el-button
          v-if="config.export"
          :icon="Download"
          @click="emit('export')"
        >
          导出
        </el-button>
        <el-button v-if="config.print" :icon="Printer" @click="emit('print')">
          打印
        </el-button>
      </div>

      <div v-if="config.density" class="uni-table-toolbar__section">
        <div class="uni-table-toolbar__title">密度</div>
        <el-radio-group
          :model-value="tableSize"
          size="small"
          @update:model-value="
            (value: UniTableSize) => emit('update:tableSize', value)
          "
        >
          <el-radio-button value="large">宽松</el-radio-button>
          <el-radio-button value="default">默认</el-radio-button>
          <el-radio-button value="small">紧凑</el-radio-button>
        </el-radio-group>
      </div>

      <div v-if="config.columnSetting" class="uni-table-toolbar__section">
        <UniTableColumnSettings
          :columns="columnStates"
          @drag-start="(prop) => emit('column-drag-start', prop)"
          @drop="(prop) => emit('column-drop', prop)"
        />
      </div>
    </div>
  </el-popover>
</template>

<style scoped lang="scss">
.uni-table-toolbar {
  &__trigger {
    padding: 4px;
    color: var(--el-text-color-regular);
  }

  &__trigger:hover {
    color: var(--el-color-primary);
  }

  &__panel {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  &__header {
    font-weight: 600;
    color: var(--el-text-color-primary);
  }

  &__actions {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
  }

  &__actions :deep(.el-button) {
    justify-content: flex-start;
    width: 100%;
    margin-left: 0;
  }

  &__section {
    padding-top: 12px;
    border-top: 1px solid var(--el-border-color-lighter);
  }

  &__title {
    margin-bottom: 8px;
    font-size: 13px;
    font-weight: 600;
    color: var(--el-text-color-regular);
  }
}
</style>
