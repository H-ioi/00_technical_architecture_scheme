<template>
  <section class="uni-list-page">
    <div class="uni-list-page__header">
      <div>
        <h1>{{ $t('schoolBus.studentApply.pageTitle') }}</h1>
        <p>{{ $t('schoolBus.studentApply.pageDesc') }}</p>
      </div>
      <div class="uni-list-page__header-actions">
        <el-button
          v-uni-permission="'busorder_import_intention_order'"
          @click="downloadIntentionTemplate">
          {{ $t('schoolBus.downloadTemplate') }}
        </el-button>
        <el-button v-uni-permission="'busorder_import_intention_order'" @click="pickImport">
          {{ $t('schoolBus.import') }}
        </el-button>
        <el-button v-uni-permission="'busorder_add'" type="primary" @click="openFormAdd">
          {{ $t('schoolBus.add') }}
        </el-button>
      </div>
    </div>

    <input
      ref="fileRef"
      type="file"
      accept=".xlsx,.xls"
      class="school-bus-student-apply__file"
      @change="onImportFile" />

    <el-alert
      v-if="commonDataError"
      class="school-bus-student-apply__cascade-alert"
      type="warning"
      :closable="false"
      show-icon>
      <template #default>
        <span>{{ $t('schoolBus.cascadeOptionsLoadFail') }}</span>
        <el-button type="primary" link @click="reloadCommonData">{{
          $t('common.retry')
        }}</el-button>
      </template>
    </el-alert>

    <UniSearchForm
      v-model="queryModel"
      :config="searchCfg"
      :collapsed="true"
      :collapsed-rows="1"
      :action-min-span="0"
      :submit-text="$t('schoolBus.search')"
      :reset-text="$t('schoolBus.reset')"
      @search="search"
      @reset="reset" />

    <UniDataTable
      ref="tableRef"
      row-key="id"
      selection
      :columns="columns"
      :request="loadData"
      :filters="filters"
      :pagination="{ pageSize: 10, pageSizes: [10, 20, 50, 100] }"
      :toolbar="{ refresh: true, density: true, columnSetting: true }"
      :actions="actions"
      :action-column="{ width: 110, fixed: 'right' }"
      @selection-change="onSelectionChange"
      @load-success="onTableLoadSuccess"
      @request-error="tableEmpty.onRequestError">
      <template #toolbar>
        <el-button
          v-uni-permission="'busorder_batch_approve'"
          :disabled="selection.length === 0"
          @click="batchApprove">
          {{ $t('schoolBus.studentApply.batchApprove') }}
        </el-button>
        <el-button
          v-uni-permission="'busorder_batch_deny'"
          :disabled="selection.length === 0"
          @click="openReject">
          {{ $t('schoolBus.studentApply.batchReject') }}
        </el-button>
        <el-button
          v-uni-permission="'busorder_batch_update_payment_status'"
          :disabled="selection.length === 0"
          @click="batchPayment">
          {{ $t('schoolBus.studentApply.batchPayment') }}
        </el-button>
        <el-button
          v-uni-permission="'busintentionorder_del'"
          type="danger"
          :disabled="selection.length === 0"
          @click="del">
          {{ $t('schoolBus.delete') }}
        </el-button>
      </template>
      <template #empty>
        <ListTableEmpty :kind="tableEmpty.kind" @reset="reset" @retry="retryTable" />
      </template>
    </UniDataTable>

    <OrderDetailDialog :visible="detailVisible" :order-id="detailOrderId" @close="closeDetail" />

    <BusOrderFormDialog
      v-model:visible="formVisible"
      :mode="formMode"
      :order-id="editingOrderId"
      form-type="apply"
      :school-options="schoolOptions"
      :default-school-id="defaultSingleSchoolId"
      :multi-school="multiSchool"
      @saved="reload" />

    <el-dialog
      v-model="rejectVisible"
      width="520px"
      :title="$t('schoolBus.studentApply.batchReject')"
      destroy-on-close>
      <UniForm ref="rejectUniFormRef" v-model="rejectForm" mode="edit" :config="rejectFormConfig" />
      <template #footer>
        <el-button @click="rejectVisible = false">
          {{ $t('schoolBus.cancel') }}
        </el-button>
        <el-button type="primary" @click="confirmReject">
          {{ $t('schoolBus.submit') }}
        </el-button>
      </template>
    </el-dialog>
  </section>
</template>

<script setup lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus'
import type { UniFormConfig, UniTableRequestResult } from 'uni-ui-lib'
import { UniForm, useUniI18n } from 'uni-ui-lib'
import { computed, ref } from 'vue'

import { schoolBusOrderApi } from '@/api'
import ListTableEmpty from '@/components/list-table-empty.vue'
import { useListTableEmpty } from '@/composables/use-list-table-empty'
import type { BusOrderRecord } from '@/types/modules/school-bus-order'
import BusOrderFormDialog from '../components/bus-order-form-dialog.vue'
import OrderDetailDialog from '../components/order-detail-dialog.vue'
import { useApplyList } from './use-list'

const { t } = useUniI18n()
const {
  actions,
  closeDetail,
  columns,
  commonDataError,
  defaultSingleSchoolId,
  detailOrderId,
  detailVisible,
  editingOrderId,
  filters,
  formMode,
  formVisible,
  handleLoadSuccess,
  loadData,
  multiSchool,
  openFormAdd,
  queryModel,
  reset,
  reloadCommonData,
  schoolOptions,
  search,
  searchCfg,
  tableRef
} = useApplyList()

const tableEmpty = useListTableEmpty(filters)

const onTableLoadSuccess = (result: UniTableRequestResult) => {
  tableEmpty.onLoadSuccess(result)
  handleLoadSuccess(result)
}

