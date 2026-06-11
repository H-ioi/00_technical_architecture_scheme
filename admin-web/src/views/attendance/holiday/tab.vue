<template>
  <section class="uni-list-page">
    <div class="uni-list-page__header">
      <div>
        <h1>{{ $t('attendance.holiday.pageTitle') }}</h1>
        <p>{{ $t('attendance.holiday.pageDesc') }}</p>
      </div>
      <div v-if="activeTab === 'leave'" class="uni-list-page__header-actions">
        <el-button type="primary" @click="leaveAddVisible = true">
          {{ $t('attendance.add') }}
        </el-button>
      </div>
    </div>

    <el-tabs v-model="activeTab" class="attendance-holiday-tab__tabs">
      <el-tab-pane :label="$t('attendance.holiday.tabLeave')" name="leave">
        <UniSearchForm
          v-model="leaveQueryModel"
          :config="leaveSearchConfig"
          :collapsed="true"
          :collapsed-rows="1"
          :action-min-span="0"
          :submit-text="$t('member.search')"
          :reset-text="$t('member.reset')"
          @search="searchLeave"
          @reset="resetLeaveSearch"
        />
        <UniDataTable
          ref="leaveTableRef"
          row-key="id"
          :columns="leaveColumns"
          :request="loadLeaveData"
          :filters="leaveFilters"
          :pagination="{ pageSize: 10, pageSizes: [10, 20, 50, 100] }"
          :toolbar="{ refresh: true, density: true, columnSetting: true }"
          :actions="leaveActions"
          :action-column="{ width: 110, fixed: 'right' }"
          @load-success="leaveTableEmpty.onLoadSuccess"
          @request-error="leaveTableEmpty.onRequestError"
        >
          <template #empty>
            <ListTableEmpty
              :kind="leaveTableEmpty.kind"
              @reset="resetLeaveSearch"
              @retry="leaveTableEmpty.retry"
            />
          </template>
        </UniDataTable>
      </el-tab-pane>

      <el-tab-pane :label="$t('attendance.holiday.tabReturn')" name="return">
        <UniSearchForm
          v-model="returnQueryModel"
          :config="returnSearchConfig"
          :collapsed="true"
          :collapsed-rows="1"
          :action-min-span="0"
          :submit-text="$t('member.search')"
          :reset-text="$t('member.reset')"
          @search="searchReturn"
          @reset="resetReturnSearch"
        />
        <UniDataTable
          ref="returnTableRef"
          row-key="id"
          :columns="returnColumns"
          :request="loadReturnData"
          :filters="returnFilters"
          :pagination="{ pageSize: 10, pageSizes: [10, 20, 50, 100] }"
          :toolbar="{ refresh: true, density: true, columnSetting: true }"
          :actions="returnActions"
          :action-column="{ width: 60, fixed: 'right' }"
          @load-success="returnTableEmpty.onLoadSuccess"
          @request-error="returnTableEmpty.onRequestError"
        >
          <template #empty>
            <ListTableEmpty
              :kind="returnTableEmpty.kind"
              @reset="resetReturnSearch"
              @retry="returnTableEmpty.retry"
            />
          </template>
        </UniDataTable>
      </el-tab-pane>
    </el-tabs>

    <HolidayFormDrawer v-model:visible="leaveAddVisible" @success="refreshLeaveTable" />

    <DetailDrawer
      v-model:visible="leaveDetailVisible"
      :source="leaveDetailModel"
      :config="leaveDetailConfig"
      :loading="leaveDetailLoading"
    />

    <DetailDrawer
      v-model:visible="returnDetailVisible"
      :source="returnDetailModel"
      :config="returnDetailConfig"
      :loading="returnDetailLoading"
    />
  </section>
</template>

<script setup lang="ts">
import type { UniTableAction, UniTableRequest } from 'uni-ui-lib'
import { UniDataTable, UniSearchForm } from 'uni-ui-lib'
import { ElMessage, ElMessageBox } from 'element-plus'
import { toUniOptions, useUniI18n, useUniListState } from 'uni-ui-lib'
import { computed, nextTick, onMounted, ref, watch } from 'vue'

import { attendanceHolidayApi, membershipApi } from '@/api'
import ListTableEmpty from '@/components/list-table-empty/index.vue'
import { useDialogDetailLoading } from '@/composables/use-dialog-detail-loading'
import { useListTableEmpty } from '@/composables/use-list-table-empty'
import { useTabQuerySync } from '@/composables/use-tab-query-sync'
import type {
  AttendanceHolidayListParams,
  AttendanceHolidayRecord,
  AttendanceHolidayReturnListParams
} from '@/types/modules/attendance-holiday'
import type { SchoolOptionRecord } from '@/types/modules/membership'
import { normalizeEnvelope, normalizePaged } from '@/utils/api-response-normalize'
import { normalizeHolidayListRow, normalizeHolidayReturnRow } from '@/utils/attendance-holiday'
import { dateFormat } from '@/utils/tool'
import DetailDrawer from './components/detail-drawer.vue'
import HolidayFormDrawer from './components/holiday-form-drawer.vue'
import {
  detailForm,
  formatHolidayDetailView,
  returnSearchForm,
  returnTableCols,
  searchForm,
  tableCols,
  type AttendanceHolidayDetailViewModel
} from './list.config'

