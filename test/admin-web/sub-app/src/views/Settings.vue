<script setup>
import { computed } from 'vue'

const shellKey = computed(() => window.$wujie?.props?.shellMenuKey ?? null)
</script>

<template>
  <a-space direction="vertical" size="middle" style="width: 100%; padding: 8px 0">
    <a-typography-title :level="4">子应用·设置页</a-typography-title>
    <a-alert
      type="success"
      show-icon
      message="此页由子应用左侧「设置」进入，或由主应用壳菜单切换子应用 URL 的 hash 进入。"
    />
    <a-descriptions bordered size="small" title="壳通过无界 props 下发的当前壳菜单 key">
      <a-descriptions-item label="shellMenuKey">
        {{ shellKey ?? '（未在壳内打开，或壳未下发）' }}
      </a-descriptions-item>
    </a-descriptions>
  </a-space>
</template>
