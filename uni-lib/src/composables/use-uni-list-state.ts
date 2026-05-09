import { nextTick, ref } from 'vue'

import type { UniListStateOptions, UniListTableExpose } from '@/types/uni-list-state'
import type { Recordable } from '@/types/shared'
import type { UniTableRequestResult } from '@/types/uni-table'

export type { UniListStateOptions, UniListTableExpose } from '@/types/uni-list-state'

/**
 * 列表页通用状态：查询模型、实际过滤条件、表格 ref 和总数。
 * 提供搜索/重置/刷新等通用功能。
 */
export const useUniListState = (options: UniListStateOptions) => {
  const queryModel = ref<Recordable>({ ...options.initialFilters })
  const filters = ref<Recordable>({})
  const tableRef = ref<UniListTableExpose | null>(null)
  const total = ref(0)

  const refreshTable = async () => {
    await nextTick()
    tableRef.value?.refresh()
  }

  const search = async (value: Recordable) => {
    filters.value = { ...value }
    await refreshTable()
  }

  const reset = async (value: Recordable = {}) => {
    filters.value = { ...value }
    await refreshTable()
  }

  const handleLoadSuccess = (result: UniTableRequestResult) => {
    total.value = result.total
  }

  return {
    filters,
    handleLoadSuccess,
    queryModel,
    refreshTable,
    reset,
    search,
    tableRef,
    total
  }
}
