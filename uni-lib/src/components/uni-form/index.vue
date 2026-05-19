<template>
  <el-form
    ref="formRef"
    class="uni-form"
    :model="model"
    :rules="config.rules"
    v-bind="config.formProps">
    <template v-for="section in groupedSections" :key="section.title || 'default'">
      <div v-if="section.title" class="uni-form__section-title">
        <slot name="section-title" :section="section">
          <h3>{{ section.title }}</h3>
          <p v-if="section.description" class="uni-form__section-description">
            {{ section.description }}
          </p>
        </slot>
      </div>

      <el-row v-bind="mergedRowProps">
        <el-col
          v-for="field in section.fields"
          :key="field.field"
          v-bind="field.colProps ?? section.colProps ?? config.colProps">
          <el-form-item
            :label="field.label"
            :prop="field.field"
            v-bind="field.formItemProps"
            :rules="field.rules">
            <slot
              v-if="$slots[`field-${field.field}`]"
              :name="`field-${field.field}`"
              :field="field"
              :model="model" />

            <UniFormViewValueText
              v-else-if="formMode === 'view'"
              :display="getViewDisplayString(field)"
              :overflow="resolveViewOverflow(field)" />

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
              :model-value="model[field.field]"
              :disabled="isFieldDisabled(field)"
              :readonly="isFieldReadonly(field)"
              v-bind="resolveDynamicComponentProps(field)"
              @update:model-value="(value: unknown) => handleFieldChange(field, value)" />

            <el-select
              v-else-if="field.component === 'ElSelect'"
              :model-value="model[field.field]"
              :disabled="isFieldDisabled(field)"
              v-bind="field.componentProps"
              @update:model-value="(value: unknown) => handleFieldChange(field, value)">
              <el-option
                v-for="option in getFieldOptions(field)"
                :key="String(option.value)"
                v-bind="option"
                :title="option.label" />
            </el-select>

            <el-radio-group
              v-else-if="field.component === 'ElRadioGroup'"
              :model-value="model[field.field]"
              :disabled="isFieldDisabled(field)"
              v-bind="field.componentProps"
              @update:model-value="(value: unknown) => handleFieldChange(field, value)">
              <el-radio
                v-for="option in getFieldOptions(field)"
                :key="String(option.value)"
                :value="option.value">
                {{ option.label }}
              </el-radio>
            </el-radio-group>

            <el-checkbox-group
              v-else-if="field.component === 'ElCheckboxGroup'"
              :model-value="model[field.field]"
              :disabled="isFieldDisabled(field)"
              v-bind="field.componentProps"
              @update:model-value="(value: unknown) => handleFieldChange(field, value)">
              <el-checkbox
                v-for="option in getFieldOptions(field)"
                :key="String(option.value)"
                :value="option.value">
                {{ option.label }}
              </el-checkbox>
            </el-checkbox-group>

            <UniUpload
              v-else-if="field.component === 'UniUpload'"
              :file-list="model[field.field] as never"
              v-bind="field.componentProps"
              @update:file-list="(value) => handleFieldChange(field, value)" />
          </el-form-item>
        </el-col>
      </el-row>
    </template>

    <div v-if="$slots.actions" class="uni-form__actions">
      <slot name="actions" :submit="handleSubmit" :reset="handleReset" />
    </div>
  </el-form>
</template>

<script setup lang="ts">
/**
 * 动态表单：`config.schema` 声明字段与 Element Plus 控件类型，支持分组 `sections`、
 * `rules` 校验、联动显隐、异步选项、`edit`/`view` 模式及 `#field-xxx` / `#actions` 插槽。
 */
import type { FormInstance, RowProps } from 'element-plus'
import { computed, reactive, ref, watch } from 'vue'

import UniUpload from '@/components/uni-upload/index.vue'
import type { Recordable, UniOption } from '@/types/shared'
import type {
  UniFormActions,
  UniFormConfig,
  UniFormField,
  UniFormMode,
  UniFormViewOverflow
} from '@/types/uni-form'
import { formatDate, formatEmpty, resolveOption } from '@/utils/format'
import UniFormViewValueText from './components/view-value-text.vue'

