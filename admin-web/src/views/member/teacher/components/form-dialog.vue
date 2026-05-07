<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { Recordable, UniFormConfig } from 'uni-ui-lib'

import { useAppI18n } from '@/composables/use-app-i18n'
import type { TeacherDetail } from '@/types/modules/member-teacher'

const props = defineProps<{
  visible: boolean
  mode: 'add' | 'edit'
  source?: TeacherDetail | null
  config: UniFormConfig
}>()

const emit = defineEmits<{
  'update:visible': [visible: boolean]
  submit: [value: Recordable]
}>()

const { t } = useAppI18n()
const formModel = ref<Recordable>({})
const dialogTitle = computed(() =>
  props.mode === 'add' ? t('member.actions.add') : t('member.actions.edit')
)

watch(
  () => [props.visible, props.source] as const,
  () => {
    if (!props.visible) {
      return
    }

    formModel.value =
      props.mode === 'edit' && props.source
        ? { ...props.source, password: '' }
        : { modules: [], roles: [], status: 1 }
  },
  { immediate: true }
)

const close = () => {
  emit('update:visible', false)
}
</script>

<template>
  <el-dialog
    :model-value="visible"
    :title="dialogTitle"
    width="880px"
    destroy-on-close
    :close-on-click-modal="false"
    @update:model-value="emit('update:visible', $event)"
  >
    <UniForm v-model="formModel" :config="config" mode="edit" @submit="emit('submit', $event)">
      <template #actions="{ submit, reset }">
        <el-button type="primary" @click="submit">{{ t('member.actions.save') }}</el-button>
        <el-button @click="reset">{{ t('member.actions.reset') }}</el-button>
        <el-button @click="close">{{ t('member.actions.cancel') }}</el-button>
      </template>
    </UniForm>
  </el-dialog>
</template>
