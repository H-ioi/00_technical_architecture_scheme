<template>
  <UniSearchForm
    v-model="query"
    :config="searchConfig"
    :action-min-span="10"
    :collapsed-rows="1"
    @search="() => {}"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { UniFormConfig } from "uni-ui-lib";

/** actionMinSpan 增大时，留给左侧字段栅格更少，更容易触发「展开/收起」 */
const query = ref<Record<string, unknown>>({});

const searchConfig: UniFormConfig = {
  formProps: { labelWidth: "auto" },
  schema: [
    { field: "a", label: "A", component: "ElInput", colProps: { span: 6 } },
    { field: "b", label: "B", component: "ElInput", colProps: { span: 6 } },
    { field: "c", label: "C", component: "ElInput", colProps: { span: 6 } },
    { field: "d", label: "D", component: "ElInput", colProps: { span: 6 } },
  ],
  colProps: { span: 6 },
};
</script>
