<script setup lang="ts">
import type { UniTableColumn } from "uni-ui-lib";

const columns: UniTableColumn[] = [
  {
    prop: "name",
    label: "项目名称",
    minWidth: 140,
    showOverflowTooltip: true,
  },
  {
    prop: "description",
    label: "说明",
    minWidth: 180,
    showOverflowTooltip: true,
  },
  {
    prop: "owner",
    label: "负责人",
    width: 100,
  },
];

const data = [
  {
    id: 1,
    name: "跨端后台统一业务组件库建设与迁移专项",
    description:
      "这是一段较长的项目说明，用来演示表格单元格内容超过列宽后自动省略，并在鼠标悬停时展示完整内容。",
    owner: "Alice",
  },
  {
    id: 2,
    name: "统一权限、主题与国际化治理",
    description:
      "列配置 showOverflowTooltip 为 true 时，会启用单行省略与 tooltip 提示。",
    owner: "Bob",
  },
];
</script>

<template>
  <UniDataTable :columns="columns" :data="data" :pagination="false" />
</template>
