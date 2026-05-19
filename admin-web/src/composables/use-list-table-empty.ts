import type { UniTableRequestResult } from 'uni-ui-lib'
import { useUniI18n } from 'uni-ui-lib'
import { computed, type Ref, ref, unref } from 'vue'

import type { ListTableEmptyKind } from '@/types/list-table-empty'

export type { ListTableEmptyKind } from '@/types/list-table-empty'

/** 与 useUniListState 中 filters 语义一致：无任何有效筛选条件视为未筛选 */
export function hasActiveListFilters(filters: Record<string, unknown>): boolean {
  return Object.values(filters).some((v) => {
    if (v === undefined || v === null || v === '') {
      return false
    }
    if (Array.isArray(v) && v.length === 0) {
      return false
    }
    return true
  })
}

/**
 * 列表空态：区分无权限、网络失败、筛选无结果、无数据。
 * 与 UniDataTable 的 #empty、@request-error、@load-success 配合使用。
 */
export function useListTableEmpty(filters: Ref<Record<string, unknown>>) {
  const { t } = useUniI18n()
  const hasLoadedOnce = ref(false)
  const lastTotal = ref(0)
  const requestError = ref<'forbidden' | 'network' | null>(null)

  const onLoadSuccess = (result: UniTableRequestResult) => {
    hasLoadedOnce.value = true
    requestError.value = null
    lastTotal.value = result.total ?? 0
  }

  const onRequestError = (err: unknown) => {
    hasLoadedOnce.value = true
    let status: number | undefined
    if (err && typeof err === 'object' && 'response' in err) {
      status = (err as { response?: { status?: number } }).response?.status
    }
    requestError.value = status === 403 ? 'forbidden' : 'network'
  }

  const resetError = () => {
    requestError.value = null
  }

  const kind = computed((): ListTableEmptyKind => {
    if (requestError.value === 'forbidden') {
      return 'forbidden'
    }
    if (requestError.value === 'network') {
      return 'network'
    }
    if (!hasLoadedOnce.value) {
      return 'pending'
    }
    if (lastTotal.value > 0) {
      return 'has_data'
    }
    if (hasActiveListFilters(unref(filters))) {
      return 'no_match'
    }
    return 'no_data'
  })

  const description = computed(() => {
    switch (kind.value) {
      case 'forbidden':
        return t('common.tableEmpty.forbidden')
      case 'network':
        return t('common.tableEmpty.network')
      case 'no_match':
        return t('common.tableEmpty.noMatch')
      case 'no_data':
        return t('common.tableEmpty.noData')
      case 'pending':
        return t('common.tableEmpty.pending')
      default:
        return t('common.tableEmpty.noData')
    }
  })

  return {
    description,
    kind,
    onLoadSuccess,
    onRequestError,
    resetError
  }
}
