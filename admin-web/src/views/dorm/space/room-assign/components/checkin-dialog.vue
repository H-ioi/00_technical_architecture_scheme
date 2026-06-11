<template>
  <el-dialog
    v-model="visible"
    :title="$t('dorm.roomAssign.checkin')"
    width="640px"
    destroy-on-close>
    <div v-loading="studentLoading" :element-loading-text="$t('common.loading')">
      <UniForm ref="uniFormRef" v-model="formModel" mode="edit" :config="formCfg" />
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
import { ElMessage } from 'element-plus'
import { UniForm, useUniI18n } from 'uni-ui-lib'
import type { UniFormConfig } from 'uni-ui-lib'
import { computed, ref, watch } from 'vue'

import { dormBedApi, dormStudentApi } from '@/api'
import type { DormStudentRow } from '@/types/modules/dorm-student'
import { normalizePaged } from '@/utils/api-response-normalize'

import {
  checkinFormConfig,
  checkinFormRules,
  emptyCheckinModel,
  type DormCheckinFormModel
} from '../assign.config'

const visible = defineModel<boolean>('visible', { required: true })

const props = defineProps<{
  roomId: string | number
  bedLabel?: string
  gender?: string
  schoolOptions: Array<{ label: string; value: string | number }>
  defaultSchoolId?: string | number
}>()

const emit = defineEmits<{
  saved: []
}>()

const { t } = useUniI18n()
const uniFormRef = ref<InstanceType<typeof UniForm> | null>(null)
const submitting = ref(false)
const studentLoading = ref(false)
const formModel = ref<DormCheckinFormModel>(emptyCheckinModel())
const studentRecords = ref<DormStudentRow[]>([])

const studentOptions = computed(() =>
  studentRecords.value.map((item) => ({
    label: `${item.en_name || item.cn_name || item.admission_no} (${item.admission_no})`,
    value: item.admission_no
  }))
)

const formCfg = computed<UniFormConfig>(() => ({
  ...checkinFormConfig(t, props.schoolOptions, studentOptions.value),
  rules: checkinFormRules(t)
}))

async function loadStudents(schoolId?: string | number) {
  if (schoolId == null || schoolId === '') {
    studentRecords.value = []
    return
  }
  studentLoading.value = true
  try {
    const raw = await dormStudentApi.page.get({
      schoolId,
      current: 1,
      size: 9999,
      hasBed: false,
      gender: props.gender
    })
    const { list } = normalizePaged<DormStudentRow>(raw)
    studentRecords.value = list
  } finally {
    studentLoading.value = false
  }
}

watch(
  () => formModel.value.school,
  (schoolId, prevSchoolId) => {
    if (schoolId == null) {
      studentRecords.value = []
      formModel.value.admissionNo = undefined
      return
    }
    if (prevSchoolId != null && prevSchoolId !== schoolId) {
      formModel.value.admissionNo = undefined
    }
    void loadStudents(schoolId)
  }
)

watch(
  () => visible.value,
  (open) => {
    if (!open) {
      formModel.value = emptyCheckinModel()
      studentRecords.value = []
      return
    }
    formModel.value = emptyCheckinModel()
    if (props.defaultSchoolId != null) {
      formModel.value.school = props.defaultSchoolId
      void loadStudents(props.defaultSchoolId)
    }
  }
)

async function submit() {
  const valid = await uniFormRef.value?.validate().catch(() => false)
  if (!valid || !formModel.value.admissionNo) {
    return
  }

  submitting.value = true
  try {
    await dormBedApi.assign.post({
      room_id: props.roomId,
      label: props.bedLabel,
      admission_no: formModel.value.admissionNo
    })
    ElMessage.success(t('dorm.roomAssign.checkinSuccess'))
    visible.value = false
    emit('saved')
  } finally {
    submitting.value = false
  }
}
</script>
