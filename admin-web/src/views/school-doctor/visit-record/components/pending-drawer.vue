<template>
  <el-drawer
    v-model="visible"
    :title="drawerTitle"
    size="1120px"
    destroy-on-close
    class="pending-drawer">
    <div v-if="visible" v-loading="loading" class="pending-drawer__body">
      <PendingDetailPanel
        ref="panelRef"
        v-model:operation-form="operationForm"
        :detail="pendingDetail"
        :show-operation-form="mode === 'operate'"
        :show-operation-records="true"
        :operation-readonly="mode === 'view'"
        :school-records="schoolRecords"
        @view-operation="openOperationDialog('view', $event)"
        @edit-operation="openOperationDialog('edit', $event)" />
    </div>

    <template v-if="mode === 'operate'" #footer>
      <el-button @click="visible = false">{{ $t('schoolDoctor.common.cancel') }}</el-button>
      <el-button type="warning" :loading="submitting" @click="handleEndMedication">
        {{ $t('schoolDoctor.visitRecord.endMedication') }}
      </el-button>
      <el-button type="primary" :loading="submitting" @click="handleSaveOperation">
        {{ $t('schoolDoctor.visitRecord.saveOperation') }}
      </el-button>
    </template>

    <OperationRecordDialog ref="operationDialogRef" @save="handleOperationRecordSave" />
  </el-drawer>
</template>

<script setup lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUniI18n } from 'uni-ui-lib'
import { computed, ref, watch } from 'vue'

import { membershipApi, schoolDoctorVisitRecordApi } from '@/api'
import { useDialogDetailLoading } from '@/composables/use-dialog-detail-loading'
import { usePermissionCodeStore, useUserStore } from '@/stores'
import type {
  PendingMedicationDetail,
  PendingMedicationListRow,
  PendingOperationFormModel
} from '@/types/modules/school-doctor-visit-record'
import type { SchoolOptionRecord } from '@/types/modules/membership'

import OperationRecordDialog from './operation-record-dialog.vue'
import PendingDetailPanel from './pending-detail-panel.vue'

const PENDING_ENDED = 1

const visible = defineModel<boolean>('visible', { required: true })

const props = defineProps<{
  mode: 'view' | 'operate'
  recordId?: string | number
  listRow?: PendingMedicationListRow
}>()

const emit = defineEmits<{ saved: [] }>()

const { t } = useUniI18n()
const userStore = useUserStore()
const { detailLoading: loading, runWithDetailLoading } = useDialogDetailLoading()
const panelRef = ref<InstanceType<typeof PendingDetailPanel> | null>(null)
const operationDialogRef = ref<InstanceType<typeof OperationRecordDialog> | null>(null)
const submitting = ref(false)
const schoolRecords = ref<SchoolOptionRecord[]>([])
const pendingDetail = ref<PendingMedicationDetail>({})
const operationForm = ref<PendingOperationFormModel>(emptyOperationForm())

const drawerTitle = computed(() =>
  props.mode === 'operate'
    ? t('schoolDoctor.visitRecord.pendingOperateTitle')
    : t('schoolDoctor.visitRecord.pendingViewTitle')
)

function emptyOperationForm(): PendingOperationFormModel {
  return {
    operateStatus: 1,
    notifyParent: 1,
    attachmentList: [],
    operator: currentOperator(),
    operateTime: nowDateTime()
  }
}

function currentOperator() {
  const user = userStore.userInfo as Record<string, unknown> | undefined
  return String(user?.username || user?.name || user?.nickName || '')
}

function nowDateTime() {
  const now = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
}

function resolveApplicationId(detail: PendingMedicationDetail, row?: PendingMedicationListRow) {
  const candidates = [
    row?.applicationId,
    detail.applicationId,
    (detail.application as Record<string, unknown> | undefined)?.id,
    (detail.applyInfo as Record<string, unknown> | undefined)?.id
  ]
  for (const value of candidates) {
    if (value != null && value !== '') {
      return value
    }
  }
  return undefined
}

function mapAttachmentsToApi(list?: PendingOperationFormModel['attachmentList']) {
  return (list || [])
    .map((file) => ({
      id: file.id,
      operationId: file.operationId,
      attachmentUrl: file.attachmentUrl || file.url
    }))
    .filter((item) => item.attachmentUrl)
}

