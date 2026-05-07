<script setup lang="ts">
import {
  Download,
  FullScreen,
  Printer,
  Refresh,
  Setting,
} from "@element-plus/icons-vue";

import { useUniI18n } from "@/services/i18n";
import type { UniTableToolbarConfig } from "@/types/shared";
import type { UniTableColumnState, UniTableSize } from "@/types/uni-data-table";
import UniTableColumnSettings from "./column-settings.vue";

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

const i18n = useUniI18n();
</script>

<template>
  <el-popover
    placement="bottom-end"
    trigger="click"
    width="280"
    popper-class="uni-table-toolbar-popper"
  >
    <template #reference>
      <el-button
        link
        class="uni-table-toolbar__trigger"
        :icon="Setting"
        :aria-label="i18n.t('dataTable.tools')"
        :title="i18n.t('dataTable.tools')"
      />
    </template>

    <div class="uni-table-toolbar__panel">
      <div class="uni-table-toolbar__header">
        {{ i18n.t("dataTable.tools") }}
      </div>

      <div class="uni-table-toolbar__actions">
        <el-button
          v-if="config.refresh"
          size="small"
          :icon="Refresh"
          :loading="loading"
          @click="emit('refresh')"
        >
          {{ i18n.t("dataTable.refresh") }}
        </el-button>
        <el-button
          v-if="config.fullscreen"
          size="small"
          :icon="FullScreen"
          @click="emit('update:fullscreen', !fullscreen)"
        >
          {{
            fullscreen
              ? i18n.t("dataTable.exitFullscreen")
              : i18n.t("dataTable.fullscreen")
          }}
        </el-button>
        <el-button
          v-if="config.export"
          size="small"
          :icon="Download"
          @click="emit('export')"
        >
          {{ i18n.t("dataTable.export") }}
        </el-button>
        <el-button
          v-if="config.print"
          size="small"
          :icon="Printer"
          @click="emit('print')"
        >
          {{ i18n.t("dataTable.print") }}
        </el-button>
      </div>

      <div v-if="config.density" class="uni-table-toolbar__section">
        <div class="uni-table-toolbar__title">
          {{ i18n.t("dataTable.density") }}
        </div>
        <el-radio-group
          :model-value="tableSize"
          size="small"
          @update:model-value="
            (value: UniTableSize) => emit('update:tableSize', value)
          "
        >
          <el-radio-button value="large">
            {{ i18n.t("dataTable.densityLarge") }}
          </el-radio-button>
          <el-radio-button value="default">
            {{ i18n.t("dataTable.densityDefault") }}
          </el-radio-button>
          <el-radio-button value="small">
            {{ i18n.t("dataTable.densitySmall") }}
          </el-radio-button>
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
    gap: 8px;
  }

  &__header {
    font-size: 13px;
    font-weight: 600;
    color: var(--el-text-color-primary);
  }

  &__actions {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 6px;
  }

  &__actions :deep(.el-button) {
    justify-content: flex-start;
    width: 100%;
    margin-left: 0;
  }

  &__section {
    padding-top: 8px;
    border-top: 1px solid var(--el-border-color-lighter);
  }

  &__title {
    margin-bottom: 6px;
    font-size: 12px;
    font-weight: 600;
    color: var(--el-text-color-regular);
  }
}

:global(.uni-table-toolbar-popper.el-popover) {
  padding: 10px;
}
</style>
