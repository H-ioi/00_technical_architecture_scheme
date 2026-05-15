<template>
  <el-dialog
    v-model="innerVisible"
    :title="title"
    width="520px"
    destroy-on-close
    @closed="onClosed">
    <UniForm ref="uniFormRef" v-model="model" mode="edit" :config="formConfig" />
    <template #footer>
      <el-button @click="innerVisible = false">{{ $t('common.cancel') }}</el-button>
      <el-button type="primary" :loading="submitting" @click="submit">{{
        $t('common.submit')
      }}</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import type { UniFormConfig, UniOption } from 'uni-ui-lib'
import { UniForm, useUniI18n } from 'uni-ui-lib'
import { ElMessage } from 'element-plus'
import { computed, reactive, ref, watch } from 'vue'

import { attendanceHolidayApi } from '@/api'
import type { AttendanceHolidaySysConfigRecord } from '@/types/modules/attendance-holiday'

const props = defineProps<{
  visible: boolean
  title: string
  modelValue: AttendanceHolidaySysConfigRecord
  schoolOptions: UniOption[]
  departmentOptions: UniOption[]
  gradeOptions: UniOption[]
}>()

const emit = defineEmits<{
  'update:visible': [boolean]
  success: []
}>()

const { t } = useUniI18n()

const innerVisible = computed({
  get: () => props.visible,
  set: (v) => emit('update:visible', v)
})

const model = reactive<AttendanceHolidaySysConfigRecord>({
  id: '',
  school: '',
  grades: [],
  department: '',
  email: ''
})

const gradeVisible = computed(() => {
  const d = model.department
  return !d || !['dorm', 'bus', 'doctor', 'all'].includes(d)
})

const uniFormRef = ref<InstanceType<typeof UniForm> | null>(null)
const submitting = ref(false)

const formConfig = computed<UniFormConfig>(() => ({
  formProps: { labelWidth: '100px' },
  colProps: { span: 24 },
  rules: {
    school: [
      { required: true, message: t('attendance.holidayConfig.ruleSchool'), trigger: 'change' }
    ],
    department: [
      { required: true, message: t('attendance.holidayConfig.ruleDepartment'), trigger: 'change' }
    ],
    email: [
      { required: true, message: t('attendance.holidayConfig.ruleEmail'), trigger: 'blur' },
      { type: 'email', message: t('attendance.holidayConfig.emailInvalid'), trigger: 'blur' }
    ]
  } as UniFormConfig['rules'],
  schema: [
    {
      field: 'school',
      label: t('attendance.holidayConfig.school'),
      component: 'ElSelect',
      options: props.schoolOptions,
      componentProps: {
        filterable: true,
        clearable: true,
        placeholder: t('attendance.phSchool'),
        style: { width: '100%' }
      }
    },
    {
      field: 'department',
      label: t('attendance.holidayConfig.department'),
      component: 'ElSelect',
      options: props.departmentOptions,
      componentProps: {
        placeholder: t('attendance.holidayConfig.department'),
        style: { width: '100%' }
      }
    },
    {
      field: 'grades',
      label: t('attendance.holidayConfig.grades'),
      component: 'ElSelect',
      options: props.gradeOptions,
      hidden: !gradeVisible.value,
      componentProps: {
        multiple: true,
        filterable: true,
        placeholder: t('attendance.holidayConfig.grades'),
        style: { width: '100%' }
      }
    },
    {
      field: 'email',
      label: t('attendance.holidayConfig.email'),
      component: 'ElInput',
      componentProps: { placeholder: t('attendance.holidayConfig.email') }
    }
  ]
}))

watch(
  () => props.modelValue,
  (v) => {
    model.id = v.id ?? ''
    model.school = v.school ?? ''
    model.grades = Array.isArray(v.grades) ? [...v.grades] : []
    model.department = v.department ?? ''
    model.email = v.email ?? ''
  },
  { deep: true, immediate: true }
)

const onClosed = () => {
  uniFormRef.value?.clearValidate()
}

const submit = async () => {
  try {
    await uniFormRef.value?.validate()
  } catch {
    return
  }
  submitting.value = true
  try {
    const api = model.id ? attendanceHolidayApi.sysConfigUpdate : attendanceHolidayApi.sysConfigSave
    await api.post({ ...model })
    ElMessage.success(
      model.id ? t('attendance.holidayConfig.saveOk') : t('attendance.holidayConfig.addOk')
    )
    emit('success')
    innerVisible.value = false
  } finally {
    submitting.value = false
  }
}
</script>
