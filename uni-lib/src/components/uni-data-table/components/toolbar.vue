<script setup lang="ts">
import { FullScreen, Refresh, Setting } from "@element-plus/icons-vue";

import { useUniI18n } from "@/services/i18n";
import type { UniTableToolbarConfig } from "@/types/uni-table";
import type { UniTableColumnState } from "@/types/uni-data-table";
import UniTableColumnSettings from "./column-settings.vue";

defineProps<{
  columnStates: UniTableColumnState[];
  config: Required<UniTableToolbarConfig>;
  fullscreen: boolean;
  loading: boolean;
  border: boolean;
  stripe: boolean;
}>();

const emit = defineEmits<{
  "column-drag-start": [prop: string];
  "column-drop": [prop: string];
  "update:border": [value: boolean];
  "update:fullscreen": [value: boolean];
  "update:stripe": [value: boolean];
  refresh: [];
}>();

const i18n = useUniI18n();
</script>

<template>
  <el-button-group size="small" plain class="uni-table-toolbar">
    <el-button
      v-if="config.refresh"
      class="uni-table-toolbar__trigger"
      :icon="Refresh"
      :loading="loading"
      :aria-label="i18n.t('dataTable.refresh')"
      :title="i18n.t('dataTable.refresh')"
      @click="emit('refresh')"
    />
    <el-button
      v-if="config.fullscreen"
      class="uni-table-toolbar__trigger"
      :icon="FullScreen"
      :aria-label="
        fullscreen
          ? i18n.t('dataTable.exitFullscreen')
          : i18n.t('dataTable.fullscreen')
      "
      :title="
        fullscreen
          ? i18n.t('dataTable.exitFullscreen')
          : i18n.t('dataTable.fullscreen')
      "
      @click="emit('update:fullscreen', !fullscreen)"
    />
    <el-popover
      v-if="config.columnSetting"
      placement="bottom-end"
      trigger="click"
      width="300"
      popper-class="uni-table-toolbar-popper"
    >
      <template #reference>
        <el-button
          class="uni-table-toolbar__trigger"
          :icon="Setting"
          :aria-label="i18n.t('dataTable.tools')"
          :title="i18n.t('dataTable.tools')"
        />
      </template>

      <div class="uni-table-toolbar__panel">
        <UniTableColumnSettings
          :columns="columnStates"
          @drag-start="(prop) => emit('column-drag-start', prop)"
          @drop="(prop) => emit('column-drop', prop)"
        />

        <div class="uni-table-toolbar__section">
          <div class="uni-table-toolbar__title">
            {{ i18n.t("dataTable.otherSettings") }}
          </div>
          <div class="uni-table-toolbar__option">
            <span>{{ i18n.t("dataTable.stripe") }}</span>
            <el-switch
              :model-value="stripe"
              @update:model-value="
                (value: boolean) => emit('update:stripe', value)
              "
            />
          </div>
          <div class="uni-table-toolbar__option">
            <span>{{ i18n.t("dataTable.border") }}</span>
            <el-switch
              :model-value="border"
              @update:model-value="
                (value: boolean) => emit('update:border', value)
              "
            />
          </div>
        </div>
      </div>
    </el-popover>
  </el-button-group>
</template>

<style scoped lang="scss">
.uni-table-toolbar {
  &__panel {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  &__section {
    padding-top: 10px;
    border-top: 1px solid var(--el-border-color-lighter);
  }

  &__title {
    margin-bottom: 6px;
    font-size: 12px;
    font-weight: 600;
    color: var(--el-text-color-regular);
  }

  &__option {
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 28px;
    font-size: 12px;
    color: var(--el-text-color-primary);
  }
}
</style>
