<template>
  <el-autocomplete
    v-model="keyword"
    class="uni-layout__global-search"
    popper-class="uni-layout-global-search-popper"
    :placeholder="placeholder"
    :fetch-suggestions="querySearch"
    :trigger-on-focus="false"
    clearable
    @select="handleSelect">
    <template #prefix>
      <el-icon>
        <Search />
      </el-icon>
    </template>
    <template #default="{ item }">
      <div class="uni-layout__global-search-item">
        <span class="uni-layout__global-search-title">{{ item.title }}</span>
        <small v-if="item.parentPath" class="uni-layout__global-search-path">{{ item.parentPath }}</small>
      </div>
    </template>
  </el-autocomplete>
</template>

<script setup lang="ts">
import { Search } from '@element-plus/icons-vue'
import { computed, ref } from 'vue'

import type { UniLayoutMenuRecord, UniLayoutTranslate } from '@/types/uni-layout'

defineOptions({
  name: 'LayoutSearch'
})

interface LayoutSearchItem {
  path: string
  title: string
  parentPath: string
  value: string
}

const props = withDefaults(
  defineProps<{
    menus?: UniLayoutMenuRecord[]
    translate: UniLayoutTranslate
    placeholder?: string
  }>(),
  {
    menus: () => [],
    placeholder: ''
  }
)

const emit = defineEmits<{
  select: [path: string]
}>()

const keyword = ref('')

const placeholder = computed(
  () => props.placeholder || props.translate('layout.globalSearchPlaceholder', 'Search menus')
)

const resolveTitle = (menu: UniLayoutMenuRecord) =>
  props.translate(menu.meta?.titleKey, menu.meta?.title ?? menu.name ?? menu.path)

const flattenMenus = (
  menus: UniLayoutMenuRecord[],
  parentTitles: string[] = []
): Omit<LayoutSearchItem, 'value'>[] => {
  const result: Omit<LayoutSearchItem, 'value'>[] = []

  for (const menu of menus) {
    if (menu.meta?.hidden) {
      continue
    }

    const title = resolveTitle(menu)

    if (menu.children?.length) {
      result.push(...flattenMenus(menu.children, [...parentTitles, title]))
      continue
    }

    if (!menu.path) {
      continue
    }

    result.push({
      path: menu.path,
      title,
      parentPath: parentTitles.join(' / ')
    })
  }

  return result
}

const searchItems = computed(() =>
  flattenMenus(props.menus).map((item) => ({
    ...item,
    value: item.title
  }))
)

const querySearch = (queryString: string, cb: (results: LayoutSearchItem[]) => void) => {
  const keywordText = queryString.trim().toLowerCase()

  if (!keywordText) {
    cb([])
    return
  }

  cb(
    searchItems.value
      .filter(
        (item) =>
          item.title.toLowerCase().includes(keywordText) ||
          item.parentPath.toLowerCase().includes(keywordText) ||
          item.path.toLowerCase().includes(keywordText)
      )
      .slice(0, 20)
  )
}

const handleSelect = (item: LayoutSearchItem) => {
  keyword.value = ''
  emit('select', item.path)
}
</script>
