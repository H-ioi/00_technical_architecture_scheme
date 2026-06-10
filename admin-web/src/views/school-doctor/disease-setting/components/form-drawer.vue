<template>
  <el-drawer
    v-model="visible"
    :title="drawerTitle"
    size="600px"
    destroy-on-close
    class="disease-setting-form-drawer">
    <div v-if="visible" v-loading="loading" class="disease-setting-form-drawer__body">
      <UniForm
        ref="uniFormRef"
        v-model="formModel"
        :mode="mode === 'view' ? 'view' : 'edit'"
        :config="formCfg" />
    </div>

    <template v-if="mode !== 'view'" #footer>
      <el-button @click="visible = false">{{ $t('schoolDoctor.common.cancel') }}</el-button>
      <el-button type="primary" :loading="submitting" @click="submit">
        {{ $t('schoolDoctor.common.confirm') }}
      </el-button>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { UniForm, useUniI18n } from 'uni-ui-lib'
import type { UniFormConfig } from 'uni-ui-lib'
import { computed, ref, watch } from 'vue'

import { schoolDoctorDiseaseSettingApi } from '@/api'
import { useDialogDetailLoading } from '@/composables/use-dialog-detail-loading'
import type { SchoolDoctorDiseaseSettingFormModel } from '@/types/modules/school-doctor-disease-setting'

import {
  dialogFormConfig,
  dialogFormRules,
  emptyFormModel,
  statusOpts,
  typeOpts
} from '../list.config'

const visible = defineModel<boolean>('visible', { required: true })

const props = defineProps<{
  mode: 'add' | 'view' | 'edit'
  recordId?: string | number
}>()

const emit = defineEmits<{
  saved: []
}>()

const { t } = useUniI18n()
const { detailLoading: loading, runWithDetailLoading } = useDialogDetailLoading()
const uniFormRef = ref<InstanceType<typeof UniForm> | null>(null)
const submitting = ref(false)
const formModel = ref<SchoolDoctorDiseaseSettingFormModel>(emptyFormModel())

const formCfg = computed<UniFormConfig>(() => ({
  ...dialogFormConfig(t, typeOpts(t), statusOpts(t)),
  rules: props.mode === 'view' ? undefined : dialogFormRules(t)
}))

const drawerTitle = computed(() => {
  if (props.mode === 'add') {
    return t('schoolDoctor.diseaseSetting.detailAddTitle')
  }
  if (props.mode === 'edit') {
    return t('schoolDoctor.diseaseSetting.detailEditTitle')
  }
  return t('schoolDoctor.diseaseSetting.detailViewTitle')
})

watch(visible, async (open) => {
  if (!open) {
    return
  }
  formModel.value = emptyFormModel()
  if (props.mode === 'add' || props.recordId == null) {
    return
  }
  await runWithDetailLoading(async () => {
    const data = await schoolDoctorDiseaseSettingApi.detail.get(props.recordId!)
    formModel.value = {
      ...emptyFormModel(),
      ...data,
      id: props.recordId
    }
  })
})

async function submit() {
  const valid = await uniFormRef.value?.validate().catch(() => false)
  if (!valid) {
    return
  }
  submitting.value = true
  try {
    if (props.mode === 'add') {
      await schoolDoctorDiseaseSettingApi.add.post(formModel.value)
      ElMessage.success(t('schoolDoctor.common.addSuccess'))
    } else {
      await schoolDoctorDiseaseSettingApi.edit.post(formModel.value)
      ElMessage.success(t('schoolDoctor.common.saveSuccess'))
    }
    visible.value = false
    emit('saved')
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped lang="scss">
.disease-setting-form-drawer__body {
  padding: 16px;
}
</style>
