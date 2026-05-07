<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import LayoutMenuTree from './layout-menu-tree.vue'

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
  <el-aside class="layout-sidebar" :width="appStore.sidebarWidth">
    <div class="layout-sidebar__brand">
      <span v-if="!appStore.sidebarCollapsed">{{ appTitle }}</span>
      <span v-else>{{ collapsedTitle }}</span>
    </div>

    <el-menu
      router
      class="layout-sidebar__menu"
      :collapse="appStore.sidebarCollapsed"
      :default-active="activeMenu"
    >
      <LayoutMenuTree :menus="permissionStore.menuRoutes" />
    </el-menu>
  </el-aside>
</template>

<style scoped lang="scss">
.layout-sidebar {
  overflow: hidden;
  background: var(--app-sidebar-bg-color);
  border-right: 1px solid var(--app-border-color);
  transition: width 0.2s ease;
}

.layout-sidebar__brand {
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

.layout-sidebar__menu {
  border-right: 0;
}
</style>
