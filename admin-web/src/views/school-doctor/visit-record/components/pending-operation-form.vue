<template>
  <el-form ref="formRef" :model="operationForm" :rules="rules" label-position="top" :disabled="readonly">
    <el-row :gutter="16">
      <el-col :span="12">
        <el-form-item :label="$t('schoolDoctor.visitRecord.fieldOperateTime')" prop="operateTime">
          <div class="pending-op-form__datetime">
            <el-date-picker
              v-model="operationForm.operateTime"
              type="datetime"
              value-format="YYYY-MM-DD HH:mm:ss"
              style="width: 100%"
            />
            <el-button v-if="!readonly" type="primary" link @click="setNow('operateTime')">
              {{ $t('schoolDoctor.visitRecord.now') }}
            </el-button>
          </div>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item :label="$t('schoolDoctor.visitRecord.fieldOperator')">
          <el-input v-model="operationForm.operator" disabled />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item :label="$t('schoolDoctor.visitRecord.fieldOperateStatus')" prop="operateStatus">
          <el-radio-group v-model="operationForm.operateStatus">
            <el-radio v-for="item in operateOptions" :key="item.value" :value="item.value">{{ item.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item :label="$t('schoolDoctor.visitRecord.fieldNotifyParent')">
          <el-radio-group v-model="operationForm.notifyParent">
            <el-radio :value="1">{{ $t('schoolDoctor.common.yes') }}</el-radio>
            <el-radio :value="0">{{ $t('schoolDoctor.common.no') }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item :label="$t('schoolDoctor.visitRecord.fieldSituation')" prop="specificSituation">
          <el-input
            v-model="operationForm.specificSituation"
            type="textarea"
            :rows="3"
            maxlength="300"
            show-word-limit
            :placeholder="$t('schoolDoctor.visitRecord.phOperateSituation')"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item :label="$t('schoolDoctor.visitRecord.fieldLeaveTime')">
          <div class="pending-op-form__datetime">
            <el-date-picker
              v-model="operationForm.leaveTime"
              type="datetime"
              value-format="YYYY-MM-DD HH:mm:ss"
              style="width: 100%"
            />
            <el-button v-if="!readonly" type="primary" link @click="setNow('leaveTime')">
              {{ $t('schoolDoctor.visitRecord.now') }}
            </el-button>
          </div>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item :label="$t('schoolDoctor.visitRecord.fieldLeaveDestination')">
          <el-select
            v-model="operationForm.leaveDestination"
            clearable
            style="width: 100%"
            :placeholder="$t('schoolDoctor.visitRecord.phLeaveDestinationSelect')"
          >
            <el-option v-for="item in leaveOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item>
          <template #label>
            <span>{{ $t('schoolDoctor.visitRecord.fieldAttachment') }}</span>
            <span class="pending-op-form__tip">{{ $t('schoolDoctor.visitRecord.attachmentTip') }}</span>
          </template>
          <div v-for="(file, index) in operationForm.attachmentList" :key="file.url || index" class="pending-op-form__file">
            <el-link :href="file.attachmentUrl || file.url" target="_blank" type="primary">{{ file.name || 'file' }}</el-link>
            <el-button v-if="!readonly" type="danger" link @click="removeAttachment(index)">
              {{ $t('schoolDoctor.common.remove') }}
            </el-button>
          </div>
          <el-upload
            v-if="!readonly"
            action="#"
            :show-file-list="false"
            :http-request="handleUpload"
            :before-upload="beforeUpload"
          >
            <el-button :loading="uploading">{{ $t('schoolDoctor.common.upload') }}</el-button>
          </el-upload>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script setup lang="ts">
import type { FormInstance, FormRules, UploadRequestOptions } from 'element-plus'
import { ElMessage } from 'element-plus'
import { useUniI18n } from 'uni-ui-lib'
import { computed, ref } from 'vue'

import { medicalInfoApi } from '@/api'
import type { PendingOperationFormModel } from '@/types/modules/school-doctor-visit-record'

import { leaveDestinationOpts, operateStatusOpts } from '../record.config'

defineProps<{ readonly?: boolean }>()

const operationForm = defineModel<PendingOperationFormModel>('operationForm', { required: true })

const { t } = useUniI18n()
const formRef = ref<FormInstance>()
const uploading = ref(false)
const leaveOptions = computed(() => leaveDestinationOpts(t))
const operateOptions = computed(() => operateStatusOpts(t))

const rules = computed<FormRules>(() => ({
  operateTime: [{ required: true, message: t('schoolDoctor.visitRecord.ruleOperateTime'), trigger: 'change' }],
  operateStatus: [{ required: true, message: t('schoolDoctor.visitRecord.ruleOperateStatus'), trigger: 'change' }],
  specificSituation: [{ required: true, message: t('schoolDoctor.visitRecord.ruleSituation'), trigger: 'blur' }]
}))

function setNow(field: 'operateTime' | 'leaveTime') {
  const now = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  operationForm.value[field] =
    `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
}

function beforeUpload(file: File) {
  const ok = /\.(pdf|png|jpe?g|docx)$/i.test(file.name) && file.size / 1024 / 1024 <= 10
  if (!ok) {
    ElMessage.warning(t('schoolDoctor.visitRecord.attachmentTip'))
  }
  return ok
}

async function handleUpload(option: UploadRequestOptions) {
  if (!beforeUpload(option.file)) {
    return
  }
  uploading.value = true
  try {
    const url = await medicalInfoApi.uploadAttachment.post(option.file)
    const list = operationForm.value.attachmentList || []
    list.push({ name: option.file.name, url, attachmentUrl: url })
    operationForm.value.attachmentList = list
    ElMessage.success(t('schoolDoctor.common.uploadSuccess'))
  } catch {
    ElMessage.error(t('schoolDoctor.common.uploadFailed'))
  } finally {
    uploading.value = false
  }
}

function removeAttachment(index: number) {
  operationForm.value.attachmentList?.splice(index, 1)
}

async function validate() {
  if (!formRef.value) {
    return true
  }
  return await formRef.value.validate().catch(() => false)
}

defineExpose({ validate })
</script>

<style scoped lang="scss">
.pending-op-form {
  &__datetime {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  &__tip {
    margin-left: 8px;
    font-size: 12px;
    color: var(--el-text-color-secondary);
  }

  &__file {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
  }
}
</style>
