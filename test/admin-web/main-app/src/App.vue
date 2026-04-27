<script setup>
import { computed, ref } from 'vue'
import WujieVue from 'wujie-vue3'
import { createSharedDepsPlugin } from './plugins/wujie-plugin.js'

const subOrigin = import.meta.env.VITE_SUB_ORIGIN || 'http://localhost:3001'
const base = `${subOrigin.replace(/\/$/, '')}/`

/**
 * 主应用「壳菜单」示例：
 * - 通过拼接子应用入口 + hash，让主应用决定打开子应用哪一页（URL 驱动）。
 * - 同时用无界 props 下发 shellMenuKey，子应用可读 window.$wujie.props（演示壳向子传参）。
 */
const shellMenu = [
  { key: 'shell-home', label: '子应用·首页', urlSuffix: '#/' },
  { key: 'shell-settings', label: '子应用·设置', urlSuffix: '#/settings' }
]

const selectedShellKey = ref(shellMenu[0].key)

const subUrl = computed(() => {
  const item = shellMenu.find((i) => i.key === selectedShellKey.value) ?? shellMenu[0]
  return `${base}${item.urlSuffix}`
})

function onShellMenuClick({ key }) {
  selectedShellKey.value = key
}

const wujieProps = computed(() => ({
  getSharedLib: (name) => window.__SHARED_DEPS?.libs?.[name],
  getSharedComponent: (name) => window.__SHARED_DEPS?.components?.[name],
  shellMenuKey: selectedShellKey.value
}))
</script>

<template>
  <a-layout style="min-height: 100vh">
    <a-layout-header style="background: #001529; color: #fff; padding: 0 24px; line-height: 64px">
      主应用（壳）— 左侧为<strong>壳菜单</strong>，右侧嵌入子应用；共享依赖在
      <code>window.__SHARED_DEPS</code>
    </a-layout-header>
    <a-layout>
      <a-layout-sider width="240" theme="light" style="border-right: 1px solid #f0f0f0">
        <div style="padding: 12px 16px; font-weight: 600">主应用菜单（壳）</div>
        <a-menu
          :selected-keys="[selectedShellKey]"
          mode="inline"
          @click="onShellMenuClick"
        >
          <a-menu-item v-for="item in shellMenu" :key="item.key">
            {{ item.label }}
          </a-menu-item>
        </a-menu>
        <div style="padding: 12px 16px; color: rgba(0,0,0,0.45); font-size: 12px">
          当前子应用 URL：<br />
          <code style="word-break: break-all">{{ subUrl }}</code>
        </div>
      </a-layout-sider>
      <a-layout-content style="padding: 16px">
        <a-typography-paragraph type="secondary">
          请先 <code>npm run dev</code> 或同时起主、子。子应用独立打开时无壳 props，属正常现象。
        </a-typography-paragraph>
        <WujieVue
          width="100%"
          height="560px"
          name="admin-sub"
          :url="subUrl"
          :plugins="[createSharedDepsPlugin()]"
          :props="wujieProps"
          :alive="false"
        />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
