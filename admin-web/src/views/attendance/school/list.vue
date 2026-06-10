<template>
  <section class="uni-list-page">
    <div class="uni-list-page__header">
      <div>
        <h1>{{ $t('attendance.schoolAtt.pageTitle') }}</h1>
        <p>{{ $t('attendance.schoolAtt.pageDesc') }}</p>
      </div>
      <div class="uni-list-page__header-actions">
        <el-button v-uni-permission="'school_attendance_export'" @click="exportData">
          {{ $t('attendance.export') }}
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
      @reset="reset"
    />

    <UniDataTable
      ref="tableRef"
      row-key="id"
      :columns="columns"
      :request="loadData"
      :filters="filters"
      :pagination="{ pageSize: 10, pageSizes: [10, 20, 50, 100] }"
      :toolbar="{ refresh: true, density: true, columnSetting: true }"
      :actions="actions"
      :action-column="{ width: 60, fixed: 'right' }"
      @load-success="tableEmpty.onLoadSuccess"
      @request-error="tableEmpty.onRequestError"
    >
      <template #empty>
        <ListTableEmpty :kind="tableEmpty.kind" @reset="reset" @retry="tableEmpty.retry" />
      </template>
    </UniDataTable>

    <DetailDialog v-model:visible="detailVisible" :source="activeRow" :config="detailConfig" />
  </section>
</template>

<script setup lang="ts">
import { attendanceSchoolStatusOpts } from '../student/list.config'
import DetailDialog from './components/detail-dialog.vue'
import { attendanceOpenTypeOpts, detailForm, searchForm, tableCols } from './list.config'
import { attendanceSchoolApi, membershipApi } from '@/api'
import ListTableEmpty from '@/components/list-table-empty/index.vue'
import { useListTableEmpty } from '@/composables/use-list-table-empty'
import type {
  AttendanceSchoolListParams,
  AttendanceSchoolRecord
} from '@/types/modules/attendance-school'
import type { SchoolOptionRecord } from '@/types/modules/membership'
import { normalizePaged } from '@/utils/api-response-normalize'
import { downloadBlob } from '@/utils/download'
import { dateFormat } from '@/utils/tool'
import { ElMessage } from 'element-plus'
import { useUniI18n, toUniOptions, useUniListState } from 'uni-ui-lib'
import type { UniTableAction, UniTableRequest } from 'uni-ui-lib'
import { computed, ref } from 'vue'

const { locale, t } = useUniI18n()

type Loose = Record<string, unknown>

const initialFilters: Record<string, unknown> = {
  schoolId: undefined,
  deptName: undefined,
  personName: '',
  personCode: '',
  schoolStatus: undefined,
  cardNumber: '',
  entryAcsChannel: '',
  leavingAcsChannel: '',
  beginDate: undefined,
  endDate: undefined
}

const { queryModel, filters, tableRef, handleLoadSuccess, reset, search } = useUniListState({
  initialFilters
})

const schoolRecords = ref<SchoolOptionRecord[]>([])
const schoolOptions = computed(() =>
  toUniOptions(schoolRecords.value, {
    labelKeys: locale() === 'en' ? ['enName', 'name'] : ['name', 'cnName', 'enName'],
    valueKey: 'id'
  })
)

const deptStrings = ref<string[]>([])
const deptOptions = computed(() =>
  toUniOptions(
    deptStrings.value.map((d) => ({ label: d, value: d })),
    { labelKeys: ['label'], valueKey: 'value' }
  )
)

const statusSearchOptions = computed(() => attendanceSchoolStatusOpts(t))
const openTypeSearchOptions = computed(() => attendanceOpenTypeOpts(t))

const searchCfg = computed(() =>
  searchForm(t, schoolOptions.value, deptOptions.value, statusSearchOptions.value)
)

const columns = computed(() => tableCols(t, schoolOptions.value))

const detailConfig = computed(() => detailForm(t, schoolOptions.value))

const detailVisible = ref(false)
const activeRow = ref<AttendanceSchoolRecord | null>(null)

const decorateRow = (raw: Loose): AttendanceSchoolRecord => {
  const entryCh = raw.entryAcsChannel ?? raw.entryAscChannel
  const leavingCh = raw.leavingAcsChannel ?? raw.leavingAscChannel
  const row: AttendanceSchoolRecord = {
    ...(raw as AttendanceSchoolRecord),
    schoolStatus:
      statusSearchOptions.value.find((o) => String(o.value) === String(raw.schoolStatus ?? ''))
        ?.label ?? String(raw.schoolStatus ?? '--'),
    entryOpenType:
      openTypeSearchOptions.value.find((o) => String(o.value) === String(raw.entryOpenType ?? ''))
        ?.label ?? String(raw.entryOpenType ?? '--'),
    leavingOpenType:
      openTypeSearchOptions.value.find((o) => String(o.value) === String(raw.leavingOpenType ?? ''))
        ?.label ?? String(raw.leavingOpenType ?? '--'),
    entryTime: dateFormat(String(raw.entryTime ?? '')),
    leavingTime: dateFormat(String(raw.leavingTime ?? '')),
    attendanceDate: dateFormat(String(raw.attendanceDate ?? ''), 'yyyy-MM-dd'),
    createdAt: dateFormat(String(raw.createdAt ?? '')),
    entryAcsChannel: entryCh != null ? String(entryCh) : '',
    leavingAcsChannel: leavingCh != null ? String(leavingCh) : ''
  }
  return row
}

const loadData: UniTableRequest = async ({ pageNo, pageSize, filters: f }) => {
  const params: AttendanceSchoolListParams = {
    current: pageNo,
    size: pageSize,
    ...(f as Record<string, unknown>)
  }
  const raw = await attendanceSchoolApi.schoolPage.get(params)
  const { list, total } = normalizePaged<Loose>(raw)
  return {
    data: list.map(decorateRow),
    total
  }
}

const actions = computed<UniTableAction[]>(() => [
  {
    label: t('attendance.detail'),
    onClick: (row) => {
      activeRow.value = row as AttendanceSchoolRecord
      detailVisible.value = true
    }
  }
])

const loadOpts = async () => {
  const [schools, depts] = await Promise.all([
    membershipApi.school.get(),
    attendanceSchoolApi.departmentList.get()
  ])
  schoolRecords.value = schools
  deptStrings.value = Array.isArray(depts) ? depts : []
}

loadOpts()

const tableEmpty = useListTableEmpty(filters, { tableRef, afterLoadSuccess: handleLoadSuccess })

const exportData = async () => {
  const raw: Record<string, unknown> = { ...filters.value }
  delete raw.size
  delete raw.current
  try {
    const blob = await attendanceSchoolApi.schoolExport.get(raw)
    downloadBlob(blob, 'school-attendance-export.xlsx')
    ElMessage.success(t('attendance.exportStarted'))
  } catch {
    /* request 层已提示 */
  }
}
</script>
