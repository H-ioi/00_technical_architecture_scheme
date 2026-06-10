<template>
  <div class="medicine-form">
    <div class="medicine-form__layout">
      <aside class="medicine-form__side">
        <div class="medicine-form__card">
          <h3>{{ $t('schoolDoctor.medicineApply.sectionStudent') }}</h3>
          <p class="medicine-form__desc">{{ $t('schoolDoctor.medicineApply.sectionStudentDesc') }}</p>
          <StudentRemoteSelect
            ref="studentSelectRef"
            :readonly="studentReadonly"
            :school-records="schoolRecords"
            @select="onStudentSelect"
            @clear="onStudentClear"
          />
        </div>
      </aside>

      <main class="medicine-form__main">
        <el-form ref="formRef" :model="formModel" :rules="formRules" label-position="top" :disabled="isLookMode">
          <div class="medicine-form__card">
            <h3>{{ $t('schoolDoctor.medicineApply.sectionCondition') }}</h3>
            <el-row :gutter="16">
              <el-col :span="12">
                <el-form-item :label="$t('schoolDoctor.medicineApply.fieldSymptom')">
                  <el-select
                    v-model="formModel.diseaseId"
                    clearable
                    filterable
                    style="width: 100%"
                    :disabled="formReadonly"
                    :placeholder="$t('schoolDoctor.common.select')"
                  >
                    <el-option
                      v-for="item in symptomOptions"
                      :key="item.id"
                      :label="`${item.cnName || ''} / ${item.enName || item.name || ''}`"
                      :value="item.id!"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :label="$t('schoolDoctor.medicineApply.fieldNeedMedication')" prop="applyMedication">
                  <el-select
                    v-model="formModel.applyMedication"
                    clearable
                    style="width: 100%"
                    :disabled="formReadonly"
                    :placeholder="$t('schoolDoctor.medicineApply.ruleNeedMedication')"
                  >
                    <el-option v-for="opt in needOpts" :key="opt.value" :label="opt.label" :value="opt.value" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item :label="$t('schoolDoctor.medicineApply.fieldSymptomDetail')">
                  <el-input v-model="formModel.symptomDetails" type="textarea" :rows="3" :disabled="formReadonly" />
                </el-form-item>
              </el-col>
            </el-row>
          </div>

          <div v-if="formModel.applyMedication === 1" class="medicine-form__card">
            <h3>{{ $t('schoolDoctor.medicineApply.sectionMedicationDetail') }}</h3>
            <MedicationContent v-model:content-list="formModel.contentList!" :readonly="formReadonly" />
            <el-row :gutter="16">
              <el-col :span="12">
                <el-form-item :label="$t('schoolDoctor.medicineApply.fieldLeftover')">
                  <el-select v-model="formModel.leftoverDisposal" clearable style="width: 100%" :disabled="formReadonly">
                    <el-option v-for="opt in leftoverOpts" :key="opt.value" :label="opt.label" :value="opt.value" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :label="$t('schoolDoctor.medicineApply.fieldDiagnosisImages')">
                  <el-upload
                    list-type="picture-card"
                    action="#"
                    :file-list="pictureFileList"
                    :http-request="(opt) => emit('diagnosis-upload', opt)"
                    :before-upload="beforeImage"
                    :on-remove="onRemoveImage"
                    :disabled="formReadonly || uploading"
                    accept="image/*"
                  >
                    <span v-if="!formReadonly">+</span>
                  </el-upload>
                </el-form-item>
              </el-col>
            </el-row>
          </div>

          <ParentSection
            v-model:form-model="formModel"
            :readonly="formReadonly"
            :mode="mode"
            :signature-uploading="signatureUploading"
            @open-signature="emit('open-signature')"
            @signature-upload="emit('signature-upload', $event)"
          />

          <div v-if="showApprovalSection" class="medicine-form__card">
            <h3>{{ $t('schoolDoctor.medicineApply.sectionApproval') }}</h3>
            <el-row :gutter="16">
              <el-col v-if="!approvalEditable" :span="8">
                <el-form-item :label="$t('schoolDoctor.medicineApply.fieldNurseApproval')">
                  <el-input :model-value="nurseApprovalText" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="approvalEditable ? 24 : 8">
                <el-form-item :label="$t('schoolDoctor.medicineApply.fieldNurseOperator')">
                  <el-input v-model="formModel.nurseOperator" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item :label="$t('schoolDoctor.medicineApply.fieldApprovalRemark')">
                  <el-input v-model="formModel.remark" type="textarea" :rows="3" :disabled="!approvalEditable" />
                </el-form-item>
              </el-col>
            </el-row>
          </div>

          <div v-if="mode === 'view'" class="medicine-form__card">
            <h3>{{ $t('schoolDoctor.medicineApply.sectionVisitDetail') }}</h3>
            <el-table v-loading="visitLoading" :data="visitRecordList" border size="small">
              <el-table-column :label="$t('schoolDoctor.visitRecord.fieldVisitDate')" prop="visitDate" width="108" />
              <el-table-column :label="$t('schoolDoctor.visitRecord.fieldOperateTime')" prop="visitTime" width="168" />
              <el-table-column :label="$t('schoolDoctor.visitRecord.fieldOperateStatus')" prop="operateStatusText" width="88" />
              <el-table-column :label="$t('schoolDoctor.visitRecord.fieldSituation')" prop="specificSituation" min-width="140" show-overflow-tooltip />
              <el-table-column :label="$t('schoolDoctor.visitRecord.fieldOperator')" prop="operatorName" width="96" />
              <el-table-column :label="$t('schoolDoctor.common.action')" width="72" fixed="right">
                <template #default="{ row }">
                  <el-button type="primary" link @click="emit('open-visit-detail', row)">
                    {{ $t('schoolDoctor.studentRecord.view') }}
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <div v-if="!visitLoading && visitRecordList.length === 0" class="medicine-form__empty">
              {{ $t('schoolDoctor.common.noData') }}
            </div>
          </div>
        </el-form>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormInstance, FormRules, UploadFile, UploadRequestOptions, UploadUserFile } from 'element-plus'
