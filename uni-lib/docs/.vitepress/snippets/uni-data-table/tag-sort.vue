<template>
  <UniDataTable
    :columns="columns"
    :data="data"
    :pagination="false"
    row-key="id"
    @sort-change="onSort"
  />
</template>

<script setup lang="ts">
import type { UniTableColumn } from "uni-ui-lib";

const columns: UniTableColumn[] = [
  { prop: "name", label: "名称", type: "text", minWidth: 100 },
  {
    prop: "status",
    label: "状态",
    type: "tag",
    sortable: true,
    minWidth: 100,
    options: [
      { label: "启用", value: 1 },
      { label: "停用", value: 0 },
    ],
  },
];

const data = [
  { id: 1, name: "甲", status: 1 },
  { id: 2, name: "乙", status: 0 },
];

function onSort() {
  /* 远程排序时可配合 request 刷新 */
}
</script>
