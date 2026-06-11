<template>
  <el-form
    ref="formRef"
    :model="formModel"
    :rules="rules"
    label-position="top"
    class="infectious-form">
    <StudentRemoteSelect
      ref="studentSelectRef"
      :readonly="readonly"
      :school-records="schoolRecords"
      @select="onStudentSelect"
      @clear="onStudentClear" />

    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item
          :label="$t('schoolDoctor.infectiousDisease.fieldDiseaseName')"
          prop="diseaseName">
          <el-input
            v-model="formModel.diseaseName"
            :disabled="readonly"
            :placeholder="$t('schoolDoctor.infectiousDisease.phDiseaseName')" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item
          :label="$t('schoolDoctor.infectiousDisease.fieldDiscoveryDate')"
          prop="discoveryDate">
          <el-date-picker
            v-model="formModel.discoveryDate"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            style="width: 100%"
            :disabled="readonly"
            :placeholder="$t('schoolDoctor.infectiousDisease.phDiscoveryDateSelect')" />
        </el-form-item>
      </el-col>
    </el-row>

    <el-form-item :label="$t('schoolDoctor.infectiousDisease.fieldStatus')" prop="status">
      <el-select
        v-model="formModel.status"
        style="width: 100%"
        clearable
        :disabled="readonly"
        :placeholder="$t('schoolDoctor.infectiousDisease.phStatusSelect')">
        <el-option
          v-for="item in statusOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value" />
      </el-select>
    </el-form-item>

    <el-form-item
      :label="$t('schoolDoctor.infectiousDisease.fieldAttachment')"
      prop="attachmentList">
      <el-upload
        list-type="picture-card"
        action="#"
        :file-list="pictureFileList"
        :http-request="handleCustomUpload"
        :before-upload="beforeImageUpload"
        :on-remove="handleRemovePicture"
        :on-preview="handlePicturePreview"
        :disabled="readonly || uploading"
        :class="{ 'hide-upload': readonly }"
        accept=".jpg,.jpeg,.png,.gif,.webp,image/jpeg,image/png,image/gif,image/webp">
        <el-icon><Plus /></el-icon>
      </el-upload>
      <div v-if="!readonly" class="infectious-form__tip">
        {{ $t('schoolDoctor.infectiousDisease.imageOnlyTip') }}
      </div>
    </el-form-item>

    <el-form-item :label="$t('schoolDoctor.infectiousDisease.fieldRemark')" prop="remark">
      <el-input
        v-model="formModel.remark"
        type="textarea"
        :rows="3"
        :disabled="readonly"
        :placeholder="$t('schoolDoctor.infectiousDisease.phRemark')" />
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import type {
  FormInstance,
  FormRules,
  UploadFile,
  UploadRequestOptions,
  UploadUserFile
} from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useUniI18n } from 'uni-ui-lib'
import { computed, ref } from 'vue'

import type { InfectiousDiseaseFormModel } from '@/types/modules/school-doctor-infectious-disease'
import type { SchoolOptionRecord } from '@/types/modules/membership'
import StudentRemoteSelect from '@/views/school-doctor/components/student-remote-select.vue'

import { statusOpts } from '../list.config'

const formModel = defineModel<InfectiousDiseaseFormModel>({ required: true })

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

const statusOptions = computed(() => statusOpts(t))

const pictureFileList = computed<UploadUserFile[]>(() =>
  (formModel.value.attachmentList || []).map((item, index) => ({
    name: getAttachmentName(item, index),
    url: item.attachmentUrl,
    uid: item.id ?? item.attachmentUrl ?? index
  }))
)

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
}

function onStudentClear() {
  formModel.value.admissionNo = ''
  formModel.value.studentName = ''
  formModel.value.schoolId = undefined
  formModel.value.gradeName = ''
  formModel.value.className = ''
}

function beforeImageUpload(file: File) {
  const isImage = /^image\//.test(file.type) || /\.(jpe?g|png|gif|webp)$/i.test(file.name || '')
  if (!isImage) {
    ElMessage.warning(t('schoolDoctor.infectiousDisease.imageOnlyWarning'))
    return false
  }
  return true
}

async function handleCustomUpload(option: UploadRequestOptions) {
  if (!beforeImageUpload(option.file)) {
    return
  }
  emit('upload', option)
}

function handleRemovePicture(file: UploadFile) {
  const index = (formModel.value.attachmentList || []).findIndex(
    (item) => item.attachmentUrl === file.url
  )
  if (index > -1) {
    formModel.value.attachmentList?.splice(index, 1)
  }
}

function handlePicturePreview(file: UploadFile) {
  if (file.url) {
    window.open(file.url, '_blank')
  }
}

function setDisplayFromForm() {
  studentSelectRef.value?.setDisplayFromForm({
    ...formModel.value,
    fullName: formModel.value.studentName,
    grade: formModel.value.gradeName,
    formCode: formModel.value.className
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
.infectious-form {
  &__tip {
    margin-top: 4px;
    font-size: 12px;
    color: var(--el-text-color-secondary);
  }
}

.hide-upload :deep(.el-upload--picture-card) {
  display: none;
}

:deep(.el-upload-list--picture-card .el-upload-list__item-thumbnail) {
  object-fit: contain;
}
</style>
