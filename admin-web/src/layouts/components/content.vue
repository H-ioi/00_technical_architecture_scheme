<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import { useTagsViewStore } from '@/stores'

const route = useRoute()
const tagsViewStore = useTagsViewStore()
const viewKey = computed(() => `${route.fullPath}-${tagsViewStore.refreshKey}`)
</script>

<template>
  <el-main class="content">
    <RouterView :key="viewKey" />
  </el-main>
</template>

<style scoped lang="scss">
.content {
  flex: 1;
  width: 100%;
  min-width: 0;
  min-height: 0;
  padding: 16px;
  overflow-x: hidden;
  overflow-y: auto;
}
</style>
