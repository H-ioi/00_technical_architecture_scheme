<template>
  <UniForm v-model="model" :config="config" />
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { UniFormConfig } from "uni-ui-lib";

const model = ref<Record<string, unknown>>({
  level: 1,
  qty: 10,
});

const config: UniFormConfig = {
  schema: [
    {
      field: "level",
      label: "等级",
      component: "ElRadioGroup",
      options: [
        { label: "低", value: 1 },
        { label: "中", value: 2 },
        { label: "高", value: 3 },
      ],
      colProps: { span: 24 },
    },
    {
      field: "qty",
      label: "数量",
      component: "ElInputNumber",
      componentProps: { min: 1, max: 999 },
      colProps: { span: 12 },
    },
  ],
  colProps: { span: 12 },
};
</script>
