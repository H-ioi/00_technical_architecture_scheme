<template>
  <UniDataTable
    :columns="columns"
    :data="treeData"
    :pagination="false"
    row-key="id"
    :tree="{ defaultExpandAll: true, props: { children: 'children' } }"
    :toolbar="false" />
</template>

<script setup lang="ts">
import type { UniTableColumn } from 'uni-ui-lib'

const columns: UniTableColumn[] = [
  { prop: 'name', label: '名称', type: 'text', minWidth: 160 },
  { prop: 'path', label: '路径', type: 'text', minWidth: 120 }
]

const treeData = [
  {
    id: 1,
    name: '一级目录',
    path: '/a',
    children: [
      { id: 11, name: '子页 1-1', path: '/a/1', children: [] },
      { id: 12, name: '子页 1-2', path: '/a/2', children: [] }
    ]
  },
  { id: 2, name: '一级菜单 B', path: '/b', children: [] }
]
</script>
