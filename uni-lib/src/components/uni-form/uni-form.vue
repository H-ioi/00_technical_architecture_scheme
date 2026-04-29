<script setup lang="ts">
import { computed, reactive, ref, watch } from "vue";
import type { FormInstance } from "element-plus";

import UniUpload from "@/components/uni-upload/uni-upload.vue";
import type {
  Recordable,
  UniFormActions,
  UniFormConfig,
  UniFormField,
  UniFormMode,
  UniOption,
} from "@/types/shared";
import { formatDate, formatEmpty, resolveOption } from "@/utils/format";

const props = withDefaults(
  defineProps<{
    modelValue: Recordable;
    config: UniFormConfig;
    mode?: UniFormMode;
  }>(),
  {
    modelValue: () => ({}),
  },
);

const emit = defineEmits<{
  "update:modelValue": [value: Recordable];
  change: [value: Recordable];
  "field-change": [
    payload: { field: string; value: unknown; model: Recordable },
  ];
  "linkage-change": [payload: { field: string; model: Recordable }];
  validate: [valid: boolean];
  submit: [value: Recordable];
  reset: [];
}>();

const formRef = ref<FormInstance>();
const dynamicState = reactive<
  Record<
    string,
    { visible?: boolean; disabled?: boolean; options?: UniOption[] }
  >
>({});

const formMode = computed(() => props.mode ?? props.config.mode ?? "edit");
const formModel = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const actions: UniFormActions = {
  setValue(field, value) {
    formModel.value = { ...formModel.value, [field]: value };
  },
  clearValue(field) {
    const nextModel = { ...formModel.value };
    delete nextModel[field];
    formModel.value = nextModel;
  },
  resetField(field) {
    const formField = props.config.schema.find((item) => item.field === field);
    actions.setValue(field, formField?.defaultValue);
  },
  setVisible(field, visible) {
    dynamicState[field] = { ...dynamicState[field], visible };
  },
  setDisabled(field, disabled) {
    dynamicState[field] = { ...dynamicState[field], disabled };
  },
  setOptions(field, options) {
    dynamicState[field] = { ...dynamicState[field], options };
  },
  validateField(field) {
    formRef.value?.validateField(field);
  },
};

const createContext = (field: UniFormField) => ({
  model: formModel.value,
  field,
  value: formModel.value[field.field],
  actions,
});

const resolveBoolean = (
  value: UniFormField["visible"],
  field: UniFormField,
  fallback: boolean,
) => {
  if (typeof value === "function") {
    return value(createContext(field));
  }

  if (typeof value === "boolean") {
    return value;
  }

  return fallback;
};

const isFieldVisible = (field: UniFormField) => {
  const dynamicVisible = dynamicState[field.field]?.visible;
  if (typeof dynamicVisible === "boolean") {
    return dynamicVisible;
  }

  if (resolveBoolean(field.hidden, field, false)) {
    return false;
  }

  return resolveBoolean(field.visible, field, true);
};

const isFieldDisabled = (field: UniFormField) => {
  const dynamicDisabled = dynamicState[field.field]?.disabled;
  if (typeof dynamicDisabled === "boolean") {
    return dynamicDisabled;
  }

  return (
    Boolean(props.config.disabled) ||
    resolveBoolean(field.disabled, field, false)
  );
};

const isFieldReadonly = (field: UniFormField) =>
  Boolean(props.config.readonly) ||
  resolveBoolean(field.readonly, field, false);
const getFieldOptions = (field: UniFormField) =>
  dynamicState[field.field]?.options ?? field.options ?? [];

const fields = computed(() => props.config.schema.filter(isFieldVisible));
const fieldMap = computed(
  () => new Map(props.config.schema.map((field) => [field.field, field])),
);
const groupedSections = computed(() => {
  if (!props.config.sections?.length) {
    return [
      { title: "", fields: fields.value, colProps: props.config.colProps },
    ];
  }

  return props.config.sections.map((section) => ({
    ...section,
    fields: section.fields
      .map((field) => fieldMap.value.get(field))
      .filter(Boolean) as UniFormField[],
  }));
});

const handleFieldChange = async (field: UniFormField, value: unknown) => {
  const nextModel = { ...formModel.value, [field.field]: value };
  formModel.value = nextModel;
  emit("change", nextModel);
  await field.onChange?.(createContext(field));

  props.config.schema
    .filter((item) => item.dependencies?.includes(field.field))
    .forEach((item) => {
      if (!isFieldVisible(item)) {
        item.onHidden?.(createContext(item));
      }
      emit("linkage-change", { field: item.field, model: formModel.value });
    });

  emit("field-change", { field: field.field, value, model: formModel.value });
};

