<template>
  <el-dialog
    v-model="visible"
    :title="$t('dorm.boardingStudent.addStudent')"
    width="640px"
    destroy-on-close>
    <UniForm ref="uniFormRef" v-model="formModel" mode="edit" :config="formCfg" />
    <div v-if="studentPreview" class="student-add-dialog__preview">
      <div class="student-add-dialog__row">
        <span>{{ $t('dorm.boardingStudent.fieldSchool') }}</span>
        <span>{{ studentPreview.school_name || '--' }}</span>
      </div>
      <div class="student-add-dialog__row">
        <span>{{ $t('dorm.boardingStudent.fieldName') }}</span>
        <span>{{ studentPreview.show_name || '--' }}</span>
      </div>
      <div class="student-add-dialog__row">
        <span>{{ $t('dorm.boardingStudent.fieldGrade') }}</span>
        <span>{{ studentPreview.grade_code || '--' }}</span>
      </div>
      <div class="student-add-dialog__row">
        <span>{{ $t('dorm.boardingStudent.fieldClass') }}</span>
        <span>{{ studentPreview.form_code || '--' }}</span>
      </div>
      <div class="student-add-dialog__row">
        <span>{{ $t('dorm.boardingStudent.fieldGender') }}</span>
        <span>{{ studentPreview.gender || '--' }}</span>
      </div>
      <div class="student-add-dialog__row">
        <span>{{ $t('dorm.boardingStudent.fieldNationality') }}</span>
        <span>{{ studentPreview.show_nationality || '--' }}</span>
      </div>
    </div>
    <template #footer>
      <el-button @click="visible = false">{{ $t('dorm.common.cancel') }}</el-button>
      <el-button type="primary" :loading="submitting" @click="submit">
        {{ $t('dorm.common.submit') }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import type { FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { UniForm, useUniI18n } from 'uni-ui-lib'
import type { UniFormConfig } from 'uni-ui-lib'
import { computed, ref, watch } from 'vue'

import { dormStudentApi } from '@/api'
import type { DormStudentAddModel, DormStudentInfoLookup } from '@/types/modules/dorm-student'

const visible = defineModel<boolean>('visible', { required: true })

const props = defineProps<{
  schoolOptions: Array<{ label: string; value: string | number }>
  defaultSchoolId?: string | number
}>()

const emit = defineEmits<{
  saved: []
}>()

const { t } = useUniI18n()
const uniFormRef = ref<InstanceType<typeof UniForm> | null>(null)
const submitting = ref(false)
const studentPreview = ref<DormStudentInfoLookup | null>(null)
const formModel = ref<DormStudentAddModel>({
  schoolId: undefined,
  admissionNo: '',
  type: ''
})

const formCfg = computed<UniFormConfig>(() => ({
  labelWidth: '100px',
  schema: [
    {
      field: 'schoolId',
      label: t('dorm.boardingStudent.fieldSchool'),
      component: 'ElSelect',
      options: props.schoolOptions,
      componentProps: {
        filterable: true,
        placeholder: t('dorm.boardingStudent.phSchool'),
        style: { width: '100%' },
        onChange: () => {
          void lookupStudent()
        }
      },
      colProps: { span: 24 }
    },
    {
      field: 'admissionNo',
      label: t('dorm.boardingStudent.fieldAdmissionNo'),
      component: 'ElInput',
      componentProps: {
        placeholder: t('dorm.boardingStudent.phAdmissionNo'),
        onBlur: () => {
          void lookupStudent()
        }
      },
      colProps: { span: 24 }
    },
    {
      field: 'type',
      label: t('dorm.boardingStudent.fieldBoardingType'),
      component: 'ElSelect',
      options: [
        { label: 'weekly boarding', value: 'weekly boarding' },
        { label: 'full boarding', value: 'full boarding' }
      ],
      componentProps: {
        placeholder: t('dorm.boardingStudent.phBoardingType'),
        style: { width: '100%' }
      },
      colProps: { span: 24 }
    }
  ],
  rules: {
    schoolId: [
      { required: true, message: t('dorm.boardingStudent.ruleSchool'), trigger: 'change' }
    ],
    admissionNo: [
      { required: true, message: t('dorm.boardingStudent.ruleAdmissionNo'), trigger: 'blur' }
    ],
    type: [
      { required: true, message: t('dorm.boardingStudent.ruleBoardingType'), trigger: 'change' }
    ]
  } satisfies FormRules
}))

watch(visible, (open) => {
  if (!open) {
    return
  }
  studentPreview.value = null
  formModel.value = {
    schoolId: props.defaultSchoolId,
    admissionNo: '',
    type: ''
  }
})

async function lookupStudent() {
  const schoolId = formModel.value.schoolId
  const admissionNo = formModel.value.admissionNo?.trim()
  if (!schoolId || !admissionNo) {
    studentPreview.value = null
    return
  }
  try {
    studentPreview.value = await dormStudentApi.studentInfo.get({ schoolId, admissionNo })
  } catch {
    studentPreview.value = null
  }
}

async function submit() {
  const valid = await uniFormRef.value?.validate().catch(() => false)
  if (!valid) {
    return
  }
  submitting.value = true
  try {
    await dormStudentApi.manualAdd.post({
      schoolId: formModel.value.schoolId,
      admissionNo: formModel.value.admissionNo?.trim(),
      type: formModel.value.type
    })
    ElMessage.success(t('dorm.boardingStudent.addSuccess'))
    visible.value = false
    emit('saved')
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped lang="scss">
.student-add-dialog__preview {
  margin-top: 12px;
  padding: 12px;
  background: var(--el-fill-color-light);
  border-radius: 4px;
}

.student-add-dialog__row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 14px;

  &:last-child {
    margin-bottom: 0;
  }
}
</style>
