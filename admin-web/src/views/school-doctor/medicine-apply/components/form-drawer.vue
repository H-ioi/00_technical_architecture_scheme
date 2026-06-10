<template>
  <el-drawer
    v-model="visible"
    :title="drawerTitle"
    size="1120px"
    destroy-on-close
    class="medicine-apply-drawer"
  >
    <div v-if="visible" v-loading="loading" class="medicine-apply-drawer__body">
      <FormPanel
        ref="panelRef"
        v-model:form-model="formModel"
        :mode="mode"
        :form-readonly="formReadonly"
        :student-readonly="studentReadonly"
        :approval-editable="approvalEditable"
        :show-approval-section="showApprovalSection"
        :school-records="schoolRecords"
        :symptom-options="symptomOptions"
        :visit-record-list="visitRecordList"
        :visit-loading="visitLoading"
        :uploading="uploading"
        :signature-uploading="signatureUploading"
        @diagnosis-upload="handleDiagnosisUpload"
        @open-signature="signatureDialogRef?.open()"
        @signature-upload="handleSignatureUpload"
        @open-visit-detail="openVisitDetail"
      />
    </div>

    <template v-if="mode !== 'view'" #footer>
      <el-button @click="visible = false">{{ $t('schoolDoctor.common.cancel') }}</el-button>
      <template v-if="mode === 'approve'">
        <el-button type="danger" :loading="submitting" @click="submitApproval(2)">
          {{ $t('schoolDoctor.medicineApply.reject') }}
        </el-button>
        <el-button type="primary" :loading="submitting" @click="submitApproval(1)">
          {{ $t('schoolDoctor.medicineApply.approve') }}
        </el-button>
      </template>
      <el-button v-else type="primary" :loading="submitting" @click="submit">
        {{ $t('schoolDoctor.common.confirm') }}
      </el-button>
    </template>

    <SignatureDialog ref="signatureDialogRef" @confirm="onSignatureConfirm" />
    <OperationRecordDialog ref="operationDialogRef" />
  </el-drawer>
</template>

<script setup lang="ts">
import type { UploadRequestOptions } from 'element-plus'
import { ElMessage } from 'element-plus'
import { useUniI18n } from 'uni-ui-lib'
import { computed, nextTick, ref, watch } from 'vue'

import {
  medicalInfoApi,
  schoolDoctorDiseaseSettingApi,
  schoolDoctorMedicineApplyApi,
  schoolDoctorVisitRecordApi
} from '@/api'
import { useDialogDetailLoading } from '@/composables/use-dialog-detail-loading'
import { useUserStore } from '@/stores'
import type { SchoolDoctorDiseaseOption } from '@/api/modules/school-doctor-disease-setting'
import type {
  MedicineApplyFormModel,
  MedicineApplyVisitDetailRow
} from '@/types/modules/school-doctor-medicine-apply'
import type { SchoolOptionRecord } from '@/types/modules/membership'
import { normalizePaged } from '@/utils/api-response-normalize'
import SignatureDialog from '@/views/school-doctor/components/signature-dialog.vue'
import OperationRecordDialog from '@/views/school-doctor/visit-record/components/operation-record-dialog.vue'

import { emptyContentItem, emptyFormModel } from '../list.config'
import FormPanel from './form-panel.vue'

const visible = defineModel<boolean>('visible', { required: true })

const props = defineProps<{
  mode: 'add' | 'view' | 'approve'
  recordId?: string | number
  schoolRecords: SchoolOptionRecord[]
}>()

const emit = defineEmits<{ saved: [] }>()

const { t } = useUniI18n()
const userStore = useUserStore()
const { detailLoading: loading, runWithDetailLoading } = useDialogDetailLoading()
const panelRef = ref<InstanceType<typeof FormPanel> | null>(null)
const signatureDialogRef = ref<InstanceType<typeof SignatureDialog> | null>(null)
const operationDialogRef = ref<InstanceType<typeof OperationRecordDialog> | null>(null)
const submitting = ref(false)
const uploading = ref(false)
const signatureUploading = ref(false)
const visitLoading = ref(false)
const symptomOptions = ref<SchoolDoctorDiseaseOption[]>([])
const visitRecordList = ref<MedicineApplyVisitDetailRow[]>([])
const formModel = ref<MedicineApplyFormModel>(emptyFormModel())

const formReadonly = computed(() => props.mode !== 'add')
const studentReadonly = computed(() => props.mode !== 'add')
const approvalEditable = computed(() => props.mode === 'approve')
const showApprovalSection = computed(
  () =>
    props.mode === 'approve' ||
    (props.mode === 'view' && formModel.value.nurseApproval != null)
)

