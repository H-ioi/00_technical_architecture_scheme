<script setup lang="ts">
/**
 * 数据表格：列定义驱动渲染 + 可选本地/远程分页、选择列、行操作与表格工具栏。
 */
import { MoreFilled } from '@element-plus/icons-vue'
import type { Sort } from 'element-plus'
import { computed, nextTick, onBeforeUnmount, onMounted, onUpdated, ref, useSlots, watch } from 'vue'

import { hasUniPermission } from '@/directives/permission'
import { useUniI18n } from '@/services/i18n'
import type {
  Recordable,
  UniPaginationConfig,
  UniTableAction,
  UniTableActionColumnConfig,
  UniTableColumn,
  UniTableRequest,
  UniTableRequestResult,
  UniTableToolbarConfig
} from '@/types/shared'
import type { UniTableSize } from '@/types/uni-data-table'
import UniTableCell from './cell.vue'
import UniTableToolbar from './toolbar.vue'
import { useColumns } from './use-columns'
import { useData } from './use-data'

const props = withDefaults(
  defineProps<{
    columns: UniTableColumn[]
    data?: Recordable[]
    request?: UniTableRequest
    filters?: Recordable
    loading?: boolean
    pagination?: UniPaginationConfig | false
    rowKey?: string
    selection?: boolean | 'multiple' | 'single'
    selectable?: (row: Recordable, index: number) => boolean
    actions?: UniTableAction[]
    actionColumn?: UniTableActionColumnConfig
    emptyText?: string
    maxHeight?: number | string | false | 'auto'
    maxHeightOffset?: number
    valueEnums?: Record<string, import('@/types/shared').UniOption[]>
    toolbar?: boolean | UniTableToolbarConfig
  }>(),
  {
    data: () => [],
    maxHeight: 'auto',
    maxHeightOffset: 16,
    pagination: undefined,
    rowKey: 'id',
    toolbar: undefined
  }
)

const emit = defineEmits<{
  'update:pageNo': [value: number]
  'update:pageSize': [value: number]
  'selection-change': [selection: Recordable[]]
  'sort-change': [sort: Sort]
  'row-click': [row: Recordable]
  refresh: []
  'load-success': [result: UniTableRequestResult]
  'request-error': [error: unknown]
  'switch-change': [row: Recordable, column: UniTableColumn, value: unknown]
}>()

const i18n = useUniI18n()
const slots = useSlots()
const rootRef = ref<HTMLElement>()
const paginationRef = ref<HTMLElement>()
const tableSize = ref<UniTableSize>('default')
const fullscreen = ref(false)
const tableBorder = ref(false)
const tableStripe = ref(false)
const autoMaxHeight = ref<number>()
let resizeObserver: ResizeObserver | undefined
const actualEmptyText = computed(() => props.emptyText ?? i18n.t('common.empty'))
const toolbarConfig = computed<Required<UniTableToolbarConfig>>(() => {
  if (props.toolbar === false) {
    return {
      enabled: false,
      refresh: false,
      density: false,
      columnSetting: false,
      fullscreen: false,
      export: false,
      print: false,
      exportFileName: 'table-data'
    }
  }

  return {
    enabled: true,
    refresh: true,
    density: true,
    columnSetting: true,
    fullscreen: true,
    export: true,
    print: true,
    exportFileName: 'table-data',
    ...(typeof props.toolbar === 'object' ? props.toolbar : {})
  }
})
const hasToolbarTools = computed(
  () => toolbarConfig.value.enabled && (toolbarConfig.value.refresh || toolbarConfig.value.columnSetting || toolbarConfig.value.fullscreen)
)

const { columnStates, visibleColumns, handleColumnDragStart, handleColumnDrop } = useColumns(() => props.columns)

const { actualData, actualLoading, actualTotal, loadData, paginationConfig, paginationState, setSort, handleCurrentChange, handleSizeChange } = useData({
  getData: () => props.data,
  getLoading: () => props.loading,
  getPagination: () => props.pagination,
  getRequest: () => props.request,
  getFilters: () => props.filters,
  emitLoadSuccess: (result) => emit('load-success', result),
  emitRequestError: (error) => emit('request-error', error),
  emitUpdatePageNo: (value) => emit('update:pageNo', value),
  emitUpdatePageSize: (value) => emit('update:pageSize', value)
})

const handleSortChange = (sort: Sort) => {
  emit('sort-change', sort)
  setSort(sort)
}

const handleSingleSelectionChange = (row?: Recordable) => {
  if (props.selection !== 'single') {
    return
  }

  emit('selection-change', row ? [row] : [])
}

const handleToolbarRefresh = () => {
  emit('refresh')

  if (props.request) {
    loadData()
  }
}

const isActionVisible = (action: UniTableAction, row: Recordable) => {
  const visible = typeof action.visible === 'function' ? action.visible(row) : action.visible
  const permitted = action.code ? hasUniPermission(action.code) : true

  return visible !== false && permitted
}

