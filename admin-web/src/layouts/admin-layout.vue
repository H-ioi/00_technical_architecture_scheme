<script setup lang="ts">
import { DataBoard, Expand, Fold } from '@element-plus/icons-vue'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useAppStore, useTagsViewStore, useUserStore } from '@/stores'

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()
const tagsViewStore = useTagsViewStore()
const userStore = useUserStore()

const activeMenu = computed(() => route.meta.activeMenu || route.path)

const handleLogout = async () => {
  await userStore.logout()
  router.replace('/login')
}
</script>

<template>
  <el-container class="admin-layout">
    <el-aside class="admin-layout__aside" :width="appStore.sidebarWidth">
      <div class="admin-layout__brand">
        <span v-if="!appStore.sidebarCollapsed">{{ $route.meta.title ? 'Admin Web' : '' }}</span>
        <span v-else>A</span>
      </div>

      <el-menu
        router
        class="admin-layout__menu"
        :collapse="appStore.sidebarCollapsed"
        :default-active="activeMenu"
      >
        <el-menu-item index="/dashboard">
          <el-icon><DataBoard /></el-icon>
          <template #title>工作台</template>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header class="admin-layout__header">
        <div class="admin-layout__header-left">
          <el-button text @click="appStore.toggleSidebar">
            <el-icon><Fold v-if="!appStore.sidebarCollapsed" /><Expand v-else /></el-icon>
          </el-button>
          <el-breadcrumb separator="/">
            <el-breadcrumb-item>首页</el-breadcrumb-item>
            <el-breadcrumb-item>{{ route.meta.title }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>

        <el-dropdown trigger="click">
          <button class="admin-layout__user" type="button">
            {{ userStore.profile?.name || '管理员' }}
          </button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="handleLogout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-header>

      <div class="admin-layout__tags">
        <el-tag
          v-for="tag in tagsViewStore.visitedTags"
          :key="tag.path"
          :closable="!tag.affix"
          :effect="tag.path === route.fullPath ? 'dark' : 'plain'"
          @close="tagsViewStore.removeTag(tag.path)"
        >
          {{ tag.title }}
        </el-tag>
      </div>

      <el-main class="admin-layout__main">
        <RouterView />
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped lang="scss">
.admin-layout {
  min-height: 100vh;
  background: var(--app-bg-color);
}

.admin-layout__aside {
  overflow: hidden;
  background: var(--app-sidebar-bg-color);
  border-right: 1px solid var(--app-border-color);
  transition: width 0.2s ease;
}

.admin-layout__brand {
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

.admin-layout__menu {
  border-right: 0;
}

.admin-layout__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 56px;
  background: var(--app-card-bg-color);
  border-bottom: 1px solid var(--app-border-color);
}

.admin-layout__header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.admin-layout__user {
  color: var(--app-text-color);
  cursor: pointer;
  background: transparent;
  border: 0;
}

.admin-layout__tags {
  display: flex;
  gap: 8px;
  align-items: center;
  height: 40px;
  padding: 0 16px;
  background: var(--app-card-bg-color);
  border-bottom: 1px solid var(--app-border-color);
}

.admin-layout__main {
  padding: 16px;
}
</style>
