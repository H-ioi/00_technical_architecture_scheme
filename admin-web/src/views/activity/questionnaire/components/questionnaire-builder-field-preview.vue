<template>
  <div class="qb__row-preview">
    <div class="qb__pv">
      <template v-if="field.type === 'input'">
        <div class="qb__pv-field">
          <div class="qb__pv-label">{{ preview.label }}</div>
          <div class="qb__pv-control">
            <el-input :placeholder="field.properties.placeholder || undefined" disabled />
          </div>
        </div>
      </template>

      <template v-else-if="field.type === 'textarea'">
        <div class="qb__pv-field">
          <div class="qb__pv-label">{{ preview.label }}</div>
          <div class="qb__pv-control">
            <el-input
              type="textarea"
              :autosize="{ minRows: preview.textareaRows, maxRows: preview.textareaRows }"
              :placeholder="field.properties.placeholder || undefined"
              disabled
            />
          </div>
        </div>
      </template>

      <template v-else-if="field.type === 'radio'">
        <div class="qb__pv-field">
          <div class="qb__pv-label">{{ preview.label }}</div>
          <div class="qb__pv-control">
            <template v-if="preview.options.length">
              <el-radio-group :model-value="preview.radioVal" disabled>
                <div class="qb__pv-stack">
                  <el-radio v-for="opt in preview.options" :key="opt.id" :label="String(opt.id)">
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

      <template v-else-if="field.type === 'checkbox'">
        <div class="qb__pv-field">
          <div class="qb__pv-label">{{ preview.label }}</div>
          <div class="qb__pv-control">
            <template v-if="preview.options.length">
              <el-checkbox-group :model-value="preview.multiVals" disabled>
                <div class="qb__pv-stack">
                  <el-checkbox v-for="opt in preview.options" :key="opt.id" :label="Number(opt.id)">
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

      <template v-else-if="field.type === 'select'">
        <div class="qb__pv-field">
          <div class="qb__pv-label">{{ preview.label }}</div>
          <div class="qb__pv-control">
            <template v-if="preview.options.length">
              <el-select
                :model-value="preview.selectMulti ? preview.multiVals : preview.radioVal"
                :multiple="preview.selectMulti"
                collapse-tags
                collapse-tags-tooltip
                disabled
                style="width: 100%"
              >
                <el-option
                  v-for="opt in preview.options"
                  :key="opt.id"
                  :label="opt.label"
                  :value="preview.selectMulti ? Number(opt.id) : String(opt.id)"
                />
              </el-select>
            </template>
            <span v-else class="qb__pv-empty qb__muted">{{
              t('activity.qbPreviewNoOptions')
            }}</span>
          </div>
        </div>
      </template>

      <template v-else-if="field.type === 'datetimepicker'">
        <div class="qb__pv-field">
          <div class="qb__pv-label">{{ preview.label }}</div>
          <div class="qb__pv-control">
            <el-date-picker
              :teleported="false"
              disabled
              class="qb__pv-dp"
              style="width: 100%"
              :type="preview.dateType"
              :placeholder="t('activity.qbPreviewDatePh')"
            />
            <p v-if="field.properties.datetime_pattern" class="qb__pv-pattern qb__muted">
              {{ field.properties.datetime_pattern }}
            </p>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DesignerFieldKnown } from '@/types/modules/activity-questionnaire'

import type { KnownFieldPreview } from './questionnaire-builder-utils'

defineProps<{
  field: DesignerFieldKnown
  preview: KnownFieldPreview
  t: (key: string, params?: Record<string, unknown>) => string
}>()
</script>
