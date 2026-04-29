<template>
  <UniDataTable
    :columns="columns"
    :request="load"
    row-key="id"
    :pagination="{
      pageSizes: [5, 10],
      position: 'left',
      layout: 'total, prev, pager, next',
    }"
  />
</template>

<script setup lang="ts">
import type { UniTableColumn, UniTableRequest } from "uni-ui-lib";

const columns: UniTableColumn[] = [
  { prop: "name", label: "名称", type: "text" },
];

const all = Array.from({ length: 23 }).map((_, i) => ({
  id: i + 1,
  name: `第 ${i + 1} 条`,
}));

const load: UniTableRequest = async ({ pageNo, pageSize }) => {
  await new Promise((r) => setTimeout(r, 200));
  const start = (pageNo - 1) * pageSize;

  return {
    records: all.slice(start, start + pageSize),
    total: all.length,
  };
};
</script>
