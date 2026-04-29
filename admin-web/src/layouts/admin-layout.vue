<script setup lang="ts">
import { useRouter } from 'vue-router'

import LayoutContent from './components/layout-content.vue'
import LayoutHeader from './components/layout-header.vue'
import LayoutSidebar from './components/layout-sidebar.vue'
import LayoutTagsView from './components/layout-tags-view.vue'

import { useUserStore } from '@/stores'

const router = useRouter()
const userStore = useUserStore()

const handleLogout = async () => {
  await userStore.logout()
  router.replace('/login')
}
</script>

<template>
  <el-container class="admin-layout" direction="horizontal">
    <LayoutSidebar />

    <el-container class="admin-layout__main-wrap" direction="vertical">
      <LayoutHeader @logout="handleLogout" />
      <LayoutTagsView />
      <LayoutContent />
    </el-container>
  </el-container>
</template>

<style scoped lang="scss">
.admin-layout {
  height: 100vh;
  max-height: 100vh;
  overflow: hidden;
  background: var(--app-bg-color);
}

.admin-layout__main-wrap {
  flex: 1;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
}
</style>
