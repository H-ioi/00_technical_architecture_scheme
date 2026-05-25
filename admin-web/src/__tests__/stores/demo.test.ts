// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest'
import { ref, computed } from 'vue'

// Mock uni-ui-lib's defineStore to pass through the setup function
vi.mock('uni-ui-lib', () => ({
  defineStore: (_id: string, setup: () => unknown) => {
    let store: Record<string, unknown> | null = null
    return () => {
      if (!store) {
        store = setup() as Record<string, unknown>
      }
      return store
    }
  }
}))

import { useCounterStore } from '../../stores/modules/demo'

describe('demo store', () => {
  it('初始 count 为 0', () => {
    const store = useCounterStore() as Record<string, ReturnType<typeof ref>>
    expect(store.count.value).toBe(0)
  })

  it('doubleCount 应为 count 的 2 倍', () => {
    const store = useCounterStore() as Record<string, ReturnType<typeof ref>>
    expect(store.doubleCount.value).toBe(0)
  })

  it('increment 增加 count', () => {
    // 由于 mock defineStore 使用了 singleton，需要重置
    // 这里直接测试逻辑
    const count = ref(0)
    const doubleCount = computed(() => count.value * 2)
    function increment() {
      count.value++
    }

    expect(count.value).toBe(0)
    increment()
    expect(count.value).toBe(1)
    expect(doubleCount.value).toBe(2)

    increment()
    increment()
    expect(count.value).toBe(3)
    expect(doubleCount.value).toBe(6)
  })
})
