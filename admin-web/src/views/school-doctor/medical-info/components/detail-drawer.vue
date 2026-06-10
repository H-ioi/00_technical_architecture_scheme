<template>
  <el-drawer
    v-model="visible"
    :title="drawerTitle"
    size="1120px"
    destroy-on-close
    class="medical-info-drawer">
    <div v-if="visible" v-loading="loading" class="medical-info-drawer__body">
      <FormPanel
        ref="formPanelRef"
        :form="formModel"
        :rules="rules"
        :disease-rules="diseaseRules"
        :readonly="mode === 'view'"
        :school-records="schoolRecords"
        :disease-options="diseaseOptions"
        :special-proof-remark="specialProofRemark"
        :parent-sign-mode="parentSignMode"
        :parent-signature-url="parentSignatureUrl"
        :uploading="uploading"
        :is-other-disease="isOtherDisease"
        @student-select="onStudentSelect"
        @student-clear="onStudentClear"
        @add-disease="addDisease"
        @remove-disease="removeDisease"
        @disease-change="onDiseaseChange"
        @upload="handleUpload"
        @before-upload="beforeAttachmentUpload"
        @remove-attachment="removeAttachment"
        @update:special-proof-remark="specialProofRemark = $event"
        @update:parent-sign-mode="parentSignMode = $event"
        @open-signature="openSignature"
        @clear-signature="clearParentSignature"
        @upload-sign="handleParentSignUpload"
        @before-image="beforeImageUpload" />
    </div>

    <template v-if="mode !== 'view'" #footer>
      <el-button @click="visible = false">{{ $t('schoolDoctor.common.cancel') }}</el-button>
      <el-button type="primary" :loading="submitting" @click="submitForm">
        {{ $t('schoolDoctor.common.confirm') }}
      </el-button>
    </template>

    <SignatureDialog ref="signatureDialogRef" @confirm="setParentSignatureUrl" />
  </el-drawer>
</template>

<script setup lang="ts">
import type { FormRules, UploadRequestOptions } from 'element-plus'
import { ElMessage } from 'element-plus'
import { useUniI18n } from 'uni-ui-lib'
import { computed, nextTick, ref, watch } from 'vue'

import { medicalInfoApi, schoolDoctorDiseaseSettingApi } from '@/api'
import { useDialogDetailLoading } from '@/composables/use-dialog-detail-loading'
import type { SchoolDoctorDiseaseOption } from '@/api/modules/school-doctor-disease-setting'
import type { MedicalInfoDiseaseItem, MedicalInfoFormModel } from '@/types/modules/medical-info'
import type { SchoolOptionRecord } from '@/types/modules/membership'
import { normalizePaged } from '@/utils/api-response-normalize'

import SignatureDialog from '../../components/signature-dialog.vue'
import FormPanel from './form-panel.vue'

const visible = defineModel<boolean>('visible', { required: true })

const props = defineProps<{
  mode: 'add' | 'view' | 'edit'
  recordId?: string | number
  schoolRecords: SchoolOptionRecord[]
}>()

const emit = defineEmits<{
  saved: []
}>()

const { t } = useUniI18n()
const { detailLoading: loading, runWithDetailLoading } = useDialogDetailLoading()
const submitting = ref(false)
const uploading = ref(false)
const diseaseOptions = ref<SchoolDoctorDiseaseOption[]>([])
const specialProofRemark = ref('')
const parentSignMode = ref<'draw' | 'upload'>('draw')
const formPanelRef = ref<InstanceType<typeof FormPanel> | null>(null)
const signatureDialogRef = ref<InstanceType<typeof SignatureDialog> | null>(null)

const emptyForm = (): MedicalInfoFormModel => ({
  admissionNo: '',
  schoolId: undefined,
  schoolName: '',
  fullName: '',
  grade: '',
  formCode: '',
  dormitoryStatus: undefined,
  height: '',
  weight: '',
  leftVision: '',
  rightVision: '',
  leftEar: '',
  rightEar: '',
  foodAllergy: '',
  drugAllergy: '',
  contactAllergy: '',
  otherAllergy: '',
  diseaseList: [],
  attachmentList: []
})

