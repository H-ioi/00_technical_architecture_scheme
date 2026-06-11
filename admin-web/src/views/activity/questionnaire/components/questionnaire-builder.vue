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
import type { Translate } from '@/types/i18n'
import type {
  DesignerField,
  DesignerFieldKnown,
  DesignerOption
} from '@/types/modules/activity-questionnaire'
import type { UniFormConfig } from 'uni-ui-lib'
import { useUniI18n } from 'uni-ui-lib'
import { computed, onUnmounted, ref, watch } from 'vue'

import QuestionnaireBuilderEditor from './questionnaire-builder-editor.vue'
import QuestionnaireBuilderList from './questionnaire-builder-list.vue'
import QuestionnaireBuilderPalette from './questionnaire-builder-palette.vue'
import {
  builderAddOptionRow,
  buildKnownFieldPreview,
  cloneKnown,
  effectiveKnown as effectiveKnownUtil,
  presetField,
  previewSlice as previewSliceUtil,
  rawType,
  rowBadge as rowBadgeUtil,
  type PaletteType
} from './questionnaire-builder-utils'

const props = withDefaults(
  defineProps<{
    modelValue: DesignerField[]
    readonly?: boolean
  }>(),
  { readonly: false }
)
const emit = defineEmits<{ 'update:modelValue': [DesignerField[]] }>()

const DEB_MS = 160

const { t } = useUniI18n()
const tr = t as Translate

const qbSideFormConfig = computed<UniFormConfig>(() => ({
  formProps: { labelPosition: 'top' },
  colProps: { span: 24 },
  schema: [
    {
      field: 'label',
      label: t('activity.qbFieldLabel'),
      component: 'ElInput',
      componentProps: {
        type: 'textarea',
        autosize: { minRows: 3, maxRows: 10 },
        maxlength: 255,
        showWordLimit: true
      }
    },
    {
      field: '_qbEditor',
      label: '',
      component: 'ElInput',
      componentProps: { style: { display: 'none' } }
    }
  ]
}))

const selFontId = ref<string | null>(null)
const draft = ref<DesignerFieldKnown | null>(null)
const syncingDraft = ref(false)
let debTimer: ReturnType<typeof setTimeout> | null = null

const sel = computed(() => props.modelValue.find((r) => r.fontId === selFontId.value) ?? null)

const selectedOrdinal = computed(() => {
  if (!selFontId.value) {
    return 0
  }
  const i = props.modelValue.findIndex((r) => r.fontId === selFontId.value)
  return i >= 0 ? i + 1 : 0
})

const orderedFields = computed({
  get: () => props.modelValue,
  set: (v: DesignerField[]) => emit('update:modelValue', v)
})

watch(
  () => [props.readonly, props.modelValue.length] as const,
  () => {
    if (props.readonly) {
      if (debTimer) {
        clearTimeout(debTimer)
        debTimer = null
      }
      selFontId.value = null
      draft.value = null
      return
    }
    if (props.modelValue.length && selFontId.value == null) {
      selFontId.value = props.modelValue[0].fontId
    }
    if (selFontId.value && !props.modelValue.some((r) => r.fontId === selFontId.value)) {
      selFontId.value = props.modelValue[0]?.fontId ?? null
    }
  },
  { immediate: true }
)

function ensureOpts(): void {
  const d = draft.value
  if (!d || (d.type !== 'radio' && d.type !== 'checkbox' && d.type !== 'select')) {
    return
  }
  if (!Array.isArray(d.properties.option)) {
    d.properties.option = []
  }
}

function flushDraftFor(fontId: string | null): void {
  const d = draft.value
  if (!fontId || !d || d.fontId !== fontId) {
    return
  }
  if (d.type === 'datetimepicker') {
    syncDt()
  }
  const i = props.modelValue.findIndex((r) => r.fontId === d.fontId)
  if (i < 0) {
    return
  }
  const next = cloneKnown(d)
  const cur = props.modelValue[i]
  if (JSON.stringify(cur) === JSON.stringify(next)) {
    return
  }
  const copy = [...props.modelValue]
  copy[i] = next
  emit('update:modelValue', copy)
}

