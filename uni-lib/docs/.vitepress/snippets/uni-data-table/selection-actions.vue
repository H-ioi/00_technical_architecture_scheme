<template>
  <UniDataTable
    :columns="columns"
    :data="data"
    selection="multiple"
    :actions="actions"
    :pagination="false"
    row-key="id"
  />
</template>

<script setup lang="ts">
import type { UniTableAction, UniTableColumn } from "uni-ui-lib";

const columns: UniTableColumn[] = [
  { prop: "name", label: "名称", type: "text", minWidth: 120 },
];

const data = [
  { id: 1, name: "行 A" },
  { id: 2, name: "行 B" },
];

const actions: UniTableAction[] = [
  {
    label: "详情",
    type: "primary",
    onClick: (row) => console.info(row),
  },
];
</script>
