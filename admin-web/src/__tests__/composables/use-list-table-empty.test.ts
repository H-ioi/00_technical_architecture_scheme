// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'

vi.mock('uni-ui-lib', () => ({
  useUniI18n: () => ({
    t: (key: string) => {
      const map: Record<string, string> = {
        'common.tableEmpty.forbidden': '没有权限',
        'common.tableEmpty.network': '网络错误',
        'common.tableEmpty.noMatch': '未找到匹配',
        'common.tableEmpty.noData': '暂无数据',
        'common.tableEmpty.pending': '加载中',
        'common.tableEmpty.hasData': '有数据'
      }
      return map[key] ?? key
    }
  })
}))

import { hasActiveListFilters, useListTableEmpty } from '../../composables/use-list-table-empty'

describe('use-list-table-empty.ts', () => {
  describe('hasActiveListFilters', () => {
    it('有非空值时返回 true', () => {
      expect(hasActiveListFilters({ name: 'test' })).toBe(true)
    })

    it('有数字 0 也应视为有效值', () => {
      expect(hasActiveListFilters({ count: 0 })).toBe(true)
    })

    it('有非空数组时返回 true', () => {
      expect(hasActiveListFilters({ ids: [1, 2] })).toBe(true)
    })

    it('所有值为 null/undefined/空字符串返回 false', () => {
      expect(hasActiveListFilters({ a: null, b: undefined, c: '' })).toBe(false)
    })

    it('空数组视为无效', () => {
      expect(hasActiveListFilters({ ids: [] })).toBe(false)
    })

    it('空对象返回 false', () => {
      expect(hasActiveListFilters({})).toBe(false)
    })
  })

  describe('useListTableEmpty', () => {
    let filters: ReturnType<typeof ref<Record<string, unknown>>>

    beforeEach(() => {
      filters = ref({})
    })

    it('初始 kind 为 pending', () => {
      const { kind, description } = useListTableEmpty(filters)
      expect(kind.value).toBe('pending')
      expect(description.value).toBe('加载中')
    })

    it('onLoadSuccess 后 total>0 且无筛选 kind 为 has_data', () => {
      const { kind, onLoadSuccess } = useListTableEmpty(filters)
      onLoadSuccess({ current: 1, pageSize: 10, total: 5, records: [] })
      expect(kind.value).toBe('has_data')
    })

    it('onLoadSuccess 后 total=0 且无筛选 kind 为 no_data', () => {
      const { kind, onLoadSuccess } = useListTableEmpty(filters)
      onLoadSuccess({ current: 1, pageSize: 10, total: 0, records: [] })
      expect(kind.value).toBe('no_data')
    })

    it('onLoadSuccess 后 total=0 且有筛选 kind 为 no_match', () => {
      filters.value = { status: 'active' }
      const { kind, onLoadSuccess } = useListTableEmpty(filters)
      onLoadSuccess({ current: 1, pageSize: 10, total: 0, records: [] })
      expect(kind.value).toBe('no_match')
    })

    it('onRequestError 403 返回 forbidden', () => {
      const { kind, onRequestError } = useListTableEmpty(filters)
      onRequestError({ response: { status: 403 } })
      expect(kind.value).toBe('forbidden')
    })

    it('onRequestError 非 403 返回 network', () => {
      const { kind, onRequestError } = useListTableEmpty(filters)
      onRequestError({ response: { status: 500 } })
      expect(kind.value).toBe('network')
    })

    it('onRequestError 无 response 也返回 network', () => {
      const { kind, onRequestError } = useListTableEmpty(filters)
      onRequestError(new Error('timeout'))
      expect(kind.value).toBe('network')
    })

    it('resetError 后清空错误状态', () => {
      const { kind, onRequestError, resetError } = useListTableEmpty(filters)
      onRequestError({ response: { status: 500 } })
      expect(kind.value).toBe('network')
      // resetError 清空错误，但 hasLoadedOnce 已为 true，所以回退到 no_data 而非 pending
      resetError()
      expect(kind.value).toBe('no_data')
    })

    it('afterLoadSuccess 回调被触发', () => {
      const afterLoadSuccess = vi.fn()
      const { onLoadSuccess } = useListTableEmpty(filters, { afterLoadSuccess })
      const result = { current: 1, pageSize: 10, total: 3, records: [] }
      onLoadSuccess(result)
      expect(afterLoadSuccess).toHaveBeenCalledWith(result)
    })
  })
})
