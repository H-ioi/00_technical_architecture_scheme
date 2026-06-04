<template>
  <div class="bus-order-form__status-row">
    <div
      class="bus-order-form__status-col"
      :class="{ 'bus-order-form__status-col--solo': !showPaymentRadios }">
      <div class="bus-order-form__nested-field">
        <div class="bus-order-form__nested-label">
          {{ $t('schoolBus.studentOrder.formApprovalStatus') }}
        </div>
        <el-radio-group
          v-if="formType === 'apply'"
          v-model="ruleForm.approvalStatus"
          :disabled="mainDisabled || String(ruleForm.approvalStatus ?? '') === '2'"
          @change="onApprovalChange">
          <el-radio v-for="a in approvalOpts" :key="String(a.value)" :label="String(a.value)">
            {{ a.label }}
          </el-radio>
        </el-radio-group>
        <el-radio-group
          v-else
          v-model="ruleForm.approvalStatus"
          :disabled="mainDisabled"
          @change="onApprovalChange">
          <el-radio label="1">{{ approvalOpts.find((x) => x.value === '1')?.label }}</el-radio>
        </el-radio-group>
      </div>
    </div>
    <div v-if="showPaymentRadios" class="bus-order-form__status-col">
      <div class="bus-order-form__nested-field">
        <div class="bus-order-form__nested-label">
          {{ $t('schoolBus.studentOrder.formPaymentStatus') }}
        </div>
        <el-radio-group
          v-if="formType === 'apply'"
          v-model="ruleForm.paymentStatus"
          :disabled="mainDisabled"
          @change="onPaymentChange">
          <el-radio v-for="p in paymentOpts" :key="String(p.value)" :label="String(p.value)">
            <span>{{ p.label }}</span>
            <el-input-number
              v-if="
                canShowPayInfo && String(ruleForm.paymentStatus) === '2' && String(p.value) === '2'
              "
              v-model="ruleForm.paymentAmount"
              class="bus-order-form__pay-inline"
              :min="0"
              :step="0.1"
              :precision="2"
              :disabled="mainDisabled || !canEditPayInfo" />
          </el-radio>
        </el-radio-group>
        <el-radio-group
          v-else
          v-model="ruleForm.paymentStatus"
          :disabled="mainDisabled"
          @change="onPaymentChange">
          <el-radio label="2">
            {{ paymentOpts.find((x) => String(x.value) === '2')?.label }}
            <el-input-number
              v-if="canShowPayInfo"
              v-model="ruleForm.paymentAmount"
              class="bus-order-form__pay-inline"
              :min="0"
              :step="0.1"
              :precision="2"
              :disabled="mainDisabled || !canEditPayInfo" />
          </el-radio>
        </el-radio-group>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { UniOption } from 'uni-ui-lib'
import { inject } from 'vue'

import { busOrderRuleFormKey } from '../bus-order-form-types'

const ruleForm = inject(busOrderRuleFormKey)!

defineProps<{
  formType: 'apply' | 'order'
  mainDisabled: boolean
  showPaymentRadios: boolean
  approvalOpts: UniOption[]
  paymentOpts: UniOption[]
  canShowPayInfo: boolean
  canEditPayInfo: boolean
  onApprovalChange: () => void
  onPaymentChange: (e?: string | number | boolean) => void
}>()
</script>
