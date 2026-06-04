<template>
  <section class="uni-list-page">
    <div class="uni-list-page__header">
      <div>
        <h1>{{ $t('schoolBus.studentOrder.pageTitle') }}</h1>
        <p>{{ $t('schoolBus.studentOrder.pageDesc') }}</p>
      </div>
      <div class="uni-list-page__header-actions">
        <el-button v-uni-permission="'busorder_export_order'" @click="exportData">
          {{ $t('schoolBus.export') }}
        </el-button>
        <el-button v-uni-permission="'busorder_import_order'" @click="downloadOrderTemplate">
          {{ $t('schoolBus.downloadTemplate') }}
        </el-button>
        <el-button v-uni-permission="'busorder_import_order'" @click="fileRef?.click()">
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
      class="school-bus-student-order__file"
      @change="onImportFile" />

    <el-alert
      v-if="commonDataError"
      class="school-bus-student-order__cascade-alert"
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
          v-uni-permission="'busorder_del'"
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
      form-type="order"
      :school-options="schoolOptions"
      :default-school-id="defaultSingleSchoolId"
      :multi-school="multiSchool"
      @saved="refreshTable" />
  </section>
</template>

<script setup lang="ts">
import BusOrderFormDialog from '../components/bus-order-form-dialog.vue'
import OrderDetailDialog from '../components/order-detail-dialog.vue'
import { useBusOrderFormDialog } from '../components/use-bus-order-form-dialog'
import { pickupMethodOptions, useStudentOrderFilters } from '../use-student-order-filters'
import { searchForm, tableCols } from './list.config'
import { schoolBusOrderApi } from '@/api'
import ListTableEmpty from '@/components/list-table-empty/index.vue'
import { useListTableEmpty } from '@/composables/use-list-table-empty'
import type { SchoolOptionRecord } from '@/types/modules/membership'
import type { BusOrderRecord, BusOrderListParams } from '@/types/modules/school-bus-order'
import { normalizePaged } from '@/utils/api-response-normalize'
import { downloadBlob } from '@/utils/download'
import { membershipSchoolLabel } from '@/utils/membership-school'
import dayjs from 'dayjs'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUniI18n, useUniListState } from 'uni-ui-lib'
import type { UniTableAction, UniTableRequest } from 'uni-ui-lib'
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
    sectionOptions.value,
    lineOptions.value,
    stationOptions.value,
    carSelectOptions.value,
    multiSchool.value,
    searchCascade.value
  )
)

const columns = computed(() => tableCols(t, pickupOpts.value))

const { formVisible, formMode, editingOrderId, openFormAdd, openFormEdit } = useBusOrderFormDialog()

const detailVisible = ref(false)
const detailOrderId = ref<string | number | null>(null)

const closeDetail = () => {
  detailVisible.value = false
  detailOrderId.value = null
}

const loadData: UniTableRequest = async ({ pageNo: _p, pageSize: _s, filters: f }) => {
  const raw: BusOrderListParams = { current: _p, size: _s, ...f } as BusOrderListParams
  if (!multiSchool.value && defaultSingleSchoolId.value != null && raw.schoolIds == null) {
    raw.schoolIds = defaultSingleSchoolId.value
  }
  const result = await schoolBusOrderApi.orderPage.get(raw)
  const { list, total } = normalizePaged<BusOrderRecord>(result)
  const loc = locale()
  return {
    data: list.map((row) => decorateRow(row, loc, schoolRecords.value)),
    total
  }
}

const actions = computed<UniTableAction[]>(() => [
  {
    label: t('schoolBus.look'),
    onClick: (row) => {
      detailOrderId.value = (row as BusOrderRecord).id
      detailVisible.value = true
    }
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

const selectionIds = computed(() => selection.value.map((r) => r.id))

const onSelectionChange = (rows: BusOrderRecord[]) => {
  selection.value = rows
}

const downloadOrderTemplate = async () => {
  try {
    await schoolBusOrderApi.downloadOrder.download()
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
  const importExt = file.name.toLowerCase()
  if (!importExt.endsWith('.xls') && !importExt.endsWith('.xlsx')) {
    ElMessage.warning(t('schoolBus.importInvalidType'))
    return
  }
  if (file.size > IMPORT_MAX_BYTES) {
    ElMessage.warning(t('schoolBus.importTooLarge'))
    return
  }
  try {
    await schoolBusOrderApi.importOrder.post(file)
    ElMessage.success(t('schoolBus.importSuccess'))
    void refreshTable()
  } catch {
    /* request 层已提示 */
  }
}

const exportData = async () => {
  const raw: Record<string, unknown> = { ...filters.value }
  delete raw.size
  delete raw.current
  try {
    const blob = await schoolBusOrderApi.exportOrder.get(raw)
    downloadBlob(blob, 'bus-order-export.xlsx')
    ElMessage.success(t('schoolBus.exportSuccess'))
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
    await schoolBusOrderApi.delOrder.delete(selectionIds.value)
    ElMessage.success(t('schoolBus.operationSuccess'))
    selection.value = []
    void refreshTable()
  } catch {
    /* request 层已提示 */
  }
}
</script>

<style scoped lang="scss">
.school-bus-student-order {
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
