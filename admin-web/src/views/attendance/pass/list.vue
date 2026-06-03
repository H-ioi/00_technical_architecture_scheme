<template>
  <section class="uni-list-page">
    <div class="uni-list-page__header">
      <div>
        <h1>{{ $t('attendance.holidayPass.title') }}</h1>
        <p>{{ $t('attendance.holidayPass.pageDesc') }}</p>
      </div>
      <div class="uni-list-page__header-actions">
        <el-button v-if="hasPermission('pass-add')" type="primary" @click="openAdd">
          {{ $t('attendance.add') }}
        </el-button>
      </div>
    </div>

    <UniSearchForm
      v-model="queryModel"
      :config="searchCfg"
      :collapsed="true"
      :collapsed-rows="1"
      :action-min-span="0"
      :submit-text="$t('member.search')"
      :reset-text="$t('member.reset')"
      @search="search"
      @reset="reset" />

    <UniDataTable
      ref="tableRef"
      row-key="id"
      selection="multiple"
      :columns="columns"
      :request="loadData"
      :filters="filters"
      :pagination="{ pageSize: 10, pageSizes: [10, 20, 50, 100] }"
      :toolbar="{ refresh: true, density: true, columnSetting: true }"
      :actions="actions"
      :action-column="{ width: 150, fixed: 'right' }"
      @load-success="tableEmpty.onLoadSuccess"
      @request-error="tableEmpty.onRequestError"
      @selection-change="onSelectionChange">
      <template #toolbar>
        <el-button
          v-if="hasPermission('pass-generated-batch')"
          :disabled="selection.length === 0"
          @click="openBatch">
          {{ $t('attendance.holidayPass.batchGenerate') }}
        </el-button>
        <el-button
          v-if="hasPermission('pass-delete')"
          type="danger"
          :disabled="selection.length === 0"
          @click="batchDelete">
          {{ $t('attendance.delete') }}
        </el-button>
      </template>
      <template #empty>
        <ListTableEmpty :kind="tableEmpty.kind" @reset="reset" @retry="tableEmpty.retry" />
      </template>
    </UniDataTable>

    <PassFormDialog
      v-model:visible="dialogVisible"
      :edit="dialogEdit"
      :batch-rows="batchPayload"
      :view-only="dialogViewOnly"
      @success="refreshTable" />
  </section>
</template>

<script setup lang="ts">
import PassFormDialog from './components/pass-form-dialog.vue'
import { searchForm, tableCols } from './list.config'
import { attendanceHolidayApi, membershipApi } from '@/api'
import ListTableEmpty from '@/components/list-table-empty.vue'
import { useListTableEmpty } from '@/composables/use-list-table-empty'
import type { AttendanceLeavePassRecord } from '@/types/modules/attendance-holiday'
import type { SchoolOptionRecord } from '@/types/modules/membership'
import { normalizePaged } from '@/utils/api-response-normalize'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  UniDataTable,
  UniSearchForm,
  toUniOptions,
  useUniI18n,
  useUniListState,
  useUniPermission
} from 'uni-ui-lib'
import type { UniTableAction, UniTableRequest } from 'uni-ui-lib'
import { onMounted, computed, ref } from 'vue'

const { locale, t } = useUniI18n()

type Loose = Record<string, unknown>
const { hasPermission } = useUniPermission()
const schoolRecords = ref<SchoolOptionRecord[]>([])
const selection = ref<AttendanceLeavePassRecord[]>([])

const { queryModel, filters, tableRef, handleLoadSuccess, refreshTable, reset, search } =
  useUniListState({
    initialFilters: { keyword: '', studentSchool: '', isDormitory: '' }
  })

const schoolOptions = computed(() =>
  toUniOptions(schoolRecords.value, {
    labelKeys: locale() === 'en' ? ['enName', 'name'] : ['name', 'cnName', 'enName'],
    valueKey: 'enName'
  })
)

const searchCfg = computed(() => searchForm(t, schoolOptions.value))
const columns = computed(() => tableCols(t))

const dialogVisible = ref(false)
const dialogEdit = ref<AttendanceLeavePassRecord | null>(null)
const dialogViewOnly = ref(false)
const batchPayload = ref<AttendanceLeavePassRecord[] | null>(null)

