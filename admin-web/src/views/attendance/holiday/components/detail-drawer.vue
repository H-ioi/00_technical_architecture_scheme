<template>
  <el-drawer
    v-model="visible"
    :title="$t('attendance.detail')"
    direction="rtl"
    size="560px"
    destroy-on-close>
    <div
      v-loading="loading"
      class="holiday-detail-drawer__body"
      :element-loading-text="$t('common.loading')">
      <UniForm v-if="source" v-model="viewFormModel" :config="config" />
    </div>
    <template #footer>
      <el-button @click="visible = false">{{ $t('member.actions.close') }}</el-button>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import type { UniFormConfig } from 'uni-ui-lib'

import { useViewOnlyFormModel } from '@/composables/use-view-only-form-model'

import type { AttendanceHolidayDetailViewModel } from '../list.config'

const visible = defineModel<boolean>('visible', { required: true })

const props = defineProps<{
  /** 查看态扁平模型（由列表页拉取详情后 `formatHolidayDetailView` 生成） */
  source: AttendanceHolidayDetailViewModel | null
  config: UniFormConfig
  loading?: boolean
}>()

const viewFormModel = useViewOnlyFormModel(() => props.source)
</script>

<style scoped lang="scss">
.holiday-detail-drawer__body {
  min-height: 200px;
  position: relative;
}
</style>
