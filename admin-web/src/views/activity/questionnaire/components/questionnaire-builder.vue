<template>
  <div class="qb" role="application" :aria-label="t('activity.qbPaletteTitle')">
    <div class="qb__workspace">
      <div class="qb__body" :class="{ 'qb__body--readonly': readonly }">
        <!-- 左侧：添加题型 -->
        <aside v-if="!readonly" class="qb__palette qb__panel">
          <div class="qb__palette-head">
            <span class="qb__panel-title">{{ t('activity.qbPaletteTitle') }}</span>
            <span class="qb__toolbar-count qb__muted">{{
              t('activity.qbTotalQuestions', { n: props.modelValue.length })
            }}</span>
          </div>
          <div class="qb__type-grid">
            <el-button
              v-for="btn in BUILDER_PALETTE_TYPES"
              :key="btn"
              plain
              size="small"
              class="qb__type-btn"
              @click="add(btn)">
              <el-icon :size="16" class="qb__type-btn-ic">
                <component :is="PALETTE_ICON[btn]" />
              </el-icon>
              <span class="qb__type-btn-txt">{{ t(`activity.qbTypes.${btn}`) }}</span>
            </el-button>
          </div>
          <p class="qb__hint qb__muted">{{ t('activity.qbPaletteHint') }}</p>
        </aside>

        <!-- 中间：题目列表（拖拽排序，点击进入右侧编辑） -->
        <div class="qb__list qb__panel">
          <div class="qb__list-head">
            <span class="qb__panel-title">{{ t('activity.qbListTitle') }}</span>
          </div>

          <el-empty v-if="!props.modelValue.length" :description="t('activity.qbEmpty')" />

          <el-scrollbar
            v-else
            class="qb__scroll qb__scroll--list"
            max-height="min(720px, calc(100vh - 260px))">
            <draggable
              v-model="orderedFields"
              item-key="fontId"
              handle=".qb__drag-h"
              :disabled="readonly"
              :animation="180"
              ghost-class="qb__ghost"
              drag-class="qb__drag"
              class="qb__draggable"
              tag="div">
              <template #item="{ element: row, index: idx }">
                <div
                  :key="row.fontId"
                  class="qb__row"
                  :class="{
                    active: !readonly && selFontId === row.fontId,
                    'qb__row--readonly': readonly
                  }"
                  :role="readonly ? undefined : 'button'"
                  :tabindex="readonly ? undefined : 0"
                  @click="onRowClick(row.fontId)"
                  @keydown.enter.prevent="onRowClick(row.fontId)">
                  <div class="qb__row-toolbar">
                    <span
                      v-if="!readonly"
                      class="qb__drag-h"
                      :title="t('activity.qbDrag')"
                      @click.stop>
                      <el-icon>
                        <Rank />
                      </el-icon>
                    </span>
                    <span class="qb__badge">{{ idx + 1 }}</span>
                    <el-tag size="small" type="primary" effect="plain">{{ rowBadge(row) }}</el-tag>
                    <el-tag
                      v-if="row.kind === 'known' && effectiveKnown(row)?.isHide"
                      size="small"
                      effect="plain"
                      type="info"
                      class="qb__row-hide">
                      {{ t('activity.qbHide') }}
                    </el-tag>
                    <el-button
                      v-if="!readonly"
                      text
                      type="danger"
                      :icon="Delete"
                      class="qb__row-del"
                      @click.stop="remove(idx)" />
                  </div>

                  <div
                    v-if="row.kind === 'raw'"
                    class="qb__row-preview qb__row-preview--raw qb__muted">
                    {{ t('activity.qbPreviewLegacy', { type: rawType(row as DesignerFieldRaw) }) }}
                  </div>

                  <template v-else>
                    <template v-for="fk in previewSlice(row)" :key="`${row.fontId}-pv`">
                      <div class="qb__row-preview">
                        <div class="qb__pv">
                          <!-- 单行文本 -->
                          <template v-if="fk.type === 'input'">
                            <div class="qb__pv-field">
                              <div class="qb__pv-label">{{ previewLabel(fk) }}</div>
                              <div class="qb__pv-control">
                                <el-input
                                  :placeholder="fk.properties.placeholder || undefined"
                                  disabled />
                              </div>
                            </div>
                          </template>

                          <!-- 多行文本 -->
                          <template v-else-if="fk.type === 'textarea'">
                            <div class="qb__pv-field">
                              <div class="qb__pv-label">{{ previewLabel(fk) }}</div>
                              <div class="qb__pv-control">
                                <el-input
                                  type="textarea"
                                  :autosize="{
                                    minRows: textareaRows(fk),
                                    maxRows: textareaRows(fk)
                                  }"
                                  :placeholder="fk.properties.placeholder || undefined"
                                  disabled />
                              </div>
                            </div>
                          </template>

                          <!-- 单选 -->
                          <template v-else-if="fk.type === 'radio'">
                            <div class="qb__pv-field">
                              <div class="qb__pv-label">{{ previewLabel(fk) }}</div>
                              <div class="qb__pv-control">
                                <template v-if="previewOptionList(fk).length">
                                  <el-radio-group :model-value="previewRadioVal(fk)" disabled>
                                    <div class="qb__pv-stack">
                                      <el-radio
                                        v-for="opt in previewOptionList(fk)"
                                        :key="opt.id"
                                        :label="String(opt.id)">
                                        {{ opt.label }}
                                      </el-radio>
                                    </div>
                                  </el-radio-group>
                                </template>
                                <span v-else class="qb__pv-empty qb__muted">{{
                                  t('activity.qbPreviewNoOptions')
                                }}</span>
                              </div>
                            </div>
                          </template>

                          <!-- 多选 -->
                          <template v-else-if="fk.type === 'checkbox'">
                            <div class="qb__pv-field">
                              <div class="qb__pv-label">{{ previewLabel(fk) }}</div>
                              <div class="qb__pv-control">
                                <template v-if="previewOptionList(fk).length">
                                  <el-checkbox-group :model-value="previewMultiVals(fk)" disabled>
                                    <div class="qb__pv-stack">
                                      <el-checkbox
                                        v-for="opt in previewOptionList(fk)"
                                        :key="opt.id"
                                        :label="Number(opt.id)">
                                        {{ opt.label }}
                                      </el-checkbox>
                                    </div>
                                  </el-checkbox-group>
                                </template>
                                <span v-else class="qb__pv-empty qb__muted">{{
                                  t('activity.qbPreviewNoOptions')
                                }}</span>
                              </div>
                            </div>
                          </template>

                          <!-- 下拉 -->
                          <template v-else-if="fk.type === 'select'">
                            <div class="qb__pv-field">
                              <div class="qb__pv-label">{{ previewLabel(fk) }}</div>
                              <div class="qb__pv-control">
                                <template v-if="previewOptionList(fk).length">
                                  <el-select
                                    :model-value="
                                      previewSelectMulti(fk)
                                        ? previewMultiVals(fk)
                                        : previewRadioVal(fk)
                                    "
                                    :multiple="previewSelectMulti(fk)"
                                    collapse-tags
                                    collapse-tags-tooltip
                                    disabled
                                    style="width: 100%">
                                    <el-option
                                      v-for="opt in previewOptionList(fk)"
                                      :key="opt.id"
                                      :label="opt.label"
                                      :value="
                                        previewSelectMulti(fk) ? Number(opt.id) : String(opt.id)
                                      " />
                                  </el-select>
                                </template>
                                <span v-else class="qb__pv-empty qb__muted">{{
                                  t('activity.qbPreviewNoOptions')
                                }}</span>
                              </div>
                            </div>
                          </template>

                          <!-- 日期时间 -->
                          <template v-else-if="fk.type === 'datetimepicker'">
                            <div class="qb__pv-field">
                              <div class="qb__pv-label">{{ previewLabel(fk) }}</div>
                              <div class="qb__pv-control">
                                <el-date-picker
                                  :teleported="false"
                                  disabled
                                  class="qb__pv-dp"
                                  style="width: 100%"
                                  :type="previewDateType(fk)"
                                  :placeholder="t('activity.qbPreviewDatePh')" />
                                <p
                                  v-if="fk.properties.datetime_pattern"
                                  class="qb__pv-pattern qb__muted">
                                  {{ fk.properties.datetime_pattern }}
                                </p>
                              </div>
                            </div>
                          </template>
                        </div>
                      </div>
                    </template>
                  </template>
                </div>
              </template>
            </draggable>
          </el-scrollbar>
        </div>

        <!-- 右侧：选中题目的表单编辑 -->
        <aside v-if="!readonly" class="qb__editor qb__panel">
          <div class="qb__editor-head">
            <span class="qb__panel-title">{{ t('activity.qbPropsTitle') }}</span>
          </div>

          <div v-if="!sel" class="qb__empty-editor qb__muted">{{ t('activity.qbPickFirst') }}</div>

          <template v-else>
            <div class="qb__ctx">
              <span class="qb__ctx-num">#{{ selectedOrdinal }}</span>
              <el-tag size="small" type="primary" effect="plain">{{ rowBadge(sel) }}</el-tag>
              <div v-if="sel.kind === 'known' && draft" class="qb__ctx-switches" @click.stop>
                <span class="qb__ctx-sw">
                  <span class="qb__ctx-sw-lbl qb__muted">{{ t('activity.qbRequired') }}</span>
                  <el-switch
                    :model-value="knownHeaderProp(sel.fontId).required"
                    size="small"
                    @change="setHeaderRequired(sel.fontId, $event)" />
                </span>
                <span class="qb__ctx-sw">
                  <span class="qb__ctx-sw-lbl qb__muted">{{ t('activity.qbHide') }}</span>
                  <el-switch
                    :model-value="knownHeaderProp(sel.fontId).isHide"
                    size="small"
                    @change="setHeaderHide(sel.fontId, $event)" />
                </span>
              </div>
            </div>

            <div class="qb__scroll qb__scroll--editor">
              <el-alert
                v-if="sel.kind === 'raw'"
                type="warning"
                show-icon
                :closable="false"
                class="qb__editor-alert">
                {{ t('activity.qbRawHint', { type: rawType(sel as DesignerFieldRaw) }) }}
              </el-alert>

              <template v-else-if="draft">
                <UniForm v-model="draft" mode="edit" class="qb__form" :config="qbSideFormConfig">
                  <template #field-_qbEditor>
                    <template v-if="draft.type === 'input'">
                      <div class="qb__fake-item">
                        <div class="qb__fake-label">{{ t('activity.qbPlaceholder') }}</div>
                        <el-input v-model="draft.properties.placeholder" />
                      </div>
                      <div class="qb__fake-item">
                        <div class="qb__fake-label">{{ t('activity.qbRegex') }}</div>
                        <el-input v-model="draft.regex" />
                      </div>
                      <div class="qb__fake-item">
                        <div class="qb__fake-label">{{ t('activity.qbRegexHint') }}</div>
                        <el-input v-model="draft.regexHint" />
                      </div>
                    </template>

                    <template v-else-if="draft.type === 'textarea'">
                      <div class="qb__fake-item">
                        <div class="qb__fake-label">{{ t('activity.qbPlaceholder') }}</div>
                        <el-input v-model="draft.properties.placeholder" />
                      </div>
                      <div class="qb__fake-item">
                        <div class="qb__fake-label">{{ t('activity.qbTextRows') }}</div>
                        <el-input-number
                          v-model="draft.properties.text_num_line"
                          :min="1"
                          :max="20"
                          controls-position="right"
                          style="width: 100%" />
                      </div>
                    </template>

                    <template
                      v-else-if="
                        draft.type === 'radio' ||
                        draft.type === 'checkbox' ||
                        draft.type === 'select'
                      ">
                      <div
                        v-if="draft.type === 'select'"
                        class="qb__fake-item qb__fake-item--switch">
                        <span class="qb__fake-label">{{ t('activity.qbMulti') }}</span>
                        <el-switch v-model="selMultiToggle" />
                      </div>

                      <div class="qb__opts-head">
                        <span class="qb__opts-title">{{ t('activity.qbOptions') }}</span>
                      </div>

                      <div class="qb__opts-body">
                        <el-scrollbar
                          class="qb__scroll qb__scroll--opts"
                          max-height="min(440px, 48vh)">
                          <div class="qb__opts-strip">
                            <el-radio-group
                              v-if="useSingleDefaultPicker"
                              v-model="radioDefault"
                              class="qb__opt-block">
                              <div
                                v-for="(opt, oi) in opts"
                                :key="opt.id"
                                class="qb__opt qb__opt--with-default">
                                <span class="qb__opt-idx">{{ oi + 1 }}</span>
                                <el-input
                                  v-model="opt.label"
                                  :placeholder="t('activity.qbOptLabel')" />
                                <el-radio
                                  :label="String(opt.id)"
                                  :title="t('activity.qbDefault')"
                                  class="qb__opt-default-el" />
                                <el-button
                                  text
                                  link
                                  type="danger"
                                  :icon="Delete"
                                  class="qb__opt-remove"
                                  :title="t('activity.qbRemove')"
                                  @click="rmOption(oi)" />
                              </div>
                            </el-radio-group>

                            <div v-else-if="useMultiDefaultPicker" class="qb__opt-block">
                              <div
                                v-for="(opt, oi) in opts"
                                :key="opt.id"
                                class="qb__opt qb__opt--with-default">
                                <span class="qb__opt-idx">{{ oi + 1 }}</span>
                                <el-input
                                  v-model="opt.label"
                                  :placeholder="t('activity.qbOptLabel')" />
                                <el-checkbox
                                  :model-value="multiDefaultHas(Number(opt.id))"
                                  :title="t('activity.qbDefault')"
                                  class="qb__opt-default-el qb__opt-default-el--chk"
                                  @change="onMultiDefaultChange(Number(opt.id), $event)" />
                                <el-button
                                  text
                                  link
                                  type="danger"
                                  :icon="Delete"
                                  class="qb__opt-remove"
                                  :title="t('activity.qbRemove')"
                                  @click="rmOption(oi)" />
                              </div>
                            </div>
                          </div>
                        </el-scrollbar>
                        <el-button
                          size="small"
                          type="primary"
                          class="qb__opts-add"
                          plain
                          @click="addOptionRow">
                          + {{ t('activity.qbAddOption') }}
                        </el-button>
                      </div>
                    </template>

                    <template v-else-if="draft.type === 'datetimepicker'">
                      <div class="qb__fake-item">
                        <div class="qb__fake-label">{{ t('activity.qbDateMode') }}</div>
                        <el-select
                          v-model="draft.datetimeTypeKey"
                          style="width: 100%"
                          @change="syncDt">
                          <el-option :label="t('activity.qbDateOnly')" value="date" />
                          <el-option :label="t('activity.qbDatetime')" value="datetime" />
                          <el-option :label="t('activity.qbYearMonth')" value="month" />
                        </el-select>
                      </div>
                      <div class="qb__fake-item">
                        <div class="qb__fake-label">{{ t('activity.qbPattern') }}</div>
                        <el-input
                          v-model="draft.properties.datetime_pattern"
                          maxlength="80"
                          show-word-limit />
                      </div>
                    </template>
                  </template>
                </UniForm>
              </template>
            </div>
          </template>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Translate } from '@/types/i18n'
