<template>
  <div>
    <UniSearchForm
      v-model="query"
      :config="config"
      @field-change="onFieldChange"
      @search="onSearch"
      @reset="onReset"
    />
    <p style="margin: 8px 0 0; font-size: 13px">最近变更：{{ lastChange }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { UniFormConfig } from "uni-ui-lib";

const query = ref<Record<string, unknown>>({
  keyword: "",
  status: "",
});
const lastChange = ref("无");

const config: UniFormConfig = {
  schema: [
    {
      field: "keyword",
      label: "",
      component: "ElInput",
      componentProps: { placeholder: "关键词", clearable: true },
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
      componentProps: { placeholder: "状态", clearable: true },
      colProps: { span: 6 },
    },
  ],
  rowProps: { gutter: 12 },
  colProps: { span: 6 },
};

function onFieldChange(payload: { field: string; value: unknown }) {
  lastChange.value = `${payload.field}: ${String(payload.value ?? "")}`;
}

function onSearch(value: Record<string, unknown>) {
  console.info("reload list", value);
}

function onReset() {
  lastChange.value = "已重置";
}
</script>
