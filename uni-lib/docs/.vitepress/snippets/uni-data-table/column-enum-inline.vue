<template>
  <UniDataTable :columns="columns" :data="data" :pagination="false" row-key="id" />
</template>

<script setup lang="ts">
import type { UniTableColumn } from 'uni-ui-lib'

/** 枚举映射写在对应列的 `options` 上 */
const columns: UniTableColumn[] = [
  { prop: 'code', label: '编码', type: 'text', minWidth: 80 },
  {
    prop: 'state',
    label: '状态',
    type: 'enum',
    minWidth: 100,
    options: [
      { label: '草稿', value: 'd' },
      { label: '已发布', value: 'p' }
    ]
  }
]

const data = [
  { id: 1, code: 'A1', state: 'd' },
  { id: 2, code: 'A2', state: 'p' }
]
</script>
