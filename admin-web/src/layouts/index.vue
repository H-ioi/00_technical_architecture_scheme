<script setup lang="ts">
import { useRouter } from 'vue-router'

import Content from './components/content.vue'
import Header from './components/header.vue'
import Sidebar from './components/sidebar.vue'
import TagsView from './components/tags-view.vue'

import { usePermissionStore, useTagsViewStore, useUserStore } from '@/stores'

const router = useRouter()
const permissionStore = usePermissionStore()
const tagsViewStore = useTagsViewStore()
const userStore = useUserStore()

const handleLogout = async () => {
  await userStore.logout()
  permissionStore.resetPermission()
  tagsViewStore.resetTags()
  router.replace('/login')
}
</script>

<template>
  <el-container class="layout" direction="horizontal">
    <Sidebar />

    <el-container class="layout__main" direction="vertical">
      <Header @logout="handleLogout" />
      <TagsView />
      <Content />
    </el-container>
  </el-container>
</template>

<style scoped lang="scss">
.layout {
  height: 100vh;
  max-height: 100vh;
  overflow: hidden;
  background: var(--app-bg-color);
}

.layout__main {
  flex: 1;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
}
</style>
