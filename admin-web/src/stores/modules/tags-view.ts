import { defineStore } from 'pinia'
import { ref } from 'vue'

import type { TagView } from '@/types/tags-view'

export const useTagsViewStore = defineStore('tagsView', () => {
  const visitedTags = ref<TagView[]>([])
  const refreshKey = ref(0)

  const addTag = (tag: TagView) => {
    if (visitedTags.value.some((item) => item.path === tag.path)) {
      return
    }

    visitedTags.value.push(tag)
  }

  const removeTag = (path: string) => {
    const tag = visitedTags.value.find((item) => item.path === path)

    if (tag?.affix) {
      return
    }

    visitedTags.value = visitedTags.value.filter((item) => item.path !== path)
  }

  const removeOtherTags = (path: string) => {
    visitedTags.value = visitedTags.value.filter((tag) => tag.affix || tag.path === path)
  }

  const removeAllTags = () => {
    visitedTags.value = visitedTags.value.filter((tag) => tag.affix)
  }

  const refreshCurrentTag = () => {
    refreshKey.value += 1
  }

  const resetTags = () => {
    visitedTags.value = visitedTags.value.filter((tag) => tag.affix)
  }

  return {
    visitedTags,
    refreshKey,
    addTag,
    removeTag,
    removeOtherTags,
    removeAllTags,
    refreshCurrentTag,
    resetTags
  }
})
