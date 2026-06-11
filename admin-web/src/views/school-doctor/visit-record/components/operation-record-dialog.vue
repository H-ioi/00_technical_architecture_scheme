<template>
  <el-dialog
    v-model="visible"
    :title="
      readonly
        ? $t('schoolDoctor.visitRecord.operationViewTitle')
        : $t('schoolDoctor.visitRecord.operationEditTitle')
    "
    width="760px"
    append-to-body
    :close-on-click-modal="false"
    destroy-on-close>
    <PendingOperationForm
      ref="formRef"
      v-model:operation-form="operationForm"
      :readonly="readonly" />
    <template #footer>
      <el-button @click="visible = false">
        {{ readonly ? $t('schoolDoctor.common.cancel') : $t('schoolDoctor.common.cancel') }}
      </el-button>
      <el-button v-if="!readonly" type="primary" :loading="submitting" @click="handleSave">
        {{ $t('schoolDoctor.common.confirm') }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import type { PendingOperationFormModel } from '@/types/modules/school-doctor-visit-record'

import PendingOperationForm from './pending-operation-form.vue'

const emit = defineEmits<{
  save: [form: PendingOperationFormModel]
}>()

const visible = ref(false)
const readonly = ref(false)
const submitting = ref(false)
const formRef = ref<InstanceType<typeof PendingOperationForm> | null>(null)
const operationForm = ref<PendingOperationFormModel>({
  operateStatus: 1,
  notifyParent: 1,
  attachmentList: []
})

function mapAttachments(list?: Array<Record<string, unknown>>) {
  return (list || [])
    .map((file) => {
      const url = String(file.attachmentUrl || file.url || '')
      return {
        id: file.id as string | number | undefined,
        operationId: file.operationId as string | number | undefined,
        attachmentUrl: url,
        url,
        name: String(file.name || url.split('/').pop() || '')
      }
    })
    .filter((file) => file.url)
}

function open(type: 'view' | 'edit', record: Record<string, unknown>, operatorFallback: string) {
  readonly.value = type === 'view'
  const operateTime = record.operationTime || record.operateTime || record.createTime
  operationForm.value = {
    operationId: (record.id || record.operationId) as string | number | undefined,
    operateTime: operateTime ? String(operateTime) : '',
    operateStatus: Number(record.operationStatus ?? record.operateStatus ?? 1),
    specificSituation: String(
      record.situationDetail || record.specificSituation || record.remark || ''
    ),
    operator: String(record.operator || record.operatorName || record.creator || operatorFallback),
    notifyParent: record.notifyParent === 0 ? 0 : 1,
    attachmentList: mapAttachments(record.attachmentList as Array<Record<string, unknown>>),
    leaveTime: record.leaveTime ? String(record.leaveTime) : '',
    leaveDestination: record.leaveDestination as number | undefined
  }
  visible.value = true
}

async function handleSave() {
  const valid = await formRef.value?.validate()
  if (!valid) {
    return
  }
  submitting.value = true
  emit('save', { ...operationForm.value })
}

function finishSubmit() {
  submitting.value = false
}

function close() {
  visible.value = false
  submitting.value = false
}

defineExpose({ open, finishSubmit, close })
</script>