const formModel = ref<MedicalInfoFormModel>(emptyForm())

const rules = computed<FormRules>(() => ({
  admissionNo: [{ required: true, message: t('schoolDoctor.medicalInfo.ruleAdmissionNo'), trigger: 'blur' }],
  schoolId: [{ required: true, message: t('schoolDoctor.medicalInfo.ruleSchool'), trigger: 'change' }]
}))

const diseaseRules = computed<FormRules>(() => ({
  conditionStatus: [{ required: true, message: t('schoolDoctor.medicalInfo.ruleCondition'), trigger: 'change' }],
  needRegularMedicationSchool: [{ required: true, message: t('schoolDoctor.medicalInfo.ruleNeedMedication'), trigger: 'change' }]
}))

const drawerTitle = computed(() => {
  if (props.mode === 'add') {
    return t('schoolDoctor.medicalInfo.detailAddTitle')
  }
  if (props.mode === 'edit') {
    return t('schoolDoctor.medicalInfo.detailEditTitle')
  }
  return t('schoolDoctor.medicalInfo.detailViewTitle')
})

const parentSignatureUrl = computed(() => {
  const list = getAttachments(3)
  return list.length ? String(list[0].attachUrl || '') : ''
})

function getAttachments(type: number) {
  return (formModel.value.attachmentList || []).filter((item) => item.attachType === type)
}

function isOtherDisease(disease: MedicalInfoDiseaseItem) {
  const option = diseaseOptions.value.find((item) => String(item.id) === String(disease.diseaseId))
  const name = (option && (option.cnName || option.name)) || ''
  return /其他|other/i.test(name)
}

function onStudentSelect(fields: Record<string, unknown>) {
  Object.assign(formModel.value, fields)
}

function onStudentClear() {
  formModel.value.admissionNo = ''
  formModel.value.fullName = ''
  formModel.value.schoolId = undefined
  formModel.value.grade = ''
  formModel.value.formCode = ''
  formModel.value.dormitoryStatus = undefined
}

function addDisease() {
  formModel.value.diseaseList.push({
    diseaseId: undefined,
    diseaseNameOther: '',
    conditionStatus: undefined,
    needRegularMedicationSchool: undefined,
    medicationUsage: '',
    attackTimeDetail: '',
    measures: '',
    diagnosisAndTreatment: ''
  })
}

function removeDisease(index: number) {
  formModel.value.diseaseList.splice(index, 1)
}

function onDiseaseChange(disease: MedicalInfoDiseaseItem) {
  if (!isOtherDisease(disease)) {
    disease.diseaseNameOther = ''
  }
}

function removeAttachment(type: number, index: number) {
  const files = getAttachments(type)
  const target = files[index]
  const realIndex = formModel.value.attachmentList.indexOf(target)
  if (realIndex > -1) {
    formModel.value.attachmentList.splice(realIndex, 1)
  }
}

/** 入学体检(4)仅 PDF；疫苗(1)支持图片/PDF */
function beforeAttachmentUpload(file: File, attachType: number) {
  if (attachType === 4) {
    const isPdf = file.type === 'application/pdf' || /\.pdf$/i.test(file.name || '')
    if (!isPdf) {
      ElMessage.warning(t('schoolDoctor.medicalInfo.pdfOnly'))
      return false
    }
  }
  if (attachType === 1) {
    const allowed = /^image\//.test(file.type) || /\.(pdf|png|jpe?g)$/i.test(file.name || '')
    if (!allowed) {
      ElMessage.warning(t('schoolDoctor.medicalInfo.vaccineTip'))
      return false
    }
  }
  return true
}

function beforeImageUpload(file: File) {
  const isImage = /^image\//.test(file.type) || /\.(png|jpe?g|gif|webp)$/i.test(file.name || '')
  if (!isImage) {
    ElMessage.warning(t('schoolDoctor.medicalInfo.imageOnly'))
    return false
  }
  return true
}