function flushDraftPending(): void {
  flushDraftFor(selFontId.value)
}

function scheduleFlush(): void {
  if (syncingDraft.value) {
    return
  }
  if (debTimer) {
    clearTimeout(debTimer)
  }
  debTimer = setTimeout(() => {
    debTimer = null
    flushDraftPending()
  }, DEB_MS)
}

function mergeKnownIntoList(ix: number, nextKnown: DesignerFieldKnown): void {
  const copy = [...props.modelValue]
  copy[ix] = nextKnown
  emit('update:modelValue', copy)
}

function setHeaderRequired(fontId: string, val: boolean | string | number): void {
  const on = val === true
  const i = props.modelValue.findIndex((r) => r.fontId === fontId)
  if (i < 0) return
  const row = props.modelValue[i]
  if (row.kind !== 'known') return
  if (draft.value?.fontId === fontId) {
    draft.value.required = on
    scheduleFlush()
    return
  }
  const nextKnown = cloneKnown(row)
  nextKnown.required = on
  mergeKnownIntoList(i, nextKnown)
}

function setHeaderHide(fontId: string, val: boolean | string | number): void {
  const on = val === true
  const i = props.modelValue.findIndex((r) => r.fontId === fontId)
  if (i < 0) return
  const row = props.modelValue[i]
  if (row.kind !== 'known') return
  if (draft.value?.fontId === fontId) {
    draft.value.isHide = on
    scheduleFlush()
    return
  }
  const nextKnown = cloneKnown(row)
  nextKnown.isHide = on
  mergeKnownIntoList(i, nextKnown)
}

function knownHeaderProp(fontId: string): { required: boolean; isHide: boolean } {
  if (draft.value?.fontId === fontId) {
    return { required: !!draft.value.required, isHide: !!draft.value.isHide }
  }
  const row = props.modelValue.find((r) => r.fontId === fontId && r.kind === 'known') as
    | DesignerFieldKnown
    | undefined
  if (!row) return { required: false, isHide: false }
  return { required: !!row.required, isHide: !!row.isHide }
}

function onRowClick(fontId: string): void {
  if (props.readonly) {
    return
  }
  selectRow(fontId)
}

function selectRow(fontId: string): void {
  if (props.readonly) {
    return
  }
  if (debTimer) {
    clearTimeout(debTimer)
    debTimer = null
  }
  selFontId.value = fontId
}

watch(
  selFontId,
  (n, o) => {
    if (debTimer) {
      clearTimeout(debTimer)
      debTimer = null
    }
    if (o != null && o !== n) {
      flushDraftFor(o)
    }
    syncingDraft.value = true
    try {
      if (n == null) {
        draft.value = null
        return
      }
      const cur = props.modelValue.find((r) => r.fontId === n) ?? null
      if (cur?.kind !== 'known') {
        draft.value = null
        return
      }
      draft.value = cloneKnown(cur)
      ensureOpts()
    } finally {
      syncingDraft.value = false
    }
  },
  { immediate: true }
)

watch(
  draft,
  () => {
    scheduleFlush()
  },
  { deep: true }
)

onUnmounted(() => {
  if (debTimer) {
    clearTimeout(debTimer)
  }
})

const opts = computed({
  get(): DesignerOption[] {
    ensureOpts()
    return draft.value?.properties.option ?? []
  },
  set(v: DesignerOption[]) {
    if (draft.value) {
      draft.value.properties.option = v
    }
  }
})

const selMultiToggle = computed({
  get() {
    const d = draft.value
    if (!d || d.type !== 'select') {
      return false
    }
    return d.properties.option_multi === true || d.properties.option_multi === 'true'
  },
  set(v: boolean) {
    if (!draft.value || draft.value.type !== 'select') {
      return
    }
    draft.value.properties.option_multi = v
    draft.value.properties.option_default = v ? ([] as number[]) : ''
  }
})

const useSingleDefaultPicker = computed(() => {
  const d = draft.value
  if (!d) return false
  if (d.type === 'radio') return true
  if (d.type === 'select') return !selMultiToggle.value
  return false
})