import type {
  DesignerField,
  DesignerFieldKnown,
  DesignerFieldRaw,
  DesignerOption
} from '@/types/modules/activity-questionnaire'
import {
  Aim,
  Calendar,
  Checked,
  Delete,
  EditPen,
  Memo,
  Rank,
  Select as SelectIcon
} from '@element-plus/icons-vue'

import type { UniFormConfig } from 'uni-ui-lib'
import { UniForm, useUniI18n } from 'uni-ui-lib'
import type { Component } from 'vue'
import { computed, onUnmounted, ref, watch } from 'vue'
import draggable from 'vuedraggable'

function createFontId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `f_${crypto.randomUUID()}`
  }
  return `f_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}

function newTemplateFieldId(): string {
  return `-${Math.random().toString(36).slice(2, 11)}`
}

const BUILDER_PALETTE_TYPES = [
  'input',
  'textarea',
  'radio',
  'checkbox',
  'select',
  'datetimepicker'
] as const

type PaletteType = (typeof BUILDER_PALETTE_TYPES)[number]

function nextSeqOptionId(opts: DesignerOption[]): number {
  const nums = opts.map((o) => Number(o.id)).filter((n) => Number.isFinite(n))
  let m = nums.length ? Math.max(...nums, 0) : 0
  m++
  while (nums.includes(m)) {
    m++
  }
  return m
}

function defaultOptions(kind: 'radio' | 'checkbox' | 'select'): DesignerOption[] {
  return [
    { label: kind === 'select' ? '选项一' : '选项1', id: 1, value: '', isHide: 0 },
    { label: kind === 'select' ? '选项二' : '选项2', id: 2, value: '', isHide: 0 }
  ]
}

function radioProps(): DesignerFieldKnown['properties'] {
  const option = defaultOptions('radio')
  return {
    option,
    option_default: String(option[0].id),
    searchable: false
  }
}

function presetField(type: PaletteType): DesignerFieldKnown {
  const id = newTemplateFieldId()
  switch (type) {
    case 'input':
      return {
        kind: 'known',
        fontId: createFontId(),
        id,
        type: 'input',
        label: '单行文本',
        required: false,
        readonly: false,
        disabled: false,
        isHide: false,
        regex: '',
        regexHint: '',
        datetimeTypeKey: '',
        properties: { placeholder: '' }
      }
    case 'textarea':
      return {
        kind: 'known',
        fontId: createFontId(),
        id,
        type: 'textarea',
        label: '多行文本',
        required: false,
        readonly: false,
        disabled: false,
        isHide: false,
        regex: '',
        regexHint: '',
        datetimeTypeKey: '',
        properties: {
          placeholder: '',
          text_num_line: 3,
          text_num_column: 40
        }
      }
    case 'radio':
      return {
        kind: 'known',
        fontId: createFontId(),
        id,
        type: 'radio',
        label: '单选题',
        required: false,
        readonly: false,
        disabled: false,
        isHide: false,
        regex: '',
        regexHint: '',
        datetimeTypeKey: '',
        properties: radioProps()
      }
    case 'checkbox':
      return {
        kind: 'known',
        fontId: createFontId(),
        id,
        type: 'checkbox',
        label: '多选题',
        required: false,
        readonly: false,
        disabled: false,
        isHide: false,
        regex: '',
        regexHint: '',
        datetimeTypeKey: '',
        properties: {
          option: defaultOptions('checkbox'),
          option_default: [],
          searchable: false
        }
      }
    case 'select':
      return {
        kind: 'known',
        fontId: createFontId(),
        id,
        type: 'select',
        label: '下拉',
        required: false,
        readonly: false,
        disabled: false,
        isHide: false,
        regex: '',
        regexHint: '',
        datetimeTypeKey: '',
        properties: {
          option: defaultOptions('select'),
          option_default: [],
          option_multi: false,
          searchable: true
        }
      }
    case 'datetimepicker':
      return {
        kind: 'known',
        fontId: createFontId(),
        id,
        type: 'datetimepicker',
        label: '日期时间',
        required: false,
        readonly: false,
        disabled: false,
        isHide: false,
        regex: '',
        regexHint: '',
        datetimeTypeKey: 'date',
        properties: {
          datetime_type: 'date',
          datetime_pattern: 'yyyy-MM-dd'
        }
      }
    default: {
      const _x: never = type
      throw new Error(`unknown palette type ${_x}`)
    }
  }
}

function builderAddOptionRow(f: DesignerFieldKnown): DesignerFieldKnown {
  const p = { ...f.properties }
  const list = [...(Array.isArray(p.option) ? p.option : [])]
  const nid = nextSeqOptionId(list)
  list.push({ label: `选项${nid}`, id: nid, value: '', isHide: 0 })
  p.option = list
  return { ...f, properties: p }
}

const PALETTE_ICON: Record<PaletteType, Component> = {
  input: EditPen,
  textarea: Memo,
  radio: Aim,
  checkbox: Checked,
  select: SelectIcon,
  datetimepicker: Calendar
}

const props = withDefaults(
  defineProps<{
    modelValue: DesignerField[]
    readonly?: boolean
  }>(),
  { readonly: false }
)
const emit = defineEmits<{ 'update:modelValue': [DesignerField[]] }>()

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

const draft = ref<DesignerFieldKnown | null>(null)
const syncingDraft = ref(false)
let debTimer: ReturnType<typeof setTimeout> | null = null
const DEB_MS = 160

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

function cloneKnown(row: DesignerFieldKnown): DesignerFieldKnown {
  return JSON.parse(JSON.stringify(row)) as DesignerFieldKnown
}

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

/** 折叠头栏开关：与 draft 同源或并入 props */
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

function rowBadge(row: DesignerField): string {
  return row.kind === 'raw'
    ? `${tr('activity.qbRawPrefix')} (${rawType(row as DesignerFieldRaw)})`
    : tr(`activity.qbTypes.${(row as DesignerFieldKnown).type}`)
}

function rawType(row: DesignerFieldRaw): string {
  return String(row.backendRow.type ?? '?')
}

/** 中间「答题视图」预览：选中行用 draft，其它行用列表快照。 */
function effectiveKnown(row: DesignerField): DesignerFieldKnown | null {
  if (row.kind !== 'known') {
    return null
  }

  if (draft.value?.fontId === row.fontId) {
    return draft.value
  }

  return row
}

function previewSlice(row: DesignerField): DesignerFieldKnown[] {
  const k = effectiveKnown(row)

  return k ? [k] : []
}

function previewLabel(k: DesignerFieldKnown): string {
  return k.required ? `${k.label} *` : k.label
}

function previewOptionList(k: DesignerFieldKnown): DesignerOption[] {
  const list = Array.isArray(k.properties.option) ? k.properties.option : []

  return list.filter((o) => !o.isHide)
}

function previewSelectMulti(k: DesignerFieldKnown): boolean {
  return k.properties.option_multi === true || k.properties.option_multi === 'true'
}

function previewMultiVals(k: DesignerFieldKnown): number[] {
  const raw = k.properties.option_default

  return Array.isArray(raw) ? raw.map((x) => Number(x)) : []
}

function previewRadioVal(k: DesignerFieldKnown): string {
  return String(k.properties.option_default ?? '')
}

function previewDateType(k: DesignerFieldKnown): 'date' | 'datetime' | 'month' {
  const dt = String(k.datetimeTypeKey || k.properties.datetime_type || 'date')

  if (dt === 'datetime') {
    return 'datetime'
  }

  if (dt === 'month') {
    return 'month'
  }

  return 'date'
}

function textareaRows(k: DesignerFieldKnown): number {
  const n = Number(k.properties.text_num_line)

  if (Number.isFinite(n) && n > 0) {
    return Math.min(8, Math.max(2, n))
  }

  return 3
}

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
</script>

<style scoped lang="scss">
.qb {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.qb__workspace {
  border: 1px solid var(--el-border-color-extra-light);
  border-radius: 12px;
  overflow: hidden;
  background: var(--el-bg-color);
}

.qb__body {
  display: grid;
  grid-template-columns: minmax(172px, 200px) minmax(280px, 3fr) minmax(268px, 1fr);
  gap: 0;
  align-items: stretch;
  min-height: min(620px, calc(100vh - 260px));
}

.qb__body--readonly {
  grid-template-columns: minmax(0, 1fr);
}

@media (max-width: 960px) {
  .qb__body {
    grid-template-columns: 1fr;
    min-height: auto;
  }

  .qb__scroll--list :deep(.el-scrollbar__wrap),
  .qb__scroll--opts :deep(.el-scrollbar__wrap) {
    max-height: min(480px, 55vh) !important;
  }
}

.qb__panel {
  border: none;
  border-radius: 0;
  padding: 14px 16px;
  background: var(--el-bg-color);
  min-width: 0;
}

.qb__palette {
  border-right: 1px solid var(--el-border-color-extra-light);
}

@media (max-width: 960px) {
  .qb__palette {
    border-right: none;
    border-bottom: 1px solid var(--el-border-color-extra-light);
  }
}

.qb__list {
  border-right: 1px solid var(--el-border-color-extra-light);
  padding: 14px 6px 14px 16px;
}

.qb__editor {
  min-width: 0;
}

@media (max-width: 960px) {
  .qb__list {
    border-right: none;
    border-bottom: 1px solid var(--el-border-color-extra-light);
  }
}

.qb__palette-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 12px;
}

.qb__type-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 8px;
}

.qb__type-btn {
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

.qb__type-btn-txt {
  font-size: 14px;
  line-height: 1;
  text-align: center;
}

.qb__type-btn + .qb__type-btn {
  margin-left: 0 !important;
}

.qb__type-btn-ic {
  color: var(--el-color-primary);
  margin-top: -2px;
  margin-right: 5px;
}

.qb__panel-title {
  font-weight: 600;
  font-size: 14px;
}

.qb__toolbar-count {
  font-size: 12px;
  flex-shrink: 0;
}

.qb__hint {
  margin: 10px 0 0;
  font-size: 12px;
  line-height: 1.45;
}

.qb__muted {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.qb__list-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
}

.qb__scroll--editor :deep(.el-scrollbar__wrap),
.qb__scroll--opts :deep(.el-scrollbar__wrap) {
  overflow-x: hidden;
}

.qb__opts-strip {
  padding-right: 12px;
}

.qb__draggable {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-right: 12px;
}

.qb__ghost {
  opacity: 0.55;
}

.qb__drag {
  opacity: 0.95;
}

.qb__row {
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

.qb__row:hover {
  border-color: var(--el-color-primary-light-5);
}

.qb__row:focus-visible {
  outline: 2px solid var(--el-color-primary);
  outline-offset: 2px;
}

.qb__row.active {
  border-color: var(--el-color-primary);
  background: var(--el-fill-color-blank);
  box-shadow: 0 0 0 1px color-mix(in srgb, var(--el-color-primary) 35%, transparent);
}

.qb__row--readonly {
  cursor: default;
}

.qb__row--readonly:hover {
  border-color: var(--el-border-color-lighter);
}

.qb__row--readonly:focus-visible {
  outline: none;
}

.qb__row-toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
}

.qb__drag-h {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  flex-shrink: 0;
  color: var(--el-text-color-secondary);
  cursor: grab;
}

.qb__drag-h:active {
  cursor: grabbing;
}

.qb__badge {
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

.qb__row-hide {
  flex-shrink: 0;
}

.qb__row-preview {
  pointer-events: none;
  padding: 8px 12px 12px;
  border-top: 1px dashed var(--el-border-color-extra-light);
  background: var(--el-fill-color-blank);
}

.qb__row-preview--raw {
  padding-top: 10px;
  font-size: 12px;
  line-height: 1.5;
}

.qb__pv-empty {
  font-size: 13px;
}

.qb__pv-pattern {
  margin: 6px 0 0;
  font-size: 11px;
}

.qb__pv-stack {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
}

.qb__pv-stack :deep(.el-radio),
.qb__pv-stack :deep(.el-checkbox) {
  margin-right: 0;
}

.qb__pv-field {
  margin-bottom: 8px;
}

.qb__pv-field:last-child {
  margin-bottom: 0;
}

.qb__pv-label {
  font-size: 14px;
  font-weight: 600;
  line-height: 1.4;
  color: var(--el-text-color-regular);
  margin-bottom: 8px;
}

.qb__pv-control {
  min-width: 0;
}

.qb__editor-head {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.qb__empty-editor {
  padding: 48px 12px;
  text-align: center;
  border: 1px dashed var(--el-border-color);
  border-radius: 10px;
  margin-top: 8px;
}

.qb__ctx {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  min-width: 0;
}

.qb__ctx-num {
  font-size: 12px;
  font-weight: 700;
  color: var(--el-text-color-secondary);
}

.qb__editor-alert {
  margin-bottom: 12px;
}

.qb__ctx-switches {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 8px 12px;
  margin-left: auto;
}

.qb__ctx-sw {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.qb__ctx-sw-lbl {
  font-size: 12px;
  white-space: nowrap;
}

.qb__row-del {
  flex-shrink: 0;
  margin-left: auto !important;
}

.qb__form {
  max-width: none;
}

.qb__fake-item {
  margin-bottom: 16px;
}

.qb__fake-label {
  font-size: 12px;
  line-height: 1.5;
  margin-bottom: 6px;
  color: var(--el-text-color-regular);
}

.qb__fake-item--switch {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.qb__sect--base {
  padding-bottom: 8px;
  margin-bottom: 12px;
  border-bottom: 1px dashed var(--el-border-color-lighter);
}

.qb__opts-head {
  display: flex;
  align-items: center;
  margin: 12px 0 8px;
}

.qb__opts-body {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 0;
}

.qb__opts-add {
  width: 100%;
}

.qb__opts-title {
  font-size: 13px;
  font-weight: 600;
}

.qb__opt-block {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 10px;
  width: 100%;
  min-width: 0;
}

.qb__opt-block.el-radio-group {
  display: grid !important;
  align-items: stretch;
  font-size: inherit;
  line-height: inherit;
}

.qb__opt-remove {
  flex-shrink: 0;
  justify-self: end;
}

.qb__opt--with-default {
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

.qb__opt-default-el {
  justify-self: center;
  margin: 0;
  height: 32px;
  display: inline-flex;
  align-items: center;
}

.qb__opt-default-el :deep(.el-radio__label) {
  display: none;
}

.qb__opt-default-el--chk :deep(.el-checkbox__label) {
  display: none;
}

.qb__opt-idx {
  font-size: 11px;
  color: var(--el-text-color-secondary);
  text-align: center;
}
</style>