const drawerTitle = computed(() => {
  if (props.mode === 'add') {
    return t('schoolDoctor.medicineApply.detailAddTitle')
  }
  if (props.mode === 'approve') {
    return t('schoolDoctor.medicineApply.detailApproveTitle')
  }
  return t('schoolDoctor.medicineApply.detailViewTitle')
})

function currentOperator() {
  const user = userStore.userInfo as Record<string, unknown> | undefined
  return String(user?.username || user?.name || user?.nickName || '')
}

function mapVisitRow(item: Record<string, unknown>): MedicineApplyVisitDetailRow {
  const operateTime = item.operationTime || item.operateTime || item.createTime
  const timeText = operateTime ? String(operateTime).slice(0, 16) : '--'
  const status = Number(item.operationStatus ?? item.operateStatus)
  const statusText =
    status === 1
      ? t('schoolDoctor.visitRecord.operateNormal')
      : status === 2
        ? t('schoolDoctor.visitRecord.operateAbnormal')
        : '--'
  const dest = Number(item.leaveDestination)
  const destMap: Record<number, string> = {
    1: t('schoolDoctor.visitRecord.leaveClassroom'),
    2: t('schoolDoctor.visitRecord.leaveHome'),
    3: t('schoolDoctor.visitRecord.leaveHospital')
  }
  return {
    rawRecord: item,
    pendingId: (item.pendingId || item.pendingMedicationId) as string | number | undefined,
    visitDate: timeText.slice(0, 10),
    visitTime: timeText,
    operateStatusText: statusText,
    specificSituation: String(item.situationDetail || item.specificSituation || item.remark || '--'),
    operatorName: String(item.operator || item.operatorName || item.creator || '--'),
    leaveTime: item.leaveTime ? String(item.leaveTime).slice(0, 16) : '--',
    leaveDestinationText: destMap[dest] || '--'
  }
}

async function loadSymptomOptions() {
  const result = await schoolDoctorDiseaseSettingApi.page.get({ current: 1, size: 500, status: 1 })
  const { list } = normalizePaged<SchoolDoctorDiseaseOption>(result)
  symptomOptions.value = list
}

async function loadVisitRecords() {
  if (!formModel.value.id || visitRecordList.value.length) {
    return
  }
  visitLoading.value = true
  try {
    const page = await schoolDoctorVisitRecordApi.pendingPage.get({
      current: 1,
      size: 100,
      medicationApplicationId: formModel.value.id
    })
    const { list: pendingList } = normalizePaged<{ id?: string | number }>(page)
    if (!pendingList.length) {
      visitRecordList.value = []
      return
    }
    const groups = await Promise.all(
      pendingList.map(async (pending) => {
        const detail = await schoolDoctorVisitRecordApi.pendingDetail.get(pending.id!)
        const ops = detail.operationList || detail.operationRecordList || []
        return (ops as Array<Record<string, unknown>>).map((op) =>
          mapVisitRow({ ...op, pendingId: pending.id })
        )
      })
    )
    visitRecordList.value = groups.flat()
  } finally {
    visitLoading.value = false
  }
}

watch(visible, async (open) => {
  if (!open) {
    return
  }
  formModel.value = emptyFormModel()
  visitRecordList.value = []
  await loadSymptomOptions()
  if (props.mode === 'add') {
    await nextTick(() => panelRef.value?.resetStudentSelect())
    return
  }
  if (props.recordId == null) {
    return
  }
  await runWithDetailLoading(async () => {
    const data = await schoolDoctorMedicineApplyApi.detail.get(props.recordId!)
    const contentList =
      data.contentList?.length
        ? data.contentList.map((item) => ({
            ...emptyContentItem(),
            ...item,
            startDate: item.startDate ? String(item.startDate).slice(0, 10) : '',
            endDate: item.endDate ? String(item.endDate).slice(0, 10) : ''
          }))
        : [emptyContentItem()]
    const legacyLeftover = data.contentList?.[0]?.leftoverDisposal
    formModel.value = {
      ...emptyFormModel(),
      ...data,
      id: props.recordId,
      informedConsent: data.informedConsent === 1 ? 1 : 0,
      leftoverDisposal: data.leftoverDisposal ?? legacyLeftover,
      contentList,
      diagnosisImageList: data.diagnosisImageList || []
    }
    const embedded = (data as Record<string, unknown>).medicationDetailList ||
      (data as Record<string, unknown>).visitRecordList ||
      (data as Record<string, unknown>).operationList
    if (Array.isArray(embedded) && embedded.length) {
      visitRecordList.value = embedded.map((item) => mapVisitRow(item as Record<string, unknown>))
    }
    if (props.mode === 'approve') {
      formModel.value.nurseOperator = currentOperator()
    }
    if (props.mode === 'view' && !visitRecordList.value.length) {
      await loadVisitRecords()
    }
    await nextTick(() => panelRef.value?.setDisplayFromForm())
  })
})

