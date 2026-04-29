<template>
  <UniDataTable
    :columns="columns"
    :data="data"
    :pagination="false"
    row-key="id"
  />
</template>

<script setup lang="ts">
import type { UniTableColumn } from "uni-ui-lib";

const columns: UniTableColumn[] = [
  { prop: "name", label: "名称", type: "text", minWidth: 120 },
  { prop: "status", label: "状态", type: "text", minWidth: 100 },
];

const data = [{ id: 1, name: "示例", status: "启用" }];
</script>
