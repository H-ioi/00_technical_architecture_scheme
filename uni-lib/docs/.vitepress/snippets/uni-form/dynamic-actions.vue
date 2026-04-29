<template>
  <UniForm v-model="model" :config="config" @field-change="onFieldChange" />
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { UniFormConfig } from "uni-ui-lib";

const model = ref<Record<string, unknown>>({
  type: "normal",
  owner: "",
  reason: "",
});

const config: UniFormConfig = {
  schema: [
    {
      field: "type",
      label: "类型",
      component: "ElSelect",
      options: [
        { label: "普通", value: "normal" },
        { label: "特殊", value: "special" },
      ],
      componentProps: { placeholder: "请选择类型" },
      colProps: { span: 12 },
      onChange: ({ value, actions }) => {
        actions.setDisabled("owner", value === "special");
        actions.setVisible("reason", value === "special");
        if (value === "special") {
          actions.setValue("reason", "特殊类型需填写原因");
        } else {
          actions.clearValue("reason");
        }
      },
    },
    {
      field: "owner",
      label: "负责人",
      component: "ElInput",
      componentProps: { placeholder: "特殊类型时禁用" },
      colProps: { span: 12 },
    },
    {
      field: "reason",
      label: "原因",
      component: "ElInput",
      visible: false,
      componentProps: { type: "textarea", rows: 2 },
      colProps: { span: 24 },
    },
  ],
  rowProps: { gutter: 12 },
  colProps: { span: 12 },
};

function onFieldChange(payload: { field: string; value: unknown }) {
  console.info("field-change", payload);
}
</script>