const isActionDisabled = (action: UniTableAction, row: Recordable) => (typeof action.disabled === 'function' ? action.disabled(row) : Boolean(action.disabled))

const ACTION_VISIBLE_LIMIT = 3
const ACTION_INLINE_LIMIT_WHEN_MORE = ACTION_VISIBLE_LIMIT - 1

const getVisibleActions = (row: Recordable) => (props.actions ?? []).filter((action) => isActionVisible(action, row))

const hasActionColumn = computed(() => {
  if (slots.actions) {
    return true
  }

  if (!props.actions?.length) {
    return false
  }

  return actualData.value.some((row) => getVisibleActions(row).length > 0)
})

const actualMaxHeight = computed(() => {
  if (props.maxHeight === false) {
    return undefined
  }

  if (props.maxHeight !== 'auto') {
    return props.maxHeight
  }

  return autoMaxHeight.value
})

const updateAutoMaxHeight = () => {
  if (props.maxHeight !== 'auto' || typeof window === 'undefined') {
    return
  }

  const tableElement = rootRef.value?.querySelector<HTMLElement>('.el-table')

  if (!tableElement) {
    return
  }

  const tableTop = tableElement.getBoundingClientRect().top
  const paginationHeight = paginationRef.value?.getBoundingClientRect().height ?? 0
  const paginationGap = paginationHeight > 0 ? 10 : 0
  const availableHeight = window.innerHeight - tableTop - paginationHeight - paginationGap - props.maxHeightOffset - 22

  autoMaxHeight.value = Math.max(160, Math.floor(availableHeight))
}

const scheduleUpdateAutoMaxHeight = () => {
  void nextTick(updateAutoMaxHeight)
}

const getInlineActions = (row: Recordable) => {
  const actions = getVisibleActions(row)

  return actions.length > ACTION_VISIBLE_LIMIT ? actions.slice(0, ACTION_INLINE_LIMIT_WHEN_MORE) : actions
}

const getMoreActions = (row: Recordable) => {
  const actions = getVisibleActions(row)

  return actions.length > ACTION_VISIBLE_LIMIT ? actions.slice(ACTION_INLINE_LIMIT_WHEN_MORE) : []
}

const getActionKey = (action: UniTableAction, index: number) => `${action.code ? JSON.stringify(action.code) : action.label}-${index}`

const handleMoreActionCommand = (action: UniTableAction, row: Recordable, index: number) => {
  if (isActionDisabled(action, row)) {
    return
  }

  action.onClick(row, index)
}

defineExpose({
  refresh: handleToolbarRefresh
})

onMounted(() => {
  scheduleUpdateAutoMaxHeight()
  window.addEventListener('resize', scheduleUpdateAutoMaxHeight)

  if (typeof ResizeObserver !== 'undefined' && rootRef.value) {
    resizeObserver = new ResizeObserver(scheduleUpdateAutoMaxHeight)
    resizeObserver.observe(rootRef.value)
  }
})

onUpdated(scheduleUpdateAutoMaxHeight)

onBeforeUnmount(() => {
  window.removeEventListener('resize', scheduleUpdateAutoMaxHeight)
  resizeObserver?.disconnect()
})

watch(() => [props.maxHeight, actualData.value.length, paginationConfig.value, fullscreen.value, tableSize.value], scheduleUpdateAutoMaxHeight)
</script>

