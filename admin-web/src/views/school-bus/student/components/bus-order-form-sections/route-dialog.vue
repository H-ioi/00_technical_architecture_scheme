<template>
  <el-dialog
    v-model="visible"
    width="480px"
    append-to-body
    :title="routeDialogTitle"
    destroy-on-close
    @closed="resetRouteForm">
    <UniForm ref="routeUniFormRef" v-model="routeForm" mode="edit" :config="routeDialogFormConfig">
      <template #field-ridingWeekDay>
        <el-select
          v-model="routeFormRidingWeekMulti"
          multiple
          clearable
          style="width: 100%"
          :disabled="mainDisabled">
          <el-option v-for="d in ridingWeekDaySelectOpts" :key="d" :label="d" :value="d" />
        </el-select>
      </template>
      <template #field-ridingDay>
        <el-date-picker
          v-model="routeForm.ridingDay"
          type="daterange"
          style="width: 100%"
          value-format="YYYY-MM-DD"
          :disabled-date="disabledRidingDate"
          :disabled="mainDisabled"
          @change="onRidingRangeChange" />
      </template>
    </UniForm>
    <template #footer>
      <el-button @click="visible = false">{{ $t('schoolBus.cancel') }}</el-button>
      <el-button type="primary" @click="submitRoute">{{ $t('schoolBus.submit') }}</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import type { UniFormConfig } from 'uni-ui-lib'
import { UniForm } from 'uni-ui-lib'
import { ref } from 'vue'

import type { Loose } from '../bus-order-form-types'

const visible = defineModel<boolean>('visible', { required: true })
const routeForm = defineModel<Loose>('routeForm', { required: true })
const routeFormRidingWeekMulti = defineModel<string[]>('routeFormRidingWeekMulti', {
  required: true
})

defineProps<{
  routeDialogTitle: string
  routeDialogFormConfig: UniFormConfig
  ridingWeekDaySelectOpts: string[]
  mainDisabled: boolean
  disabledRidingDate: (time: Date) => boolean
  onRidingRangeChange: (val: string[] | null) => void
  resetRouteForm: () => void
  submitRoute: () => void | Promise<void>
}>()

const routeUniFormRef = ref<InstanceType<typeof UniForm> | null>(null)

defineExpose({ routeUniFormRef })
</script>
