import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'

const mockRoute = {
  query: {} as Record<string, unknown>
}

const mockRouter = {
  replace: vi.fn()
}

vi.mock('vue-router', () => ({
  useRoute: () => mockRoute,
  useRouter: () => mockRouter
}))

import { useTabQuerySync } from '../../composables/use-tab-query-sync'

type TabType = 'overview' | 'details' | 'settings'

describe('use-tab-query-sync.ts', () => {
  beforeEach(() => {
    mockRoute.query = {}
    mockRouter.replace.mockReset()
  })

  it('URL 无 tab 时保持 activeTab 不变', () => {
    const activeTab = ref<TabType>('overview')
    useTabQuerySync(activeTab, ['overview', 'details', 'settings'] as const)
    expect(activeTab.value).toBe('overview')
  })

  it('URL 有有效 tab 时同步到 activeTab', () => {
    mockRoute.query = { tab: 'details' }
    const activeTab = ref<TabType>('overview')
    useTabQuerySync(activeTab, ['overview', 'details', 'settings'] as const)
    expect(activeTab.value).toBe('details')
  })

  it('URL 有无效 tab 时保持原有 activeTab', () => {
    mockRoute.query = { tab: 'invalid_tab' }
    const activeTab = ref<TabType>('overview')
    useTabQuerySync(activeTab, ['overview', 'details', 'settings'] as const)
    expect(activeTab.value).toBe('overview')
  })

  it('URL 数组 tab 取第一个元素', () => {
    mockRoute.query = { tab: ['details', 'overview'] }
    const activeTab = ref<TabType>('overview')
    useTabQuerySync(activeTab, ['overview', 'details', 'settings'] as const)
    expect(activeTab.value).toBe('details')
  })

  it('activeTab 变化时调用 router.replace', async () => {
    const activeTab = ref<TabType>('overview')
    useTabQuerySync(activeTab, ['overview', 'details', 'settings'] as const)

    activeTab.value = 'settings'
    // 需要等待 watch 触发
    await vi.waitFor(() => {
      expect(mockRouter.replace).toHaveBeenCalled()
    })

    const callArg = mockRouter.replace.mock.calls[0]?.[0] as Record<string, unknown>
    expect(callArg.query).toMatchObject({ tab: 'settings' })
  })

  it('可使用自定义 queryKey', () => {
    mockRoute.query = { activePane: 'details' }
    const activeTab = ref<TabType>('overview')
    useTabQuerySync(activeTab, ['overview', 'details', 'settings'] as const, {
      queryKey: 'activePane'
    })
    expect(activeTab.value).toBe('details')
  })
})
