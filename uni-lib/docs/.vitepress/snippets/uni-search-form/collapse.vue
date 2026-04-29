<template>
  <UniSearchForm
    v-model="query"
    :config="searchConfig"
    :collapsed-rows="1"
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
      field: "a",
      label: "条件一",
      component: "ElInput",
      colProps: { span: 6 },
    },
    {
      field: "b",
      label: "条件二",
      component: "ElInput",
      colProps: { span: 6 },
    },
    {
      field: "c",
      label: "条件三",
      component: "ElInput",
      colProps: { span: 6 },
    },
    {
      field: "d",
      label: "条件四",
      component: "ElInput",
      colProps: { span: 6 },
    },
    {
      field: "e",
      label: "条件五",
      component: "ElInput",
      colProps: { span: 6 },
    },
  ],
  colProps: { span: 6 },
  rowProps: { gutter: 12 },
};

function onSearch() {
  /* 查询 */
}
</script>
