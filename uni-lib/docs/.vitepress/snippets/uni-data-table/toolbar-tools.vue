<template>
  <UniDataTable
    :columns="columns"
    :data="data"
    :pagination="false"
    :toolbar="toolbar"
    row-key="id"
  >
    <template #toolbar>
      <el-button type="primary" size="small">新增</el-button>
      <el-button size="small">批量导入</el-button>
    </template>
  </UniDataTable>
</template>

<script setup lang="ts">
import type {
  UniTableColumn,
  UniTableToolbarConfig,
} from "uni-ui-lib";

const columns: UniTableColumn[] = [
  { prop: "name", label: "名称", type: "text", minWidth: 120 },
  { prop: "status", label: "状态", type: "text", minWidth: 100 },
  { prop: "updatedAt", label: "更新时间", type: "text", minWidth: 160 },
];

const data = [
  { id: 1, name: "示例一行", status: "启用", updatedAt: "2026-04-29 10:00" },
  { id: 2, name: "示例二行", status: "停用", updatedAt: "2026-04-28 15:30" },
];

const toolbar: UniTableToolbarConfig = {
  refresh: true,
  density: true,
  columnSetting: true,
  fullscreen: true,
  export: true,
  print: true,
  exportFileName: "uni-data-table-demo",
};
</script>
