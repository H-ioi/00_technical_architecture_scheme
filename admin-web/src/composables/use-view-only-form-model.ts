import { computed, type ComputedRef } from 'vue'

import type { Recordable } from 'uni-ui-lib'

/**
 * 查看态 UniForm：需要 `v-model` 与组件内 `defineModel` 对齐，但不应对父级传入的 prop 做可变绑定。
 * 使用带空 setter 的计算属性，避免子表单 `update:modelValue` 尝试回写 prop。
 */
export function useViewOnlyFormModel(
  getter: () => Recordable | null | undefined
): ComputedRef<Recordable> {
  return computed<Recordable>({
    get: () => (getter() ?? {}) as Recordable,
    set: () => {}
  })
}