async function handleUpload(option: UploadRequestOptions, attachType: number) {
  if (!beforeAttachmentUpload(option.file, attachType)) {
    return
  }
  uploading.value = true
  try {
    const url = await medicalInfoApi.uploadAttachment.post(option.file)
    formModel.value.attachmentList.push({
      attachType,
      attachUrl: url,
      remark: attachType === 2 ? specialProofRemark.value : ''
    })
    ElMessage.success(t('schoolDoctor.common.uploadSuccess'))
  } catch {
    ElMessage.error(t('schoolDoctor.common.uploadFailed'))
  } finally {
    uploading.value = false
  }
}

function handleParentSignUpload(option: UploadRequestOptions) {
  if (!beforeImageUpload(option.file)) {
    return
  }
  setParentSignatureUrl('')
  void handleUpload(option, 3)
}

function openSignature() {
  if (props.mode === 'view') {
    return
  }
  parentSignMode.value = 'draw'
  signatureDialogRef.value?.open()
}

function setParentSignatureUrl(url: string) {
  formModel.value.attachmentList = (formModel.value.attachmentList || []).filter((item) => item.attachType !== 3)
  if (url) {
    formModel.value.attachmentList.push({ attachType: 3, attachUrl: url })
  }
}

function clearParentSignature() {
  setParentSignatureUrl('')
}

function buildSubmitData() {
  const data: MedicalInfoFormModel = {
    ...formModel.value,
    attachmentList: (formModel.value.attachmentList || []).map((item) => ({
      ...item,
      remark: item.attachType === 2 ? specialProofRemark.value : item.remark
    })),
    diseaseList: [...formModel.value.diseaseList]
  }
  const hasAllergen = [data.foodAllergy, data.drugAllergy, data.contactAllergy, data.otherAllergy].some(
    (value) => String(value || '').trim() !== ''
  )
  data.hasAllergen = hasAllergen ? 1 : 0
  data.hasDisease = (data.diseaseList || []).length ? 1 : 0
  data.regularMedication = (data.diseaseList || []).some((item) => item.needRegularMedicationSchool === 1) ? 1 : 0
  return data
}

async function loadDiseaseOptions() {
  const raw = await schoolDoctorDiseaseSettingApi.page.get({ current: 1, size: 500, status: 1 })
  const { list } = normalizePaged<SchoolDoctorDiseaseOption>(raw)
  diseaseOptions.value = list
}

watch(visible, async (open) => {
  if (!open) {
    return
  }
  formModel.value = emptyForm()
  specialProofRemark.value = ''
  parentSignMode.value = 'draw'
  await runWithDetailLoading(async () => {
    await loadDiseaseOptions()
    if (props.mode !== 'add' && props.recordId != null) {
      const data = await medicalInfoApi.detail.get(props.recordId)
      formModel.value = {
        ...emptyForm(),
        ...data,
        diseaseList: Array.isArray(data.diseaseList) ? data.diseaseList : [],
        attachmentList: Array.isArray(data.attachmentList) ? data.attachmentList : []
      }
      const proof = getAttachments(2)[0]
      specialProofRemark.value = String(proof?.remark || '')
    }
  })
  await nextTick(() => {
    if (!formPanelRef.value) {
      return
    }
    if (props.mode === 'add') {
      formPanelRef.value.resetStudentSelect()
    } else {
      formPanelRef.value.setDisplayFromForm(formModel.value)
    }
  })
})

async function submitForm() {
  const valid = await formPanelRef.value?.validateForm()
  if (!valid) {
    return
  }
  const invalidMedication = (formModel.value.diseaseList || []).find(
    (item) => item.needRegularMedicationSchool === 1 && !String(item.medicationUsage || '').trim()
  )
  if (invalidMedication) {
    ElMessage.warning(t('schoolDoctor.medicalInfo.ruleMedicationUsage'))
    return
  }
  submitting.value = true
  try {
    const data = buildSubmitData()
    if (props.mode === 'add') {
      await medicalInfoApi.add.post(data)
      ElMessage.success(t('schoolDoctor.common.addSuccess'))
    } else {
      await medicalInfoApi.edit.post(data)
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
.medical-info-drawer__body {
  min-height: 200px;
  padding: 12px;
  background: var(--el-fill-color-light);
}
</style>
