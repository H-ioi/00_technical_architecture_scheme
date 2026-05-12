<template>
  <el-dialog
    :model-value="visible"
    :title="$t('attendance.wechatOpenid.actions.detail')"
    width="880px"
    destroy-on-close
    @update:model-value="emit('update:visible', $event)">
    <UniForm v-if="source" :model-value="source" :config="config" mode="view" />
    <template #footer>
      <el-button @click="emit('update:visible', false)">{{ $t('member.actions.close') }}</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import type { UniFormConfig } from 'uni-ui-lib'

import type { AttendanceWechatOpenidRecord } from '@/types/modules/attendance-wechat-openid'

defineProps<{
  visible: boolean
  source: AttendanceWechatOpenidRecord | null
  config: UniFormConfig
}>()

const emit = defineEmits<{
  'update:visible': [boolean]
}>()
</script>

<style scoped lang="scss"></style>
