<template>
  <div class="medicine-parent">
    <h3>{{ $t('schoolDoctor.medicineApply.sectionParent') }}</h3>
    <p class="medicine-parent__desc">{{ $t('schoolDoctor.medicineApply.sectionParentDesc') }}</p>
    <el-row :gutter="16">
      <el-col :span="12">
        <el-form-item :label="$t('schoolDoctor.medicineApply.fieldParentName')">
          <el-input v-model="formModel.parentName" :disabled="readonly" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item :label="$t('schoolDoctor.medicineApply.fieldParentContact')">
          <el-input v-model="formModel.parentContact" :disabled="readonly" />
        </el-form-item>
      </el-col>
    </el-row>

    <div class="medicine-parent__sign">
      <div class="medicine-parent__sign-head">
        <span>{{ $t('schoolDoctor.medicineApply.fieldParentSignature') }}</span>
        <el-radio-group v-if="!readonly" v-model="signMode" size="small">
          <el-radio-button value="draw">{{ $t('schoolDoctor.medicalInfo.signDraw') }}</el-radio-button>
          <el-radio-button value="upload">{{ $t('schoolDoctor.medicalInfo.signUpload') }}</el-radio-button>
        </el-radio-group>
      </div>
      <div v-if="formModel.parentSignaturePath" class="medicine-parent__preview">
        <el-image :src="formModel.parentSignaturePath" fit="contain" style="width: 200px; height: 100px" />
        <el-button v-if="!readonly" type="danger" link @click="formModel.parentSignaturePath = ''">
          {{ $t('schoolDoctor.medicalInfo.clearSignature') }}
        </el-button>
      </div>
      <template v-else-if="!readonly">
        <el-button v-if="signMode === 'draw'" type="primary" link @click="emit('open-signature')">
          {{ $t('schoolDoctor.medicalInfo.startSign') }}
        </el-button>
        <el-upload
          v-else
          action="#"
          :show-file-list="false"
          accept="image/*"
          :http-request="(opt) => emit('signature-upload', opt)"
          :before-upload="beforeImage">
          <el-button :loading="signatureUploading">{{ $t('schoolDoctor.common.upload') }}</el-button>
        </el-upload>
      </template>
      <span v-else>--</span>
    </div>

    <el-form-item v-if="mode === 'add'" prop="informedConsent" class="medicine-parent__consent">
      <el-checkbox v-model="formModel.informedConsent" :true-value="1" :false-value="0">
        <span>{{ $t('schoolDoctor.medicineApply.informedConsent') }}</span>
      </el-checkbox>
      <p class="medicine-parent__consent-tip">{{ $t('schoolDoctor.medicineApply.informedConsentTip') }}</p>
    </el-form-item>
    <div v-else-if="formModel.informedConsent === 1" class="medicine-parent__consent medicine-parent__consent--ok">
      {{ $t('schoolDoctor.medicineApply.informedConsent') }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { useUniI18n } from 'uni-ui-lib'
import type { UploadRequestOptions } from 'element-plus'
import { ref } from 'vue'

import type { MedicineApplyFormModel } from '@/types/modules/school-doctor-medicine-apply'

defineProps<{
  readonly?: boolean
  mode: 'add' | 'view' | 'approve'
  signatureUploading?: boolean
}>()

const emit = defineEmits<{
  'open-signature': []
  'signature-upload': [option: UploadRequestOptions]
}>()

const formModel = defineModel<MedicineApplyFormModel>('formModel', { required: true })
const signMode = ref<'draw' | 'upload'>('draw')
const { t } = useUniI18n()

function beforeImage(file: File) {
  const ok = /^image\//.test(file.type) || /\.(jpe?g|png|gif|webp)$/i.test(file.name)
  if (!ok) {
    ElMessage.warning(t('schoolDoctor.medicalInfo.imageOnly'))
  }
  return ok
}
</script>

<style scoped lang="scss">
.medicine-parent {
  margin-bottom: 16px;
  padding: 16px;
  background: #fff;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 12px;

  h3 {
    margin: 0 0 8px;
    font-size: 15px;
  }

  &__desc {
    margin: 0 0 12px;
    font-size: 12px;
    color: var(--el-text-color-secondary);
  }

  &__sign-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }

  &__preview {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  &__consent {
    margin-top: 16px;

    &--ok {
      padding: 12px;
      background: var(--el-color-success-light-9);
      border-radius: 8px;
      color: var(--el-color-success);
    }
  }

  &__consent-tip {
    margin: 4px 0 0 24px;
    font-size: 12px;
    color: var(--el-text-color-secondary);
  }
}
</style>
