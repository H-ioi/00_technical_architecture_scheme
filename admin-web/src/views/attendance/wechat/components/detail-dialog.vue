<template>
  <el-dialog
    v-model="visible"
    :title="$t('attendance.wechatOpenid.actions.detail')"
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
import type { AttendanceWechatOpenidRecord } from '@/types/modules/attendance-wechat-openid'

const visible = defineModel<boolean>('visible', { required: true })

const props = defineProps<{
  source: AttendanceWechatOpenidRecord | null
  config: UniFormConfig
}>()

const viewFormModel = useViewOnlyFormModel(() => props.source)
</script>

<style scoped lang="scss"></style>
