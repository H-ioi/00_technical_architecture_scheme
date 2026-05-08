<script setup lang="ts">
import { computed } from "vue";
import type { Component } from "vue";

const props = withDefaults(
  defineProps<{
    icon: Component;
    size?: number | string;
    color?: string;
    title?: string;
  }>(),
  {
    size: 16,
  },
);

const normalizedSize = computed(() =>
  typeof props.size === "number" ? `${props.size}px` : props.size,
);

const iconStyle = computed(() => ({
  width: normalizedSize.value,
  height: normalizedSize.value,
  color: props.color,
}));
</script>

<template>
  <span class="uni-icon" :style="iconStyle" :role="title ? 'img' : undefined" :aria-label="title" :aria-hidden="title ? undefined : 'true'">
    <component :is="icon" />
  </span>
</template>

<style scoped lang="scss">
.uni-icon {
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  line-height: 1;
  vertical-align: -0.125em;

  :deep(svg) {
    display: block;
    width: 100%;
    height: 100%;
  }
}
</style>
