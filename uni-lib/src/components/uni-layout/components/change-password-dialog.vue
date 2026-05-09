<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import { computed, reactive, ref, watch } from 'vue'

import type { UniLayoutChangePasswordPayload } from '@/types/uni-layout'
import { useUniI18n } from '@/services/i18n'

defineOptions({
  name: 'UniLayoutChangePasswordDialog'
})

const props = withDefaults(
  defineProps<{
    modelValue: boolean
    loading?: boolean
    width?: string
    destroyOnClose?: boolean
  }>(),
  {
    loading: false,
    width: '420px',
    destroyOnClose: true
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  submit: [payload: UniLayoutChangePasswordPayload]
  cancel: []
}>()

const { t } = useUniI18n()
const formRef = ref<FormInstance>()
const form = reactive({
  password: '',
  newpassword1: '',
  newpassword2: ''
})

const resetForm = () => {
  form.password = ''
  form.newpassword1 = ''
  form.newpassword2 = ''
  formRef.value?.clearValidate()
}

watch(
  () => props.modelValue,
  (open) => {
    if (open) {
      resetForm()
    }
  }
)

const rules = computed<FormRules<typeof form>>(() => ({
  password: [
    { required: true, message: t('layout.oldPasswordRequired'), trigger: 'blur' },
    { min: 6, message: t('layout.passwordMinLength'), trigger: 'blur' }
  ],
  newpassword1: [
    { required: true, message: t('layout.newPasswordRequired'), trigger: 'blur' },
    { min: 6, message: t('layout.passwordMinLength'), trigger: 'blur' }
  ],
  newpassword2: [
    { required: true, message: t('layout.confirmPasswordRequired'), trigger: 'blur' },
    {
      validator: (_rule, value, callback) => {
        if (value !== form.newpassword1) {
          callback(new Error(t('layout.passwordMismatch')))
          return
        }

        callback()
      },
      trigger: 'blur'
    }
  ]
}))

const visible = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value)
})

const handleCancel = () => {
  emit('cancel')
  visible.value = false
}

const handleSubmit = async () => {
  const valid = await formRef.value?.validate().catch(() => false)

  if (!valid) {
    return
  }

  emit('submit', {
    password: form.password,
    newpassword1: form.newpassword1,
    newpassword2: form.newpassword2
  })
}
</script>

<template>
  <el-dialog
    v-model="visible"
    :title="t('layout.changePasswordTitle')"
    :width="width"
    :destroy-on-close="destroyOnClose"
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-position="top">
      <el-form-item :label="t('layout.oldPassword')" prop="password">
        <el-input v-model="form.password" type="password" show-password />
      </el-form-item>
      <el-form-item :label="t('layout.newPassword')" prop="newpassword1">
        <el-input v-model="form.newpassword1" type="password" show-password />
      </el-form-item>
      <el-form-item :label="t('layout.confirmPassword')" prop="newpassword2">
        <el-input v-model="form.newpassword2" type="password" show-password />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="resetForm">{{ t('layout.reset') }}</el-button>
      <el-button @click="handleCancel">{{ t('layout.cancel') }}</el-button>
      <el-button type="primary" :loading="loading" @click="handleSubmit">
        {{ t('layout.submit') }}
      </el-button>
    </template>
  </el-dialog>
</template>
