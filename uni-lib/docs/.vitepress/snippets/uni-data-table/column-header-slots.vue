<template>
  <UniDataTable :columns="columns" :data="data" :pagination="false" row-key="id">
    <template #header-status>
      <span>状态 <el-tag size="small" type="info">列头插槽</el-tag></span>
    </template>
    <template #column-remark="{ row }">
      <el-tag type="success">{{ row.remark || '—' }}</el-tag>
    </template>
  </UniDataTable>
</template>

<script setup lang="ts">
import type { UniTableColumn } from 'uni-ui-lib'

const columns: UniTableColumn[] = [
  { prop: 'name', label: '名称', type: 'text', minWidth: 100 },
  { prop: 'status', label: '状态', type: 'text', minWidth: 80 },
  { prop: 'remark', label: '备注列单元格', minWidth: 140 }
]

const data = [{ id: 1, name: 'A', status: 'ok', remark: '自定义列' }]
</script>
