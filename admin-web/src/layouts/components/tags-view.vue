<script setup lang="ts">
import { ArrowLeft, ArrowRight, MoreFilled, Refresh } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useAppI18n } from '@/composables/use-app-i18n'
import { useTagsViewStore } from '@/stores'

const route = useRoute()
const router = useRouter()
const tagsViewStore = useTagsViewStore()
const { t } = useAppI18n()
const scrollRef = ref<HTMLElement>()

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

const closeOthers = () => {
  tagsViewStore.removeOtherTags(route.fullPath)
}

const closeAll = () => {
  tagsViewStore.removeAllTags()
  router.push('/dashboard')
}

const scrollTags = (direction: 'left' | 'right') => {
  scrollRef.value?.scrollBy({
    left: direction === 'left' ? -180 : 180,
    behavior: 'smooth'
  })
}

const handleMoreCommand = (command: string | number | object) => {
  if (command === 'closeOthers') {
    closeOthers()
    return
  }

  if (command === 'closeAll') {
    closeAll()
  }
}
</script>

<template>
  <div class="tags-view">
    <div ref="scrollRef" class="tags-view__scroll">
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
      <el-button
        :icon="ArrowLeft"
        text
        :aria-label="t('common.scrollLeft')"
        @click="scrollTags('left')"
      />
      <el-button
        :icon="ArrowRight"
        text
        :aria-label="t('common.scrollRight')"
        @click="scrollTags('right')"
      />
      <el-dropdown
        trigger="click"
        popper-class="tags-view-more-dropdown"
        @command="handleMoreCommand"
      >
        <el-button :icon="MoreFilled" text :aria-label="t('common.more')" />
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="closeOthers">{{ t('common.closeOthers') }}</el-dropdown-item>
            <el-dropdown-item command="closeAll">{{ t('common.closeAll') }}</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <el-button :icon="Refresh" text :aria-label="t('common.refresh')" @click="refreshCurrent" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.tags-view {
  display: flex;
  gap: 0;
  align-items: center;
  flex-shrink: 0;
  height: 40px;
  padding: 0 10px;
  background: var(--app-card-bg-color);
  border-bottom: 1px solid var(--app-border-color);

  &__scroll {
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

  &__scroll::-webkit-scrollbar {
    display: none;
  }

  &__tag {
    flex-shrink: 0;
    cursor: pointer;
    user-select: none;
  }

  &__actions {
    display: flex;
    flex-shrink: 0;
    gap: 6px;
    align-items: center;
    height: 100%;
    padding-left: 8px;
    margin-left: 8px;
    position: relative;

    :deep(.el-button) {
      width: 30px;
      height: 30px;
      margin-left: 0;
      color: #8ca0b3;
      font-size: 14px;
    }

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      width: 1px;
      height: 60%;
      transform: translateY(-50%);
      background: var(--app-border-color);
    }
  }
}
</style>
