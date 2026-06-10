<template>
  <el-drawer
    v-model="visible"
    :title="drawerTitle"
    size="1120px"
    destroy-on-close
    class="record-form-drawer"
  >
    <div v-if="visible" v-loading="loading" class="record-form-drawer__body">
      <RecordFormPanel
        ref="panelRef"
        v-model:form-model="formModel"
        :mode="mode"
        :school-records="schoolRecords"
        :parent-receipt-refreshing="parentReceiptRefreshing"
        @refresh-parent-receipt="refreshParentReceipt"
      />
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
import { ElMessage } from 'element-plus'
import { useUniI18n } from 'uni-ui-lib'
import { computed, nextTick, ref, watch } from 'vue'

import { schoolDoctorVisitRecordApi } from '@/api'
import { useDialogDetailLoading } from '@/composables/use-dialog-detail-loading'
import { useUserStore } from '@/stores'
import type { VisitRecordFormModel } from '@/types/modules/school-doctor-visit-record'
import type { SchoolOptionRecord } from '@/types/modules/membership'

import RecordFormPanel from './record-form-panel.vue'

const visible = defineModel<boolean>('visible', { required: true })

const props = defineProps<{
  mode: 'add' | 'view' | 'edit'
  recordId?: string | number
  schoolRecords: SchoolOptionRecord[]
}>()

const emit = defineEmits<{ saved: [] }>()

const { t } = useUniI18n()
const userStore = useUserStore()
const { detailLoading: loading, runWithDetailLoading } = useDialogDetailLoading()
const panelRef = ref<InstanceType<typeof RecordFormPanel> | null>(null)
const submitting = ref(false)
const parentReceiptRefreshing = ref(false)
const formModel = ref<VisitRecordFormModel>(emptyForm())

const drawerTitle = computed(() => {
  if (props.mode === 'add') {
    return t('schoolDoctor.visitRecord.detailAddTitle')
  }
  if (props.mode === 'edit') {
    return t('schoolDoctor.visitRecord.detailEditTitle')
  }
  return t('schoolDoctor.visitRecord.detailViewTitle')
})

function emptyForm(): VisitRecordFormModel {
  return {
    attachmentList: [],
    notifyParent: 1,
    executeOperation: 0,
    operator: currentOperator()
  }
}

function currentOperator() {
  const user = userStore.userInfo as Record<string, unknown> | undefined
  return String(user?.username || user?.name || user?.nickName || '')
}

watch(visible, async (open) => {
  if (!open) {
    return
  }
  formModel.value = emptyForm()
  if (props.mode === 'add') {
    await nextTick(() => panelRef.value?.resetStudentSelect())
    return
  }
  if (props.recordId == null) {
    return
  }
  await runWithDetailLoading(async () => {
    const data = await schoolDoctorVisitRecordApi.recordDetail.get(props.recordId!)
    formModel.value = {
      ...emptyForm(),
      ...data,
      id: props.recordId,
      attachmentList: data.attachmentList || [],
      notifyParent: data.notifyParent === 0 ? 0 : data.notifyParent ?? 1,
      executeOperation: data.executeOperation === 1 ? 1 : 0,
      operator: data.operator || data.creator || currentOperator()
    }
    await nextTick(() => panelRef.value?.setDisplayFromForm())
  })
})

async function refreshParentReceipt() {
  if (!formModel.value.id) {
    ElMessage.warning(t('schoolDoctor.visitRecord.saveBeforeRefresh'))
    return
  }
  parentReceiptRefreshing.value = true
  try {
    const data = await schoolDoctorVisitRecordApi.recordDetail.get(formModel.value.id)
    formModel.value = {
      ...formModel.value,
      ...data,
      attachmentList: data.attachmentList || formModel.value.attachmentList,
      operator: data.operator || formModel.value.operator
    }
    await nextTick(() => panelRef.value?.setDisplayFromForm())
  } finally {
    parentReceiptRefreshing.value = false
  }
}

async function submit() {
  const valid = await panelRef.value?.validate()
  if (!valid) {
    return
  }
  if (props.mode === 'add' && !formModel.value.admissionNo) {
    ElMessage.warning(t('schoolDoctor.visitRecord.ruleStudent'))
    return
  }
  submitting.value = true
  try {
    if (props.mode === 'add') {
      await schoolDoctorVisitRecordApi.recordAdd.post(formModel.value)
      ElMessage.success(t('schoolDoctor.common.addSuccess'))
    } else {
      await schoolDoctorVisitRecordApi.recordEdit.post(formModel.value)
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
.record-form-drawer__body {
  padding: 16px;
  background: var(--el-fill-color-light);
  min-height: 100%;
}
</style>
