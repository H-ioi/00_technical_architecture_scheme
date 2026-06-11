<template>
  <el-aside class="uni-layout__sidebar" :width="collapsed ? '64px' : sidebarWidth">
    <div class="uni-layout__brand">
      <slot name="logo">
        <img v-if="logo" class="uni-layout__logo" :src="logo" :alt="logoAlt" />
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
import type { UniLayoutIconMap, UniLayoutMenuRecord, UniLayoutTranslate } from '@/types/uni-layout'
import Menu from './menu.vue'

defineOptions({
  name: 'SidebarPanel'
})

withDefaults(
  defineProps<{
    collapsed?: boolean
    sidebarWidth?: string
    logo?: string
    logoAlt?: string
    menus: UniLayoutMenuRecord[]
    activeMenu?: string
    iconMap?: UniLayoutIconMap
    translate: UniLayoutTranslate
  }>(),
  {
    collapsed: false,
    sidebarWidth: '220px',
    logo: '',
    logoAlt: 'logo',
    activeMenu: '',
    iconMap: () => ({})
  }
)

const emit = defineEmits<{
  menuSelect: [path: string]
}>()
</script>
