<template>
  <el-drawer
    v-model="visible"
    :title="drawerTitle"
    size="720px"
    destroy-on-close
    class="regulation-form-drawer">
    <div v-if="visible" v-loading="loading" class="regulation-form-drawer__body">
      <UniForm
        ref="uniFormRef"
        v-model="formModel"
        :mode="mode === 'view' ? 'view' : 'edit'"
        :config="formCfg" />

      <div class="regulation-form-drawer__attachment">
        <div class="regulation-form-drawer__attachment-label">
          <span>{{ $t('schoolDoctor.regulation.fieldAttachment') }}</span>
          <span class="regulation-form-drawer__attachment-tip">{{
            $t('schoolDoctor.regulation.pdfOnly')
          }}</span>
        </div>
        <div v-if="formModel.attachmentUrl" class="regulation-form-drawer__file">
          <el-link :href="formModel.attachmentUrl" target="_blank" type="primary">
            {{ displayFileName }}
          </el-link>
          <el-button v-if="mode !== 'view'" type="danger" link @click="removeAttachment">
            {{ $t('schoolDoctor.common.remove') }}
          </el-button>
        </div>
        <el-upload
          v-else-if="mode !== 'view'"
          action="#"
          :show-file-list="false"
          accept=".pdf,application/pdf"
          :http-request="handleUpload"
          :before-upload="beforePdfUpload">
          <el-button :loading="uploading">{{ $t('schoolDoctor.common.upload') }}</el-button>
        </el-upload>
        <span v-else>--</span>
      </div>
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
import type { UploadRequestOptions } from 'element-plus'
import { ElMessage } from 'element-plus'
import { UniForm, useUniI18n } from 'uni-ui-lib'
import type { UniFormConfig } from 'uni-ui-lib'
import { computed, ref, watch } from 'vue'

import { medicalInfoApi, schoolDoctorRegulationApi } from '@/api'
import { useDialogDetailLoading } from '@/composables/use-dialog-detail-loading'
import type { SchoolDoctorRegulationFormModel } from '@/types/modules/school-doctor-regulation'

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
  schoolOptions: Array<{ label: string; value: string | number }>
}>()

const emit = defineEmits<{
  saved: []
}>()

const { t } = useUniI18n()
const { detailLoading: loading, runWithDetailLoading } = useDialogDetailLoading()
const uniFormRef = ref<InstanceType<typeof UniForm> | null>(null)
const submitting = ref(false)
const uploading = ref(false)
const formModel = ref<SchoolDoctorRegulationFormModel>(emptyFormModel())

const formCfg = computed<UniFormConfig>(() => ({
  ...dialogFormConfig(t, props.schoolOptions, typeOpts(t), statusOpts(t)),
  rules: props.mode === 'view' ? undefined : dialogFormRules(t)
}))

const drawerTitle = computed(() => {
  if (props.mode === 'add') {
    return t('schoolDoctor.regulation.detailAddTitle')
  }
  if (props.mode === 'edit') {
    return t('schoolDoctor.regulation.detailEditTitle')
  }
  return t('schoolDoctor.regulation.detailViewTitle')
})

const displayFileName = computed(() => {
  const name = formModel.value.attachmentName || ''
  if (name) {
    return name.length > 40 ? `${name.slice(0, 40)}...` : name
  }
  const url = formModel.value.attachmentUrl || ''
  const matched = url.match(/[^/?#]+(?=[?#]|$)/)
  return matched ? decodeURIComponent(matched[0]) : t('schoolDoctor.common.viewAttachment')
})

function beforePdfUpload(file: File) {
  const isPdf = file.type === 'application/pdf' || /\.pdf$/i.test(file.name || '')
  if (!isPdf) {
    ElMessage.warning(t('schoolDoctor.regulation.pdfOnly'))
    return false
  }
  return true
}

async function handleUpload(option: UploadRequestOptions) {
  if (!beforePdfUpload(option.file)) {
    return
  }
  uploading.value = true
  try {
    const url = await medicalInfoApi.uploadAttachment.post(option.file)
    formModel.value.attachmentUrl = url
    formModel.value.attachmentName = option.file.name
    ElMessage.success(t('schoolDoctor.common.uploadSuccess'))
  } catch {
    ElMessage.error(t('schoolDoctor.common.uploadFailed'))
  } finally {
    uploading.value = false
  }
}

function removeAttachment() {
  formModel.value.attachmentUrl = ''
  formModel.value.attachmentName = ''
}

watch(visible, async (open) => {
  if (!open) {
    return
  }
  formModel.value = emptyFormModel()
  if (props.mode === 'add' || props.recordId == null) {
    return
  }
  await runWithDetailLoading(async () => {
    const data = await schoolDoctorRegulationApi.detail.get(props.recordId!)
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
      await schoolDoctorRegulationApi.add.post(formModel.value)
      ElMessage.success(t('schoolDoctor.common.addSuccess'))
    } else {
      await schoolDoctorRegulationApi.edit.post(formModel.value)
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
.regulation-form-drawer {
  &__body {
    padding: 16px;
  }

  &__attachment {
    margin-top: 8px;
    padding: 14px;
    background: var(--el-fill-color-light);
    border: 1px solid var(--el-border-color-lighter);
    border-radius: 10px;
  }

  &__attachment-label {
    display: flex;
    justify-content: space-between;
    margin-bottom: 12px;
    font-size: 14px;
    color: var(--el-text-color-regular);
  }

  &__attachment-tip {
    font-size: 12px;
    color: var(--el-color-danger);
  }

  &__file {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }
}
</style>
