<template>
  <section class="uni-list-page">
    <div class="uni-list-page__header">
      <div>
        <h1>{{ $t('schoolBus.studentApply.page.title') }}</h1>
        <p>{{ $t('schoolBus.studentApply.page.description') }}</p>
      </div>
      <div class="uni-list-page__header-actions">
        <el-button
          v-uni-permission="'busorder_import_intention_order'"
          @click="downloadIntentionTemplate">
          {{ $t('schoolBus.driver.actions.downloadTemplate') }}
        </el-button>
        <el-button v-uni-permission="'busorder_import_intention_order'" @click="pickImport">
          {{ $t('schoolBus.driver.actions.import') }}
        </el-button>
        <el-button v-uni-permission="'busorder_add'" type="primary" @click="openFormAdd">
          {{ $t('schoolBus.driver.actions.add') }}
        </el-button>
      </div>
    </div>

    <input
      ref="fileRef"
      type="file"
      accept=".xlsx,.xls"
      class="school-bus-student-apply__file"
      @change="onImportFile" />

    <UniSearchForm
      v-model="queryModel"
      :config="searchCfg"
      :collapsed="true"
      :collapsed-rows="1"
      :action-min-span="0"
      :submit-text="$t('schoolBus.driver.actions.search')"
      :reset-text="$t('schoolBus.driver.actions.reset')"
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
      :action-column="{ width: 150, fixed: 'right' }"
      @selection-change="onSelectionChange"
      @load-success="handleLoadSuccess">
      <template #toolbar>
        <el-button
          v-uni-permission="'busorder_batch_approve'"
          :disabled="selection.length === 0"
          @click="batchApprove">
          {{ $t('schoolBus.studentApply.actions.batchApprove') }}
        </el-button>
        <el-button
          v-uni-permission="'busorder_batch_deny'"
          :disabled="selection.length === 0"
          @click="openReject">
          {{ $t('schoolBus.studentApply.actions.batchReject') }}
        </el-button>
        <el-button
          v-uni-permission="'busorder_batch_update_payment_status'"
          :disabled="selection.length === 0"
          @click="batchPayment">
          {{ $t('schoolBus.studentApply.actions.batchPayment') }}
        </el-button>
        <el-button
          v-uni-permission="'busintentionorder_del'"
          type="danger"
          :disabled="selection.length === 0"
          @click="del">
          {{ $t('schoolBus.driver.actions.delete') }}
        </el-button>
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
      :title="$t('schoolBus.studentApply.actions.batchReject')"
      destroy-on-close>
      <UniForm ref="rejectUniFormRef" v-model="rejectForm" mode="edit" :config="rejectFormConfig" />
      <template #footer>
        <el-button @click="rejectVisible = false">
          {{ $t('schoolBus.driver.actions.cancel') }}
        </el-button>
        <el-button type="primary" @click="confirmReject">
          {{ $t('schoolBus.driver.actions.submit') }}
        </el-button>
      </template>
    </el-dialog>
  </section>
</template>

<script setup lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus'
import type { UniFormConfig } from 'uni-ui-lib'
import { UniForm, useUniI18n } from 'uni-ui-lib'
import { computed, ref } from 'vue'

import OrderDetailDialog from '../components/order-detail-dialog.vue'
import BusOrderFormDialog from '../components/bus-order-form-dialog.vue'
import { useApplyList } from './use-list'

import { schoolBusOrderApi } from '@/api'
import type { BusOrderRecord } from '@/types/modules/school-bus-order'

const { t } = useUniI18n()
const {
  actions,
  closeDetail,
  columns,
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
  schoolOptions,
  search,
  searchCfg,
  tableRef
} = useApplyList()

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
        message: t('schoolBus.studentApply.reject.reasonRequired'),
        trigger: 'blur'
      }
    ]
  } as UniFormConfig['rules'],
  schema: [
    {
      field: 'denyReason',
      label: t('schoolBus.studentApply.reject.reason'),
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
    ElMessage.warning(t('schoolBus.driver.messages.importInvalidType'))
    return
  }
  if (file.size > IMPORT_MAX_BYTES) {
    ElMessage.warning(t('schoolBus.driver.messages.importTooLarge'))
    return
  }
  try {
    await schoolBusOrderApi.importIntentionOrder.post(file)
    ElMessage.success(t('schoolBus.driver.messages.importSuccess'))
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
    ElMessage.warning(t('schoolBus.studentApply.messages.onlyPending'))
    return
  }
  try {
    await ElMessageBox.confirm(
      t('schoolBus.studentApply.messages.confirmApprove'),
      t('schoolBus.studentApply.actions.batchApprove'),
      { type: 'warning' }
    )
  } catch {
    return
  }
  try {
    await schoolBusOrderApi.batchApprove.get({ ids: selectionIds.value })
    ElMessage.success(t('schoolBus.studentApply.messages.success'))
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
    ElMessage.warning(t('schoolBus.studentApply.messages.onlyPending'))
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
    ElMessage.success(t('schoolBus.studentApply.messages.success'))
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
    ElMessage.warning(t('schoolBus.studentApply.messages.paymentRule'))
    return
  }
  try {
    await ElMessageBox.confirm(
      t('schoolBus.studentApply.messages.confirmPayment'),
      t('schoolBus.studentApply.actions.batchPayment'),
      { type: 'warning' }
    )
  } catch {
    return
  }
  try {
    await schoolBusOrderApi.batchUpdatePaymentStatus.get({ ids: selectionIds.value })
    ElMessage.success(t('schoolBus.studentApply.messages.success'))
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
    await ElMessageBox.confirm(
      t('schoolBus.studentApply.messages.confirmDelete'),
      t('schoolBus.driver.actions.delete'),
      { type: 'warning' }
    )
  } catch {
    return
  }
  try {
    await schoolBusOrderApi.delIntentionOrder.delete(selectionIds.value)
    ElMessage.success(t('schoolBus.studentApply.messages.success'))
    selection.value = []
    reload()
  } catch {
    /* request 层已提示 */
  }
}
</script>

<style scoped lang="scss">
.school-bus-student-apply__file {
  position: absolute;
  width: 0;
  height: 0;
  opacity: 0;
  pointer-events: none;
}
</style>