const renderViewValue = (field: UniFormField) => {
  const context = createContext(field);

  if (field.viewRender) {
    return field.viewRender(context);
  }

  if (field.viewType === "enum") {
    return (
      resolveOption(context.value, {
        prop: field.field,
        label: field.label,
        options: field.options,
      })?.label ?? formatEmpty(context.value)
    );
  }

  if (field.viewType === "date" || field.viewType === "datetime") {
    return formatDate(
      context.value,
      field.viewType === "date" ? "YYYY-MM-DD" : "YYYY-MM-DD HH:mm:ss",
    );
  }

  return formatEmpty(
    context.value,
    field.emptyText ?? props.config.view?.emptyText,
  );
};

const handleSubmit = async () => {
  const valid = await formRef.value?.validate().catch(() => false);
  emit("validate", Boolean(valid));

  if (valid) {
    emit("submit", formModel.value);
  }
};

const handleReset = () => {
  formRef.value?.resetFields();
  emit("reset");
};

watch(
  () => props.config.schema,
  async (schema) => {
    await Promise.all(
      schema.map(async (field) => {
        if (field.loadOptions) {
          actions.setOptions(
            field.field,
            await field.loadOptions(formModel.value),
          );
        }
      }),
    );
  },
  { immediate: true },
);

defineExpose({
  validate: () => formRef.value?.validate(),
  validateField: (field: string) => formRef.value?.validateField(field),
  resetFields: () => formRef.value?.resetFields(),
  clearValidate: () => formRef.value?.clearValidate(),
  scrollToField: (field: string) => formRef.value?.scrollToField(field),
  actions,
});
</script>

<template>
  <el-form
    ref="formRef"
    :model="formModel"
    :rules="config.rules"
    v-bind="config.formProps"
  >
    <template
      v-for="section in groupedSections"
      :key="section.title || 'default'"
    >
      <div v-if="section.title" class="uni-form__section-title">
        <slot name="section-title" :section="section">
          <h3>{{ section.title }}</h3>
          <p v-if="section.description">{{ section.description }}</p>
        </slot>
      </div>

      <el-row v-bind="config.rowProps">
        <el-col
          v-for="field in section.fields"
          :key="field.field"
          v-bind="field.colProps ?? section.colProps ?? config.colProps"
        >
          <el-form-item
            :label="field.label"
            :prop="field.field"
            v-bind="field.formItemProps"
          >
            <slot
              v-if="$slots[`field-${field.field}`]"
              :name="`field-${field.field}`"
              :field="field"
              :model="formModel"
            />

            <span v-else-if="formMode === 'view'" class="uni-form__view-value">
              {{ renderViewValue(field) }}
            </span>

            <component
              :is="field.component"
              v-else-if="
                field.component === 'ElInput' ||
                field.component === 'ElInputNumber' ||
                field.component === 'ElSwitch' ||
                field.component === 'ElDatePicker' ||
                field.component === 'ElTimePicker' ||
                field.component === 'ElCascader' ||
                field.component === 'ElTreeSelect'
              "
              :model-value="formModel[field.field]"
              :disabled="isFieldDisabled(field)"
              :readonly="isFieldReadonly(field)"
              v-bind="field.componentProps"
              @update:model-value="
                (value: unknown) => handleFieldChange(field, value)
              "
            />

            <el-select
              v-else-if="field.component === 'ElSelect'"
              :model-value="formModel[field.field]"
              :disabled="isFieldDisabled(field)"
              v-bind="field.componentProps"
              @update:model-value="
                (value: unknown) => handleFieldChange(field, value)
              "
            >
              <el-option
                v-for="option in getFieldOptions(field)"
                :key="String(option.value)"
                v-bind="option"
              />
            </el-select>

            <el-radio-group
              v-else-if="field.component === 'ElRadioGroup'"
              :model-value="formModel[field.field]"
              :disabled="isFieldDisabled(field)"
              v-bind="field.componentProps"
              @update:model-value="
                (value: unknown) => handleFieldChange(field, value)
              "
            >
              <el-radio
                v-for="option in getFieldOptions(field)"
                :key="String(option.value)"
                :value="option.value"
              >
                {{ option.label }}
              </el-radio>
            </el-radio-group>

            <el-checkbox-group
              v-else-if="field.component === 'ElCheckboxGroup'"
              :model-value="formModel[field.field]"
              :disabled="isFieldDisabled(field)"
              v-bind="field.componentProps"
              @update:model-value="
                (value: unknown) => handleFieldChange(field, value)
              "
            >
              <el-checkbox
                v-for="option in getFieldOptions(field)"
                :key="String(option.value)"
                :value="option.value"
              >
                {{ option.label }}
              </el-checkbox>
            </el-checkbox-group>

            <UniUpload
              v-else-if="field.component === 'UniUpload'"
              :file-list="formModel[field.field] as never"
              v-bind="field.componentProps"
              @update:file-list="(value) => handleFieldChange(field, value)"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </template>

    <div v-if="$slots.actions" class="uni-form__actions">
      <slot name="actions" :submit="handleSubmit" :reset="handleReset" />
    </div>
  </el-form>
</template>
