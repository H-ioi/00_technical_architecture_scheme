<template>
  <div>
    <p style="margin: 0 0 8px; font-size: 13px">已选 id：{{ selectedIds }}</p>
    <UniDataTable
      :columns="columns"
      :data="data"
      selection="multiple"
      :pagination="false"
      row-key="id"
      @selection-change="onSel"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { Recordable } from "uni-ui-lib";
import type { UniTableColumn } from "uni-ui-lib";

const columns: UniTableColumn[] = [
  { prop: "name", label: "名称", type: "text" },
];

const data = [
  { id: 1, name: "可选 A" },
  { id: 2, name: "可选 B" },
];

const selectedIds = ref<string>("无");

function onSel(rows: Recordable[]) {
  selectedIds.value = rows.map((r) => String(r.id)).join(", ") || "无";
}
</script>
