<template>
  <el-aside class="uni-layout__sidebar" :width="collapsed ? '64px' : sidebarWidth">
    <div class="uni-layout__brand">
      <slot name="logo">
        <div class="uni-layout__brand-inner" :class="{ 'is-collapsed': collapsed }">
          <UniIcon :icon="UniLogo" class="uni-layout__brand-icon" :size="brandIconSize" />
          <div v-if="!collapsed" class="uni-layout__brand-text">
            <div class="uni-layout__brand-name">{{ resolvedBrandName }}</div>
            <div class="uni-layout__brand-desc">{{ resolvedBrandDescription }}</div>
          </div>
        </div>
      </slot>
    </div>

    <div class="uni-layout__menu-wrap">
      <el-menu
        class="uni-layout__menu"
        :collapse="collapsed"
        :default-active="activeMenu"
        @select="(path: string) => emit('menuSelect', path)">
        <Menu :menus="menus" :icon-map="iconMap" :translate="translate">
          <template v-if="$slots['menu-icon']" #menu-icon="slotProps">
            <slot name="menu-icon" v-bind="slotProps" />
          </template>
          <template v-if="$slots['menu-title']" #menu-title="slotProps">
            <slot name="menu-title" v-bind="slotProps" />
          </template>
        </Menu>
      </el-menu>
    </div>
  </el-aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { UniIcon } from '@/components/uni-icon'
import { UniLogo } from '@/icons'
import type { UniLayoutIconMap, UniLayoutMenuRecord, UniLayoutTranslate } from '@/types/uni-layout'
import Menu from './menu.vue'

defineOptions({
  name: 'SidebarPanel'
})

const props = withDefaults(
  defineProps<{
    collapsed?: boolean
    sidebarWidth?: string
    layout?: 'default' | 'isa-light' | 'ems-dark' | 'mas-dark'
    brandName?: string
    brandDescription?: string
    menus: UniLayoutMenuRecord[]
    activeMenu?: string
    iconMap?: UniLayoutIconMap
    translate: UniLayoutTranslate
  }>(),
  {
    collapsed: false,
    sidebarWidth: '220px',
    layout: 'default',
    brandName: '',
    brandDescription: '',
    activeMenu: '',
    iconMap: () => ({})
  }
)

const emit = defineEmits<{
  menuSelect: [path: string]
}>()

const resolvedBrandName = computed(() => {
  if (props.brandName) {
    return props.brandName
  }

  if (props.layout === 'ems-dark') {
    return 'EMS'
  }

  if (props.layout === 'mas-dark') {
    return 'MAS'
  }

  return 'ISA SMS'
})

const resolvedBrandDescription = computed(() => {
  if (props.brandDescription) {
    return props.brandDescription
  }

  if (props.layout === 'ems-dark') {
    return '教学业务管理系统'
  }

  if (props.layout === 'mas-dark') {
    return '市场招生管理系统'
  }

  return '爱莎学校运营管理系统'
})

const brandIconSize = computed(() => {
  if (props.collapsed) {
    return 32
  }

  if (props.layout === 'ems-dark' || props.layout === 'mas-dark') {
    return 44
  }

  if (props.layout === 'isa-light') {
    return 40
  }

  return 36
})
</script>
