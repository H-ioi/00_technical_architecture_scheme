<script setup lang="ts">
import { DataBoard, Grid } from '@element-plus/icons-vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import { useAppI18n } from '@/composables/use-app-i18n'
import { useAppStore, usePermissionStore } from '@/stores'

const route = useRoute()
const appStore = useAppStore()
const permissionStore = usePermissionStore()
const { t } = useAppI18n()

const activeMenu = computed(() => route.meta.activeMenu || route.path)
const appTitle = computed(() => t('app.title'))
const collapsedTitle = computed(() => Array.from(appTitle.value)[0] ?? 'A')
const canViewDashboard = computed(() => permissionStore.hasPermission('dashboard:view'))
const canViewUniLibDemo = computed(() => permissionStore.hasPermission('uni-lib:demo:view'))
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
      <el-menu-item v-if="canViewDashboard" index="/dashboard">
        <el-icon><DataBoard /></el-icon>
        <template #title>{{ t('route.dashboard') }}</template>
      </el-menu-item>
      <el-sub-menu v-if="canViewUniLibDemo" index="/uni-lib-demo">
        <template #title>
          <el-icon><Grid /></el-icon>
          <span>{{ t('route.uniLibDemo') }}</span>
        </template>
        <el-sub-menu index="/uni-lib-demo/table-basic">
          <template #title>{{ t('route.basicTableConfig') }}</template>
          <el-menu-item index="/uni-lib-demo/standard-table">
            {{ t('route.standardTable') }}
          </el-menu-item>
          <el-menu-item index="/uni-lib-demo/plain-table">
            {{ t('route.plainTable') }}
          </el-menu-item>
          <el-menu-item index="/uni-lib-demo/no-pagination-table">
            {{ t('route.noPaginationTable') }}
          </el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="/uni-lib-demo/table-tree">
          <template #title>{{ t('route.treeTableConfig') }}</template>
          <el-menu-item index="/uni-lib-demo/tree-table">
            {{ t('route.treeTable') }}
          </el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="/uni-lib-demo/table-form">
          <template #title>{{ t('route.tableFormConfig') }}</template>
          <el-menu-item index="/uni-lib-demo/table-link-detail">
            {{ t('route.tableLinkForm') }}
          </el-menu-item>
          <el-menu-item index="/uni-lib-demo/table-dialog-detail">
            {{ t('route.tableDialogForm') }}
          </el-menu-item>
        </el-sub-menu>
      </el-sub-menu>
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
