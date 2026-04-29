<script setup lang="ts">
import { Expand, Fold } from '@element-plus/icons-vue'
import { useRoute } from 'vue-router'

import { useAppStore, useUserStore } from '@/stores'

const route = useRoute()
const appStore = useAppStore()
const userStore = useUserStore()

const emit = defineEmits<{
  logout: []
}>()
</script>

<template>
  <el-header class="layout-header">
    <div class="layout-header__left">
      <el-button text @click="appStore.toggleSidebar">
        <el-icon><Fold v-if="!appStore.sidebarCollapsed" /><Expand v-else /></el-icon>
      </el-button>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>首页</el-breadcrumb-item>
        <el-breadcrumb-item>{{ route.meta.title }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <el-dropdown trigger="click">
      <button class="layout-header__user" type="button">
        {{ userStore.profile?.name || '管理员' }}
      </button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="emit('logout')">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </el-header>
</template>

<style scoped lang="scss">
.layout-header {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: space-between;
  height: 56px;
  background: var(--app-card-bg-color);
  border-bottom: 1px solid var(--app-border-color);
}

.layout-header__left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.layout-header__user {
  color: var(--app-text-color);
  cursor: pointer;
  background: transparent;
  border: 0;
}
</style>