const model = defineModel<Recordable>({ default: () => ({}) })

const props = withDefaults(
  defineProps<{
    config: UniFormConfig
    mode?: UniFormMode
  }>(),
  {}
)

const emit = defineEmits<{
  change: [value: Recordable]
  'field-change': [payload: { field: string; value: unknown; model: Recordable }]
  'linkage-change': [payload: { field: string; model: Recordable }]
  validate: [valid: boolean]
  submit: [value: Recordable]
  reset: []
}>()

const formRef = ref<FormInstance>()
const dynamicState = reactive<
  Record<string, { visible?: boolean; disabled?: boolean; options?: UniOption[] }>
>({})

const formMode = computed(() => props.mode ?? props.config.mode ?? 'edit')

/** ElRow.gutter 必须为 number；JSON/接口常写成字符串，会导致栅距不生效 */
function normalizeRowProps(rowProps?: Partial<RowProps>): Partial<RowProps> {
  if (!rowProps || typeof rowProps !== 'object') {
    return {}
  }

  const { gutter, ...rest } = rowProps

  if (gutter === undefined || gutter === null) {
    return { ...rest }
  }

  const n =
    typeof gutter === 'number'
      ? gutter
      : typeof gutter === 'string'
        ? Number.parseFloat(gutter)
        : Number(gutter)

  return {
    ...rest,
    ...(Number.isFinite(n) ? { gutter: n } : {})
  }
}

const mergedRowProps = computed(() => normalizeRowProps(props.config.rowProps))

/**
 * 合并默认样式类 props（可被 `componentProps` 覆盖）
 * 用以设置全局默认样式类 props
 */
function resolveDynamicComponentProps(field: UniFormField): Recordable {
  const base = (field.componentProps ?? {}) as Recordable
  if (field.component === 'ElInputNumber') {
    return {
      controlsPosition: 'right',
      ...base
    }
  }
  return base
}

const actions: UniFormActions = {
  setValue(field, value) {
    model.value = { ...model.value, [field]: value }
  },
  clearValue(field) {
    const nextModel = { ...model.value }
    delete nextModel[field]
    model.value = nextModel
  },
  resetField(field) {
    const formField = props.config.schema.find((item) => item.field === field)
    actions.setValue(field, formField?.defaultValue)
  },
  setVisible(field, visible) {
    dynamicState[field] = { ...dynamicState[field], visible }
  },
  setDisabled(field, disabled) {
    dynamicState[field] = { ...dynamicState[field], disabled }
  },
  setOptions(field, options) {
    dynamicState[field] = { ...dynamicState[field], options }
  },
  validateField(field) {
    formRef.value?.validateField(field)
  }
}

const createContext = (field: UniFormField) => ({
  model: model.value,
  field,
  value: model.value[field.field],
  actions
})

const resolveBoolean = (value: UniFormField['visible'], field: UniFormField, fallback: boolean) => {
  if (typeof value === 'function') {
    return value(createContext(field))
  }

  if (typeof value === 'boolean') {
    return value
  }

  return fallback
}

const isFieldVisible = (field: UniFormField) => {
  const dynamicVisible = dynamicState[field.field]?.visible
  if (typeof dynamicVisible === 'boolean') {
    return dynamicVisible
  }

  if (resolveBoolean(field.hidden, field, false)) {
    return false
  }

  return resolveBoolean(field.visible, field, true)
}

const isFieldDisabled = (field: UniFormField) => {
  const dynamicDisabled = dynamicState[field.field]?.disabled
  if (typeof dynamicDisabled === 'boolean') {
    return dynamicDisabled
  }

  return Boolean(props.config.disabled) || resolveBoolean(field.disabled, field, false)
}

const isFieldReadonly = (field: UniFormField) =>
  Boolean(props.config.readonly) || resolveBoolean(field.readonly, field, false)
const getFieldOptions = (field: UniFormField) =>
  dynamicState[field.field]?.options ?? field.options ?? []

