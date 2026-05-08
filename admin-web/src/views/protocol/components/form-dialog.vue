<script setup lang="ts">
import type { FormInstance, UploadRequestOptions, UploadUserFile } from 'element-plus'
import { ElMessage } from 'element-plus'
import type { UniOption } from 'uni-ui-lib'
import { computed, reactive, ref, watch } from 'vue'

import { addProtocol, fetchProtocolDetail, updateProtocol, uploadProtocolDocument } from '@/api'
import { useAppI18n } from '@/composables/use-app-i18n'
import type { ProtocolFormModel, ProtocolRecord } from '@/types/modules/protocol'

import { createFormRules } from '../list.config'

const props = defineProps<{
  visible: boolean
  mode: 'add' | 'edit'
  source?: ProtocolRecord | null
  schoolOptions: UniOption[]
  protocolTypeOptions: UniOption[]
  moduleOptions: UniOption[]
  yesNoOptions: UniOption[]
  statusOptions: UniOption[]
}>()

const emit = defineEmits<{
  'update:visible': [visible: boolean]
  saved: []
}>()

const { t } = useAppI18n()
const formRef = ref<FormInstance>()
const submitting = ref(false)
const fileList = ref<UploadUserFile[]>([])
const formModel = reactive<ProtocolFormModel>({})
const rules = computed(() => createFormRules(t))
const title = computed(() => t(props.mode === 'add' ? 'protocol.actions.add' : 'protocol.actions.edit'))

// 弹窗复用同一份表单状态，打开前必须清空旧值，避免新增/编辑之间串数据。
const resetForm = () => {
  Object.keys(formModel).forEach((key) => {
    delete formModel[key as keyof ProtocolFormModel]
  })
  fileList.value = []

  if (props.schoolOptions.length === 1) {
    formModel.schoolIds = [props.schoolOptions[0].value as string | number]
  }

  formModel.needSign = 1
  formModel.status = 1
  formRef.value?.clearValidate()
}

const fillForm = (record: ProtocolRecord) => {
  formModel.id = record.id
  formModel.schoolIds = Array.isArray(record.schoolIds) ? record.schoolIds : []
  formModel.cnName = record.cnName
  formModel.enName = record.enName
  formModel.protocolType = record.protocolType
  formModel.module = record.module
  formModel.needSign = record.needSign
  formModel.status = record.status
  formModel.documentUrl = record.documentUrl

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
  emit('update:visible', false)
}

// UniUpload 通过自定义 request 接入项目上传接口，成功后把返回 URL 写回表单字段参与校验。
const handleUploadRequest = async (options: UploadRequestOptions) => {
  const file = options.file
  const url = await uploadProtocolDocument(file)

  if (!url) {
    throw new Error(t('protocol.messages.uploadRequired'))
  }

  formModel.documentUrl = url
  fileList.value = [{ name: file.name, url }]
  await formRef.value?.validateField('documentUrl').catch(() => undefined)

  return { url }
}

const handleValidateError = (message: string) => {
  ElMessage.error(message)
}

const handleRemove = () => {
  formModel.documentUrl = undefined
  fileList.value = []
}

const submit = async () => {
  const valid = await formRef.value?.validate().catch(() => false)

  if (!valid) {
    return
  }

  submitting.value = true

  try {
    if (props.mode === 'add') {
      await addProtocol({ ...formModel })
    } else {
      await updateProtocol({ ...formModel })
    }

    ElMessage.success(t('protocol.messages.saveSuccess'))
    emit('saved')
    close()
  } finally {
    submitting.value = false
  }
}

watch(
  () => props.visible,
  async (visible) => {
    if (!visible) {
      return
    }

    resetForm()

    if (props.mode === 'edit' && props.source?.id) {
      fillForm(await fetchProtocolDetail(props.source.id))
    }
  }
)
</script>

<template>
  <el-dialog
    :model-value="visible"
    :title="title"
    width="920px"
    destroy-on-close
    @update:model-value="emit('update:visible', $event)"
  >
    <el-form ref="formRef" :model="formModel" :rules="rules" label-position="top">
      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item :label="t('protocol.fields.school')" prop="schoolIds">
            <el-select
              v-model="formModel.schoolIds"
              multiple
              collapse-tags
              filterable
              clearable
              :placeholder="t('protocol.placeholders.school')"
            >
              <el-option
                v-for="option in schoolOptions"
                :key="String(option.value)"
                :label="option.label"
                :value="option.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="t('protocol.fields.cnName')" prop="cnName">
            <el-input v-model="formModel.cnName" maxlength="50" :placeholder="t('protocol.placeholders.cnName')" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="t('protocol.fields.enName')" prop="enName">
            <el-input v-model="formModel.enName" maxlength="50" :placeholder="t('protocol.placeholders.enName')" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="t('protocol.fields.protocolType')" prop="protocolType">
            <el-select v-model="formModel.protocolType" filterable :placeholder="t('protocol.placeholders.protocolType')">
              <el-option
                v-for="option in protocolTypeOptions"
                :key="String(option.value)"
                :label="option.label"
                :value="option.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="t('protocol.fields.module')" prop="module">
            <el-select v-model="formModel.module" filterable :placeholder="t('protocol.placeholders.module')">
              <el-option
                v-for="option in moduleOptions"
                :key="String(option.value)"
                :label="option.label"
                :value="option.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="t('protocol.fields.needSign')" prop="needSign">
            <el-select v-model="formModel.needSign" :placeholder="t('protocol.placeholders.needSign')">
              <el-option
                v-for="option in yesNoOptions"
                :key="String(option.value)"
                :label="option.label"
                :value="option.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="t('protocol.fields.status')" prop="status">
            <el-select v-model="formModel.status" :placeholder="t('protocol.placeholders.status')">
              <el-option
                v-for="option in statusOptions"
                :key="String(option.value)"
                :label="option.label"
                :value="option.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item :label="t('protocol.fields.documentUrl')" prop="documentUrl">
            <!-- UniUpload 负责文件类型、大小、数量和拖拽交互；协议业务只实现上传请求和 URL 回填。 -->
            <UniUpload
              v-model:file-list="fileList"
              drag
              accept=".pdf,application/pdf"
              :limit="1"
              :max-size="10 * 1024 * 1024"
              :request="handleUploadRequest"
              @validate-error="handleValidateError"
              @remove="handleRemove"
            >
              <template #tip>
                <div class="protocol-form__upload-tip">
                  {{ t('protocol.messages.uploadPdfSize') }}
                </div>
              </template>
            </UniUpload>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <template #footer>
      <el-button @click="close">{{ t('protocol.actions.cancel') }}</el-button>
      <el-button type="primary" :loading="submitting" @click="submit">
        {{ t('protocol.actions.submit') }}
      </el-button>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
.protocol-form__upload-tip {
  margin-top: 8px;
  color: var(--app-text-color-secondary);
  font-size: 12px;
}
</style>