<template>
  <div ref="rootRef" class="uni-data-table" :class="{ 'is-fullscreen': fullscreen }">
    <el-table
      v-loading="actualLoading"
      :data="actualData"
      :row-key="rowKey"
      :empty-text="actualEmptyText"
      :border="tableBorder"
      :max-height="actualMaxHeight"
      :size="tableSize"
      :stripe="tableStripe"
      :highlight-current-row="selection === 'single'"
      @selection-change="(selection: Recordable[]) => emit('selection-change', selection)"
      @current-change="handleSingleSelectionChange"
      @sort-change="handleSortChange"
      @row-click="(row: Recordable) => emit('row-click', row)">
      <el-table-column v-if="selection === true || selection === 'multiple'" type="selection" width="48" :selectable="selectable" />

      <el-table-column
        v-for="column in visibleColumns"
        :key="column.prop"
        :prop="column.prop"
        :label="column.label"
        :width="column.width"
        :min-width="column.minWidth"
        :fixed="column.fixed"
        :align="column.align"
        :sortable="column.sortable"
        :show-overflow-tooltip="column.showOverflowTooltip">
        <template #header>
          <slot :name="`header-${column.prop}`" :column="column">{{ column.label }}</slot>
        </template>
        <template #default="{ row, $index }">
          <slot v-if="$slots[`column-${column.prop}`]" :name="`column-${column.prop}`" :row="row" :value="row[column.prop]" :index="$index" />
          <UniTableCell
            v-else
            :row="row"
            :column="column"
            :value="row[column.prop]"
            :row-index="$index"
            :value-enums="valueEnums"
            @switch-change="(nextRow, nextColumn, value) => emit('switch-change', nextRow, nextColumn, value)" />
        </template>
      </el-table-column>

      <el-table-column
        v-if="hasActionColumn"
        :label="actionColumn?.label ?? i18n.t('dataTable.actions')"
        :fixed="actionColumn?.fixed === false ? false : (actionColumn?.fixed ?? 'right')"
        :width="actionColumn?.width ?? 180"
        :min-width="actionColumn?.minWidth">
        <template #default="{ row, $index }">
          <slot name="actions" :row="row" :index="$index">
            <template v-for="(action, actionIndex) in getInlineActions(row)" :key="getActionKey(action, actionIndex)">
              <el-button link :type="action.type ?? 'primary'" :disabled="isActionDisabled(action, row)" @click="action.onClick(row, $index)">
                {{ action.label }}
              </el-button>
            </template>
            <el-dropdown v-if="getMoreActions(row).length" trigger="click" @command="(action: UniTableAction) => handleMoreActionCommand(action, row, $index)">
              <el-button link type="primary" class="uni-data-table__more-action" :aria-label="i18n.t('dataTable.moreActions')">
                <el-icon>
                  <MoreFilled />
                </el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item
                    v-for="(action, actionIndex) in getMoreActions(row)"
                    :key="getActionKey(action, actionIndex)"
                    :command="action"
                    :disabled="isActionDisabled(action, row)">
                    {{ action.label }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </slot>
        </template>
      </el-table-column>

      <template #empty>
        <slot name="empty">{{ actualEmptyText }}</slot>
      </template>
    </el-table>

    <div
      v-if="$slots.toolbar || hasToolbarTools || (paginationConfig && paginationConfig.enabled !== false)"
      ref="paginationRef"
      class="uni-data-table__footer">
      <div class="uni-data-table__toolbar">
        <el-button-group size="small" v-if="$slots.toolbar" class="uni-data-table__toolbar-left">
          <slot name="toolbar" />
        </el-button-group>
        <el-divider v-if="$slots.toolbar" direction="vertical" />
        <div v-if="hasToolbarTools" class="uni-data-table__toolbar-right">
          <UniTableToolbar
            v-model:border="tableBorder"
            v-model:fullscreen="fullscreen"
            v-model:stripe="tableStripe"
            :column-states="columnStates"
            :config="toolbarConfig"
            :loading="actualLoading"
            @refresh="handleToolbarRefresh"
            @column-drag-start="handleColumnDragStart"
            @column-drop="handleColumnDrop" />
        </div>
      </div>

      <div v-if="paginationConfig && paginationConfig.enabled !== false" class="uni-data-table__pagination" :class="`is-${paginationConfig.position}`">
        <el-pagination
          :background="paginationConfig.background"
          :layout="paginationConfig.layout"
          :page-sizes="paginationConfig.pageSizes"
          :hide-on-single-page="paginationConfig.hideOnSinglePage"
          :current-page="paginationState.pageNo"
          :page-size="paginationState.pageSize"
          size="small"
          :total="actualTotal"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.uni-data-table {
  min-width: 0;
  width: 100%;

  &.is-fullscreen {
    position: fixed;
    inset: 0;
    z-index: 2000;
    display: flex;
    flex-direction: column;
    padding: 16px;
    overflow: auto;
    background: var(--el-bg-color);
  }

  &.is-fullscreen :deep(.el-table) {
    flex: 1;
  }

  :deep(.el-table) {
    width: 100%;
  }

  :deep(.el-table) {
    --el-table-border-color: #edf0f5;
    --el-table-header-bg-color: #fafbfc;
    --el-table-row-hover-bg-color: #f7f9ff;

    border-top: 1px solid var(--el-table-border-color);
    color: var(--app-text-color);
    font-size: 13px;
  }

  :deep(.el-table th.el-table__cell) {
    height: 44px;
    color: var(--app-text-color-secondary);
    font-weight: 600;
    background: #fafbfc;
  }

  :deep(.el-table .el-table__cell) {
    padding: 9px 0;
  }

  :deep(.el-table__inner-wrapper::before) {
    height: 0;
  }

  :deep(.uni-data-table__pagination) {
    margin-top: 0;
  }

  &__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 32px;
    margin-top: 10px;
  }

  &__toolbar {
    display: inline-flex;
    gap: 8px;
    align-items: center;
    justify-content: flex-start;
    min-width: 0;
  }

  &__toolbar-left {
    flex: 0 1 auto;
    min-width: 0;
  }

  &__toolbar-right {
    display: inline-flex;
    flex-shrink: 0;
    align-items: center;
  }

  &__pagination {
    display: flex;
    flex: 1;
    min-width: 0;

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

  &__more-action {
    margin-left: 12px;
  }
}
</style>
