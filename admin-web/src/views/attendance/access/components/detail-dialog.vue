<template>
  <el-dialog
    v-model="visible"
    :title="$t('attendance.access.actions.detail')"
    width="880px"
    destroy-on-close>
    <UniForm v-if="source" v-model="viewFormModel" :config="config" mode="view" />
    <template #footer>
      <el-button @click="visible = false">{{ $t('member.actions.close') }}</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import type { UniFormConfig } from 'uni-ui-lib'

import { useViewOnlyFormModel } from '@/composables/use-view-only-form-model'
import type { AttendanceAccessRecord } from '@/types/modules/attendance-access'

const visible = defineModel<boolean>('visible', { required: true })

const props = defineProps<{
  source: AttendanceAccessRecord | null
  config: UniFormConfig
}>()

const viewFormModel = useViewOnlyFormModel(() => props.source)
</script>

<style scoped lang="scss"></style>
