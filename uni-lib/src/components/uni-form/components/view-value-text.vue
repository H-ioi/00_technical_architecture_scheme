<template>
  <span
    v-if="overflow === 'wrap'"
    class="uni-form-view-value-text uni-form-view-value-text--wrap"
    >{{ display }}</span
  >
  <span v-else-if="overflow === 'none'" class="uni-form-view-value-text">{{ display }}</span>
  <el-tooltip
    v-else
    :content="display"
    placement="top"
    :disabled="!isOverflowing"
    :show-after="200">
    <span ref="lineRef" class="uni-form-view-value-text uni-form-view-value-text--ellipsis">
      {{ display }}
    </span>
  </el-tooltip>
</template>

<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'

import type { UniFormViewOverflow } from '@/types/uni-form'

const props = defineProps<{
  display: string
  overflow: UniFormViewOverflow
}>()

const lineRef = ref<HTMLElement | null>(null)
const isOverflowing = ref(false)

let ro: ResizeObserver | null = null

const measure = async () => {
  if (props.overflow !== 'ellipsis') {
    isOverflowing.value = false
    return
  }
  await nextTick()
  const el = lineRef.value
  if (!el) {
    isOverflowing.value = false
    return
  }
  isOverflowing.value = el.scrollWidth > el.clientWidth + 1
}

function setupResizeObserver() {
  ro?.disconnect()
  ro = null
  if (props.overflow !== 'ellipsis' || typeof ResizeObserver === 'undefined') {
    return
  }
  const el = lineRef.value
  const parent = el?.parentElement
  if (!parent) {
    return
  }
  ro = new ResizeObserver(() => {
    void measure()
  })
  ro.observe(parent)
}

onMounted(async () => {
  await measure()
  setupResizeObserver()
})

watch(
  () => [props.display, props.overflow] as const,
  async () => {
    await measure()
    setupResizeObserver()
  }
)

onUnmounted(() => {
  ro?.disconnect()
  ro = null
})
</script>

<style lang="scss">
.uni-form-view-value-text {
  color: var(--uni-text-color);
  display: inline-block;
  width: 100%;
  max-width: 100%;
  vertical-align: top;
}

.uni-form-view-value-text--ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.uni-form-view-value-text--wrap {
  white-space: pre-wrap;
  word-break: break-word;
  overflow-wrap: anywhere;
}
</style>
