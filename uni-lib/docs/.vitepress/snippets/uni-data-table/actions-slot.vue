<template>
  <UniDataTable
    :columns="columns"
    :data="data"
    :pagination="false"
    row-key="id"
  >
    <template #actions="{ row, index }">
      <el-button
        link
        type="primary"
        size="small"
        @click="() => log(row, index)"
      >
        自定义操作
      </el-button>
    </template>
  </UniDataTable>
</template>

<script setup lang="ts">
import type { UniTableColumn } from "uni-ui-lib";

const columns: UniTableColumn[] = [
  { prop: "name", label: "名称", type: "text" },
];

const data = [{ id: 1, name: "一行" }];

function log(row: unknown, index: number) {
  console.info("actions slot", row, index);
}
</script>
