<template>
  <div class="medical-section">
    <h3>{{ $t('schoolDoctor.medicalInfo.sectionAttachment') }}</h3>
    <p class="medical-section__desc">{{ $t('schoolDoctor.medicalInfo.sectionAttachmentDesc') }}</p>

    <div class="attachment-grid">
      <div v-for="group in fileGroups" :key="group.type" class="attachment-card">
        <div class="attachment-card__head">
          <span>{{ group.label }}</span>
          <span class="attachment-card__tip">{{ group.tip }}</span>
        </div>
        <el-upload
          v-if="!readonly"
          action="#"
          :show-file-list="false"
          :http-request="(opt) => emit('upload', opt, group.type)"
          :accept="uploadAccept(group.type)"
          :before-upload="(file) => emit('before-upload', file, group.type)"
        >
          <el-button :loading="uploading">{{ $t('schoolDoctor.common.upload') }}</el-button>
        </el-upload>
        <div v-for="(file, fileIndex) in attachments(group.type)" :key="`${group.type}-${fileIndex}`" class="attachment-file">
          <el-link :href="file.attachUrl" target="_blank" type="primary">{{ fileName(file.attachUrl) }}</el-link>
          <el-button v-if="!readonly" type="danger" link @click="emit('remove-attachment', group.type, fileIndex)">
            {{ $t('schoolDoctor.common.remove') }}
          </el-button>
        </div>
      </div>
    </div>

    <div class="attachment-proof">
      <div class="attachment-proof__title">{{ $t('schoolDoctor.medicalInfo.specialProof') }}</div>
      <el-input
        :model-value="specialProofRemark"
        :disabled="readonly"
        :placeholder="$t('schoolDoctor.medicalInfo.phSpecialProof')"
        @update:model-value="emit('update:specialProofRemark', $event)"
      >
        <template v-if="!readonly" #append>
          <el-upload
            action="#"
            :show-file-list="false"
            :http-request="(opt) => emit('upload', opt, 2)"
            :before-upload="(file) => emit('before-upload', file, 2)"
          >
            <el-button link :loading="uploading">{{ $t('schoolDoctor.common.upload') }}</el-button>
          </el-upload>
        </template>
      </el-input>
      <div v-for="(file, fileIndex) in attachments(2)" :key="`proof-${fileIndex}`" class="attachment-file">
        <el-link :href="file.attachUrl" target="_blank" type="primary">{{ fileName(file.attachUrl) }}</el-link>
        <el-button v-if="!readonly" type="danger" link @click="emit('remove-attachment', 2, fileIndex)">
          {{ $t('schoolDoctor.common.remove') }}
        </el-button>
      </div>
    </div>

    <div class="attachment-sign">
      <div class="attachment-sign__head">
        <span>{{ $t('schoolDoctor.medicalInfo.parentSignature') }}</span>
        <el-radio-group
          v-if="!readonly"
          :model-value="parentSignMode"
          size="small"
          @update:model-value="emit('update:parentSignMode', $event as 'draw' | 'upload')"
        >
          <el-radio-button label="draw">{{ $t('schoolDoctor.medicalInfo.signDraw') }}</el-radio-button>
          <el-radio-button label="upload">{{ $t('schoolDoctor.medicalInfo.signUpload') }}</el-radio-button>
        </el-radio-group>
      </div>
      <div v-if="parentSignatureUrl" class="attachment-sign__preview">
        <el-image :src="parentSignatureUrl" fit="contain" style="max-height: 160px" />
        <el-button v-if="!readonly" link @click="emit('clear-signature')">
          {{ $t('schoolDoctor.medicalInfo.clearSignature') }}
        </el-button>
      </div>
      <template v-else-if="!readonly">
        <el-button v-if="parentSignMode === 'draw'" @click="emit('open-signature')">
          {{ $t('schoolDoctor.medicalInfo.startSign') }}
        </el-button>
        <el-upload
          v-else
          action="#"
          :show-file-list="false"
          accept="image/*"
          :http-request="(opt) => emit('upload-sign', opt)"
          :before-upload="(file) => emit('before-image', file)"
        >
          <el-button :loading="uploading">{{ $t('schoolDoctor.common.upload') }}</el-button>
        </el-upload>
      </template>
      <span v-else>--</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { UploadRequestOptions } from 'element-plus'
import { useUniI18n } from 'uni-ui-lib'
import { computed } from 'vue'

import type { MedicalInfoAttachment } from '@/types/modules/medical-info'

const props = defineProps<{
  attachmentList: MedicalInfoAttachment[]
  specialProofRemark: string
  parentSignMode: 'draw' | 'upload'
  parentSignatureUrl: string
  readonly: boolean
  uploading: boolean
}>()

const emit = defineEmits<{
  upload: [opt: UploadRequestOptions, type: number]
  'before-upload': [file: File, type: number]
  'remove-attachment': [type: number, index: number]
  'update:specialProofRemark': [value: string]
  'update:parentSignMode': [value: 'draw' | 'upload']
  'open-signature': []
  'clear-signature': []
  'upload-sign': [opt: UploadRequestOptions]
  'before-image': [file: File]
}>()

const { t } = useUniI18n()

const fileGroups = computed(() => [
  { type: 1, label: t('schoolDoctor.medicalInfo.attachVaccine'), tip: t('schoolDoctor.medicalInfo.vaccineTip') },
  { type: 4, label: t('schoolDoctor.medicalInfo.attachExam'), tip: t('schoolDoctor.medicalInfo.examTip') }
])

function attachments(type: number) {
  return (props.attachmentList || []).filter((item) => item.attachType === type)
}

function uploadAccept(type: number) {
  if (type === 4) {
    return '.pdf,application/pdf'
  }
  if (type === 1) {
    return '.pdf,.png,.jpg,.jpeg,application/pdf,image/png,image/jpeg'
  }
  return ''
}

function fileName(url?: string) {
  if (!url) {
    return t('schoolDoctor.common.viewAttachment')
  }
  try {
    const parts = url.split('?')[0].split('/')
    return decodeURIComponent(parts[parts.length - 1] || url)
  } catch {
    return url
  }
}
</script>

<style scoped lang="scss">
.medical-section {
  margin-bottom: 16px;
  padding: 20px;
  background: #fff;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 12px;

  h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
  }

  &__desc {
    margin: 8px 0 16px;
    font-size: 12px;
    color: var(--el-text-color-secondary);
  }
}

.attachment-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.attachment-card,
.attachment-proof,
.attachment-sign {
  margin-top: 16px;
  padding: 16px;
  background: var(--el-fill-color-light);
  border-radius: 10px;
}

.attachment-card__tip {
  margin-left: 8px;
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.attachment-file {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
}

.attachment-sign__head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.attachment-sign__preview {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
