<script setup lang="ts">
import type { UniFormConfig } from 'uni-ui-lib'

import { useAppI18n } from '@/composables/use-app-i18n'
import type { TeacherDetail } from '@/types/modules/member-teacher'

defineProps<{
  visible: boolean
  source?: TeacherDetail | null
  config: UniFormConfig
}>()

const emit = defineEmits<{
  'update:visible': [visible: boolean]
  edit: []
}>()

const { t } = useAppI18n()
</script>

<template>
  <el-dialog
    :model-value="visible"
    :title="t('member.actions.detail')"
    width="880px"
    destroy-on-close
    @update:model-value="emit('update:visible', $event)"
  >
    <UniForm v-if="source" :model-value="source" :config="config" mode="view" />
    <template #footer>
      <el-button @click="emit('update:visible', false)">{{ t('member.actions.close') }}</el-button>
      <el-button type="primary" @click="emit('edit')">{{ t('member.actions.edit') }}</el-button>
    </template>
  </el-dialog>
</template>
