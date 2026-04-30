<template>
  <UniSearchForm
    v-model="query"
    :config="searchConfig"
    submit-text="筛选"
    reset-text="清空"
    @search="onSearch"
  />
</template>

<script setup lang="ts">
import type { UniFormConfig } from "uni-ui-lib";
import { ref } from "vue";

const query = ref<Record<string, unknown>>({});
const searchConfig: UniFormConfig = {
  formProps: { labelWidth: "auto" },
  schema: [
    {
      field: "name",
      label: "",
      component: "ElInput",
      componentProps: { placeholder: "名称", clearable: true },
      colProps: { span: 8 },
    },
  ],
  colProps: { span: 8 },
};

function onSearch() {}
</script>
