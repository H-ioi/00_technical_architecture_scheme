<template>
  <el-dialog v-model="visible" :title="title" width="640px" destroy-on-close>
    <div
      v-loading="detailLoading"
      class="school-bus-follow-teacher-form__body"
      :element-loading-text="$t('common.loading')">
      <UniForm
        ref="uniFormRef"
        v-model="formModel"
        :mode="uniFormMode"
        :config="dialogFormConfig" />
    </div>
    <template #footer>
      <el-button @click="close">{{ $t('schoolBus.cancel') }}</el-button>
      <el-button v-if="!isLook" type="primary" :loading="submitting" @click="submit">
        {{ $t('schoolBus.submit') }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import type { UniFormConfig, UniOption } from 'uni-ui-lib'
import { UniForm, useUniI18n } from 'uni-ui-lib'
import { computed, nextTick, ref, watch } from 'vue'

import { teacherDialogForm } from '../list.config'

import { schoolBusFollowTeacherApi } from '@/api'
import { useDialogDetailLoading } from '@/composables/use-dialog-detail-loading'
import type {
  FollowTeacherFormModel,
  FollowTeacherRecord
} from '@/types/modules/school-bus-follow-teacher'

const visible = defineModel<boolean>('visible', { required: true })

const props = defineProps<{
  mode: 'add' | 'edit' | 'look'
  source: FollowTeacherRecord | null
  defaultSchoolId: string | number | null
  schoolOptions: UniOption[]
  statusOptions: UniOption[]
  multiSchool: boolean
}>()

const emit = defineEmits<{
  saved: []
}>()

const { t } = useUniI18n()
const { detailLoading, runWithDetailLoading } = useDialogDetailLoading()
const uniFormRef = ref<InstanceType<typeof UniForm> | null>(null)
const submitting = ref(false)
const formModel = ref<FollowTeacherFormModel>({})
const isLook = computed(() => props.mode === 'look')
const uniFormMode = computed(() => (isLook.value ? 'view' : 'edit'))

const dialogFormConfig = computed<UniFormConfig>(() => {
  const base = teacherDialogForm(
    t,
    props.schoolOptions,
    props.statusOptions,
    props.multiSchool,
    props.mode
  )
  if (isLook.value) {
    return { ...base, rules: {} }
  }
  return base
})

const title = computed(() =>
  t(
    props.mode === 'add'
      ? 'schoolBus.add'
      : props.mode === 'look'
        ? 'schoolBus.look'
        : 'schoolBus.edit'
  )
)

const resetForm = () => {
  const next: FollowTeacherFormModel = { status: 1, modules: [], roles: [] }
  if (props.mode === 'add' && props.defaultSchoolId != null && !props.multiSchool) {
    next.school = props.defaultSchoolId
  }
  formModel.value = next
  nextTick(() => uniFormRef.value?.clearValidate())
}

const fillForm = (data: FollowTeacherFormModel) => {
  formModel.value = {
    ...data,
    modules: Array.isArray(data.modules) ? [...data.modules] : [],
    roles: Array.isArray(data.roles) ? [...data.roles] : []
  }
  nextTick(() => uniFormRef.value?.clearValidate())
}

watch(visible, async (isOpen) => {
  if (!isOpen) {
    return
  }
  if (props.mode === 'add') {
    resetForm()
  } else if (props.source) {
    await runWithDetailLoading(async () => {
      resetForm()
      const raw = await schoolBusFollowTeacherApi.detail.get(props.source!.id)
      const data =
        raw && typeof raw === 'object' && 'data' in raw
          ? (raw as { data: FollowTeacherFormModel }).data
          : (raw as FollowTeacherFormModel)
      fillForm(data)
    })
  }
})

const close = () => {
  visible.value = false
}

const submit = async () => {
  await uniFormRef.value?.validate()
  submitting.value = true
  try {
    const payload = { ...formModel.value }
    if (!props.multiSchool && props.defaultSchoolId != null) {
      payload.school = props.defaultSchoolId
    }
    if (props.mode === 'add') {
      await schoolBusFollowTeacherApi.add.post(payload)
    } else {
      await schoolBusFollowTeacherApi.edit.post(payload)
    }
    ElMessage.success(t('schoolBus.saveSuccess'))
    emit('saved')
    close()
  } finally {
    submitting.value = false
  }
}
</script>
