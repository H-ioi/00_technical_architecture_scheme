<script setup lang="ts">
import { useUniI18n, type Recordable, type UniFormConfig } from 'uni-ui-lib'

defineProps<{
  visible: boolean
  source?: Recordable | null
  config: UniFormConfig
}>()

const emit = defineEmits<{
  'update:visible': [visible: boolean]
}>()

const { t } = useUniI18n()
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
    </template>
  </el-dialog>
</template>
