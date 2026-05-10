<template>
  <el-dialog
    :model-value="visible"
    :title="title"
    width="640px"
    destroy-on-close
    @update:model-value="emit('update:visible', $event)"
  >
    <UniForm
      ref="uniFormRef"
      v-model="formModel"
      :mode="uniFormMode"
      :config="dialogFormConfig"
    />

    <template #footer>
      <el-button @click="close">{{ $t('schoolBus.driver.actions.cancel') }}</el-button>
      <el-button v-if="!isLook" type="primary" :loading="submitting" @click="submit">
        {{ $t('schoolBus.driver.actions.submit') }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { UniForm, useUniI18n } from 'uni-ui-lib'
import type { UniFormConfig } from 'uni-ui-lib'
import { computed, nextTick, ref, watch } from 'vue'

import { schoolBusDriverApi } from '@/api'
import type {
  SchoolBusDriverFormEmits,
  SchoolBusDriverFormProps
} from '@/types/components/school-bus-driver-form'
import type { DriverFormModel, DriverRecord } from '@/types/modules/school-bus-driver'

import { driverDialogFormConfig } from '../list.config'

const props = defineProps<SchoolBusDriverFormProps>()

const emit = defineEmits<SchoolBusDriverFormEmits>()

const { t } = useUniI18n()
const uniFormRef = ref<InstanceType<typeof UniForm> | null>(null)
const submitting = ref(false)
const formModel = ref<DriverFormModel>({})
const isLook = computed(() => props.mode === 'look')
const uniFormMode = computed(() => (isLook.value ? 'view' : 'edit'))

const dialogFormConfig = computed<UniFormConfig>(() => {
  const base = driverDialogFormConfig(t, props.schoolOptions, props.statusOptions)

  if (isLook.value) {
    return { ...base, rules: {} }
  }

  return base
})

const title = computed(() =>
  t(
    props.mode === 'add'
      ? 'schoolBus.driver.actions.add'
      : props.mode === 'look'
        ? 'schoolBus.driver.actions.look'
        : 'schoolBus.driver.actions.edit'
  )
)

const resetForm = () => {
  const next: DriverFormModel = { status: 1 }
  const sid = props.defaultSchoolId

  if (props.mode === 'add' && sid != null) {
    next.schoolIds = [sid]
  }

  formModel.value = next

  nextTick(() => {
    uniFormRef.value?.clearValidate()
  })
}

const toNum = (value: unknown): number | undefined => {
  if (value === '' || value === null || value === undefined) {
    return undefined
  }

  const n = Number(value)

  return Number.isFinite(n) ? n : undefined
}

const fillForm = (record: DriverRecord) => {
  formModel.value = {
    id: record.id,
    schoolIds: Array.isArray(record.schoolIds) ? record.schoolIds : [],
    name: record.name,
    employeeNo: record.employeeNo,
    contact: record.contact,
    age: toNum(record.age),
    licenseType: record.licenseType,
    status:
      record.status === undefined || record.status === null ? 1 : Number(record.status)
  }
}

const close = () => {
  emit('update:visible', false)
}

const submit = async () => {
  const valid = await uniFormRef.value?.validate().catch(() => false)

  if (!valid) {
    return
  }

  submitting.value = true

  try {
    const raw = formModel.value
    const payload: DriverFormModel = {
      ...raw,
      age: raw.age === undefined ? undefined : Number(raw.age)
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

    if ((props.mode === 'edit' || props.mode === 'look') && props.source?.id) {
      fillForm(await schoolBusDriverApi.detail.get(props.source.id))
    }
  }
)
</script>
