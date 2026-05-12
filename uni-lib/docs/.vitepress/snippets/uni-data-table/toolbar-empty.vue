<template>
  <UniDataTable :columns="columns" :data="[]" :pagination="false" row-key="id">
    <template #toolbar>
      <el-button type="primary" size="small">工具栏插槽</el-button>
    </template>
    <template #empty>
      <el-empty description="自定义空态（#empty）" />
    </template>
  </UniDataTable>
</template>

<script setup lang="ts">
import type { UniTableColumn } from 'uni-ui-lib'

const columns: UniTableColumn[] = [{ prop: 'name', label: '名称', type: 'text', minWidth: 120 }]
</script>
