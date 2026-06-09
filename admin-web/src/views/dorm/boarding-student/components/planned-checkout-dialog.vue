<template>
  <el-dialog
    v-model="visible"
    :title="$t('dorm.boardingStudent.plannedCheckoutTitle')"
    width="420px"
    destroy-on-close>
    <div class="planned-checkout-dialog__body">
      <el-date-picker
        v-model="checkoutDate"
        type="date"
        value-format="YYYY-MM-DD"
        :placeholder="$t('dorm.boardingStudent.phPlannedCheckoutSingle')"
        :disabled-date="(date: Date) => date.getTime() <= Date.now()"
        style="width: 100%" />
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
import { useUniI18n } from 'uni-ui-lib'
import { ref, watch } from 'vue'

import { dormStudentApi } from '@/api'

const visible = defineModel<boolean>('visible', { required: true })

const props = defineProps<{
  admissionNos: string[]
}>()

const emit = defineEmits<{
  saved: []
}>()

const { t } = useUniI18n()
const checkoutDate = ref('')
const submitting = ref(false)

watch(visible, (open) => {
  if (open) {
    checkoutDate.value = ''
  }
})

async function submit() {
  if (!checkoutDate.value) {
    ElMessage.warning(t('dorm.boardingStudent.rulePlannedCheckout'))
    return
  }
  if (props.admissionNos.length === 0) {
    return
  }
  submitting.value = true
  try {
    await dormStudentApi.plannedCheckout.post({
      admissionNos: props.admissionNos.join(','),
      plannedCheckoutDate: checkoutDate.value
    })
    ElMessage.success(t('dorm.boardingStudent.actionSuccess'))
    visible.value = false
    emit('saved')
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped lang="scss">
.planned-checkout-dialog__body {
  padding: 12px 0 4px;
}
</style>
