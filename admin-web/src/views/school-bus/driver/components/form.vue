<template>
  <el-dialog
    :model-value="visible"
    :title="title"
    width="640px"
    destroy-on-close
    @update:model-value="emit('update:visible', $event)"
  >
    <el-form ref="formRef" :model="formModel" :rules="rules" label-position="top">
      <el-row :gutter="16">
        <el-col :span="24">
          <el-form-item :label="$t('schoolBus.driver.fields.school')" prop="schoolIds">
            <el-select
              v-model="formModel.schoolIds"
              multiple
              collapse-tags
              filterable
              clearable
              :placeholder="$t('schoolBus.driver.placeholders.school')"
            >
              <el-option
                v-for="option in schoolOptions"
                :key="String(option.value)"
                :label="option.label"
                :value="option.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('schoolBus.driver.fields.name')" prop="name">
            <el-input v-model="formModel.name" maxlength="64" :placeholder="$t('schoolBus.driver.placeholders.name')" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('schoolBus.driver.fields.employeeNo')" prop="employeeNo">
            <el-input
              v-model="formModel.employeeNo"
              maxlength="64"
              :placeholder="$t('schoolBus.driver.placeholders.employeeNo')"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('schoolBus.driver.fields.contact')" prop="contact">
            <el-input v-model="formModel.contact" maxlength="32" :placeholder="$t('schoolBus.driver.placeholders.contact')" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('schoolBus.driver.fields.age')" prop="age">
            <el-input-number
              v-model="formModel.age"
              :min="18"
              :max="80"
              :step="1"
              controls-position="right"
              class="school-bus-driver-form__age"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('schoolBus.driver.fields.licenseType')" prop="licenseType">
            <el-input
              v-model="formModel.licenseType"
              maxlength="32"
              :placeholder="$t('schoolBus.driver.placeholders.licenseType')"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('schoolBus.driver.fields.status')" prop="status">
            <el-select v-model="formModel.status" :placeholder="$t('schoolBus.driver.placeholders.status')">
              <el-option
                v-for="option in statusOptions"
                :key="String(option.value)"
                :label="option.label"
                :value="option.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <template #footer>
      <el-button @click="close">{{ $t('schoolBus.driver.actions.cancel') }}</el-button>
      <el-button type="primary" :loading="submitting" @click="submit">
        {{ $t('schoolBus.driver.actions.submit') }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import type { FormInstance } from 'element-plus'
import { ElMessage } from 'element-plus'
import { computed, reactive, ref, watch } from 'vue'
import { useUniI18n } from 'uni-ui-lib'

import { schoolBusDriverApi } from '@/api'
import type { SchoolBusDriverFormEmits, SchoolBusDriverFormProps } from '@/types/components/school-bus-driver-form'
import type { DriverFormModel, DriverRecord } from '@/types/modules/school-bus-driver'

import { formRules } from '../list.config'

const props = defineProps<SchoolBusDriverFormProps>()

const emit = defineEmits<SchoolBusDriverFormEmits>()

const { t } = useUniI18n()
const formRef = ref<FormInstance>()
const submitting = ref(false)
const formModel = reactive<DriverFormModel>({})
const rules = computed(() => formRules(t))
const title = computed(() =>
  t(props.mode === 'add' ? 'schoolBus.driver.actions.add' : 'schoolBus.driver.actions.edit')
)

const resetForm = () => {
  Object.keys(formModel).forEach((key) => {
    delete formModel[key as keyof DriverFormModel]
  })

  formModel.status = 1
  formRef.value?.clearValidate()
}

const toNum = (value: unknown): number | undefined => {
  if (value === '' || value === null || value === undefined) {
    return undefined
  }

  const n = Number(value)

  return Number.isFinite(n) ? n : undefined
}

const fillForm = (record: DriverRecord) => {
  formModel.id = record.id
  formModel.schoolIds = Array.isArray(record.schoolIds) ? record.schoolIds : []
  formModel.name = record.name
  formModel.employeeNo = record.employeeNo
  formModel.contact = record.contact
  formModel.age = toNum(record.age)
  formModel.licenseType = record.licenseType
  formModel.status = record.status === undefined || record.status === null ? 1 : Number(record.status)
}

const close = () => {
  emit('update:visible', false)
}

const submit = async () => {
  const valid = await formRef.value?.validate().catch(() => false)

  if (!valid) {
    return
  }

  submitting.value = true

  try {
    const payload: DriverFormModel = {
      ...formModel,
      age: formModel.age === undefined ? undefined : Number(formModel.age)
    }

    if (props.mode === 'add') {
      await schoolBusDriverApi.add.post(payload)
    } else {
      await schoolBusDriverApi.edit.post(payload)
    }

    ElMessage.success(t('schoolBus.driver.messages.saveSuccess'))
    emit('saved')
    close()
  } finally {
    submitting.value = false
  }
}

watch(
  () => props.visible,
  async (visible) => {
    if (!visible) {
      return
    }

    resetForm()

    if (props.mode === 'edit' && props.source?.id) {
      fillForm(await schoolBusDriverApi.detail.get(props.source.id))
    }
  }
)
</script>

<style scoped lang="scss">
.school-bus-driver-form__age {
  width: 100%;
}
</style>