const loadData: UniTableRequest = async ({ pageNo, pageSize, filters: f }) => {
  const raw = await attendanceHolidayApi.leavePassPage.get({
    current: pageNo,
    size: pageSize,
    ...(f as Loose)
  })
  const { list, total } = normalizePaged(raw)
  return { data: list as AttendanceLeavePassRecord[], total }
}

const updateRowStatus = (row: AttendanceLeavePassRecord, status: number) => {
  ElMessageBox.confirm(t('attendance.holidayPass.actionConfirm'), t('attendance.tipTitle'), {
    type: 'warning',
    confirmButtonText: t('common.submit'),
    cancelButtonText: t('common.cancel')
  })
    .then(async () => {
      await attendanceHolidayApi.leavePassUpdateStatus.post({
        id: row.id,
        passTime: row.passTime,
        status,
        dataFrom: 'admin'
      })
      ElMessage.success(t('attendance.holiday.withdrawSuccess'))
      void refreshTable()
    })
    .catch(() => {})
}

const openAdd = () => {
  dialogEdit.value = null
  dialogViewOnly.value = false
  batchPayload.value = null
  dialogVisible.value = true
}

const openView = (row: AttendanceLeavePassRecord, viewOnly: boolean) => {
  dialogEdit.value = { ...(row as AttendanceLeavePassRecord) }
  dialogViewOnly.value = viewOnly
  batchPayload.value = null
  dialogVisible.value = true
}

const openBatch = () => {
  if (selection.value.length === 0) {
    ElMessage.warning(t('attendance.holidayPass.needSelection'))
    return
  }
  const bad = selection.value.some((item) => String(item.status) !== '2')
  if (bad) {
    ElMessage.warning(t('attendance.holidayPass.batchOnlyPending'))
    return
  }
  dialogEdit.value = null
  dialogViewOnly.value = false
  batchPayload.value = [...selection.value]
  dialogVisible.value = true
}

const batchDelete = () => {
  if (selection.value.length === 0) {
    ElMessage.warning(t('attendance.holidayPass.needSelection'))
    return
  }
  const bad = selection.value.some((item) => String(item.status) === '0')
  if (bad) {
    ElMessage.warning(t('attendance.holidayPass.cannotDeleteActive'))
    return
  }
  ElMessageBox.confirm(t('attendance.holidayPass.batchDeleteConfirm'), t('attendance.tipTitle'), {
    type: 'warning',
    confirmButtonText: t('common.submit'),
    cancelButtonText: t('common.cancel')
  })
    .then(async () => {
      const ids = selection.value.map((r) => r.id).filter((id) => id != null)
      await attendanceHolidayApi.leavePassUpdateBatchStatus.post({ ids, status: -1 })
      ElMessage.success(t('attendance.holiday.withdrawSuccess'))
      void refreshTable()
    })
    .catch(() => {})
}

const onSelectionChange = (rows: Record<string, unknown>[]) => {
  selection.value = rows as AttendanceLeavePassRecord[]
}

const actions = computed<UniTableAction[]>(() => [
  {
    label: t('attendance.delete'),
    visible: (row) =>
      hasPermission('pass-delete') && String((row as AttendanceLeavePassRecord).status) !== '0',
    onClick: (row) => updateRowStatus(row as AttendanceLeavePassRecord, -1)
  },
  {
    label: t('attendance.holidayPass.void'),
    visible: (row) => {
      const st = Number((row as AttendanceLeavePassRecord).status)
      return hasPermission('pass-voided') && ![3, 2, 1].includes(st)
    },
    onClick: (row) => updateRowStatus(row as AttendanceLeavePassRecord, 1)
  },
  {
    label: t('attendance.detail'),
    onClick: (row) => openView(row as AttendanceLeavePassRecord, true)
  },
  {
    label: t('attendance.holidayPass.generate'),
    visible: (row) =>
      hasPermission('pass-generated') && String((row as AttendanceLeavePassRecord).status) === '2',
    onClick: (row) => openView(row as AttendanceLeavePassRecord, false)
  }
])

const initSchools = async () => {
  schoolRecords.value = await membershipApi.school.get()
}

const tableEmpty = useListTableEmpty(filters, { tableRef, afterLoadSuccess: handleLoadSuccess })

onMounted(() => {
  initSchools()
})
</script>