const useMultiDefaultPicker = computed(() => {
  const d = draft.value
  if (!d) return false
  if (d.type === 'checkbox') return true
  if (d.type === 'select') return selMultiToggle.value
  return false
})

function multiDefaultHas(id: number): boolean {
  return multiDefaultNum.value.includes(id)
}

function onMultiDefaultChange(id: number, checked: unknown): void {
  if (!draft.value) return
  const on = checked === true
  const next = new Set(multiDefaultNum.value)
  if (on) next.add(id)
  else next.delete(id)
  draft.value.properties.option_default = Array.from(next)
}

const radioDefault = computed({
  get() {
    return String(draft.value?.properties.option_default ?? '')
  },
  set(v: string) {
    if (!draft.value) {
      return
    }
    draft.value.properties.option_default = v
  }
})

const multiDefaultNum = computed({
  get() {
    const d = draft.value?.properties.option_default
    return Array.isArray(d) ? d.map((x) => Number(x)) : []
  },
  set(v: number[]) {
    if (!draft.value) {
      return
    }
    draft.value.properties.option_default = v
  }
})

function syncDt(): void {
  const d = draft.value
  if (!d || d.type !== 'datetimepicker') {
    return
  }
  d.properties.datetime_type = d.datetimeTypeKey ?? 'date'
}

function add(bt: PaletteType): void {
  if (props.readonly) {
    return
  }
  const row = presetField(bt)
  emit('update:modelValue', [...props.modelValue, row])
  selFontId.value = row.fontId
}

function remove(ix: number): void {
  if (props.readonly) {
    return
  }
  const fid = props.modelValue[ix]?.fontId
  if (debTimer) {
    clearTimeout(debTimer)
    debTimer = null
  }
  if (fid != null && selFontId.value === fid) {
    flushDraftFor(fid)
  }
  const list = [...props.modelValue]
  list.splice(ix, 1)
  emit('update:modelValue', list)
  selFontId.value =
    fid != null && selFontId.value === fid
      ? (list[0]?.fontId ?? null)
      : list.some((r) => r.fontId === selFontId.value)
        ? selFontId.value
        : (list[0]?.fontId ?? null)
}

function addOptionRow(): void {
  if (props.readonly) {
    return
  }
  const d = draft.value
  if (!d || (d.type !== 'radio' && d.type !== 'checkbox' && d.type !== 'select')) {
    return
  }
  Object.assign(d, builderAddOptionRow(d))
}

function rmOption(oi: number): void {
  if (props.readonly) {
    return
  }
  ensureOpts()
  const list = [...opts.value]
  const removed = list[oi]
  if (removed == null || !draft.value) {
    return
  }
  const removedId = Number(removed.id)
  list.splice(oi, 1)
  if (!list.length) {
    return
  }
  opts.value = list
  const d = draft.value
  if (d.type === 'radio' || (d.type === 'select' && !selMultiToggle.value)) {
    const ids = new Set(list.map((o) => String(o.id)))
    const cur = String(d.properties.option_default ?? '')
    if (!ids.has(cur)) {
      d.properties.option_default = String(list[0].id)
    }
  } else if (d.type === 'checkbox' || (d.type === 'select' && selMultiToggle.value)) {
    const raw = d.properties.option_default
    const cur = (Array.isArray(raw) ? raw : []).map((x) => Number(x)).filter((x) => x !== removedId)
    d.properties.option_default = cur
  }
}
const rowBadge = (row: DesignerField) => rowBadgeUtil(row, tr)
const effectiveKnown = (row: DesignerField) => effectiveKnownUtil(row, draft.value)
const previewSlice = (row: DesignerField) => previewSliceUtil(row, draft.value)
const fieldPreview = buildKnownFieldPreview

const onFieldsReorder = (fields: DesignerField[]) => {
  orderedFields.value = fields
}
</script>