import { ElMessage } from 'element-plus'
import { useUniI18n } from 'uni-ui-lib'
import { computed, ref } from 'vue'

import StudentRemoteSelect from '@/views/school-doctor/components/student-remote-select.vue'
import type { SchoolDoctorDiseaseOption } from '@/api/modules/school-doctor-disease-setting'
import type { MedicineApplyFormModel, MedicineApplyVisitDetailRow } from '@/types/modules/school-doctor-medicine-apply'
import type { SchoolOptionRecord } from '@/types/modules/membership'

import { addFormRules, needMedicationOpts, nurseApprovalOpts } from '../list.config'
import MedicationContent from './medication-content.vue'
import ParentSection from './parent-section.vue'

const props = defineProps<{
  mode: 'add' | 'view' | 'approve'
  formReadonly: boolean
  studentReadonly: boolean
  approvalEditable: boolean
  showApprovalSection: boolean
  schoolRecords: SchoolOptionRecord[]
  symptomOptions: SchoolDoctorDiseaseOption[]
  visitRecordList: MedicineApplyVisitDetailRow[]
  visitLoading?: boolean
  uploading?: boolean
  signatureUploading?: boolean
}>()

const emit = defineEmits<{
  'diagnosis-upload': [option: UploadRequestOptions]
  'open-signature': []
  'signature-upload': [option: UploadRequestOptions]
  'open-visit-detail': [row: MedicineApplyVisitDetailRow]
}>()

const formModel = defineModel<MedicineApplyFormModel>('formModel', { required: true })

const { t } = useUniI18n()
const formRef = ref<FormInstance>()
const studentSelectRef = ref<InstanceType<typeof StudentRemoteSelect> | null>(null)

const isLookMode = computed(() => props.mode === 'view')
const needOpts = computed(() => needMedicationOpts(t))
const formRules = computed<FormRules>(() => (props.mode === 'add' ? addFormRules(t) : {}))

const nurseApprovalText = computed(() => {
  const item = nurseApprovalOpts(t).find((opt) => opt.value === formModel.value.nurseApproval)
  return item?.label || '--'
})

const leftoverOpts = computed(() => [
  { label: t('schoolDoctor.medicineApply.leftoverFriday'), value: 1 },
  { label: t('schoolDoctor.medicineApply.leftoverWeekend'), value: 2 },
  { label: t('schoolDoctor.medicineApply.leftoverDiscard'), value: 3 }
])

const pictureFileList = computed<UploadUserFile[]>(() =>
  (formModel.value.diagnosisImageList || []).map((item, index) => ({
    name: item.name || `image-${index + 1}`,
    url: item.imagePath,
    uid: index
  }))
)

function onStudentSelect(fields: Record<string, unknown>) {
  Object.assign(formModel.value, fields)
}

function onStudentClear() {
  formModel.value.admissionNo = ''
  formModel.value.fullName = ''
  formModel.value.schoolId = undefined
  formModel.value.grade = ''
  formModel.value.formCode = ''
}

function beforeImage(file: File) {
  const ok = /^image\//.test(file.type) || /\.(jpe?g|png|gif|webp)$/i.test(file.name)
  if (!ok) {
    ElMessage.warning(t('schoolDoctor.medicalInfo.imageOnly'))
  }
  return ok
}

function onRemoveImage(file: UploadFile) {
  const list = formModel.value.diagnosisImageList || []
  const index = list.findIndex((item) => item.imagePath === file.url)
  if (index > -1) {
    list.splice(index, 1)
  }
}

function setDisplayFromForm() {
  studentSelectRef.value?.setDisplayFromForm(formModel.value as Record<string, unknown>)
}

function resetStudentSelect() {
  studentSelectRef.value?.reset()
}

async function validate() {
  if (!formRef.value) {
    return true
  }
  return await formRef.value.validate().catch(() => false)
}

defineExpose({ validate, setDisplayFromForm, resetStudentSelect })
</script>

<style scoped lang="scss">
.medicine-form {
  &__layout {
    display: flex;
    gap: 16px;
    align-items: flex-start;
  }

  &__side {
    flex: 0 0 320px;
    width: 320px;
  }

  &__main {
    flex: 1;
    min-width: 0;
  }

  &__card {
    margin-bottom: 16px;
    padding: 16px;
    background: #fff;
    border: 1px solid var(--el-border-color-lighter);
    border-radius: 12px;

    h3 {
      margin: 0 0 12px;
      font-size: 15px;
    }
  }

  &__desc {
    margin: 0 0 12px;
    font-size: 12px;
    color: var(--el-text-color-secondary);
  }

  &__empty {
    padding: 16px;
    text-align: center;
    color: var(--el-text-color-secondary);
    font-size: 13px;
  }
}
</style>