const retryTable = () => {
  tableEmpty.resetError()
  tableRef.value?.refresh()
}

const fileRef = ref<HTMLInputElement | null>(null)
const selection = ref<BusOrderRecord[]>([])
const IMPORT_MAX_BYTES = 10 * 1024 * 1024

const rejectVisible = ref(false)
const rejectUniFormRef = ref<InstanceType<typeof UniForm> | null>(null)
const rejectForm = ref({ denyReason: '' })
const rejectFormConfig = computed<UniFormConfig>(() => ({
  formProps: { labelPosition: 'top' },
  rowProps: { gutter: 0 },
  colProps: { span: 24 },
  rules: {
    denyReason: [
      {
        required: true,
        message: t('schoolBus.studentApply.rejectReasonRequired'),
        trigger: 'blur'
      }
    ]
  } as UniFormConfig['rules'],
  schema: [
    {
      field: 'denyReason',
      label: t('schoolBus.studentApply.rejectReason'),
      component: 'ElInput',
      componentProps: { type: 'textarea', rows: 5 }
    }
  ]
}))

const selectionIds = computed(() => selection.value.map((r) => r.id))

const reload = () => tableRef.value?.refresh()

const onSelectionChange = (rows: BusOrderRecord[]) => {
  selection.value = rows
}

const downloadIntentionTemplate = async () => {
  try {
    await schoolBusOrderApi.downloadIntentionOrder.download()
  } catch {
    /* request 层已提示 */
  }
}

const pickImport = () => fileRef.value?.click()

const isSpreadsheetFilename = (name: string) => {
  const lower = name.toLowerCase()
  return lower.endsWith('.xls') || lower.endsWith('.xlsx')
}

const onImportFile = async (e: Event) => {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''
  if (!file) {
    return
  }
  if (!isSpreadsheetFilename(file.name)) {
    ElMessage.warning(t('schoolBus.importInvalidType'))
    return
  }
  if (file.size > IMPORT_MAX_BYTES) {
    ElMessage.warning(t('schoolBus.importTooLarge'))
    return
  }
  try {
    await schoolBusOrderApi.importIntentionOrder.post(file)
    ElMessage.success(t('schoolBus.importSuccess'))
    reload()
  } catch {
    /* request 层已提示 */
  }
}

const validateAllPending = (rows: BusOrderRecord[]) => {
  const bad = rows.filter((r) => r.approvalStatus != null && String(r.approvalStatus) !== '0')
  return bad.length === 0
}

const batchApprove = async () => {
  if (selection.value.length === 0) {
    return
  }
  if (!validateAllPending(selection.value)) {
    ElMessage.warning(t('schoolBus.studentApply.msgOnlyPending'))
    return
  }
  try {
    await ElMessageBox.confirm(
      t('schoolBus.studentApply.msgConfirmApprove'),
      t('schoolBus.studentApply.batchApprove'),
      { type: 'warning' }
    )
  } catch {
    return
  }
  try {
    await schoolBusOrderApi.batchApprove.get({ ids: selectionIds.value })
    ElMessage.success(t('schoolBus.operationSuccess'))
    selection.value = []
    reload()
  } catch {
    /* request 层已提示 */
  }
}

const openReject = () => {
  if (selection.value.length === 0) {
    return
  }
  if (!validateAllPending(selection.value)) {
    ElMessage.warning(t('schoolBus.studentApply.msgOnlyPending'))
    return
  }
  rejectForm.value.denyReason = ''
  rejectVisible.value = true
}

const confirmReject = async () => {
  const valid = await rejectUniFormRef.value?.validate().catch(() => false)
  if (!valid) {
    return
  }
  try {
    await schoolBusOrderApi.batchDeny.get({
      ids: selectionIds.value,
      denyReason: rejectForm.value.denyReason
    })
    ElMessage.success(t('schoolBus.operationSuccess'))
    rejectVisible.value = false
    selection.value = []
    reload()
  } catch {
    /* request 层已提示 */
  }
}

const batchPayment = async () => {
  if (selection.value.length === 0) {
    return
  }
  const invalid = selection.value.filter(
    (r) => String(r.approvalStatus) !== '1' || String(r.paymentStatus) !== '1'
  )
  if (invalid.length) {
    ElMessage.warning(t('schoolBus.studentApply.msgPaymentRule'))
    return
  }
  try {
    await ElMessageBox.confirm(
      t('schoolBus.studentApply.msgConfirmPayment'),
      t('schoolBus.studentApply.batchPayment'),
      { type: 'warning' }
    )
  } catch {
    return
  }
  try {
    await schoolBusOrderApi.batchUpdatePaymentStatus.get({ ids: selectionIds.value })
    ElMessage.success(t('schoolBus.operationSuccess'))
    selection.value = []
    reload()
  } catch {
    /* request 层已提示 */
  }
}

const del = async () => {
  if (selection.value.length === 0) {
    return
  }
  try {
    await ElMessageBox.confirm(t('schoolBus.confirmDeleteRows'), t('schoolBus.delete'), {
      type: 'warning'
    })
  } catch {
    return
  }
  try {
    await schoolBusOrderApi.delIntentionOrder.delete(selectionIds.value)
    ElMessage.success(t('schoolBus.operationSuccess'))
    selection.value = []
    reload()
  } catch {
    /* request 层已提示 */
  }
}
</script>

<style scoped lang="scss">
.school-bus-student-apply__cascade-alert {
  margin-bottom: 12px;
}

.school-bus-student-apply__file {
  position: absolute;
  width: 0;
  height: 0;
  opacity: 0;
  pointer-events: none;
}
</style>
