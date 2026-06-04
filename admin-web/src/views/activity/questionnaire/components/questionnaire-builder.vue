<template>
  <div class="qb" role="application" :aria-label="t('activity.qbPaletteTitle')">
    <div class="qb__workspace">
      <div class="qb__body" :class="{ 'qb__body--readonly': readonly }">
        <QuestionnaireBuilderPalette
          v-if="!readonly"
          :t="t"
          :total-count="modelValue.length"
          @add="add" />

        <QuestionnaireBuilderList
          :fields="orderedFields"
          :readonly="readonly"
          :selected-font-id="selFontId"
          :t="t"
          :row-badge="rowBadge"
          :raw-type="rawType"
          :effective-known="effectiveKnown"
          :preview-slice="previewSlice"
          :field-preview="fieldPreview"
          @update:fields="onFieldsReorder"
          @row-click="onRowClick"
          @remove="remove" />

        <QuestionnaireBuilderEditor
          v-if="!readonly"
          v-model:draft="draft"
          :selected="sel"
          :selected-ordinal="selectedOrdinal"
          :side-form-config="qbSideFormConfig"
          :select-multi="selMultiToggle"
          :options="opts"
          :use-single-default-picker="useSingleDefaultPicker"
          :use-multi-default-picker="useMultiDefaultPicker"
          :radio-default="radioDefault"
          :t="t"
          :row-badge="rowBadge"
          :raw-type="rawType"
          :known-header-prop="knownHeaderProp"
          :multi-default-has="multiDefaultHas"
          @set-required="setHeaderRequired"
          @set-hide="setHeaderHide"
          @update:select-multi="(v) => (selMultiToggle = v as boolean)"
          @update:radio-default="(v) => (radioDefault = String(v ?? ''))"
          @multi-default-change="onMultiDefaultChange"
          @remove-option="rmOption"
          @add-option="addOptionRow"
          @sync-dt="syncDt" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DesignerField } from '@/types/modules/activity-questionnaire'

import QuestionnaireBuilderEditor from './questionnaire-builder-editor.vue'
import QuestionnaireBuilderList from './questionnaire-builder-list.vue'
import QuestionnaireBuilderPalette from './questionnaire-builder-palette.vue'
import { useQuestionnaireBuilder } from './use-questionnaire-builder'

const props = withDefaults(
  defineProps<{
    modelValue: DesignerField[]
    readonly?: boolean
  }>(),
  { readonly: false }
)
const emit = defineEmits<{ 'update:modelValue': [DesignerField[]] }>()

const {
  t,
  qbSideFormConfig,
  sel,
  selFontId,
  draft,
  selectedOrdinal,
  orderedFields,
  rowBadge,
  rawType,
  effectiveKnown,
  previewSlice,
  fieldPreview,
  onRowClick,
  add,
  remove,
  knownHeaderProp,
  setHeaderRequired,
  setHeaderHide,
  selMultiToggle,
  opts,
  useSingleDefaultPicker,
  useMultiDefaultPicker,
  radioDefault,
  multiDefaultHas,
  onMultiDefaultChange,
  syncDt,
  addOptionRow,
  rmOption
} = useQuestionnaireBuilder(props, emit)

const onFieldsReorder = (fields: DesignerField[]) => {
  orderedFields.value = fields
}
</script>

<style lang="scss">
@import './questionnaire-builder.scss';
</style>