type Loose = Record<string, unknown>

const HOLIDAY_TABS = ['leave', 'return'] as const
const activeTab = ref<(typeof HOLIDAY_TABS)[number]>('leave')
useTabQuerySync(activeTab, HOLIDAY_TABS)
const schoolRecords = ref<SchoolOptionRecord[]>([])
const leaveAddVisible = ref(false)
const { locale, t } = useUniI18n()

const schoolOptions = computed(() =>
  toUniOptions(schoolRecords.value, {
    labelKeys: locale() === 'en' ? ['enName', 'name'] : ['name', 'cnName', 'enName'],
    valueKey: 'enName'
  })
)

const { detailLoading: leaveDetailLoading, runWithDetailLoading: runLeaveDetailLoading } =
  useDialogDetailLoading()
const leaveInitialFilters: Record<string, unknown> = {
  keyword: '',
  type: undefined,
  studentSchool: undefined,
  scp: undefined,
  beginTime: undefined,
  endTime: undefined
}
const {
  queryModel: leaveQueryModel,
  filters: leaveFilters,
  tableRef: leaveTableRef,
  handleLoadSuccess: handleLeaveLoadSuccess,
  refreshTable: refreshLeaveTable,
  reset: resetLeaveSearch,
  search: searchLeave
} = useUniListState({ initialFilters: leaveInitialFilters })
const leaveSearchConfig = computed(() => searchForm(t, schoolOptions.value))
const leaveColumns = computed(() => tableCols(t))
const leaveDetailConfig = computed(() => detailForm(t))
const leaveDetailVisible = ref(false)
const leaveDetailModel = ref<AttendanceHolidayDetailViewModel | null>(null)

const decorateLeaveRow = (raw: Loose): AttendanceHolidayRecord => {
  const n = normalizeHolidayListRow(raw)
  return {
    ...(n as AttendanceHolidayRecord),
    createdAt: dateFormat(String(n.createdAt ?? ''))
  }
}

const loadLeaveData: UniTableRequest = async ({ pageNo, pageSize, filters: f }) => {
  const params: AttendanceHolidayListParams = {
    current: pageNo,
    size: pageSize,
    ...(f as Record<string, unknown>)
  }
  const raw = await attendanceHolidayApi.holidayPage.get(params)
  const { list, total } = normalizePaged(raw)
  return { data: list.map(decorateLeaveRow), total }
}

const openLeaveDetail = async (row: AttendanceHolidayRecord) => {
  if (row.id == null || row.id === '') {
    return
  }
  leaveDetailVisible.value = true
  leaveDetailModel.value = null
  await runLeaveDetailLoading(async () => {
    const raw = await attendanceHolidayApi.holidayDetail.get(row.id)
    const body = normalizeEnvelope(raw)
    leaveDetailModel.value = formatHolidayDetailView(body, t)
  })
}

const withdrawLeave = (row: AttendanceHolidayRecord) => {
  const procId = row.procId
  const holidayId = row.id
  if (holidayId == null || holidayId === '') {
    ElMessage.warning(t('attendance.holiday.withdrawMissingId'))
    return
  }
  const procSeg =
    procId === undefined || procId === null || procId === ''
      ? 'null'
      : typeof procId === 'number' || typeof procId === 'string'
        ? procId
        : String(procId)
  ElMessageBox.confirm(
    t('attendance.holiday.withdrawConfirm', {
      procId: String(procSeg),
      id: String(holidayId ?? '')
    }),
    t('attendance.tipTitle'),
    {
      type: 'warning',
      confirmButtonText: t('common.submit'),
      cancelButtonText: t('common.cancel')
    }
  )
    .then(async () => {
      try {
        await attendanceHolidayApi.holidayCancelFlow.get(procSeg, holidayId)
        ElMessage.success(t('attendance.holiday.withdrawSuccess'))
        leaveTableRef.value?.refresh()
      } catch {
        ElMessage.error(t('attendance.holiday.withdrawFail'))
      }
    })
    .catch(() => {})
}

const removeLeaveRow = (row: AttendanceHolidayRecord) => {
  if (row.id == null || row.id === '') {
    return
  }
  ElMessageBox.confirm(
    t('attendance.holiday.deleteConfirm', { id: String(row.id) }),
    t('attendance.tipTitle'),
    {
      type: 'warning',
      confirmButtonText: t('common.submit'),
      cancelButtonText: t('common.cancel')
    }
  )
    .then(async () => {
      await attendanceHolidayApi.holidayDelete.remove(row.id)
      ElMessage.success(t('attendance.holiday.deleteSuccess'))
      leaveTableRef.value?.refresh()
    })
    .catch(() => {})
}

