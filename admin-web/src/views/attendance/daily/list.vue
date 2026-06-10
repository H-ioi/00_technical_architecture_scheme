<template>
  <section class="uni-list-page">
    <div class="uni-list-page__header">
      <div>
        <h1>{{ $t('attendance.daily.pageTitle') }}</h1>
        <p>{{ $t('attendance.daily.pageDesc') }}</p>
      </div>
      <div class="uni-list-page__header-actions">
        <el-button type="primary" @click="exportData">{{ $t('attendance.export') }}</el-button>
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
      @reset="reset"
    />

    <UniDataTable
      ref="tableRef"
      row-key="_key"
      :columns="columns"
      :request="loadData"
      :filters="filters"
      :pagination="{ pageSize: 10, pageSizes: [10, 20, 50, 100] }"
      :toolbar="{ refresh: true, density: true, columnSetting: true }"
      @load-success="tableEmpty.onLoadSuccess"
      @request-error="tableEmpty.onRequestError"
    >
      <template #empty>
        <ListTableEmpty :kind="tableEmpty.kind" @reset="reset" @retry="tableEmpty.retry" />
      </template>
    </UniDataTable>
  </section>
</template>

<script setup lang="ts">
import { dailyStatusOpts, dataFromOpts, searchForm, tableCols, ynOpts } from './list.config'
import { attendanceDailyApi } from '@/api'
import ListTableEmpty from '@/components/list-table-empty/index.vue'
import { useListTableEmpty } from '@/composables/use-list-table-empty'
import type {
  AttendanceDailyListParams,
  AttendanceDailyRecord
} from '@/types/modules/attendance-daily'
import { normalizeArray, normalizePaged } from '@/utils/api-response-normalize'
import { downloadBlob } from '@/utils/download'
import { dateFormat } from '@/utils/tool'
import { ElMessage } from 'element-plus'
import { useUniI18n, toUniOptions, useUniListState } from 'uni-ui-lib'
import type { UniTableRequest } from 'uni-ui-lib'
import { computed, ref } from 'vue'

const { locale, t } = useUniI18n()

type Loose = Record<string, unknown>
/** 对齐旧页 `renderSection`：`MB` 来源展示「第 n 节课」，否则展示 `date2`。 */
const attendanceTimeText = (
  row: Loose,
  tr: (key: string, params?: Record<string, unknown>) => string
) => {
  const df = row.dataFrom
  const d2 = row.date2
  if (df !== 'MB') {
    if (d2 == null || d2 === '') {
      return '-'
    }
    return String(d2)
  }
  if (d2 === '-') {
    return '-'
  }
  if (d2 == null || d2 === '') {
    return '-'
  }
  return tr('attendance.daily.mbLesson', { period: String(d2) })
}

const initialFilters: Record<string, unknown> = {
  schoolName: undefined,
  admissionNo: '',
  busStatus: undefined,
  dormitoryStatus: undefined,
  beginTime: undefined,
  endTime: undefined,
  dataFrom: undefined,
  status: undefined
}

const { queryModel, filters, tableRef, handleLoadSuccess, reset, search } = useUniListState({
  initialFilters
})

const schoolRecords = ref<Loose[]>([])
const schoolOptions = computed(() =>
  toUniOptions(schoolRecords.value, {
    labelKeys: locale() === 'en' ? ['enName', 'name'] : ['name', 'cnName', 'enName'],
    valueKey: 'enName'
  })
)

const ynSearchOptions = computed(() => ynOpts(t))
const dataFromSearchOptions = computed(() => dataFromOpts(t))
const statusSearchOptions = computed(() => dailyStatusOpts(t))

const searchCfg = computed(() =>
  searchForm(
    t,
    schoolOptions.value,
    ynSearchOptions.value,
    dataFromSearchOptions.value,
    statusSearchOptions.value
  )
)

const columns = computed(() => tableCols(t))

const decorateRow = (raw: Loose): AttendanceDailyRecord => {
  const row: AttendanceDailyRecord = { ...(raw as AttendanceDailyRecord) }
  row._key = String(raw.id ?? `${raw.admissionNo ?? ''}-${raw.date ?? ''}-${raw.createdAt ?? ''}`)

  const busN = Number(raw.busStatus)
  const dormN = Number(raw.dormitoryStatus)
  row.busStatusLabel = busN === 1 ? t('attendance.yes') : busN === 0 ? t('attendance.no') : '--'
  row.dormitoryStatusLabel =
    dormN === 1 ? t('attendance.yes') : dormN === 0 ? t('attendance.no') : '--'

  const statusKey = String(raw.status ?? '')
  const statusMap: Record<string, string> = {
    Late: t('attendance.daily.statusLate'),
    Present: t('attendance.daily.statusPresent'),
    Leave: t('attendance.daily.statusLeave'),
    Absent: t('attendance.daily.statusAbsent'),
    Exit: t('attendance.daily.statusExit'),
    Enter: t('attendance.daily.statusEnter')
  }
  row.statusLabel = statusMap[statusKey] || (statusKey ? statusKey : '--')

  const dataFromKey = String(raw.dataFrom ?? '')
  const dataFromMap: Record<string, string> = {
    MB: t('attendance.daily.dataFromMb'),
    schoolBus: t('attendance.daily.dataFromSchoolBus'),
    gate: t('attendance.daily.dataFromGate'),
    community: t('attendance.daily.dataFromCommunity')
  }
  row.dataFromLabel = dataFromMap[dataFromKey] || dataFromKey || '--'

  row.attendanceTimeLabel = attendanceTimeText(raw, t)
  row.createdAt = dateFormat(String(raw.createdAt ?? ''))
  row.form = raw.form != null && raw.form !== '' ? String(raw.form) : '-'
  return row
}

const loadData: UniTableRequest = async ({ pageNo, pageSize, filters: f }) => {
  const flat = f as Record<string, unknown>
  const params: AttendanceDailyListParams = {
    current: pageNo,
    size: pageSize,
    schoolName: flat.schoolName ? String(flat.schoolName) : undefined,
    admissionNo: flat.admissionNo ? String(flat.admissionNo) : undefined,
    busStatus: flat.busStatus as AttendanceDailyListParams['busStatus'],
    dormitoryStatus: flat.dormitoryStatus as AttendanceDailyListParams['dormitoryStatus'],
    beginTime: flat.beginTime ? String(flat.beginTime) : undefined,
    endTime: flat.endTime ? String(flat.endTime) : undefined,
    dataFrom: flat.dataFrom ? String(flat.dataFrom) : undefined,
    status: flat.status ? String(flat.status) : undefined
  }

  const raw = await attendanceDailyApi.dailyPage.get(params)
  const { list, total } = normalizePaged<Loose>(raw)
  return {
    data: list.map(decorateRow),
    total
  }
}

const loadSchools = async () => {
  const payload = await attendanceDailyApi.commonSchoolList.get()
  schoolRecords.value = (normalizeArray(payload) as Loose[]).filter(
    (s) => s.enName != null && s.enName !== ''
  )
}

loadSchools()

const tableEmpty = useListTableEmpty(filters, { tableRef, afterLoadSuccess: handleLoadSuccess })

const exportData = async () => {
  const raw: Record<string, unknown> = { ...filters.value }
  delete raw.size
  delete raw.current
  try {
    const blob = await attendanceDailyApi.dailyExport.get(raw)
    downloadBlob(blob, 'daily-attendance-export.xlsx')
    ElMessage.success(t('attendance.exportStarted'))
  } catch {
    /* request 层已提示 */
  }
}
</script>
