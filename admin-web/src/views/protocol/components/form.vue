<template>
  <el-dialog
    v-model="visible"
    :title="title"
    width="920px"
    destroy-on-close>
    <div
      v-loading="detailLoading"
      class="protocol-form__body"
      :element-loading-text="$t('common.loading')">
      <UniForm ref="uniFormRef" v-model="formModel" mode="edit" :config="dialogFormConfig">
        <template #field-documentUrl>
          <UniUpload
            v-model:file-list="fileList"
            drag
            accept=".pdf,application/pdf"
            :limit="1"
            :max-size="10 * 1024 * 1024"
            :request="uploadReq"
            @validate-error="onUploadErr"
            @remove="clearDoc">
            <template #tip>
              <div class="protocol-form__upload-tip">
                {{ $t('protocol.messages.uploadPdfSize') }}
              </div>
            </template>
          </UniUpload>
        </template>
      </UniForm>
    </div>

    <template #footer>
      <el-button @click="close">{{ $t('protocol.actions.cancel') }}</el-button>
      <el-button type="primary" :loading="submitting" @click="submit">
        {{ $t('protocol.actions.submit') }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import type { UploadRequestOptions, UploadUserFile } from 'element-plus'
import { ElMessage } from 'element-plus'
import type { UniFormConfig } from 'uni-ui-lib'
import { UniForm, useUniI18n } from 'uni-ui-lib'
import { computed, nextTick, ref, watch } from 'vue'

import { protocolApi } from '@/api'
import { useDialogDetailLoading } from '@/composables/use-dialog-detail-loading'
import type { ProtocolFormEmits, ProtocolFormProps } from '@/types/components/protocol-form'
import type { ProtocolFormModel, ProtocolRecord } from '@/types/modules/protocol'

import { protocolDialogFormConfig } from '../list.config'

const visible = defineModel<boolean>('visible', { required: true })

const props = defineProps<ProtocolFormProps>()

const emit = defineEmits<ProtocolFormEmits>()

const { t } = useUniI18n()
const { detailLoading, runWithDetailLoading } = useDialogDetailLoading()
const uniFormRef = ref<InstanceType<typeof UniForm> | null>(null)
const submitting = ref(false)
const fileList = ref<UploadUserFile[]>([])
const formModel = ref<ProtocolFormModel>({})
const dialogFormConfig = computed<UniFormConfig>(() =>
  protocolDialogFormConfig(
    t,
    props.schoolOptions,
    props.protocolTypeOptions,
    props.moduleOptions,
    props.yesNoOptions,
    props.statusOptions
  )
)
const title = computed(() =>
  t(props.mode === 'add' ? 'protocol.actions.add' : 'protocol.actions.edit')
)

const revalidateDocument = () => {
  nextTick(() => {
    const exposed = uniFormRef.value as unknown as
      | { validateField?: (prop: string | string[]) => Promise<unknown> }
      | null
      | undefined
    void exposed?.validateField?.('documentUrl')?.catch(() => undefined)
  })
}

const resetForm = () => {
  fileList.value = []

  const next: ProtocolFormModel = {
    needSign: 1,
    status: 1
  }

  if (props.schoolOptions.length === 1) {
    next.schoolIds = [props.schoolOptions[0].value as string | number]
  }

  formModel.value = next

  nextTick(() => {
    uniFormRef.value?.clearValidate()
  })
}

const fillForm = (record: ProtocolRecord) => {
  formModel.value = {
    id: record.id,
    schoolIds: Array.isArray(record.schoolIds) ? record.schoolIds : [],
    cnName: record.cnName,
    enName: record.enName,
    protocolType: record.protocolType,
    module: record.module,
    needSign: record.needSign,
    status: record.status,
    documentUrl: record.documentUrl
  }

  fileList.value = record.documentUrl
    ? [
        {
          name: record.enName || record.cnName || String(record.documentUrl),
          url: record.documentUrl
        }
      ]
    : []
}

const close = () => {
  visible.value = false
}

const uploadReq = async (options: UploadRequestOptions) => {
  const file = options.file
  const url = await protocolApi.upload.post(file)

  if (!url) {
    throw new Error(t('protocol.messages.uploadRequired'))
  }

  formModel.value.documentUrl = url
  fileList.value = [{ name: file.name, url }]
  revalidateDocument()

  return { url }
}

const onUploadErr = (message: string) => {
  ElMessage.error(message)
}

const clearDoc = () => {
  formModel.value.documentUrl = undefined
  fileList.value = []
}

const submit = async () => {
  const valid = await uniFormRef.value?.validate().catch(() => false)

  if (!valid) {
    return
  }

  submitting.value = true

  try {
    if (props.mode === 'add') {
      await protocolApi.add.post({ ...formModel.value })
    } else {
      await protocolApi.edit.post({ ...formModel.value })
    }

    ElMessage.success(t('protocol.messages.saveSuccess'))
    emit('saved')
    close()
  } finally {
    submitting.value = false
  }
}

watch(visible, async (isOpen) => {
  if (!isOpen) {
    return
  }

  resetForm()

  if (props.mode === 'edit' && props.source?.id) {
    await runWithDetailLoading(async () => {
      fillForm(await protocolApi.info.get(props.source!.id))
    })
  }
})
</script>

<style scoped lang="scss">
.protocol-form__upload-tip {
  margin-top: 8px;
  color: var(--app-text-color-secondary);
  font-size: 12px;
}
</style>
