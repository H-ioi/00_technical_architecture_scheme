<template>
  <el-dialog v-model="visible" :title="$t('dorm.roomAssign.addBed')" width="400px" destroy-on-close>
    <UniForm ref="uniFormRef" v-model="formModel" mode="edit" :config="formCfg" />
    <template #footer>
      <el-button @click="visible = false">{{ $t('dorm.common.cancel') }}</el-button>
      <el-button type="primary" :loading="submitting" @click="submit">
        {{ $t('dorm.common.submit') }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { UniForm, useUniI18n } from 'uni-ui-lib'
import type { UniFormConfig } from 'uni-ui-lib'
import { computed, ref, watch } from 'vue'

import { dormBedApi } from '@/api'

import {
  addBedFormConfig,
  addBedFormRules,
  emptyAddBedModel,
  type DormAddBedFormModel
} from '../assign.config'

const visible = defineModel<boolean>('visible', { required: true })

const props = defineProps<{
  roomId: string | number
}>()

const emit = defineEmits<{
  saved: []
}>()

const { t } = useUniI18n()
const uniFormRef = ref<InstanceType<typeof UniForm> | null>(null)
const submitting = ref(false)
const formModel = ref<DormAddBedFormModel>(emptyAddBedModel())

const formCfg = computed<UniFormConfig>(() => ({
  ...addBedFormConfig(t),
  rules: addBedFormRules(t)
}))

watch(
  () => visible.value,
  (open) => {
    if (!open) {
      formModel.value = emptyAddBedModel()
    }
  }
)

async function submit() {
  const valid = await uniFormRef.value?.validate().catch(() => false)
  if (!valid) {
    return
  }

  submitting.value = true
  try {
    await dormBedApi.create.post({
      roomId: props.roomId,
      label: formModel.value.label,
      is_active: 1
    })
    ElMessage.success(t('dorm.roomAssign.actionSuccess'))
    visible.value = false
    emit('saved')
  } finally {
    submitting.value = false
  }
}
</script>
