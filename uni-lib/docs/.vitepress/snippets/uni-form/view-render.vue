<template>
  <UniForm v-model="model" :config="config" mode="view" />
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { UniFormConfig } from "uni-ui-lib";

const model = ref<Record<string, unknown>>({
  name: "演示项目",
  status: 1,
  startedAt: "2026-04-29 10:00:00",
  remark: "",
});

const config: UniFormConfig = {
  view: {
    emptyText: "未填写",
  },
  schema: [
    {
      field: "name",
      label: "名称",
      component: "ElInput",
      colProps: { span: 12 },
    },
    {
      field: "status",
      label: "状态",
      component: "ElSelect",
      viewType: "enum",
      options: [
        { label: "启用", value: 1 },
        { label: "停用", value: 0 },
      ],
      colProps: { span: 12 },
    },
    {
      field: "startedAt",
      label: "开始时间",
      component: "ElDatePicker",
      viewType: "datetime",
      colProps: { span: 12 },
    },
    {
      field: "remark",
      label: "备注",
      component: "ElInput",
      viewRender: ({ value }) => (value ? `备注：${value}` : "暂无备注"),
      colProps: { span: 12 },
    },
  ],
  rowProps: { gutter: 12 },
  colProps: { span: 12 },
};
</script>
