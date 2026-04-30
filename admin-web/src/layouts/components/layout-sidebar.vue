<script setup lang="ts">
import { DataBoard, Grid } from '@element-plus/icons-vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import { useAppStore } from '@/stores'

const route = useRoute()
const appStore = useAppStore()

const activeMenu = computed(() => route.meta.activeMenu || route.path)
</script>

<template>
  <el-aside class="layout-sidebar" :width="appStore.sidebarWidth">
    <div class="layout-sidebar__brand">
      <span v-if="!appStore.sidebarCollapsed">{{ $route.meta.title ? 'Admin Web' : '' }}</span>
      <span v-else>A</span>
    </div>

    <el-menu
      router
      class="layout-sidebar__menu"
      :collapse="appStore.sidebarCollapsed"
      :default-active="activeMenu"
    >
      <el-menu-item index="/dashboard">
        <el-icon><DataBoard /></el-icon>
        <template #title>工作台</template>
      </el-menu-item>
      <el-sub-menu index="/uni-lib-demo">
        <template #title>
          <el-icon><Grid /></el-icon>
          <span>组件库案例</span>
        </template>
        <el-menu-item index="/uni-lib-demo/standard-table">常规表格页</el-menu-item>
        <el-menu-item index="/uni-lib-demo/plain-table">无搜索表格页</el-menu-item>
        <el-menu-item index="/uni-lib-demo/tree-table">树形表格页</el-menu-item>
        <el-menu-item index="/uni-lib-demo/no-pagination-table">无分页表格页</el-menu-item>
        <el-menu-item index="/uni-lib-demo/table-link-detail">表格跳转表单</el-menu-item>
        <el-menu-item index="/uni-lib-demo/table-dialog-detail">表格弹窗表单</el-menu-item>
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
