<template>
  <aside class="qb__editor qb__panel">
    <div class="qb__editor-head">
      <span class="qb__panel-title">{{ t('activity.qbPropsTitle') }}</span>
    </div>

    <div v-if="!selected" class="qb__empty-editor qb__muted">{{ t('activity.qbPickFirst') }}</div>

    <template v-else>
      <div class="qb__ctx">
        <span class="qb__ctx-num">#{{ selectedOrdinal }}</span>
        <el-tag size="small" type="primary" effect="plain">{{ rowBadge(selected) }}</el-tag>
        <div v-if="selected.kind === 'known' && draft" class="qb__ctx-switches" @click.stop>
          <span class="qb__ctx-sw">
            <span class="qb__ctx-sw-lbl qb__muted">{{ t('activity.qbRequired') }}</span>
            <el-switch
              :model-value="knownHeaderProp(selected.fontId).required"
              size="small"
              @change="emit('set-required', selected.fontId, $event)"
            />
          </span>
          <span class="qb__ctx-sw">
            <span class="qb__ctx-sw-lbl qb__muted">{{ t('activity.qbHide') }}</span>
            <el-switch
              :model-value="knownHeaderProp(selected.fontId).isHide"
              size="small"
              @change="emit('set-hide', selected.fontId, $event)"
            />
          </span>
        </div>
      </div>

      <div class="qb__scroll qb__scroll--editor">
        <el-alert
          v-if="selected.kind === 'raw'"
          type="warning"
          show-icon
          :closable="false"
          class="qb__editor-alert"
        >
          {{ t('activity.qbRawHint', { type: rawType(selected) }) }}
        </el-alert>

        <template v-else-if="draft">
          <UniForm v-model="draft" mode="edit" class="qb__form" :config="sideFormConfig">
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
                    style="width: 100%"
                  />
                </div>
              </template>

              <template
                v-else-if="
                  draft.type === 'radio' || draft.type === 'checkbox' || draft.type === 'select'
                "
              >
                <div v-if="draft.type === 'select'" class="qb__fake-item qb__fake-item--switch">
                  <span class="qb__fake-label">{{ t('activity.qbMulti') }}</span>
                  <el-switch
                    :model-value="selectMulti"
                    @update:model-value="emit('update:selectMulti', $event)"
                  />
                </div>

                <div class="qb__opts-head">
                  <span class="qb__opts-title">{{ t('activity.qbOptions') }}</span>
                </div>

                <div class="qb__opts-body">
                  <el-scrollbar class="qb__scroll qb__scroll--opts" max-height="min(440px, 48vh)">
                    <div class="qb__opts-strip">
                      <el-radio-group
                        v-if="useSingleDefaultPicker"
                        :model-value="radioDefault"
                        class="qb__opt-block"
                        @update:model-value="emit('update:radioDefault', $event)"
                      >
                        <div
                          v-for="(opt, oi) in options"
                          :key="opt.id"
                          class="qb__opt qb__opt--with-default"
                        >
                          <span class="qb__opt-idx">{{ oi + 1 }}</span>
                          <el-input v-model="opt.label" :placeholder="t('activity.qbOptLabel')" />
                          <el-radio
                            :label="String(opt.id)"
                            :title="t('activity.qbDefault')"
                            class="qb__opt-default-el"
                          />
                          <el-button
                            text
                            link
                            type="danger"
                            :icon="Delete"
                            class="qb__opt-remove"
                            :title="t('activity.qbRemove')"
                            @click="emit('remove-option', oi)"
                          />
                        </div>
                      </el-radio-group>

                      <div v-else-if="useMultiDefaultPicker" class="qb__opt-block">
                        <div
                          v-for="(opt, oi) in options"
                          :key="opt.id"
                          class="qb__opt qb__opt--with-default"
                        >
                          <span class="qb__opt-idx">{{ oi + 1 }}</span>
                          <el-input v-model="opt.label" :placeholder="t('activity.qbOptLabel')" />
                          <el-checkbox
                            :model-value="multiDefaultHas(Number(opt.id))"
                            :title="t('activity.qbDefault')"
                            class="qb__opt-default-el qb__opt-default-el--chk"
                            @change="emit('multi-default-change', Number(opt.id), $event)"
                          />
                          <el-button
                            text
                            link
                            type="danger"
                            :icon="Delete"
                            class="qb__opt-remove"
                            :title="t('activity.qbRemove')"
                            @click="emit('remove-option', oi)"
                          />
                        </div>
                      </div>
                    </div>
                  </el-scrollbar>
                  <el-button
                    size="small"
                    type="primary"
                    class="qb__opts-add"
                    plain
                    @click="emit('add-option')"
                  >
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
                    @change="emit('sync-dt')"
                  >
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
                    show-word-limit
                  />
                </div>
              </template>
            </template>
          </UniForm>
        </template>
      </div>
    </template>
  </aside>
</template>

<script setup lang="ts">
import type {
  DesignerField,
  DesignerFieldKnown,
  DesignerFieldRaw,
  DesignerOption
} from '@/types/modules/activity-questionnaire'
import { Delete } from '@element-plus/icons-vue'
import type { UniFormConfig } from 'uni-ui-lib'
import { UniForm } from 'uni-ui-lib'

const draft = defineModel<DesignerFieldKnown | null>('draft', { required: true })

defineProps<{
  selected: DesignerField | null
  selectedOrdinal: number
  sideFormConfig: UniFormConfig
  selectMulti: boolean
  options: DesignerOption[]
  useSingleDefaultPicker: boolean
  useMultiDefaultPicker: boolean
  radioDefault: string
  t: (key: string, params?: Record<string, unknown>) => string
  rowBadge: (row: DesignerField) => string
  rawType: (row: DesignerFieldRaw) => string
  knownHeaderProp: (fontId: string) => { required: boolean; isHide: boolean }
  multiDefaultHas: (id: number) => boolean
}>()

const emit = defineEmits<{
  'set-required': [fontId: string, value: boolean | string | number]
  'set-hide': [fontId: string, value: boolean | string | number]
  'update:selectMulti': [value: boolean | string | number]
  'update:radioDefault': [value: string | number | boolean | undefined]
  'multi-default-change': [id: number, checked: boolean | string | number]
  'remove-option': [index: number]
  'add-option': []
  'sync-dt': []
}>()
</script>