<style lang="scss">
.qb {
  display: flex;
  flex-direction: column;
  min-width: 0;

  &__workspace {
    border: 1px solid var(--el-border-color-extra-light);
    border-radius: 12px;
    overflow: hidden;
    background: var(--el-bg-color);
  }

  &__body {
    display: grid;
    grid-template-columns: minmax(172px, 200px) minmax(280px, 3fr) minmax(268px, 1fr);
    gap: 0;
    align-items: stretch;
    min-height: min(620px, calc(100vh - 260px));
  }

  &__body--readonly {
    grid-template-columns: minmax(0, 1fr);
  }

  @media (width <= 960px) {
    &__body {
      grid-template-columns: 1fr;
      min-height: auto;
    }

    &__scroll--list :deep(.el-scrollbar__wrap),
    &__scroll--opts :deep(.el-scrollbar__wrap) {
      max-height: min(480px, 55vh) !important;
    }
  }

  &__panel {
    border: none;
    border-radius: 0;
    padding: 14px 16px;
    background: var(--el-bg-color);
    min-width: 0;
  }

  &__palette {
    border-right: 1px solid var(--el-border-color-extra-light);
  }

  @media (width <= 960px) {
    &__palette {
      border-right: none;
      border-bottom: 1px solid var(--el-border-color-extra-light);
    }
  }

  &__list {
    border-right: 1px solid var(--el-border-color-extra-light);
    padding: 14px 6px 14px 16px;
  }

  &__editor {
    min-width: 0;
  }

  @media (width <= 960px) {
    &__list {
      border-right: none;
      border-bottom: 1px solid var(--el-border-color-extra-light);
    }
  }

  &__palette-head {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 10px;
    margin-bottom: 12px;
  }

  &__type-grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 8px;
  }

  &__type-btn {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 4px;
    width: 100%;
    padding: 8px 14px;
    margin: 0;
    height: auto;
    min-height: 56px;
  }

  &__type-btn-txt {
    font-size: 14px;
    line-height: 1;
    text-align: center;
  }

  &__type-btn + .qb__type-btn {
    margin-left: 0 !important;
  }

  &__type-btn-ic {
    color: var(--el-color-primary);
    margin-top: -2px;
    margin-right: 5px;
  }

  &__panel-title {
    font-weight: 600;
    font-size: 14px;
  }

  &__toolbar-count {
    font-size: 12px;
    flex-shrink: 0;
  }

  &__hint {
    margin: 10px 0 0;
    font-size: 12px;
    line-height: 1.45;
  }

  &__muted {
    font-size: 12px;
    color: var(--el-text-color-secondary);
  }

  &__list-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 4px;
  }

  &__scroll--editor :deep(.el-scrollbar__wrap),
  &__scroll--opts :deep(.el-scrollbar__wrap) {
    overflow-x: hidden;
  }

  &__opts-strip {
    padding-right: 12px;
  }

  &__draggable {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding-right: 12px;
  }

  &__ghost {
    opacity: 0.55;
  }

  &__drag {
    opacity: 0.95;
  }

  &__row {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 0;
    padding: 0;
    margin: 0;
    border: 1px solid var(--el-border-color-lighter);
    border-radius: 10px;
    background: var(--el-fill-color-lighter);
    cursor: pointer;
    outline: none;
    transition:
      border-color 0.15s ease,
      background 0.15s ease;
    overflow: hidden;
  }

  &__row:hover {
    border-color: var(--el-color-primary-light-5);
  }

  &__row:focus-visible {
    outline: 2px solid var(--el-color-primary);
    outline-offset: 2px;
  }

  &__row.active {
    border-color: var(--el-color-primary);
    background: var(--el-fill-color-blank);
    box-shadow: 0 0 0 1px color-mix(in srgb, var(--el-color-primary) 35%, transparent);
  }

  &__row--readonly {
    cursor: default;
  }

  &__row--readonly:hover {
    border-color: var(--el-border-color-lighter);
  }

  &__row--readonly:focus-visible {
    outline: none;
  }

  &__row-toolbar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    padding: 8px 10px;
  }

  &__drag-h {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    flex-shrink: 0;
    color: var(--el-text-color-secondary);
    cursor: grab;
  }

  &__drag-h:active {
    cursor: grabbing;
  }

  &__badge {
    flex: none;
    min-width: 24px;
    height: 24px;
    line-height: 24px;
    text-align: center;
    border-radius: 6px;
    font-size: 11px;
    font-weight: 700;
    background: var(--el-fill-color);
    color: var(--el-text-color-secondary);
  }

  &__row-hide {
    flex-shrink: 0;
  }

  &__row-preview {
    pointer-events: none;
    padding: 8px 12px 12px;
    border-top: 1px dashed var(--el-border-color-extra-light);
    background: var(--el-fill-color-blank);
  }

  &__row-preview--raw {
    padding-top: 10px;
    font-size: 12px;
    line-height: 1.5;
  }

  &__pv-empty {
    font-size: 13px;
  }

  &__pv-pattern {
    margin: 6px 0 0;
    font-size: 11px;
  }

  &__pv-stack {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }

  &__pv-stack :deep(.el-radio),
  &__pv-stack :deep(.el-checkbox) {
    margin-right: 0;
  }

  &__pv-field {
    margin-bottom: 8px;
  }

  &__pv-field:last-child {
    margin-bottom: 0;
  }

  &__pv-label {
    font-size: 14px;
    font-weight: 600;
    line-height: 1.4;
    color: var(--el-text-color-regular);
    margin-bottom: 8px;
  }

  &__pv-control {
    min-width: 0;
  }

  &__editor-head {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }

  &__empty-editor {
    padding: 48px 12px;
    text-align: center;
    border: 1px dashed var(--el-border-color);
    border-radius: 10px;
    margin-top: 8px;
  }

  &__ctx {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
    min-width: 0;
  }

  &__ctx-num {
    font-size: 12px;
    font-weight: 700;
    color: var(--el-text-color-secondary);
  }

  &__editor-alert {
    margin-bottom: 12px;
  }

  &__ctx-switches {
    display: inline-flex;
    flex-wrap: wrap;
    gap: 8px 12px;
    margin-left: auto;
  }

  &__ctx-sw {
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }

  &__ctx-sw-lbl {
    font-size: 12px;
    white-space: nowrap;
  }

  &__row-del {
    flex-shrink: 0;
    margin-left: auto !important;
  }

  &__form {
    max-width: none;
  }

  &__fake-item {
    margin-bottom: 16px;
  }

  &__fake-label {
    font-size: 12px;
    line-height: 1.5;
    margin-bottom: 6px;
    color: var(--el-text-color-regular);
  }

  &__fake-item--switch {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;
  }

  &__sect--base {
    padding-bottom: 8px;
    margin-bottom: 12px;
    border-bottom: 1px dashed var(--el-border-color-lighter);
  }

  &__opts-head {
    display: flex;
    align-items: center;
    margin: 12px 0 8px;
  }

  &__opts-body {
    display: flex;
    flex-direction: column;
    gap: 10px;
    min-width: 0;
  }

  &__opts-add {
    width: 100%;
  }

  &__opts-title {
    font-size: 13px;
    font-weight: 600;
  }

  &__opt-block {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 10px;
    width: 100%;
    min-width: 0;
  }

  &__opt-block.el-radio-group {
    display: grid !important;
    align-items: stretch;
    font-size: inherit;
    line-height: inherit;
  }

  &__opt-remove {
    flex-shrink: 0;
    justify-self: end;
  }

  &__opt--with-default {
    box-sizing: border-box;
    display: grid;
    grid-template-columns: 22px minmax(0, 1fr) 36px auto;
    align-items: center;
    margin-bottom: 0;
    padding: 8px;
    border: 1px solid var(--el-border-color-extra-light);
    border-radius: 8px;
    background: var(--el-fill-color-lighter);
  }

  &__opt-default-el {
    justify-self: center;
    margin: 0;
    height: 32px;
    display: inline-flex;
    align-items: center;
  }

  &__opt-default-el :deep(.el-radio__label) {
    display: none;
  }

  &__opt-default-el--chk :deep(.el-checkbox__label) {
    display: none;
  }

  &__opt-idx {
    font-size: 11px;
    color: var(--el-text-color-secondary);
    text-align: center;
  }
}
</style>
