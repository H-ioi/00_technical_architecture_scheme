/**
 * 示例 Store，用于演示如何使用 Pinia
 * 实际项目中，应根据业务需求，创建相应的 Store
 * 使用组件库的 defineStore 方法，而不是 pinia 的 defineStore 方法
 */
import { defineStore } from 'uni-ui-lib'
import { computed, ref } from 'vue'

export const useCounterStore = defineStore('counter', () => {
  // state
  const count = ref(0)

  // getters
  const doubleCount = computed(() => count.value * 2)

  // actions
  function increment() {
    count.value++
  }

  return { count, doubleCount, increment }
})
