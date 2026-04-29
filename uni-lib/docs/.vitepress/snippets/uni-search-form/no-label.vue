<template>
  <UniSearchForm v-model="query" :config="searchConfig" @search="() => { }" />
</template>

<script setup lang="ts">
import type { UniFormConfig } from "uni-ui-lib";
import { ref } from "vue";

/** UniSearchForm 默认 labelWidth 为 0；字段 label 置空，用 placeholder 表达含义 */
const query = ref<Record<string, unknown>>({
  keyword: "",
  status: "",
});

const searchConfig: UniFormConfig = {
  schema: [
    {
      field: "keyword",
      label: "",
      component: "ElInput",
      componentProps: {
        placeholder: "关键词",
        clearable: true,
      },
      colProps: { span: 8 },
    },
    {
      field: "status",
      label: "",
      component: "ElSelect",
      options: [
        { label: "启用", value: "1" },
        { label: "停用", value: "0" },
      ],
      componentProps: {
        clearable: true,
        placeholder: "状态",
      },
      colProps: { span: 6 },
    },
  ],
  colProps: { span: 6 },
  rowProps: { gutter: 12 },
};
</script>
