<template>
  <aside class="qb__palette qb__panel">
    <div class="qb__palette-head">
      <span class="qb__panel-title">{{ t('activity.qbPaletteTitle') }}</span>
      <span class="qb__toolbar-count qb__muted">{{
        t('activity.qbTotalQuestions', { n: totalCount })
      }}</span>
    </div>
    <div class="qb__type-grid">
      <el-button
        v-for="btn in BUILDER_PALETTE_TYPES"
        :key="btn"
        plain
        size="small"
        class="qb__type-btn"
        @click="emit('add', btn)">
        <el-icon :size="16" class="qb__type-btn-ic">
          <component :is="PALETTE_ICON[btn]" />
        </el-icon>
        <span class="qb__type-btn-txt">{{ t(`activity.qbTypes.${btn}`) }}</span>
      </el-button>
    </div>
    <p class="qb__hint qb__muted">{{ t('activity.qbPaletteHint') }}</p>
  </aside>
</template>

<script setup lang="ts">
import {
  Aim,
  Calendar,
  Checked,
  EditPen,
  Memo,
  Select as SelectIcon
} from '@element-plus/icons-vue'
import type { Component } from 'vue'

import { BUILDER_PALETTE_TYPES, type PaletteType } from './questionnaire-builder-utils'

defineProps<{ t: (key: string, params?: Record<string, unknown>) => string; totalCount: number }>()

const emit = defineEmits<{ add: [type: PaletteType] }>()

const PALETTE_ICON: Record<PaletteType, Component> = {
  input: EditPen,
  textarea: Memo,
  radio: Aim,
  checkbox: Checked,
  select: SelectIcon,
  datetimepicker: Calendar
}
</script>
