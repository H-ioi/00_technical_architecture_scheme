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
        <el-button v-uni-permission="'busorder_import_intention_order'" @click="fileRef?.click()">
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
        <el-button type="primary" link @click="reloadCommonData">
          {{ $t('common.retry') }}
        </el-button>
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
      @load-success="tableEmpty.onLoadSuccess"
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
        <ListTableEmpty :kind="tableEmpty.kind" @reset="reset" @retry="tableEmpty.retry" />
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
      @saved="refreshTable" />

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
import BusOrderFormDialog from '../components/bus-order-form-dialog.vue'
import OrderDetailDialog from '../components/order-detail-dialog.vue'
import { useBusOrderFormDialog } from '../components/use-bus-order-form-dialog'
import {
  approvalStatusOptions,
  paymentStatusOptions,
  pickupMethodOptions,
  useStudentOrderFilters
} from '../use-student-order-filters'
import { searchForm, tableCols } from './list.config'
import { schoolBusOrderApi } from '@/api'
import ListTableEmpty from '@/components/list-table-empty.vue'
import { useListTableEmpty } from '@/composables/use-list-table-empty'
import type { SchoolOptionRecord } from '@/types/modules/membership'
import type { BusOrderRecord, BusOrderListParams } from '@/types/modules/school-bus-order'
import { normalizePaged } from '@/utils/api-response-normalize'
import { membershipSchoolLabel } from '@/utils/membership-school'
import { isSpreadsheetFilename } from '@/utils/school-bus'
import dayjs from 'dayjs'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { UniFormConfig, UniTableAction, UniTableRequest } from 'uni-ui-lib'
import { UniForm, useUniI18n, useUniListState } from 'uni-ui-lib'
import { computed, ref, nextTick, onMounted, watch } from 'vue'

const { locale, t } = useUniI18n()

const decorateRow = (
  row: BusOrderRecord,
  loc: string,
  schoolRecords: SchoolOptionRecord[]
): BusOrderRecord => {
  const r = { ...row }
  r.createTime = r.createTime ? dayjs(String(r.createTime)).format('YYYY-MM-DD HH:mm') : ''
  r.showLineName = loc === 'en' ? String(r.buslineEnName ?? '') : String(r.buslineCnName ?? '')
  r.showSectionName = loc === 'en' ? String(r.sectionEnName ?? '') : String(r.sectionCnName ?? '')
  r.showStationName =
    loc === 'en' ? String(r.busStationEnName ?? '') : String(r.busStationCnName ?? '')
  const rawSid = r.schoolId ?? r.schoolIds
  const sid = Array.isArray(rawSid) ? rawSid[0] : rawSid
  const mapped = membershipSchoolLabel(schoolRecords, sid, loc)
  r.showSchoolName =
    mapped !== '--' ? mapped : String(r.schoolEnName != null ? r.schoolEnName : '--')
  return r
}

const {
  initSchools,
  schoolRecords,
  schoolOptions,
  sectionOptions,
  lineOptions,
  stationOptions,
  carSelectOptions,
  defaultSingleSchoolId,
  syncSchoolSelection,
  commonDataLoading,
  commonDataError,
  reloadCommonData
} = useStudentOrderFilters()

const initialFilters: Record<string, unknown> = {
  schoolIds: undefined,
  approvalStatus: undefined,
  sectionId: undefined,
  lineIds: undefined,
  stationIds: undefined,
  keyword: '',
  carInfoId: undefined
}

const { queryModel, filters, tableRef, search, reset, handleLoadSuccess, refreshTable } =
  useUniListState({
    initialFilters
  })

const multiSchool = computed(() => schoolRecords.value.length > 1)
const approvalOpts = computed(() => approvalStatusOptions(t))
const paymentOpts = computed(() => paymentStatusOptions(t))
const pickupOpts = computed(() => pickupMethodOptions(t))

const hasSchoolSelection = computed(() => {
  if (!multiSchool.value) {
    return true
  }
  const v = queryModel.value.schoolIds
  return Array.isArray(v) && v.length > 0
})

