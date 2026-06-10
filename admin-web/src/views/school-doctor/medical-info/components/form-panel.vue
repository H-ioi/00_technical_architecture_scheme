<template>
  <div class="medical-form-panel">
    <aside class="medical-form-panel__left">
      <div class="medical-section">
        <h3>{{ $t('schoolDoctor.medicalInfo.sectionStudentBasic') }}</h3>
        <p>{{ $t('schoolDoctor.medicalInfo.sectionStudentBasicDesc') }}</p>
        <el-form label-position="top">
          <StudentRemoteSelect
            ref="studentSelectRef"
            :readonly="readonly"
            :school-records="schoolRecords"
            @select="onStudentSelect"
            @clear="onStudentClear"
          />
          <el-form-item :label="$t('schoolDoctor.studentRecord.fieldAdmissionNo')" prop="admissionNo">
            <el-input v-model="formModel.admissionNo" :disabled="readonly" />
          </el-form-item>
          <el-form-item :label="$t('schoolDoctor.studentRecord.fieldSchool')" prop="schoolId">
            <el-select v-model="formModel.schoolId" :disabled="readonly" filterable style="width: 100%">
              <el-option
                v-for="item in schoolRecords"
                :key="item.id"
                :label="item.cnName || item.enName || item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </aside>

    <main class="medical-form-panel__right">
      <el-form ref="formRef" label-position="top" :model="formModel" :rules="rules">
        <HealthSection v-model:form="formModel" :readonly="readonly" />
        <DiseaseSection
          :disease-list="formModel.diseaseList"
          :disease-options="diseaseOptions"
          :disease-rules="diseaseRules"
          :readonly="readonly"
          :is-other-disease="isOtherDisease"
          @add="emit('add-disease')"
          @remove="emit('remove-disease', $event)"
          @disease-change="emit('disease-change', $event)"
        />
        <AttachmentSection
          :attachment-list="formModel.attachmentList"
          :special-proof-remark="specialProofRemark"
          :parent-sign-mode="parentSignMode"
          :parent-signature-url="parentSignatureUrl"
          :readonly="readonly"
          :uploading="uploading"
          @upload="(opt, type) => emit('upload', opt, type)"
          @before-upload="(file, type) => emit('before-upload', file, type)"
          @remove-attachment="(type, index) => emit('remove-attachment', type, index)"
          @update:special-proof-remark="emit('update:specialProofRemark', $event)"
          @update:parent-sign-mode="emit('update:parentSignMode', $event)"
          @open-signature="emit('open-signature')"
          @clear-signature="emit('clear-signature')"
          @upload-sign="emit('upload-sign', $event)"
          @before-image="emit('before-image', $event)"
        />
      </el-form>
    </main>
  </div>
</template>

<script setup lang="ts">
import type { FormInstance, FormRules, UploadRequestOptions } from 'element-plus'
import { defineModel, ref } from 'vue'

import type { SchoolDoctorDiseaseOption } from '@/api/modules/school-doctor-disease-setting'
import type { MedicalInfoDiseaseItem, MedicalInfoFormModel } from '@/types/modules/medical-info'
import type { SchoolOptionRecord } from '@/types/modules/membership'

import StudentRemoteSelect from '../../components/student-remote-select.vue'
import AttachmentSection from './attachment-section.vue'
import DiseaseSection from './disease-section.vue'
import HealthSection from './health-section.vue'

const formModel = defineModel<MedicalInfoFormModel>('form', { required: true })

defineProps<{
  rules: FormRules
  diseaseRules: FormRules
  readonly: boolean
  schoolRecords: SchoolOptionRecord[]
  diseaseOptions: SchoolDoctorDiseaseOption[]
  specialProofRemark: string
  parentSignMode: 'draw' | 'upload'
  parentSignatureUrl: string
  uploading: boolean
  isOtherDisease: (disease: MedicalInfoDiseaseItem) => boolean
}>()

const emit = defineEmits<{
  'student-select': [fields: Record<string, unknown>]
  'student-clear': []
  'add-disease': []
  'remove-disease': [index: number]
  'disease-change': [disease: MedicalInfoDiseaseItem]
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

const formRef = ref<FormInstance | null>(null)
const studentSelectRef = ref<InstanceType<typeof StudentRemoteSelect> | null>(null)

function onStudentSelect(fields: Record<string, unknown>) {
  emit('student-select', fields)
}

function onStudentClear() {
  emit('student-clear')
}

async function validateForm() {
  if (!formRef.value) {
    return false
  }
  try {
    await formRef.value.validate()
    return true
  } catch {
    return false
  }
}

function resetStudentSelect() {
  studentSelectRef.value?.reset()
}

function setDisplayFromForm(form: Record<string, unknown>) {
  studentSelectRef.value?.setDisplayFromForm(form)
}

defineExpose({ validateForm, resetStudentSelect, setDisplayFromForm })
</script>

<style scoped lang="scss">
.medical-form-panel {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 16px;
  min-height: 100%;
  background: var(--el-fill-color-light);

  &__left,
  &__right {
    min-width: 0;
  }

  .medical-section {
    padding: 20px;
    background: #fff;
    border: 1px solid var(--el-border-color-lighter);
    border-radius: 12px;

    h3 {
      margin: 0 0 8px;
      font-size: 16px;
      font-weight: 600;
    }

    p {
      margin: 0 0 16px;
      font-size: 12px;
      color: var(--el-text-color-secondary);
    }
  }
}
</style>
