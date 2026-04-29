<template>
  <UniDataTable
    :columns="columns"
    :data="data"
    :value-enums="valueEnums"
    :pagination="false"
    row-key="id"
  />
</template>

<script setup lang="ts">
import type { UniOption, UniTableColumn } from "uni-ui-lib";

/** 列上未写 options 时，可用 valueEnums 按 prop 注入选项（如 tag/enum 展示） */
const columns: UniTableColumn[] = [
  { prop: "code", label: "编码", type: "text", minWidth: 80 },
  { prop: "state", label: "状态", type: "enum", minWidth: 100 },
];

const valueEnums: Record<string, UniOption[]> = {
  state: [
    { label: "草稿", value: "d" },
    { label: "已发布", value: "p" },
  ],
};

const data = [
  { id: 1, code: "A1", state: "d" },
  { id: 2, code: "A2", state: "p" },
];
</script>