const leaveActions = computed<UniTableAction[]>(() => [
  {
    label: t('attendance.holiday.withdraw'),
    visible: (row) => {
      const r = row as Loose
      if (r.dataFrom === 'MB' || r.data_from === 'MB') {
        return false
      }
      const st = (row as AttendanceHolidayRecord).status
      return st === '1100' || st === 1100 || st === '1103' || st === 1103
    },
    onClick: (row) => withdrawLeave(row as AttendanceHolidayRecord)
  },
  {
    label: t('attendance.detail'),
    onClick: (row) => openLeaveDetail(row as AttendanceHolidayRecord)
  },
  {
    label: t('attendance.delete'),
    code: 'holiday-delete',
    visible: (row) => {
      const id = (row as AttendanceHolidayRecord).id
      return id != null && id !== ''
    },
    onClick: (row) => removeLeaveRow(row as AttendanceHolidayRecord)
  }
])

const leaveTableEmpty = useListTableEmpty(leaveFilters, {
  tableRef: leaveTableRef,
  afterLoadSuccess: handleLeaveLoadSuccess
})

const { detailLoading: returnDetailLoading, runWithDetailLoading: runReturnDetailLoading } =
  useDialogDetailLoading()
const returnInitialFilters: Record<string, unknown> = {
  keyword: '',
  studentSchool: undefined
}
const {
  queryModel: returnQueryModel,
  filters: returnFilters,
  tableRef: returnTableRef,
  handleLoadSuccess: handleReturnLoadSuccess,
  reset: resetReturnSearch,
  search: searchReturn
} = useUniListState({ initialFilters: returnInitialFilters })
const returnSearchConfig = computed(() => returnSearchForm(t, schoolOptions.value))
const returnColumns = computed(() => returnTableCols(t))
const returnDetailConfig = computed(() => detailForm(t))
const returnDetailVisible = ref(false)
const returnDetailModel = ref<AttendanceHolidayDetailViewModel | null>(null)

const decorateReturnRow = (raw: Loose): AttendanceHolidayRecord => ({
  ...(raw as AttendanceHolidayRecord),
  createdAt: dateFormat(String(raw.createdAt ?? ''))
})

const loadReturnData: UniTableRequest = async ({ pageNo, pageSize, filters: f }) => {
  const fv = f as Record<string, unknown>
  const params: AttendanceHolidayReturnListParams = {
    current: pageNo,
    size: pageSize,
    keyword: typeof fv.keyword === 'string' ? fv.keyword : undefined,
    studentSchool:
      fv.studentSchool !== undefined && fv.studentSchool !== null && fv.studentSchool !== ''
        ? String(fv.studentSchool)
        : undefined
  }
  const raw = await attendanceHolidayApi.holidayReturnPage.get(params)
  const { list, total } = normalizePaged(raw)
  return {
    data: list.map((row) => decorateReturnRow(normalizeHolidayReturnRow(row))),
    total
  }
}

const openReturnDetail = async (row: AttendanceHolidayRecord) => {
  const r = row as Loose
  const hid = r.holidayId ?? r.holiday_id ?? r.leaveId ?? r.leave_id
  const detailId =
    hid !== undefined && hid !== null && hid !== '' ? (hid as string | number) : row.id
  if (detailId == null || detailId === '') {
    return
  }
  returnDetailVisible.value = true
  returnDetailModel.value = null
  await runReturnDetailLoading(async () => {
    const raw = await attendanceHolidayApi.holidayDetail.get(detailId)
    const body = normalizeEnvelope(raw)
    returnDetailModel.value = formatHolidayDetailView(body, t)
  })
}

const returnActions = computed<UniTableAction[]>(() => [
  {
    label: t('attendance.detail'),
    visible: (row) => {
      const r = row as Loose
      const hid = r.holidayId ?? r.holiday_id ?? r.leaveId ?? r.leave_id
      const id =
        hid !== undefined && hid !== null && hid !== ''
          ? (hid as string | number)
          : (row as AttendanceHolidayRecord).id
      return id != null && id !== ''
    },
    onClick: (row) => openReturnDetail(row as AttendanceHolidayRecord)
  }
])

const returnTableEmpty = useListTableEmpty(returnFilters, {
  tableRef: returnTableRef,
  afterLoadSuccess: handleReturnLoadSuccess
})

onMounted(async () => {
  schoolRecords.value = await membershipApi.school.get()
})

watch(
  () => schoolRecords.value.length,
  (n) => {
    if (n === 0) {
      return
    }
    nextTick(() => {
      leaveTableRef.value?.refresh()
      returnTableRef.value?.refresh()
    })
  }
)
</script>

<style scoped lang="scss">
.attendance-holiday-tab {
  &__tabs {
    margin-top: 8px;
  }
}
</style>
