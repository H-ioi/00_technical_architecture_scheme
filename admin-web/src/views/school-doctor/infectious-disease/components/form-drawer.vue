<template>
  <el-drawer
    v-model="visible"
    :title="drawerTitle"
    size="600px"
    destroy-on-close
    class="infectious-disease-drawer">
    <div v-if="visible" v-loading="loading" class="infectious-disease-drawer__body">
      <FormPanel
        ref="panelRef"
        v-model="formModel"
        :readonly="mode === 'view'"
        :rules="rules"
        :school-records="schoolRecords"
        :uploading="uploading"
        @upload="handleUpload" />
    </div>

    <template v-if="mode !== 'view'" #footer>
      <el-button @click="visible = false">{{ $t('schoolDoctor.common.cancel') }}</el-button>
      <el-button type="primary" :loading="submitting" @click="submit">
        {{ $t('schoolDoctor.common.confirm') }}
      </el-button>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import type { UploadRequestOptions } from 'element-plus'
import { ElMessage } from 'element-plus'
import { useUniI18n } from 'uni-ui-lib'
import { computed, nextTick, ref, watch } from 'vue'

import { medicalInfoApi, schoolDoctorInfectiousDiseaseApi } from '@/api'
import { useDialogDetailLoading } from '@/composables/use-dialog-detail-loading'
import type { InfectiousDiseaseFormModel } from '@/types/modules/school-doctor-infectious-disease'
import type { SchoolOptionRecord } from '@/types/modules/membership'

import FormPanel from './form-panel.vue'
import { emptyFormModel, formRules } from '../list.config'

const visible = defineModel<boolean>('visible', { required: true })

const props = defineProps<{
  mode: 'add' | 'view' | 'edit'
  recordId?: string | number
  schoolRecords: SchoolOptionRecord[]
}>()

const emit = defineEmits<{ saved: [] }>()

const { t } = useUniI18n()
const { detailLoading: loading, runWithDetailLoading } = useDialogDetailLoading()
const panelRef = ref<InstanceType<typeof FormPanel> | null>(null)
const submitting = ref(false)
const uploading = ref(false)
const formModel = ref<InfectiousDiseaseFormModel>(emptyFormModel())

const rules = computed(() => (props.mode === 'view' ? {} : formRules(t)))

const drawerTitle = computed(() => {
  if (props.mode === 'add') {
    return t('schoolDoctor.infectiousDisease.detailAddTitle')
  }
  if (props.mode === 'edit') {
    return t('schoolDoctor.infectiousDisease.detailEditTitle')
  }
  return t('schoolDoctor.infectiousDisease.detailViewTitle')
})

function mapDetail(
  data: InfectiousDiseaseFormModel,
  id: string | number
): InfectiousDiseaseFormModel {
  return {
    ...emptyFormModel(),
    ...data,
    id,
    admissionNo: data.admissionNo || (data as Record<string, unknown>).admissonNo?.toString() || '',
    studentName:
      data.studentName ||
      (data as Record<string, unknown>).fullName?.toString() ||
      (data as Record<string, unknown>).cnFullName?.toString() ||
      '',
    gradeName: data.gradeName || (data as Record<string, unknown>).grade?.toString() || '',
    className: data.className || (data as Record<string, unknown>).formCode?.toString() || '',
    attachmentList: Array.isArray(data.attachmentList) ? data.attachmentList : []
  }
}

watch(visible, async (open) => {
  if (!open) {
    return
  }
  formModel.value = emptyFormModel()
  if (props.mode === 'add') {
    await nextTick(() => panelRef.value?.resetStudentSelect())
    return
  }
  if (props.recordId == null) {
    return
  }
  await runWithDetailLoading(async () => {
    const data = await schoolDoctorInfectiousDiseaseApi.detail.get(props.recordId!)
    formModel.value = mapDetail(data, props.recordId!)
    await nextTick(() => panelRef.value?.setDisplayFromForm())
  })
})

async function handleUpload(option: UploadRequestOptions) {
  uploading.value = true
  try {
    const url = await medicalInfoApi.uploadAttachment.post(option.file)
    const list = formModel.value.attachmentList || []
    list.push({ attachmentUrl: url, name: option.file.name })
    formModel.value.attachmentList = list
    ElMessage.success(t('schoolDoctor.common.uploadSuccess'))
  } catch {
    ElMessage.error(t('schoolDoctor.common.uploadFailed'))
  } finally {
    uploading.value = false
  }
}

function buildSubmitData(): InfectiousDiseaseFormModel {
  return {
    ...formModel.value,
    attachmentList: (formModel.value.attachmentList || []).map((item) => ({
      id: item.id,
      infectiousDiseaseId: item.infectiousDiseaseId,
      attachmentUrl: item.attachmentUrl
    }))
  }
}

async function submit() {
  const valid = await panelRef.value?.validate()
  if (!valid) {
    return
  }
  if (!formModel.value.attachmentList?.length) {
    ElMessage.warning(t('schoolDoctor.infectiousDisease.ruleAttachment'))
    return
  }
  submitting.value = true
  try {
    const data = buildSubmitData()
    if (props.mode === 'add') {
      await schoolDoctorInfectiousDiseaseApi.add.post(data)
      ElMessage.success(t('schoolDoctor.common.addSuccess'))
    } else {
      await schoolDoctorInfectiousDiseaseApi.edit.post(data)
      ElMessage.success(t('schoolDoctor.common.saveSuccess'))
    }
    visible.value = false
    emit('saved')
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped lang="scss">
.infectious-disease-drawer__body {
  padding: 16px;
}
</style>