async function uploadImage(file: File) {
  return await medicalInfoApi.uploadAttachment.post(file)
}

async function handleDiagnosisUpload(option: UploadRequestOptions) {
  uploading.value = true
  try {
    const url = await uploadImage(option.file)
    const list = formModel.value.diagnosisImageList || []
    list.push({ imagePath: url, name: option.file.name })
    formModel.value.diagnosisImageList = list
    ElMessage.success(t('schoolDoctor.common.uploadSuccess'))
  } catch {
    ElMessage.error(t('schoolDoctor.common.uploadFailed'))
  } finally {
    uploading.value = false
  }
}

async function handleSignatureUpload(option: UploadRequestOptions) {
  signatureUploading.value = true
  try {
    formModel.value.parentSignaturePath = await uploadImage(option.file)
    ElMessage.success(t('schoolDoctor.common.uploadSuccess'))
  } catch {
    ElMessage.error(t('schoolDoctor.common.uploadFailed'))
  } finally {
    signatureUploading.value = false
  }
}

function onSignatureConfirm(url: string) {
  formModel.value.parentSignaturePath = url
}

function openVisitDetail(row: MedicineApplyVisitDetailRow) {
  if (!row.rawRecord) {
    return
  }
  operationDialogRef.value?.open('view', row.rawRecord, currentOperator())
}

function buildSubmitData() {
  const data: MedicineApplyFormModel = { ...formModel.value }
  if (data.applyMedication !== 1) {
    data.contentList = []
    data.leftoverDisposal = undefined
  } else {
    data.contentList = (data.contentList || []).map((item) => ({
      ...item,
      startDate: item.startDate?.length === 10 ? `${item.startDate} 00:00:00` : item.startDate,
      endDate: item.endDate?.length === 10 ? `${item.endDate} 00:00:00` : item.endDate
    }))
  }
  if (props.mode === 'approve') {
    data.nurseOperator = data.nurseOperator || currentOperator()
    if (data.nurseApproval === 1) {
      data.status = 1
    } else if (data.nurseApproval === 2) {
      data.status = 3
    }
  }
  if (props.mode === 'add') {
    data.informedConsent = data.informedConsent === 1 ? 1 : 0
  }
  return data
}

function validateContentList() {
  if (props.mode !== 'add' || formModel.value.applyMedication !== 1) {
    return ''
  }
  const list = formModel.value.contentList || []
  if (!list.length) {
    return t('schoolDoctor.medicineApply.ruleContent')
  }
  const first = list[0]
  if (!first.medicineName?.trim()) {
    return t('schoolDoctor.medicineApply.ruleMedicineName')
  }
  if (!first.startDate) {
    return t('schoolDoctor.medicineApply.ruleStartDate')
  }
  if (!first.endDate) {
    return t('schoolDoctor.medicineApply.ruleEndDate')
  }
  return ''
}

async function submitApproval(nurseApproval: number) {
  formModel.value.nurseApproval = nurseApproval
  if (nurseApproval === 2 && !String(formModel.value.remark || '').trim()) {
    ElMessage.warning(t('schoolDoctor.medicineApply.ruleApprovalRemark'))
    return
  }
  await submit()
}

async function submit() {
  const valid = await panelRef.value?.validate()
  if (!valid) {
    return
  }
  if (props.mode === 'add' && !formModel.value.admissionNo) {
    ElMessage.warning(t('schoolDoctor.medicineApply.ruleStudent'))
    return
  }
  const contentError = validateContentList()
  if (contentError) {
    ElMessage.warning(contentError)
    return
  }
  submitting.value = true
  try {
    const data = buildSubmitData()
    if (props.mode === 'add') {
      await schoolDoctorMedicineApplyApi.add.post(data)
      ElMessage.success(t('schoolDoctor.common.addSuccess'))
    } else {
      await schoolDoctorMedicineApplyApi.edit.post(data)
      const msg =
        props.mode === 'approve'
          ? formModel.value.nurseApproval === 2
            ? t('schoolDoctor.medicineApply.rejectSuccess')
            : t('schoolDoctor.medicineApply.approveSuccess')
          : t('schoolDoctor.common.saveSuccess')
      ElMessage.success(msg)
    }
    visible.value = false
    emit('saved')
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped lang="scss">
.medicine-apply-drawer__body {
  padding: 16px;
  background: var(--el-fill-color-light);
  min-height: 100%;
}
</style>
