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
import { ref } from "vue";
import type { UniFormConfig } from "uni-ui-lib";

const query = ref<Record<string, unknown>>({});
const searchConfig: UniFormConfig = {
  formProps: { labelWidth: "auto" },
  schema: [
    {
      field: "name",
      label: "名称",
      component: "ElInput",
      colProps: { span: 8 },
    },
  ],
  colProps: { span: 8 },
};

function onSearch() {}
</script>
