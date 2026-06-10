<template>
  <div class="qb__list qb__panel">
    <div class="qb__list-head">
      <span class="qb__panel-title">{{ t('activity.qbListTitle') }}</span>
    </div>

    <el-empty v-if="!fields.length" :description="t('activity.qbEmpty')" />

    <el-scrollbar
      v-else
      class="qb__scroll qb__scroll--list"
      max-height="min(720px, calc(100vh - 260px))"
    >
      <draggable
        :model-value="fields"
        item-key="fontId"
        handle=".qb__drag-h"
        :disabled="readonly"
        :animation="180"
        ghost-class="qb__ghost"
        drag-class="qb__drag"
        class="qb__draggable"
        tag="div"
        @update:model-value="emit('update:fields', $event)"
      >
        <template #item="{ element: row, index: idx }">
          <div
            :key="row.fontId"
            class="qb__row"
            :class="{
              active: !readonly && selectedFontId === row.fontId,
              'qb__row--readonly': readonly
            }"
            :role="readonly ? undefined : 'button'"
            :tabindex="readonly ? undefined : 0"
            @click="emit('row-click', row.fontId)"
            @keydown.enter.prevent="emit('row-click', row.fontId)"
          >
            <div class="qb__row-toolbar">
              <span v-if="!readonly" class="qb__drag-h" :title="t('activity.qbDrag')" @click.stop>
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
                class="qb__row-hide"
              >
                {{ t('activity.qbHide') }}
              </el-tag>
              <el-button
                v-if="!readonly"
                text
                type="danger"
                :icon="Delete"
                class="qb__row-del"
                @click.stop="emit('remove', idx)"
              />
            </div>

            <div v-if="row.kind === 'raw'" class="qb__row-preview qb__row-preview--raw qb__muted">
              {{ t('activity.qbPreviewLegacy', { type: rawType(row) }) }}
            </div>

            <template v-else>
              <QuestionnaireBuilderFieldPreview
                v-for="fk in previewSlice(row)"
                :key="fk.fontId"
                :field="fk"
                :preview="fieldPreview(fk)"
                :t="t"
              />
            </template>
          </div>
        </template>
      </draggable>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import type {
  DesignerField,
  DesignerFieldKnown,
  DesignerFieldRaw
} from '@/types/modules/activity-questionnaire'
import { Delete, Rank } from '@element-plus/icons-vue'
import draggable from 'vuedraggable'

import QuestionnaireBuilderFieldPreview from './questionnaire-builder-field-preview.vue'
import type { KnownFieldPreview } from './questionnaire-builder-utils'

defineProps<{
  fields: DesignerField[]
  readonly: boolean
  selectedFontId: string | null
  t: (key: string, params?: Record<string, unknown>) => string
  rowBadge: (row: DesignerField) => string
  rawType: (row: DesignerFieldRaw) => string
  effectiveKnown: (row: DesignerField) => DesignerFieldKnown | null
  previewSlice: (row: DesignerField) => DesignerFieldKnown[]
  fieldPreview: (field: DesignerFieldKnown) => KnownFieldPreview
}>()

const emit = defineEmits<{
  'update:fields': [fields: DesignerField[]]
  'row-click': [fontId: string]
  remove: [index: number]
}>()
</script>
