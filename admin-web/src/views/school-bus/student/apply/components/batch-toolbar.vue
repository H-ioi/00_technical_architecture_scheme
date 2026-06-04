<template>
  <el-button
    v-uni-permission="'busorder_batch_approve'"
    :disabled="disabled"
    @click="emit('approve')">
    {{ $t('schoolBus.studentApply.batchApprove') }}
  </el-button>
  <el-button v-uni-permission="'busorder_batch_deny'" :disabled="disabled" @click="emit('reject')">
    {{ $t('schoolBus.studentApply.batchReject') }}
  </el-button>
  <el-button
    v-uni-permission="'busorder_batch_update_payment_status'"
    :disabled="disabled"
    @click="emit('payment')">
    {{ $t('schoolBus.studentApply.batchPayment') }}
  </el-button>
  <el-button
    v-uni-permission="'busintentionorder_del'"
    type="danger"
    :disabled="disabled"
    @click="emit('delete')">
    {{ $t('schoolBus.delete') }}
  </el-button>
</template>

<script setup lang="ts">
defineProps<{ disabled: boolean }>()

const emit = defineEmits<{
  approve: []
  reject: []
  payment: []
  delete: []
}>()
</script>
