<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import MenuTree from './menu-tree.vue'

import logoUrl from '@/assets/images/logo-top.png'
import { useAppStore, usePermissionStore } from '@/stores'

const route = useRoute()
const appStore = useAppStore()
const permissionStore = usePermissionStore()

const activeMenu = computed(() => route.meta.activeMenu || route.path)
</script>

<template>
  <el-aside class="sidebar" :width="appStore.sidebarWidth">
    <div class="sidebar__brand">
      <img class="sidebar__logo" :src="logoUrl" alt="logo" />
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

  &__brand {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 56px;
    padding: 0 12px;
    overflow: hidden;
  }

  &__logo {
    display: block;
    max-width: 100%;
    height: 100%;
    object-fit: contain;
  }

  &__menu {
    border-right: 0;
  }
}
</style>
