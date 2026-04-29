<template>
  <UniSearchForm v-model="query" :config="searchConfig" @search="loadList" />
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { UniFormConfig } from "uni-ui-lib";

const query = ref<Record<string, unknown>>({});

const searchConfig: UniFormConfig = {
  formProps: { labelWidth: "auto" },
  schema: [
    {
      field: "keyword",
      label: "关键词",
      component: "ElInput",
      componentProps: { placeholder: "请输入", clearable: true },
      colProps: { span: 6 },
    },
    {
      field: "status",
      label: "状态",
      component: "ElSelect",
      options: [
        { label: "启用", value: "1" },
        { label: "停用", value: "0" },
      ],
      componentProps: { clearable: true, placeholder: "全部" },
      colProps: { span: 6 },
    },
  ],
  colProps: { span: 6 },
};

function loadList() {
  /* 在此请求列表接口 */
}
</script>
