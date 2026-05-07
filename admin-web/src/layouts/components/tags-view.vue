<script setup lang="ts">
import { Close, FolderDelete, Refresh, Remove } from '@element-plus/icons-vue'
import { useRoute, useRouter } from 'vue-router'

import { useAppI18n } from '@/composables/use-app-i18n'
import { useTagsViewStore } from '@/stores'

const route = useRoute()
const router = useRouter()
const tagsViewStore = useTagsViewStore()
const { t } = useAppI18n()

const findNextTag = (path: string) => {
  const tags = tagsViewStore.visitedTags
  const index = tags.findIndex((tag) => tag.path === path)
  const left = index > 0 ? tags[index - 1] : undefined
  const right = index < tags.length - 1 ? tags[index + 1] : undefined

  return left || right || tagsViewStore.visitedTags[tagsViewStore.visitedTags.length - 1]
}

const goTag = (path: string) => {
  if (path !== route.fullPath) {
    router.push(path)
  }
}

const closeTag = (path: string, event: Event) => {
  event.stopPropagation()
  const isActive = route.fullPath === path
  const nextTag = findNextTag(path)

  tagsViewStore.removeTag(path)

  if (!isActive) {
    return
  }

  const fallback = { path: '/dashboard' }
  const target = nextTag || fallback

  router.push(target.path)
}

const refreshCurrent = () => {
  tagsViewStore.refreshCurrentTag()
}

const closeCurrent = () => {
  closeTag(route.fullPath, new Event('close'))
}

const closeOthers = () => {
  tagsViewStore.removeOtherTags(route.fullPath)
}

const closeAll = () => {
  tagsViewStore.removeAllTags()
  router.push('/dashboard')
}
</script>

<template>
  <div class="tags-view">
    <div class="tags-view__scroll">
      <el-tag
        v-for="tag in tagsViewStore.visitedTags"
        :key="tag.path"
        class="tags-view__tag"
        :closable="!tag.affix"
        :effect="tag.path === route.fullPath ? 'dark' : 'plain'"
        @click="goTag(tag.path)"
        @close="closeTag(tag.path, $event)"
      >
        {{ t(tag.titleKey, tag.title) }}
      </el-tag>
    </div>
    <div class="tags-view__actions">
      <el-tooltip content="刷新当前" placement="bottom">
        <el-button :icon="Refresh" text @click="refreshCurrent" />
      </el-tooltip>
      <el-tooltip content="关闭当前" placement="bottom">
        <el-button :icon="Close" text @click="closeCurrent" />
      </el-tooltip>
      <el-tooltip content="关闭其他" placement="bottom">
        <el-button :icon="Remove" text @click="closeOthers" />
      </el-tooltip>
      <el-tooltip content="关闭全部" placement="bottom">
        <el-button :icon="FolderDelete" text @click="closeAll" />
      </el-tooltip>
    </div>
  </div>
</template>

<style scoped lang="scss">
.tags-view {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-shrink: 0;
  height: 40px;
  padding: 0 12px;
  background: var(--app-card-bg-color);
  border-bottom: 1px solid var(--app-border-color);
}

.tags-view__scroll {
  display: flex;
  gap: 8px;
  align-items: center;
  flex: 1;
  min-width: 0;
  height: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: thin;
}

.tags-view__tag {
  flex-shrink: 0;
  cursor: pointer;
  user-select: none;
}

.tags-view__actions {
  display: flex;
  flex-shrink: 0;
  gap: 2px;
  align-items: center;
  height: 100%;

  :deep(.el-button) {
    width: 28px;
    height: 28px;
    margin-left: 0;
    color: var(--app-text-color-secondary);
  }
}
</style>
