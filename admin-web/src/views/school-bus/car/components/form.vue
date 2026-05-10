<template>
  <el-dialog
    :model-value="visible"
    :title="title"
    width="720px"
    destroy-on-close
    @update:model-value="emit('update:visible', $event)"
  >
    <UniForm ref="uniFormRef" v-model="formModel" :mode="uniFormMode" :config="dialogFormConfig" />

    <div v-if="!isLook" class="car-form__upload">
      <div class="car-form__upload-label">{{ $t('schoolBus.car.fields.carImage') }}</div>
      <el-upload
        :show-file-list="false"
        accept="image/*"
        :before-upload="beforeUpload"
      >
        <el-button type="primary">{{ $t('schoolBus.car.actions.pickImage') }}</el-button>
      </el-upload>
      <span v-if="formModel.carImageUrl" class="car-form__url">{{ formModel.carImageUrl }}</span>
    </div>

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
import type { UniFormConfig, UniOption } from 'uni-ui-lib'
import { UniForm, useUniI18n } from 'uni-ui-lib'
import { computed, nextTick, ref, watch } from 'vue'

import { carDialogFormConfig, type CarFormModel } from '../list.config'

import { protocolApi, schoolBusCarApi, schoolBusCommonApi } from '@/api'
import type { CarRecord } from '@/types/modules/school-bus-car'

const props = defineProps<{
  visible: boolean
  mode: 'add' | 'edit' | 'look'
  source: CarRecord | null
  defaultSchoolId: string | number | null
  schoolOptions: UniOption[]
  statusOptions: UniOption[]
  multiSchool: boolean
}>()

const emit = defineEmits<{
  'update:visible': [boolean]
  saved: []
}>()

const { t } = useUniI18n()
const uniFormRef = ref<InstanceType<typeof UniForm> | null>(null)
const submitting = ref(false)
const formModel = ref<CarFormModel>({})
const isLook = computed(() => props.mode === 'look')
const uniFormMode = computed(() => (isLook.value ? 'view' : 'edit'))

const driverOptions = ref<UniOption[]>([])
const teacherOptions = ref<UniOption[]>([])

const dialogFormConfig = computed<UniFormConfig>(() => {
  const base = carDialogFormConfig(
    t,
    props.schoolOptions,
    driverOptions.value,
    teacherOptions.value,
    props.statusOptions,
    props.multiSchool
  )
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

const pickDriversTeachers = async (schoolIds: Array<string | number> | undefined) => {
  if (!schoolIds?.length) {
    driverOptions.value = []
    teacherOptions.value = []
    return
  }
  const [dRes, tRes] = await Promise.all([
    schoolBusCommonApi.driverList.get({ schoolIds }),
    schoolBusCommonApi.teacherList.get({ schoolIds })
  ])
  const dList = Array.isArray(dRes) ? dRes : Array.isArray((dRes as { data?: unknown }).data) ? (dRes as { data: unknown[] }).data : []
  const tList = Array.isArray(tRes) ? tRes : Array.isArray((tRes as { data?: unknown }).data) ? (tRes as { data: unknown[] }).data : []
  driverOptions.value = (dList as { id: string | number; name?: string; status?: number }[]).map((i) => ({
    label: String(i.name ?? i.id),
    value: i.id,
    disabled: i.status === 0
  }))
  teacherOptions.value = (tList as { id: string | number; nickname?: string; status?: number }[]).map((i) => ({
    label: String(i.nickname ?? i.id),
    value: i.id,
    disabled: i.status === 0
  }))
}

const resetForm = () => {
  const next: CarFormModel = { status: 0 }
  if (props.mode === 'add' && props.defaultSchoolId != null) {
    next.schoolIds = [props.defaultSchoolId]
  }
  formModel.value = next
  nextTick(() => uniFormRef.value?.clearValidate())
}

const fillForm = async (record: CarRecord) => {
  const sid = Array.isArray(record.schoolIds) ? record.schoolIds : []
  await pickDriversTeachers(sid)
  formModel.value = {
    id: record.id,
    schoolIds: sid,
    carNumber: record.carNumber,
    carTeacherId: record.carTeacherId,
    seatNumber: record.seatNumber,
    driverId: record.driverId,
    status: record.status,
    carImageUrl: record.carImageUrl
  }
}

watch(
  () => props.visible,
  async (vis) => {
    if (!vis) {
      return
    }
    if (props.mode === 'add') {
      resetForm()
      if (formModel.value.schoolIds?.length) {
        await pickDriversTeachers(formModel.value.schoolIds)
      }
    } else if (props.source) {
      const raw = await schoolBusCarApi.detail.get(props.source.id)
      const data = raw && typeof raw === 'object' && 'data' in raw ? (raw as { data: CarRecord }).data : (raw as CarRecord)
      await fillForm(data)
    }
  }
)

watch(
  () => formModel.value.schoolIds,
  async (ids) => {
    if (!props.visible || isLook.value) {
      return
    }
    if (ids?.length) {
      await pickDriversTeachers(ids)
    } else {
      driverOptions.value = []
      teacherOptions.value = []
    }
  }
)

const beforeUpload = async (file: File) => {
  try {
    const url = await protocolApi.upload.post(file)
    formModel.value.carImageUrl = url
  } catch {
    ElMessage.error(t('schoolBus.car.messages.uploadFail'))
  }
  return false
}

const close = () => {
  emit('update:visible', false)
}

const submit = async () => {
  await uniFormRef.value?.validate()
  submitting.value = true
  try {
    const payload = { ...formModel.value }
    if (!props.multiSchool && props.defaultSchoolId != null) {
      payload.schoolIds = [props.defaultSchoolId]
    }
    if (props.mode === 'add') {
      await schoolBusCarApi.add.post(payload)
    } else {
      await schoolBusCarApi.edit.post(payload)
    }
    ElMessage.success(t('schoolBus.driver.messages.saveSuccess'))
    emit('saved')
    close()
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped lang="scss">
.car-form__upload {
  margin-top: 12px;
}

.car-form__upload-label {
  margin-bottom: 8px;
  font-size: 13px;
}

.car-form__url {
  display: block;
  margin-top: 8px;
  font-size: 12px;
  color: var(--el-text-color-secondary);
  word-break: break-all;
}
</style>
