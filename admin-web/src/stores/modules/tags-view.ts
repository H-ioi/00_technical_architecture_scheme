import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface TagView {
  title: string
  titleKey?: string
  path: string
  affix?: boolean
}

export const useTagsViewStore = defineStore('tagsView', () => {
  const visitedTags = ref<TagView[]>([])

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

  const resetTags = () => {
    visitedTags.value = visitedTags.value.filter((tag) => tag.affix)
  }

  return {
    visitedTags,
    addTag,
    removeTag,
    resetTags
  }
})
