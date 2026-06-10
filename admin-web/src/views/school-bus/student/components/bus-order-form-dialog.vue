<template>
  <el-drawer
    v-model="visible"
    class="bus-order-form-drawer"
    direction="rtl"
    size="min(1000px, 96vw)"
    destroy-on-close
    :title="dialogTitle"
    :close-on-click-modal="false"
    :before-close="handleMainDialogBeforeClose"
    @closed="onClosed"
  >
    <div
      v-if="innerVisible"
      v-loading="formDetailLoading"
      class="bus-order-form"
      :element-loading-text="$t('common.loading')"
    >
      <div ref="formScrollRootRef" class="bus-order-form__scroll">
        <UniForm
          ref="mainUniFormRef"
          v-model="ruleForm"
          :mode="mainUniFormMode"
          :config="mainFormConfig"
        >
          <template #field-admissionNo>
            <BusOrderAdmissionField
              :main-disabled="mainDisabled"
              :query-students="queryStudents"
              :on-student-pick="onStudentPick"
            />
          </template>
          <template #field-routeTableSlot>
            <BusOrderRouteTable
              :route-table-data="routeTableData"
              :main-disabled="mainDisabled"
              :open-route-add="openRouteAdd"
              :open-route-edit="openRouteEdit"
              :remove-route="removeRoute"
            />
          </template>
          <template #field-personTableSlot>
            <BusOrderPersonTable
              :person-table-data="personTableData"
              :open-person-add="openPersonAdd"
              :open-person-edit="openPersonEdit"
              :remove-person="removePerson"
            />
          </template>
          <template #field-approvalPaymentRowSlot>
            <BusOrderApprovalPayment
              :form-type="formType"
              :main-disabled="mainDisabled"
              :show-payment-radios="showPaymentRadios"
              :approval-opts="approvalOpts"
              :payment-opts="paymentOpts"
              :can-show-pay-info="canShowPayInfo"
              :can-edit-pay-info="canEditPayInfo"
              :on-approval-change="onApprovalChange"
              :on-payment-change="onPaymentChange"
            />
          </template>
          <template #field-signImageUrl>
            <BusOrderSignField :main-disabled="mainDisabled" :on-sign-file="onSignFile" />
          </template>
          <template #field-paymentDetailSlot>
            <BusOrderPaymentDetail
              :main-disabled="mainDisabled"
              :can-edit-pay-info="canEditPayInfo"
              :payment-method-opts="paymentMethodOpts"
            />
          </template>
        </UniForm>
      </div>
    </div>

    <template v-if="innerVisible && !mainDisabled" #footer>
      <el-button @click="close">{{ $t('schoolBus.cancel') }}</el-button>
      <el-button type="primary" :loading="submitting" @click="submit">
        {{ $t('schoolBus.submit') }}
      </el-button>
    </template>

    <BusOrderRouteDialog
      ref="routeDialogRef"
      v-model:visible="routeDialogVisible"
      v-model:route-form="routeForm"
      v-model:route-form-riding-week-multi="routeFormRidingWeekMulti"
      :route-dialog-title="routeDialogTitle"
      :route-dialog-form-config="routeDialogFormConfig"
      :riding-week-day-select-opts="ridingWeekDaySelectOpts"
      :main-disabled="mainDisabled"
      :disabled-riding-date="disabledRidingDate"
      :on-riding-range-change="onRidingRangeChange"
      :reset-route-form="resetRouteForm"
      :submit-route="submitRoute"
    />

    <BusOrderPersonDialog
      ref="personDialogRef"
      v-model:visible="personDialogVisible"
      v-model:person-form="personForm"
      :person-dialog-title="personDialogTitle"
      :person-dialog-form-config="personDialogFormConfig"
      :reset-person-form="resetPersonForm"
      :submit-person="submitPerson"
      :on-person-file="onPersonFile"
    />
  </el-drawer>
</template>

<script setup lang="ts">
import { UniForm } from 'uni-ui-lib'
import { provide, ref } from 'vue'

import BusOrderAdmissionField from './bus-order-form-sections/admission-field.vue'
import BusOrderApprovalPayment from './bus-order-form-sections/approval-payment.vue'
import BusOrderPaymentDetail from './bus-order-form-sections/payment-detail.vue'
import BusOrderPersonDialog from './bus-order-form-sections/person-dialog.vue'
import BusOrderPersonTable from './bus-order-form-sections/person-table.vue'
import BusOrderRouteDialog from './bus-order-form-sections/route-dialog.vue'
import BusOrderRouteTable from './bus-order-form-sections/route-table.vue'
import BusOrderSignField from './bus-order-form-sections/sign-field.vue'
import { createBusOrderFormDialogSetup } from './bus-order-form-dialog-setup-main'
import type { BusOrderFormDialogProps } from './bus-order-form-types'
import { busOrderRuleFormKey } from './bus-order-form-types'

const visible = defineModel<boolean>('visible', { required: true })

const props = defineProps<BusOrderFormDialogProps>()

const emit = defineEmits<{
  saved: []
}>()

const mainUniFormRef = ref<InstanceType<typeof UniForm> | null>(null)
const routeDialogRef = ref<InstanceType<typeof BusOrderRouteDialog> | null>(null)
const personDialogRef = ref<InstanceType<typeof BusOrderPersonDialog> | null>(null)

const {
  innerVisible,
  formScrollRootRef,
  formDetailLoading,
  ruleForm,
  routeTableData,
  personTableData,
  dialogTitle,
  mainDisabled,
  mainUniFormMode,
  mainFormConfig,
  submitting,
  canShowPayInfo,
  canEditPayInfo,
  approvalOpts,
  paymentOpts,
  paymentMethodOpts,
  showPaymentRadios,
  queryStudents,
  onStudentPick,
  onSignFile,
  onPersonFile,
  onApprovalChange,
  onPaymentChange,
  handleMainDialogBeforeClose,
  onClosed,
  close,
  submit,
  routeDialogVisible,
  routeForm,
  routeDialogTitle,
  routeFormRidingWeekMulti,
  ridingWeekDaySelectOpts,
  routeDialogFormConfig,
  disabledRidingDate,
  onRidingRangeChange,
  openRouteAdd,
  openRouteEdit,
  removeRoute,
  submitRoute,
  resetRouteForm,
  personDialogVisible,
  personForm,
  personDialogTitle,
  personDialogFormConfig,
  openPersonAdd,
  openPersonEdit,
  removePerson,
  submitPerson,
  resetPersonForm
} = createBusOrderFormDialogSetup(props, emit, visible, {
  getMainUniFormRef: () => mainUniFormRef.value,
  getRouteUniFormRef: () => routeDialogRef.value?.routeUniFormRef ?? null,
  getPersonUniFormRef: () => personDialogRef.value?.personUniFormRef ?? null
})

provide(busOrderRuleFormKey, ruleForm)
</script>

<style lang="scss">
@use './bus-order-form-dialog.scss';
</style>