/** 读取 model 以追踪 hidden/visible 联动，否则仅改 schema 外字段时不会重算显隐 */
const fields = computed(() => {
  void model.value
  return props.config.schema.filter(isFieldVisible)
})
const fieldMap = computed(() => new Map(fields.value.map((field) => [field.field, field])))
const groupedSections = computed(() => {
  if (!props.config.sections?.length) {
    return [{ title: '', fields: fields.value, colProps: props.config.colProps }]
  }

  return props.config.sections.map((section) => ({
    ...section,
    fields: section.fields
      .map((field) => fieldMap.value.get(field))
      .filter(Boolean) as UniFormField[]
  }))
})

const handleFieldChange = async (field: UniFormField, value: unknown) => {
  const nextModel = { ...model.value, [field.field]: value }
  model.value = nextModel
  emit('change', nextModel)
  await field.onChange?.(createContext(field))

  props.config.schema
    .filter((item) => item.dependencies?.includes(field.field))
    .forEach((item) => {
      if (!isFieldVisible(item)) {
        item.onHidden?.(createContext(item))
      }
      emit('linkage-change', { field: item.field, model: model.value })
    })

  emit('field-change', { field: field.field, value, model: model.value })
}

const normalizeViewDisplay = (raw: unknown): string => {
  if (raw == null) {
    return ''
  }
  const t = typeof raw
  if (t === 'string' || t === 'number' || t === 'boolean') {
    return String(raw)
  }
  if (t === 'object') {
    try {
      return JSON.stringify(raw as object)
    } catch {
      return String(raw)
    }
  }
  return String(raw)
}

const resolveViewRawValue = (field: UniFormField): unknown => {
  const context = createContext(field)

  if (field.viewRender) {
    return field.viewRender(context)
  }

  if (field.viewType === 'enum') {
    return (
      resolveOption(context.value, {
        prop: field.field,
        label: field.label,
        options: field.options
      })?.label ?? formatEmpty(context.value)
    )
  }

  if (field.viewType === 'date' || field.viewType === 'datetime') {
    return formatDate(
      context.value,
      field.viewType === 'date' ? 'YYYY-MM-DD' : 'YYYY-MM-DD HH:mm:ss'
    )
  }

  return formatEmpty(context.value, field.emptyText ?? props.config.view?.emptyText)
}

const getViewDisplayString = (field: UniFormField): string =>
  normalizeViewDisplay(resolveViewRawValue(field))

const resolveViewOverflow = (field: UniFormField): UniFormViewOverflow =>
  field.viewOverflow ?? props.config.view?.viewOverflow ?? 'ellipsis'

const handleSubmit = async () => {
  const valid = await formRef.value?.validate().catch(() => false)
  emit('validate', Boolean(valid))

  if (valid) {
    emit('submit', model.value)
  }
}

const handleReset = () => {
  formRef.value?.resetFields()
  emit('reset')
}

watch(
  () => props.config.schema,
  async (schema) => {
    await Promise.allSettled(
      schema.map(async (field) => {
        if (field.loadOptions) {
          actions.setOptions(field.field, await field.loadOptions(model.value))
        }
      })
    )
  },
  { immediate: true }
)

defineExpose({
  validate: () => formRef.value?.validate(),
  validateField: (field: string) => formRef.value?.validateField(field),
  resetFields: () => formRef.value?.resetFields(),
  clearValidate: () => formRef.value?.clearValidate(),
  scrollToField: (field: string) => formRef.value?.scrollToField(field),
  actions
})
</script>

<style lang="scss">
.uni-form {
  .el-form-item__content {
    min-width: 0;
  }

  &__section-description {
    font-size: 12px;
    color: var(--vp-c-text-2);
    line-height: 1.5;
  }

  &__section-title {
    margin: 16px 0 12px;

    h3 {
      margin: 0;
      font-size: 16px;
    }

    p {
      margin: 4px 0 0;
      color: var(--uni-text-color-secondary);
    }
  }

  &__actions {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
