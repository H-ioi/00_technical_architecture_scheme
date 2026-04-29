<template>
  <UniSearchForm
    v-model="query"
    :config="searchConfig"
    :collapsed-rows="2"
    @search="() => {}"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { UniFormConfig } from "uni-ui-lib";

/** 收起时保留约两行字段区域再折叠其余（仍受 24 栅格与 actionMinSpan 影响） */
const query = ref<Record<string, unknown>>({});

const searchConfig: UniFormConfig = {
  formProps: { labelWidth: "auto" },
  schema: Array.from({ length: 8 }).map((_, i) => ({
    field: `f${i}`,
    label: `项 ${i + 1}`,
    component: "ElInput" as const,
    colProps: { span: 6 },
  })),
  colProps: { span: 6 },
};
</script>
