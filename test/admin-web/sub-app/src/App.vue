<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import Home from './views/Home.vue'
import Settings from './views/Settings.vue'

/** 子应用内用 hash 区分「域内页面」，避免与主应用 history 抢同一套路径 */
const hash = ref(typeof window !== 'undefined' ? window.location.hash : '')

function syncHash() {
  hash.value = window.location.hash || ''
}

const page = computed(() => {
  const h = hash.value
  if (h.startsWith('#/settings')) return 'settings'
  return 'home'
})

function goSubPage(key) {
  window.location.hash = key === 'settings' ? '#/settings' : '#/'
}

onMounted(() => {
  window.addEventListener('hashchange', syncHash)
  syncHash()
})

onUnmounted(() => {
  window.removeEventListener('hashchange', syncHash)
})
</script>

<template>
  <a-layout class="sub-shell">
    <a-layout-sider width="200" theme="light" style="border-right: 1px solid #f0f0f0">
      <div style="padding: 12px 16px; font-weight: 600">子应用菜单（域内）</div>
      <a-menu :selected-keys="[page]" mode="inline" @click="(e) => goSubPage(e.key)">
        <a-menu-item key="home">首页</a-menu-item>
        <a-menu-item key="settings">设置</a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout-content style="padding: 16px">
      <Home v-if="page === 'home'" />
      <Settings v-else />
    </a-layout-content>
  </a-layout>
</template>

<style scoped>
.sub-shell {
  min-height: 360px;
}
</style>
