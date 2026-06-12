<template>
  <el-button-group plain class="uni-table-toolbar">
    <el-button v-if="config.refresh" class="uni-table-toolbar__trigger" :icon="Refresh" :loading="loading"
      :aria-label="$t('dataTable.refresh')" :title="$t('dataTable.refresh')" @click="emit('refresh')" />
    <el-button v-if="config.fullscreen" class="uni-table-toolbar__trigger" :icon="FullScreen"
      :aria-label="fullscreen ? $t('dataTable.exitFullscreen') : $t('dataTable.fullscreen')"
      :title="fullscreen ? $t('dataTable.exitFullscreen') : $t('dataTable.fullscreen')"
      @click="fullscreen = !fullscreen" />
    <el-popover v-if="config.columnSetting" placement="bottom-end" trigger="click" width="300"
      popper-class="uni-table-toolbar-popper">
      <template #reference>
        <el-button class="uni-table-toolbar__trigger" :icon="Setting" :aria-label="$t('dataTable.tools')"
          :title="$t('dataTable.tools')" />
      </template>

      <div class="uni-table-toolbar__panel">
        <UniTableColumnSettings :columns="columnStates" @drag-start="(prop) => emit('column-drag-start', prop)"
          @drop="(prop) => emit('column-drop', prop)" />

        <div class="uni-table-toolbar__section">
          <div class="uni-table-toolbar__title">
            {{ $t('dataTable.otherSettings') }}
          </div>
          <div class="uni-table-toolbar__option">
            <span>{{ $t('dataTable.stripe') }}</span>
            <el-switch v-model="stripe" />
          </div>
          <div class="uni-table-toolbar__option">
            <span>{{ $t('dataTable.border') }}</span>
            <el-switch v-model="border" />
          </div>
        </div>
      </div>
    </el-popover>
  </el-button-group>
</template>

<script setup lang="ts">
import { FullScreen, Refresh, Setting } from '@element-plus/icons-vue'

import type { UniTableColumnState } from '@/types/uni-data-table'
import type { UniTableToolbarConfig } from '@/types/uni-table'
import UniTableColumnSettings from './column-settings.vue'

const fullscreen = defineModel<boolean>('fullscreen', { required: true })
const stripe = defineModel<boolean>('stripe', { required: true })
const border = defineModel<boolean>('border', { required: true })

defineProps<{
  columnStates: UniTableColumnState[]
  config: Required<UniTableToolbarConfig>
  loading: boolean
}>()

const emit = defineEmits<{
  'column-drag-start': [prop: string]
  'column-drop': [prop: string]
  refresh: []
}>()
</script>

<style lang="scss">
.uni-table-toolbar {
  &__trigger {
    transition: var(--uni-transition-colors);
  }

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
