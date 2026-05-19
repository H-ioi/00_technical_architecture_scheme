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
                              <div class="qb__pv-label">{{ fieldPreview(fk).label }}</div>
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
                              <div class="qb__pv-label">{{ fieldPreview(fk).label }}</div>
                              <div class="qb__pv-control">
                                <el-input
                                  type="textarea"
                                  :autosize="{
                                    minRows: fieldPreview(fk).textareaRows,
                                    maxRows: fieldPreview(fk).textareaRows
                                  }"
                                  :placeholder="fk.properties.placeholder || undefined"
                                  disabled />
                              </div>
                            </div>
                          </template>

                          <!-- 单选 -->
                          <template v-else-if="fk.type === 'radio'">
                            <div class="qb__pv-field">
                              <div class="qb__pv-label">{{ fieldPreview(fk).label }}</div>
                              <div class="qb__pv-control">
                                <template v-if="fieldPreview(fk).options.length">
                                  <el-radio-group :model-value="fieldPreview(fk).radioVal" disabled>
                                    <div class="qb__pv-stack">
                                      <el-radio
                                        v-for="opt in fieldPreview(fk).options"
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
                              <div class="qb__pv-label">{{ fieldPreview(fk).label }}</div>
                              <div class="qb__pv-control">
                                <template v-if="fieldPreview(fk).options.length">
                                  <el-checkbox-group :model-value="fieldPreview(fk).multiVals" disabled>
                                    <div class="qb__pv-stack">
                                      <el-checkbox
                                        v-for="opt in fieldPreview(fk).options"
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
                              <div class="qb__pv-label">{{ fieldPreview(fk).label }}</div>
                              <div class="qb__pv-control">
                                <template v-if="fieldPreview(fk).options.length">
                                  <el-select
                                    :model-value="
                                      fieldPreview(fk).selectMulti
                                        ? fieldPreview(fk).multiVals
                                        : fieldPreview(fk).radioVal
                                    "
                                    :multiple="fieldPreview(fk).selectMulti"
                                    collapse-tags
                                    collapse-tags-tooltip
                                    disabled
                                    style="width: 100%">
                                    <el-option
                                      v-for="opt in fieldPreview(fk).options"
                                      :key="opt.id"
                                      :label="opt.label"
                                      :value="
                                        fieldPreview(fk).selectMulti ? Number(opt.id) : String(opt.id)
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
                              <div class="qb__pv-label">{{ fieldPreview(fk).label }}</div>
                              <div class="qb__pv-control">
                                <el-date-picker
                                  :teleported="false"
                                  disabled
                                  class="qb__pv-dp"
                                  style="width: 100%"
                                  :type="fieldPreview(fk).dateType"
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
import type { DesignerField, DesignerFieldRaw } from '@/types/modules/activity-questionnaire'
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
import { UniForm } from 'uni-ui-lib'
import type { Component } from 'vue'
import draggable from 'vuedraggable'

import { BUILDER_PALETTE_TYPES, type PaletteType } from './questionnaire-builder-utils'
import { useQuestionnaireBuilder } from './use-questionnaire-builder'

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

const {
  t,
  qbSideFormConfig,
  sel,
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
</script>

<style scoped lang="scss">
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
