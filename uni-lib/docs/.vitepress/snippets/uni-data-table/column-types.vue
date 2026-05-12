<template>
  <UniDataTable :columns="columns" :data="data" :pagination="false" row-key="id" />
</template>

<script setup lang="ts">
import type { UniTableColumn } from 'uni-ui-lib'

const columns: UniTableColumn[] = [
  { prop: 'orderNo', label: '订单号', type: 'copy', minWidth: 140 },
  { prop: 'amount', label: '金额', type: 'money', minWidth: 100 },
  { prop: 'rate', label: '完成率', type: 'percent', minWidth: 100 },
  {
    prop: 'owner',
    label: '负责人',
    type: 'text',
    formatter: (_row, _column, value) => `@${value}`,
    minWidth: 100
  },
  {
    prop: 'url',
    label: '链接',
    type: 'link',
    minWidth: 120,
    link: { target: '_blank' }
  },
  {
    prop: 'tags',
    label: '标签',
    type: 'array',
    minWidth: 160,
    array: { renderMode: 'tag' }
  },
  { prop: 'extra', label: '扩展信息', type: 'json', minWidth: 160 }
]

const data = [
  {
    id: 1,
    orderNo: 'ORD-20260429-001',
    amount: 1280.5,
    rate: 0.86,
    owner: 'Alice',
    url: 'https://example.com',
    tags: ['重点', '已同步'],
    extra: { source: 'ERP', priority: 1 }
  }
]
</script>
