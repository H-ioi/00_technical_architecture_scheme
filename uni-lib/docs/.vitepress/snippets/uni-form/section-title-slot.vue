<template>
  <UniForm v-model="model" :config="config">
    <template #section-title="{ section }">
      <div class="custom-section-title">
        <strong>{{ section.title }}</strong>
        <span v-if="section.description">{{ section.description }}</span>
      </div>
    </template>
  </UniForm>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { UniFormConfig } from "uni-ui-lib";

const model = ref<Record<string, unknown>>({
  name: "",
  code: "",
});

const config: UniFormConfig = {
  sections: [
    {
      title: "基础信息",
      description: "可用插槽替换默认标题",
      fields: ["name"],
    },
    { title: "扩展信息", fields: ["code"] },
  ],
  schema: [
    {
      field: "name",
      label: "名称",
      component: "ElInput",
      colProps: { span: 12 },
    },
    {
      field: "code",
      label: "编码",
      component: "ElInput",
      colProps: { span: 12 },
    },
  ],
  rowProps: { gutter: 12 },
  colProps: { span: 12 },
};
</script>

<style scoped>
.custom-section-title {
  display: flex;
  gap: 8px;
  align-items: center;
  margin: 12px 0;
}

.custom-section-title span {
  font-size: 12px;
  color: var(--vp-c-text-2);
}
</style>
