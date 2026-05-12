<template>
  <!-- 传入 request 且 total > pageSize 时，表格底部展示分页器 -->
  <UniDataTable :columns="columns" :request="loadPage" row-key="id" />
</template>

<script setup lang="ts">
import type { UniTableColumn, UniTableRequest } from 'uni-ui-lib'

const columns: UniTableColumn[] = [
  { prop: 'name', label: '名称', type: 'text', minWidth: 140 },
  { prop: 'status', label: '状态', type: 'text', minWidth: 100 },
  { prop: 'updatedAt', label: '更新时间', type: 'text', minWidth: 160 }
]

/** 模拟总记录 50 条；默认每页 10 条 → 共 5 页，可切换每页条数 */
const allRecords = Array.from({ length: 50 }).map((_, i) => ({
  id: i + 1,
  name: `数据项 ${i + 1}`,
  status: i % 2 === 0 ? '启用' : '停用',
  updatedAt: '2026-04-29 10:00'
}))

const loadPage: UniTableRequest = async ({ pageNo, pageSize }) => {
  await new Promise((r) => setTimeout(r, 250))
  const start = (pageNo - 1) * pageSize

  return {
    records: allRecords.slice(start, start + pageSize),
    total: allRecords.length
  }
}
</script>
