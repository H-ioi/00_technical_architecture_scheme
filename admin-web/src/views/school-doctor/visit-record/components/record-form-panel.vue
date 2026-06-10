<template>
  <div class="visit-form">
    <div class="visit-form__layout">
      <aside class="visit-form__side">
        <div class="visit-form__card">
          <h3>{{ $t('schoolDoctor.visitRecord.sectionStudent') }}</h3>
          <StudentRemoteSelect
            ref="studentSelectRef"
            :readonly="isLookMode || isLimitedEdit"
            :with-drug-allergy="true"
            :school-records="schoolRecords"
            @select="onStudentSelect"
            @clear="onStudentClear" />
        </div>
      </aside>

      <main class="visit-form__main">
        <el-form ref="formRef" :model="formModel" :rules="rules" label-position="top" :disabled="isLookMode">
          <div class="visit-form__card">
            <h3>{{ $t('schoolDoctor.visitRecord.sectionOperationInfo') }}</h3>
            <el-row :gutter="16">
              <el-col :span="12">
                <el-form-item :label="$t('schoolDoctor.visitRecord.fieldVisitTime')" prop="visitTime">
                  <div class="visit-form__datetime">
                    <el-date-picker
                      v-model="formModel.visitTime"
                      type="datetime"
                      value-format="YYYY-MM-DD HH:mm:ss"
                      :disabled="isOperationDisabled"
                      style="width: 100%" />
                    <el-button v-if="!isOperationDisabled" type="primary" link @click="setNow('visitTime')">
                      {{ $t('schoolDoctor.visitRecord.now') }}
                    </el-button>
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :label="$t('schoolDoctor.visitRecord.fieldLeaveTime')">
                  <div class="visit-form__datetime">
                    <el-date-picker
                      v-model="formModel.leaveTime"
                      type="datetime"
                      value-format="YYYY-MM-DD HH:mm:ss"
                      :disabled="isLookMode"
                      style="width: 100%" />
                    <el-button v-if="!isLookMode" type="primary" link @click="setNow('leaveTime')">
                      {{ $t('schoolDoctor.visitRecord.now') }}
                    </el-button>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item :label="$t('schoolDoctor.visitRecord.fieldChiefComplaint')">
              <el-input v-model="formModel.chiefComplaint" type="textarea" :rows="3" :disabled="isOperationDisabled" />
            </el-form-item>
            <el-form-item :label="$t('schoolDoctor.visitRecord.fieldPhysicalExam')">
              <el-input v-model="formModel.physicalExam" type="textarea" :rows="3" :disabled="isOperationDisabled" />
            </el-form-item>
            <el-form-item :label="$t('schoolDoctor.visitRecord.fieldDiagnosis')">
              <el-input v-model="formModel.diagnosisAdvice" type="textarea" :rows="3" :disabled="isOperationDisabled" />
            </el-form-item>
            <el-form-item :label="$t('schoolDoctor.visitRecord.fieldRemark')">
              <el-input v-model="formModel.remark" type="textarea" :rows="2" :disabled="isOperationDisabled" />
            </el-form-item>
            <el-form-item>
              <template #label>
                <span>{{ $t('schoolDoctor.visitRecord.fieldAttachment') }}</span>
                <span class="visit-form__tip">{{ $t('schoolDoctor.visitRecord.attachmentTip') }}</span>
              </template>
              <div v-for="(file, index) in formModel.attachmentList" :key="file.url || index" class="visit-form__file">
                <el-link :href="file.url" target="_blank" type="primary">{{ file.name || 'file' }}</el-link>
                <el-button v-if="!isOperationDisabled" type="danger" link @click="removeAttachment(index)">
                  {{ $t('schoolDoctor.common.remove') }}
                </el-button>
              </div>
              <el-upload
                v-if="!isOperationDisabled"
                action="#"
                drag
                :show-file-list="false"
                accept=".pdf,.png,.jpg,.jpeg,.docx"
                :http-request="handleUpload"
                :before-upload="beforeUpload">
                <div class="visit-form__upload">{{ $t('schoolDoctor.visitRecord.uploadDrag') }}</div>
              </el-upload>
            </el-form-item>
            <el-row :gutter="16">
              <el-col :span="12">
                <el-form-item :label="$t('schoolDoctor.visitRecord.fieldLeaveDestination')">
                  <el-select
                    v-model="formModel.leaveDestination"
                    clearable
                    style="width: 100%"
                    :disabled="isOperationDisabled"
                    :placeholder="$t('schoolDoctor.visitRecord.phLeaveDestinationSelect')">
                    <el-option v-for="item in leaveOptions" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :label="$t('schoolDoctor.visitRecord.fieldOperator')">
                  <el-input v-model="formModel.operator" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :label="$t('schoolDoctor.visitRecord.fieldNotifyParent')">
                  <el-radio-group v-model="formModel.notifyParent" :disabled="isOperationDisabled">
                    <el-radio :value="1">{{ $t('schoolDoctor.common.yes') }}</el-radio>
                    <el-radio :value="0">{{ $t('schoolDoctor.common.no') }}</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :label="$t('schoolDoctor.visitRecord.fieldExecuteOperation')">
                  <el-radio-group v-model="formModel.executeOperation" :disabled="isLookMode">
                    <el-radio :value="1">{{ $t('schoolDoctor.common.yes') }}</el-radio>
                    <el-radio :value="0">{{ $t('schoolDoctor.common.no') }}</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </el-form>

        <div class="visit-form__card">
          <div class="visit-form__card-head">
            <h3>{{ $t('schoolDoctor.visitRecord.sectionParentReceipt') }}</h3>
            <el-button
              v-if="mode !== 'add'"
              type="primary"
              link
              :loading="parentReceiptRefreshing"
              @click="emit('refresh-parent-receipt')">
              {{ $t('schoolDoctor.visitRecord.refresh') }}
            </el-button>
          </div>
          <el-form label-position="top" :disabled="isLookMode">
            <el-row :gutter="16">
              <el-col :span="12">
                <el-form-item :label="$t('schoolDoctor.visitRecord.phParentAgree')">
                  <el-radio-group v-model="formModel.parentAgree">
                    <el-radio :value="1">{{ $t('schoolDoctor.common.yes') }}</el-radio>
                    <el-radio :value="0">{{ $t('schoolDoctor.common.no') }}</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :label="$t('schoolDoctor.visitRecord.fieldParentName')">
                  <el-input v-model="formModel.parentName" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :label="$t('schoolDoctor.visitRecord.fieldParentContact')">
                  <el-input v-model="formModel.parentContact" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :label="$t('schoolDoctor.visitRecord.fieldParentSignature')">
                  <div v-if="formModel.parentSignaturePath" class="visit-form__signature">
                    <el-image :src="formModel.parentSignaturePath" fit="contain" style="width: 200px; height: 100px" />
                    <el-button v-if="!isLookMode" type="danger" link @click="formModel.parentSignaturePath = ''">
                      {{ $t('schoolDoctor.common.remove') }}
                    </el-button>
                  </div>
                  <el-button v-else-if="!isLookMode" type="primary" link @click="signatureDialogRef?.open()">
                    {{ $t('schoolDoctor.medicalInfo.startSign') }}
                  </el-button>
                  <span v-else>--</span>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </main>
    </div>

    <SignatureDialog ref="signatureDialogRef" @confirm="onSignatureConfirm" />
  </div>
