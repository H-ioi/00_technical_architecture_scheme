<template>
  <el-dialog v-model="innerVisible" :title="title" width="520px" destroy-on-close @closed="onClosed">
    <el-form ref="formRef" :model="model" :rules="rules" label-width="100px">
      <el-form-item :label="$t('attendance.holidayConfig.form.school')" prop="school">
        <el-select
          v-model="model.school"
          filterable
          clearable
          style="width: 100%"
          :placeholder="$t('attendance.holidayConfig.placeholders.school')">
          <el-option
            v-for="s in schoolOptions"
            :key="String(s.value)"
            :label="s.label"
            :value="s.value" />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('attendance.holidayConfig.form.department')" prop="department">
        <el-select
          v-model="model.department"
          style="width: 100%"
          :placeholder="$t('attendance.holidayConfig.form.department')">
          <el-option
            v-for="d in departmentOptions"
            :key="d.value"
            :label="d.label"
            :value="d.value" />
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="gradeVisible"
        :label="$t('attendance.holidayConfig.form.grades')"
        prop="grades">
        <el-select
          v-model="model.grades"
          multiple
          filterable
          style="width: 100%"
          :placeholder="$t('attendance.holidayConfig.form.grades')">
          <el-option v-for="g in gradeOptions" :key="g.value" :label="g.label" :value="g.value" />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('attendance.holidayConfig.form.email')" prop="email">
        <el-input v-model="model.email" :placeholder="$t('attendance.holidayConfig.form.email')" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="innerVisible = false">{{ $t('common.cancel') }}</el-button>
      <el-button type="primary" :loading="submitting" @click="submit">{{
        $t('common.submit')
      }}</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { computed, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

import { attendanceHolidayApi } from '@/api'
import type { AttendanceHolidaySysConfigRecord } from '@/types/modules/attendance-holiday'
import type { UniFormFieldOption } from 'uni-ui-lib'

const props = defineProps<{
  visible: boolean
  title: string
  modelValue: AttendanceHolidaySysConfigRecord
  schoolOptions: UniFormFieldOption[]
  departmentOptions: { label: string; value: string }[]
  gradeOptions: UniFormFieldOption[]
}>()

const emit = defineEmits<{
  'update:visible': [boolean]
  success: []
}>()

const { t } = useI18n()

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

const formRef = ref<FormInstance>()
const submitting = ref(false)

const rules = computed<FormRules>(() => ({
  school: [{ required: true, message: t('attendance.holidayConfig.rules.school'), trigger: 'change' }],
  department: [{ required: true, message: t('attendance.holidayConfig.rules.department'), trigger: 'change' }],
  email: [
    { required: true, message: t('attendance.holidayConfig.rules.email'), trigger: 'blur' },
    { type: 'email', message: t('attendance.holidayConfig.form.emailInvalid'), trigger: 'blur' }
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
  formRef.value?.resetFields()
}

const submit = async () => {
  await formRef.value?.validate()
  submitting.value = true
  try {
    const api = model.id ? attendanceHolidayApi.sysConfigUpdate : attendanceHolidayApi.sysConfigSave
    await api.post({ ...model })
    ElMessage.success(model.id ? t('attendance.holidayConfig.messages.saveOk') : t('attendance.holidayConfig.messages.addOk'))
    emit('success')
    innerVisible.value = false
  } finally {
    submitting.value = false
  }
}
</script>