const searchCascade = computed(() => {
  const q = queryModel.value
  const hasSchool = hasSchoolSelection.value
  return {
    sectionDisabled: !hasSchool,
    lineDisabled:
      !hasSchool || q.sectionId === undefined || q.sectionId === null || q.sectionId === '',
    stationDisabled: !hasSchool || !Array.isArray(q.lineIds) || q.lineIds.length === 0,
    optionsLoading: commonDataLoading.value,
    optionsFailed: commonDataError.value
  }
})

const searchCfg = computed(() =>
  searchForm(
    t,
    schoolOptions.value,
    approvalOpts.value,
    sectionOptions.value,
    lineOptions.value,
    stationOptions.value,
    carSelectOptions.value,
    multiSchool.value,
    searchCascade.value
  )
)

const columns = computed(() =>
  tableCols(t, approvalOpts.value, paymentOpts.value, pickupOpts.value)
)

const loadData: UniTableRequest = async ({ pageNo: _p, pageSize: _s, filters: f }) => {
  const current = _p
  const size = _s
  const raw: BusOrderListParams = { current, size, ...f } as BusOrderListParams
  if (!multiSchool.value && defaultSingleSchoolId.value != null && raw.schoolIds == null) {
    raw.schoolIds = defaultSingleSchoolId.value
  }
  const result = await schoolBusOrderApi.intentionPage.get(raw)
  const { list, total } = normalizePaged<BusOrderRecord>(result)
  const loc = locale()
  return {
    data: list.map((row) => decorateRow(row, loc, schoolRecords.value)),
    total
  }
}

const { formVisible, formMode, editingOrderId, openFormAdd, openFormEdit } = useBusOrderFormDialog()

const detailVisible = ref(false)
const detailOrderId = ref<string | number | null>(null)

const openDetail = (row: BusOrderRecord) => {
  detailOrderId.value = row.id ?? null
  detailVisible.value = true
}

const closeDetail = () => {
  detailVisible.value = false
  detailOrderId.value = null
}

const actions = computed<UniTableAction[]>(() => [
  {
    label: t('schoolBus.look'),
    onClick: (row) => openDetail(row as BusOrderRecord)
  },
  {
    label: t('schoolBus.edit'),
    code: 'busorder_edit',
    onClick: (row) => openFormEdit(row as BusOrderRecord)
  }
])

onMounted(async () => {
  await initSchools()
  if (schoolRecords.value.length === 1) {
    queryModel.value.schoolIds = undefined
  }
  nextTick(() => tableRef.value?.refresh())
})

watch(
  () => queryModel.value.schoolIds,
  (ids, prev) => {
    syncSchoolSelection(ids as Array<string | number> | undefined)
    if (!multiSchool.value) {
      return
    }
    if (JSON.stringify(ids) === JSON.stringify(prev)) {
      return
    }
    queryModel.value.sectionId = undefined
    queryModel.value.lineIds = undefined
    queryModel.value.stationIds = undefined
  },
  { deep: true }
)

watch(
  () => queryModel.value.sectionId,
  (next, prev) => {
    if (next === prev) {
      return
    }
    queryModel.value.lineIds = undefined
    queryModel.value.stationIds = undefined
  }
)

watch(
  () => queryModel.value.lineIds,
  (next, prev) => {
    if (JSON.stringify(next) === JSON.stringify(prev)) {
      return
    }
    queryModel.value.stationIds = undefined
  },
  { deep: true }
)

watch(
  () => schoolRecords.value.length,
  (len) => {
    if (len === 1) {
      queryModel.value.schoolIds = undefined
      nextTick(() => tableRef.value?.refresh())
    }
  }
)

const tableEmpty = useListTableEmpty(filters, { tableRef, afterLoadSuccess: handleLoadSuccess })

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
    void refreshTable()
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
    void refreshTable()
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
    void refreshTable()
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
    void refreshTable()
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
    void refreshTable()
  } catch {
    /* request 层已提示 */
  }
}
</script>

<style scoped lang="scss">
.school-bus-student-apply {
  &__cascade-alert {
    margin-bottom: 12px;
  }

  &__file {
    position: absolute;
    width: 0;
    height: 0;
    opacity: 0;
    pointer-events: none;
  }
}
</style>