</template>

<script setup lang="ts">
import type { FormInstance, FormRules, UploadRequestOptions } from 'element-plus'
import { ElMessage } from 'element-plus'
import { useUniI18n } from 'uni-ui-lib'
import { computed, ref } from 'vue'

import { medicalInfoApi } from '@/api'
import SignatureDialog from '@/views/school-doctor/components/signature-dialog.vue'
import StudentRemoteSelect from '@/views/school-doctor/components/student-remote-select.vue'
import type { VisitRecordFormModel } from '@/types/modules/school-doctor-visit-record'
import type { SchoolOptionRecord } from '@/types/modules/membership'

import { leaveDestinationOpts } from '../record.config'

const props = defineProps<{
  mode: 'add' | 'view' | 'edit'
  schoolRecords: SchoolOptionRecord[]
  parentReceiptRefreshing?: boolean
}>()

const emit = defineEmits<{
  'refresh-parent-receipt': []
}>()

const formModel = defineModel<VisitRecordFormModel>('formModel', { required: true })

const { t } = useUniI18n()
const formRef = ref<FormInstance>()
const studentSelectRef = ref<InstanceType<typeof StudentRemoteSelect> | null>(null)
const signatureDialogRef = ref<InstanceType<typeof SignatureDialog> | null>(null)
const leaveOptions = computed(() => leaveDestinationOpts(t))

const isLookMode = computed(() => props.mode === 'view')
const parentReceiptExists = computed(() => !!formModel.value.parentSignaturePath)
const isLimitedEdit = computed(() => props.mode === 'edit' && parentReceiptExists.value)
const isOperationDisabled = computed(() => isLookMode.value || isLimitedEdit.value)

const rules = computed<FormRules>(() => ({
  visitTime: [{ required: true, message: t('schoolDoctor.visitRecord.ruleVisitTime'), trigger: 'change' }]
}))

function setNow(field: 'visitTime' | 'leaveTime') {
  const now = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  formModel.value[field] =
    `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
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
  formModel.value.drugAllergy = ''
}

function onSignatureConfirm(url: string) {
  formModel.value.parentSignaturePath = url
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
  try {
    const url = await medicalInfoApi.uploadAttachment.post(option.file)
    const list = formModel.value.attachmentList || []
    list.push({ name: option.file.name, url })
    formModel.value.attachmentList = list
    ElMessage.success(t('schoolDoctor.common.uploadSuccess'))
  } catch {
    ElMessage.error(t('schoolDoctor.common.uploadFailed'))
  }
}

function removeAttachment(index: number) {
  formModel.value.attachmentList?.splice(index, 1)
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
.visit-form {
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

  &__card-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
  }

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

  &__file,
  &__signature {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
  }

  &__upload {
    padding: 24px;
    color: var(--el-text-color-secondary);
    text-align: center;
  }
}
</style>
