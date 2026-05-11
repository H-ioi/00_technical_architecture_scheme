<template>
  <el-icon v-if="resolved">
    <component :is="resolved" />
  </el-icon>
  <span v-else-if="name">{{ name }}</span>
  <span v-else>—</span>
</template>

<script setup lang="ts">
import type { Component } from 'vue'
import { computed } from 'vue'

import { menuSidebarIconMap } from './registry'

const props = defineProps<{
  name?: string
}>()

const resolved = computed<Component | undefined>(() => {
  const n = props.name
  if (!n) {
    return undefined
  }
  return menuSidebarIconMap[n]
})
</script>
