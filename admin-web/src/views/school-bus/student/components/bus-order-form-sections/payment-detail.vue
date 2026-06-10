<template>
  <el-row :gutter="16">
    <el-col :span="8">
      <div class="bus-order-form__nested-field">
        <div class="bus-order-form__nested-label">
          {{ $t('schoolBus.studentApply.detailPaymentMethod') }}
        </div>
        <el-select
          v-model="ruleForm.paymentMethod"
          style="width: 100%"
          :disabled="mainDisabled || !canEditPayInfo"
        >
          <el-option
            v-for="m in paymentMethodOpts"
            :key="String(m.value)"
            :label="m.label"
            :value="m.value"
          />
        </el-select>
      </div>
    </el-col>
    <el-col :span="8">
      <div class="bus-order-form__nested-field">
        <div class="bus-order-form__nested-label">
          {{ $t('schoolBus.studentApply.detailPaymentDate') }}
        </div>
        <el-date-picker
          v-model="ruleForm.paymentDate"
          type="datetime"
          style="width: 100%"
          value-format="YYYY-MM-DD HH:mm:ss"
          format="YYYY-MM-DD HH:mm:ss"
          :disabled="mainDisabled || !canEditPayInfo"
        />
      </div>
    </el-col>
    <el-col :span="8">
      <div class="bus-order-form__nested-field">
        <div class="bus-order-form__nested-label">
          {{ $t('schoolBus.studentApply.detailPaymentAccount') }}
        </div>
        <el-input v-model="ruleForm.paymentAccount" :disabled="mainDisabled || !canEditPayInfo" />
      </div>
    </el-col>
  </el-row>
  <el-row :gutter="16">
    <el-col :span="8">
      <div class="bus-order-form__nested-field">
        <div class="bus-order-form__nested-label">
          {{ $t('schoolBus.studentApply.detailPaymentOrderNo') }}
        </div>
        <el-input v-model="ruleForm.paymentOrderNo" :disabled="mainDisabled || !canEditPayInfo" />
      </div>
    </el-col>
    <el-col :span="8">
      <div class="bus-order-form__nested-field">
        <div class="bus-order-form__nested-label">
          {{ $t('schoolBus.studentApply.detailReceivingAccount') }}
        </div>
        <el-input v-model="ruleForm.receivingAccount" :disabled="mainDisabled || !canEditPayInfo" />
      </div>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import type { UniOption } from 'uni-ui-lib'
import { inject } from 'vue'

import { busOrderRuleFormKey } from '../bus-order-form-types'

const ruleForm = inject(busOrderRuleFormKey)!

defineProps<{
  mainDisabled: boolean
  canEditPayInfo: boolean
  paymentMethodOpts: UniOption[]
}>()
</script>