function buildOperatePayload(endMedication: boolean) {
  const pendingId = pendingDetail.value.id
  const applicationId = resolveApplicationId(pendingDetail.value, props.listRow)
  const operation = {
    pendingId,
    operationTime: operationForm.value.operateTime,
    operationStatus: operationForm.value.operateStatus,
    situationDetail: operationForm.value.specificSituation,
    operator: operationForm.value.operator,
    notifyParent: operationForm.value.notifyParent,
    leaveTime: operationForm.value.leaveTime || undefined,
    leaveDestination: operationForm.value.leaveDestination,
    attachmentList: mapAttachmentsToApi(operationForm.value.attachmentList)
  }
  if (operationForm.value.operationId) {
    ;(operation as Record<string, unknown>).id = operationForm.value.operationId
  }
  return {
    id: pendingId,
    applicationId,
    status: endMedication ? PENDING_ENDED : pendingDetail.value.status,
    operationList: [operation]
  }
}

watch(visible, async (open) => {
  if (!open || props.recordId == null) {
    return
  }
  schoolRecords.value = await membershipApi.school.get()
  operationForm.value = emptyOperationForm()
  await runWithDetailLoading(async () => {
    const data = await schoolDoctorVisitRecordApi.pendingDetail.get(props.recordId!)
    pendingDetail.value = {
      ...data,
      applicationId: resolveApplicationId(data, props.listRow)
    }
  })
})

function openOperationDialog(type: 'view' | 'edit', row: Record<string, unknown>) {
  if (type === 'edit') {
    const permissionCodeStore = usePermissionCodeStore()
    const codes = permissionCodeStore.permissionCodes as string[] | undefined
    if (codes?.length && !permissionCodeStore.hasPermission('pendingmedication_operation_edit')) {
      ElMessage.warning(t('schoolDoctor.visitRecord.noOperationEditPermission'))
      return
    }
  }
  operationDialogRef.value?.open(type, row, currentOperator())
}

async function handleOperationRecordSave(form: PendingOperationFormModel) {
  const payload: Record<string, unknown> = {
    pendingId: pendingDetail.value.id,
    operationTime: form.operateTime,
    operationStatus: form.operateStatus,
    situationDetail: form.specificSituation,
    operator: form.operator,
    notifyParent: form.notifyParent,
    leaveTime: form.leaveTime || undefined,
    leaveDestination: form.leaveDestination,
    attachmentList: mapAttachmentsToApi(form.attachmentList)
  }
  if (form.operationId) {
    payload.id = form.operationId
  }
  if (!payload.pendingId || !payload.id) {
    ElMessage.warning(t('schoolDoctor.visitRecord.missingOperationId'))
    operationDialogRef.value?.finishSubmit()
    return
  }
  try {
    await schoolDoctorVisitRecordApi.pendingOperationEdit.post(payload)
    ElMessage.success(t('schoolDoctor.common.saveSuccess'))
    pendingDetail.value = await schoolDoctorVisitRecordApi.pendingDetail.get(props.recordId!)
    emit('saved')
    operationDialogRef.value?.close()
  } finally {
    operationDialogRef.value?.finishSubmit()
  }
}

async function submitPending(endMedication: boolean) {
  const valid = await panelRef.value?.validateOperation()
  if (!valid) {
    return
  }
  const payload = buildOperatePayload(endMedication)
  if (!payload.applicationId) {
    ElMessage.warning(t('schoolDoctor.visitRecord.missingApplicationId'))
    return
  }
  submitting.value = true
  try {
    await schoolDoctorVisitRecordApi.pendingOperate.post(payload)
    ElMessage.success(
      endMedication
        ? t('schoolDoctor.visitRecord.endMedicationSuccess')
        : t('schoolDoctor.common.actionSuccess')
    )
    visible.value = false
    emit('saved')
  } finally {
    submitting.value = false
  }
}

async function handleSaveOperation() {
  await submitPending(false)
}

async function handleEndMedication() {
  const valid = await panelRef.value?.validateOperation()
  if (!valid) {
    return
  }
  try {
    await ElMessageBox.confirm(
      t('schoolDoctor.visitRecord.confirmEndMedication'),
      t('schoolDoctor.common.confirmTitle'),
      { type: 'warning' }
    )
  } catch {
    return
  }
  await submitPending(true)
}
</script>

<style scoped lang="scss">
.pending-drawer__body {
  padding: 16px;
  background: var(--el-fill-color-light);
  min-height: 100%;
}
</style>
