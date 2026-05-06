<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'

import { useAppI18n } from '@/composables/use-app-i18n'
import { useTagsViewStore } from '@/stores'

const route = useRoute()
const router = useRouter()
const tagsViewStore = useTagsViewStore()
const { t } = useAppI18n()

const goTag = (path: string) => {
  if (path !== route.fullPath) {
    router.push(path)
  }
}

const closeTag = (path: string, event: Event) => {
  event.stopPropagation()
  const tags = tagsViewStore.visitedTags
  const index = tags.findIndex((t) => t.path === path)
  const isActive = route.fullPath === path

  const left = index > 0 ? tags[index - 1] : undefined
  const right = index < tags.length - 1 ? tags[index + 1] : undefined

  tagsViewStore.removeTag(path)

  if (!isActive) {
    return
  }

  const fallback = { path: '/dashboard' }
  const target =
    left || right || tagsViewStore.visitedTags[tagsViewStore.visitedTags.length - 1] || fallback

  router.push(target.path)
}
</script>

<template>
  <div class="layout-tags-view">
    <div class="layout-tags-view__scroll">
      <el-tag
        v-for="tag in tagsViewStore.visitedTags"
        :key="tag.path"
        class="layout-tags-view__tag"
        :closable="!tag.affix"
        :effect="tag.path === route.fullPath ? 'dark' : 'plain'"
        @click="goTag(tag.path)"
        @close="closeTag(tag.path, $event)"
      >
        {{ t(tag.titleKey, tag.title) }}
      </el-tag>
    </div>
  </div>
</template>

<style scoped lang="scss">
.layout-tags-view {
  flex-shrink: 0;
  height: 40px;
  padding: 0 12px;
  background: var(--app-card-bg-color);
  border-bottom: 1px solid var(--app-border-color);
}

.layout-tags-view__scroll {
  display: flex;
  gap: 8px;
  align-items: center;
  height: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: thin;
}

.layout-tags-view__tag {
  flex-shrink: 0;
  cursor: pointer;
  user-select: none;
}
</style>
