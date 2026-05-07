<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import MenuTree from './menu-tree.vue'

import { useAppI18n } from '@/composables/use-app-i18n'
import { useAppStore, usePermissionStore } from '@/stores'

const route = useRoute()
const appStore = useAppStore()
const permissionStore = usePermissionStore()
const { t } = useAppI18n()

const activeMenu = computed(() => route.meta.activeMenu || route.path)
const appTitle = computed(() => t('app.title'))
const collapsedTitle = computed(() => Array.from(appTitle.value)[0] ?? 'A')
</script>

<template>
  <el-aside class="sidebar" :width="appStore.sidebarWidth">
    <div class="sidebar__brand">
      <span v-if="!appStore.sidebarCollapsed">{{ appTitle }}</span>
      <span v-else>{{ collapsedTitle }}</span>
    </div>

    <el-menu
      router
      class="sidebar__menu"
      :collapse="appStore.sidebarCollapsed"
      :default-active="activeMenu"
    >
      <MenuTree :menus="permissionStore.menuRoutes" />
    </el-menu>
  </el-aside>
</template>

<style scoped lang="scss">
.sidebar {
  overflow: hidden;
  background: var(--app-sidebar-bg-color);
  border-right: 1px solid var(--app-border-color);
  transition: width 0.2s ease;
}

.sidebar__brand {
  display: flex;
  align-items: center;
  height: 56px;
  padding: 0 20px;
  overflow: hidden;
  color: var(--app-primary-color);
  font-size: 18px;
  font-weight: 700;
  white-space: nowrap;
}

.sidebar__menu {
  border-right: 0;
}
</style>
