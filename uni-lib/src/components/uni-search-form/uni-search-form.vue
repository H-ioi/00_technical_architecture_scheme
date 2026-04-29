<script setup lang="ts">
import { computed, ref } from "vue";

import UniForm from "@/components/uni-form/uni-form.vue";
import type { Recordable, UniFormConfig } from "@/types/shared";

const props = withDefaults(
  defineProps<{
    modelValue: Recordable;
    config: UniFormConfig;
    collapsed?: boolean;
    collapsedRows?: number;
    showSelectedTags?: boolean;
    submitText?: string;
    resetText?: string;
  }>(),
  {
    submitText: "查询",
    resetText: "重置",
  },
);

const emit = defineEmits<{
  "update:modelValue": [value: Recordable];
  search: [value: Recordable];
  reset: [];
  "update:collapsed": [value: boolean];
  "field-change": [
    payload: { field: string; value: unknown; model: Recordable },
  ];
}>();

const innerCollapsed = ref(props.collapsed ?? false);
const formModel = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const toggleCollapsed = () => {
  innerCollapsed.value = !innerCollapsed.value;
  emit("update:collapsed", innerCollapsed.value);
};

const handleReset = () => {
  formModel.value = {};
  emit("reset");
};
</script>

<template>
  <div class="uni-search-form">
    <UniForm
      v-model="formModel"
      :config="config"
      @field-change="(payload) => emit('field-change', payload)"
      @submit="emit('search', formModel)"
    >
      <template #actions="{ submit }">
        <slot
          name="actions"
          :search="submit"
          :reset="handleReset"
          :collapsed="innerCollapsed"
        >
          <div class="uni-search-form__actions">
            <el-button type="primary" @click="submit">{{
              submitText
            }}</el-button>
            <el-button @click="handleReset">{{ resetText }}</el-button>
            <el-button link type="primary" @click="toggleCollapsed">
              {{ innerCollapsed ? "展开" : "收起" }}
            </el-button>
          </div>
        </slot>
      </template>
    </UniForm>
  </div>
</template>
