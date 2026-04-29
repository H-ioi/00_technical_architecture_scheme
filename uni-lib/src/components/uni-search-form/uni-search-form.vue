<script setup lang="ts">
import { computed, ref } from "vue";

import UniForm from "@/components/uni-form/uni-form.vue";
import type { Recordable, UniFormConfig, UniFormField } from "@/types/shared";

const GRID_COLUMNS = 24;
const DEFAULT_ACTION_MIN_SPAN = 6;

const props = withDefaults(
  defineProps<{
    modelValue: Recordable;
    config: UniFormConfig;
    collapsed?: boolean;
    collapsedRows?: number;
    actionMinSpan?: number;
    showSelectedTags?: boolean;
    submitText?: string;
    resetText?: string;
  }>(),
  {
    collapsedRows: 1,
    actionMinSpan: DEFAULT_ACTION_MIN_SPAN,
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

const getFieldSpan = (field: UniFormField) =>
  Number(field.colProps?.span ?? props.config.colProps?.span ?? GRID_COLUMNS);

const totalFieldSpan = computed(() =>
  props.config.schema.reduce((total, field) => total + getFieldSpan(field), 0),
);

const maxCollapsedFieldSpan = computed(
  () =>
    Math.max(GRID_COLUMNS, props.collapsedRows * GRID_COLUMNS) -
    props.actionMinSpan,
);

const needCollapse = computed(
  () => totalFieldSpan.value > maxCollapsedFieldSpan.value,
);

const visibleSchema = computed(() => {
  if (!needCollapse.value || !innerCollapsed.value) {
    return props.config.schema;
  }

  let usedSpan = 0;
  const visibleFields: UniFormField[] = [];

  for (const field of props.config.schema) {
    const span = getFieldSpan(field);

    if (
      visibleFields.length > 0 &&
      usedSpan + span > maxCollapsedFieldSpan.value
    ) {
      break;
    }

    visibleFields.push(field);
    usedSpan += span;
  }

  return visibleFields.length > 0
    ? visibleFields
    : props.config.schema.slice(0, 1);
});

const searchFormConfig = computed<UniFormConfig>(() => ({
  ...props.config,
  sections: undefined,
  schema: visibleSchema.value,
}));

const handleSearch = () => {
  emit("search", formModel.value);
};

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
    <div class="uni-search-form__body">
      <div class="uni-search-form__fields">
        <UniForm v-model="formModel" :config="searchFormConfig"
          @field-change="(payload) => emit('field-change', payload)" />
      </div>

      <div class="uni-search-form__actions-wrap">
        <slot name="actions" :search="handleSearch" :reset="handleReset" :collapsed="innerCollapsed"
          :need-collapse="needCollapse" :toggle-collapsed="toggleCollapsed">
          <div class="uni-search-form__actions">
            <el-button type="primary" @click="handleSearch">{{
              submitText
              }}</el-button>
            <el-button @click="handleReset">{{ resetText }}</el-button>
            <el-button v-if="needCollapse" link type="primary" @click="toggleCollapsed">
              {{ innerCollapsed ? "展开" : "收起" }}
            </el-button>
          </div>
        </slot>
      </div>
    </div>
  </div>
</template>
