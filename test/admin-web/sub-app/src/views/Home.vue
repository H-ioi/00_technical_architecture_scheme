<script setup>
import { computed } from 'vue'

const flags = computed(() => ({
  wujie: !!window.__POWERED_BY_WUJIE__,
  shared: !!window.__SHARED_DEPS_FROM_MAIN,
  sharedTool: typeof window.$shared === 'object' && window.$shared !== null
}))

/** 壳通过无界下发的 props（仅嵌入在宿主内时存在） */
const shellMenuKey = computed(() => window.$wujie?.props?.shellMenuKey ?? null)

function onPingMain() {
  window.$shared?.callMain?.('ping', { from: 'sub-app', ts: Date.now() })
}
</script>

<template>
  <a-space direction="vertical" size="middle" style="width: 100%">
    <a-typography-title :level="4">子应用首页（依赖加载器 + 共享组件）</a-typography-title>

    <a-alert
      type="info"
      show-icon
      :message="`__POWERED_BY_WUJIE__=${flags.wujie}；__SHARED_DEPS_FROM_MAIN=${flags.shared}；$shared=${flags.sharedTool}；shellMenuKey=${shellMenuKey}`"
    />

    <a-space wrap>
      <UserAvatar />
      <CommonDialog title="CommonDialog（来自 shared-components）" />
    </a-space>

    <DataTable :rows="2" />

    <a-button type="primary" @click="onPingMain">
      调用 $shared.callMain（仅无界子应用 iframe 内有效）
    </a-button>
  </a-space>
</template>
