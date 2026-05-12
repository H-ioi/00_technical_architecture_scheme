<template>
  <UniDataTable
    :columns="columns"
    :data="data"
    :actions="actions"
    :pagination="false"
    row-key="id" />
</template>

<script setup lang="ts">
import type { UniTableAction, UniTableColumn } from 'uni-ui-lib'

const columns: UniTableColumn[] = [
  { prop: 'name', label: '名称', type: 'text', minWidth: 120 },
  { prop: 'status', label: '状态', type: 'tag', minWidth: 100 }
]

const data = [
  { id: 1, name: '流程 A', status: 'draft' },
  { id: 2, name: '流程 B', status: 'locked' }
]

const actions: UniTableAction[] = [
  { label: '详情', type: 'primary', onClick: (row) => console.info(row) },
  { label: '编辑', type: 'primary', onClick: (row) => console.info(row) },
  {
    label: '提交',
    type: 'success',
    visible: (row) => row.status === 'draft',
    onClick: (row) => console.info(row)
  },
  {
    label: '停用',
    type: 'warning',
    disabled: (row) => row.status === 'locked',
    onClick: (row) => console.info(row)
  },
  { label: '删除', type: 'danger', onClick: (row) => console.info(row) }
]
</script>
