<template>
  <el-form ref="formRef" :model="formModel" :rules="rules" label-position="top" class="health-report-form">
    <StudentRemoteSelect
      ref="studentSelectRef"
      :readonly="readonly"
      :school-records="schoolRecords"
      @select="onStudentSelect"
      @clear="onStudentClear"
    />

    <el-form-item :label="$t('schoolDoctor.healthReport.fieldReportType')" prop="reportType">
      <el-select
        v-model="formModel.reportType"
        style="width: 100%"
        clearable
        :disabled="readonly"
        :placeholder="$t('schoolDoctor.healthReport.phReportTypeSelect')"
      >
        <el-option
          v-for="item in reportTypeOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>

    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item :label="$t('schoolDoctor.healthReport.fieldExamYear')" prop="examYear">
          <el-date-picker
            v-model="formModel.examYear"
            type="year"
            value-format="YYYY"
            style="width: 100%"
            :disabled="readonly"
            :placeholder="$t('schoolDoctor.healthReport.phExamYear')"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item :label="$t('schoolDoctor.healthReport.fieldExamDate')" prop="examDate">
          <el-date-picker
            v-model="formModel.examDate"
            type="date"
            value-format="YYYY-MM-DD"
            style="width: 100%"
            :disabled="readonly"
            :placeholder="$t('schoolDoctor.healthReport.phExamDate')"
          />
        </el-form-item>
      </el-col>
    </el-row>

    <el-form-item :label="$t('schoolDoctor.healthReport.fieldExamOrg')" prop="examOrg">
      <el-input
        v-model="formModel.examOrg"
        :disabled="readonly"
        :placeholder="$t('schoolDoctor.healthReport.phExamOrg')"
      />
    </el-form-item>

    <el-form-item :label="$t('schoolDoctor.healthReport.fieldAttachment')" prop="attachmentList">
      <div v-if="formModel.attachmentList?.length" class="health-report-form__files">
        <div
          v-for="(item, index) in formModel.attachmentList"
          :key="item.id || item.attachmentUrl || index"
          class="health-report-form__file"
        >
          <el-link type="primary" :underline="false" :href="item.attachmentUrl" target="_blank">
            {{ getAttachmentName(item, index) }}
          </el-link>
          <el-icon v-if="!readonly" class="health-report-form__remove" @click="removeAttachment(index)">
            <Close />
          </el-icon>
        </div>
      </div>
      <el-upload
        v-if="!readonly"
        action="#"
        :show-file-list="false"
        :http-request="handleCustomUpload"
        :before-upload="beforeAttachmentUpload"
        accept=".pdf,.png,.jpg,.jpeg,application/pdf,image/png,image/jpeg"
      >
        <el-button size="small" :loading="uploading">{{ $t('schoolDoctor.common.upload') }}</el-button>
        <template #tip>
          <div class="health-report-form__tip">{{ $t('schoolDoctor.healthReport.attachmentTip') }}</div>
        </template>
      </el-upload>
    </el-form-item>

    <el-form-item :label="$t('schoolDoctor.healthReport.fieldRemark')" prop="remark">
      <el-input
        v-model="formModel.remark"
        type="textarea"
        :rows="3"
        :disabled="readonly"
        :placeholder="$t('schoolDoctor.healthReport.phRemark')"
      />
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import type { FormInstance, FormRules, UploadRequestOptions } from 'element-plus'
import { Close } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useUniI18n } from 'uni-ui-lib'
import { computed, ref } from 'vue'

import type { HealthReportFormModel } from '@/types/modules/school-doctor-health-report'
import type { SchoolOptionRecord } from '@/types/modules/membership'
import StudentRemoteSelect from '@/views/school-doctor/components/student-remote-select.vue'

import { reportTypeOpts } from '../list.config'

const formModel = defineModel<HealthReportFormModel>({ required: true })

defineProps<{
  readonly?: boolean
  rules: FormRules
  schoolRecords: SchoolOptionRecord[]
  uploading?: boolean
}>()

const emit = defineEmits<{
  upload: [options: UploadRequestOptions]
}>()

const { t } = useUniI18n()
const formRef = ref<FormInstance | null>(null)
const studentSelectRef = ref<InstanceType<typeof StudentRemoteSelect> | null>(null)

const reportTypeOptions = computed(() => reportTypeOpts(t))

function getAttachmentName(item: { name?: string; attachmentUrl?: string }, index: number) {
  if (item.name) {
    return item.name
  }
  const url = item.attachmentUrl || ''
  const fileName = url.split('/').pop()
  if (fileName) {
    return decodeURIComponent(fileName)
  }
  return `${t('schoolDoctor.common.viewAttachment')} ${index + 1}`
}

function onStudentSelect(fields: Record<string, unknown>) {
  formModel.value.admissionNo = String(fields.admissionNo ?? '')
  formModel.value.studentName = String(fields.fullName ?? fields.studentName ?? '')
  formModel.value.schoolId = fields.schoolId as string | number | undefined
  formModel.value.gradeName = String(fields.grade ?? fields.gradeName ?? '')
  formModel.value.className = String(fields.formCode ?? fields.className ?? '')
  formModel.value.formCode = formModel.value.className
}

function onStudentClear() {
  formModel.value.admissionNo = ''
  formModel.value.studentName = ''
  formModel.value.schoolId = undefined
  formModel.value.gradeName = ''
  formModel.value.className = ''
  formModel.value.formCode = ''
}

function beforeAttachmentUpload(file: File) {
  const allowed =
    /^image\//.test(file.type) ||
    file.type === 'application/pdf' ||
    /\.(pdf|png|jpe?g)$/i.test(file.name || '')
  if (!allowed) {
    ElMessage.warning(t('schoolDoctor.healthReport.attachmentWarning'))
    return false
  }
  return true
}

function handleCustomUpload(option: UploadRequestOptions) {
  if (!beforeAttachmentUpload(option.file)) {
    return
  }
  emit('upload', option)
}

function removeAttachment(index: number) {
  formModel.value.attachmentList?.splice(index, 1)
}

function setDisplayFromForm() {
  studentSelectRef.value?.setDisplayFromForm({
    ...formModel.value,
    fullName: formModel.value.studentName,
    grade: formModel.value.gradeName,
    formCode: formModel.value.className || formModel.value.formCode
  })
}

function resetStudentSelect() {
  studentSelectRef.value?.reset()
}

async function validate() {
  return await formRef.value?.validate().catch(() => false)
}

defineExpose({ validate, setDisplayFromForm, resetStudentSelect })
</script>

<style scoped lang="scss">
.health-report-form {
  &__files {
    margin-bottom: 8px;
  }

  &__file {
    display: inline-flex;
    align-items: center;
    height: 32px;
    margin: 0 8px 8px 0;
    padding: 4px 8px;
    background: var(--el-fill-color-light);
    border-radius: 4px;
  }

  &__remove {
    margin-left: 8px;
    color: var(--el-color-danger);
    cursor: pointer;

    &:hover {
      color: var(--el-color-danger-light-3);
    }
  }

  &__tip {
    margin-top: 4px;
    font-size: 12px;
    color: var(--el-text-color-secondary);
  }
}
</style>
