import { describe, it, expect } from 'vitest'
import { ref } from 'vue'

// Import the function under test
import { useViewOnlyFormModel } from '../../composables/use-view-only-form-model'

describe('use-view-only-form-model.ts', () => {

  describe('useViewOnlyFormModel', () => {
    it('getter 返回值通过 computed 访问', () => {
      const source = ref({ name: 'test', age: 25 })
      const model = useViewOnlyFormModel(() => source.value)

      expect(model.value).toEqual({ name: 'test', age: 25 })
    })

    it('getter 返回 null 时返回空对象', () => {
      const model = useViewOnlyFormModel(() => null as unknown as Record<string, unknown>)
      expect(model.value).toEqual({})
    })

    it('getter 返回 undefined 时返回空对象', () => {
      const model = useViewOnlyFormModel(() => undefined as unknown as Record<string, unknown>)
      expect(model.value).toEqual({})
    })

    it('setter 不修改原值（只读）', () => {
      const source = ref({ name: 'original' })
      const model = useViewOnlyFormModel(() => source.value)

      // 尝试写入 model
      ;(model as any).value = { name: 'modified' }

      // 原值不变
      expect(source.value).toEqual({ name: 'original' })
    })

    it('getter 依赖响应变化', () => {
      const source = ref({ count: 1 })
      const model = useViewOnlyFormModel(() => source.value)

      expect(model.value.count).toBe(1)

      source.value = { count: 2 }
      expect(model.value.count).toBe(2)
    })
  })
})
