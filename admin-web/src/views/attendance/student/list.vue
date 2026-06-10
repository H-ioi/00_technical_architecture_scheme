<template>
  <section class="uni-list-page">
    <div class="uni-list-page__header">
      <div>
        <h1>{{ $t('attendance.student.pageTitle') }}</h1>
        <p>{{ $t('attendance.student.pageDesc') }}</p>
      </div>
      <div class="uni-list-page__header-actions">
        <el-button v-uni-permission="'student_attendance_export'" @click="exportData">
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
import DetailDialog from './components/detail-dialog.vue'
import {
  attendanceSchoolStatusOpts,
  detailForm,
  searchForm,
  tableCols,
  ynOpts
} from './list.config'
import { attendanceStudentApi, membershipApi } from '@/api'
import ListTableEmpty from '@/components/list-table-empty/index.vue'
import { useListTableEmpty } from '@/composables/use-list-table-empty'
import type {
  AttendanceStudentListParams,
  AttendanceStudentRecord
} from '@/types/modules/attendance-student'
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
  admissionNo: '',
  grade: undefined,
  onBoarding: undefined,
  onBus: undefined,
  schoolStatus: undefined,
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

const gradeStrings = ref<string[]>([])
const gradeOptions = computed(() =>
  toUniOptions(
    gradeStrings.value.map((g) => ({ label: g, value: g })),
    { labelKeys: ['label'], valueKey: 'value' }
  )
)

const ynSearchOptions = computed(() => ynOpts(t))
const statusSearchOptions = computed(() => attendanceSchoolStatusOpts(t))

const searchCfg = computed(() =>
  searchForm(
    t,
    schoolOptions.value,
    gradeOptions.value,
    ynSearchOptions.value,
    statusSearchOptions.value
  )
)

const columns = computed(() => tableCols(t, schoolOptions.value))

const detailConfig = computed(() => detailForm(t, schoolOptions.value))

const detailVisible = ref(false)
const activeRow = ref<AttendanceStudentRecord | null>(null)

const decorateRow = (raw: Loose): AttendanceStudentRecord => {
  const boardingStr = String(raw.boarding ?? '')
  const schoolBusStr = String(raw.schoolBus ?? '')
  const statusHit = statusSearchOptions.value.find(
    (o) => String(o.value) === String(raw.schoolStatus ?? '')
  )
  const row: AttendanceStudentRecord = {
    ...(raw as AttendanceStudentRecord),
    boarding:
      boardingStr === '1' ? t('attendance.yes') : boardingStr === '0' ? t('attendance.no') : '--',
    schoolBus:
      schoolBusStr === '1' ? t('attendance.yes') : schoolBusStr === '0' ? t('attendance.no') : '--',
    schoolStatus: statusHit?.label ?? String(raw.schoolStatus ?? '--'),
    attendanceDate: dateFormat(String(raw.attendanceDate ?? ''), 'yyyy-MM-dd'),
    entryTime: dateFormat(String(raw.entryTime ?? '')),
    leavingTime: dateFormat(String(raw.leavingTime ?? '')),
    updatedAt: dateFormat(String(raw.updatedAt ?? '')),
    createdAt: dateFormat(String(raw.createdAt ?? ''))
  }
  return row
}

const loadData: UniTableRequest = async ({ pageNo, pageSize, filters: f }) => {
  const params: AttendanceStudentListParams = {
    current: pageNo,
    size: pageSize,
    ...(f as Record<string, unknown>)
  }
  const raw = await attendanceStudentApi.studentPage.get(params)
  const { list, total } = normalizePaged<Loose>(raw)
  return {
    data: list.map(decorateRow),
    total
  }
}

/** 旧页「查看」未绑定权限码，全员可见。 */
const actions = computed<UniTableAction[]>(() => [
  {
    label: t('attendance.detail'),
    onClick: (row) => {
      activeRow.value = row as AttendanceStudentRecord
      detailVisible.value = true
    }
  }
])

const loadOpts = async () => {
  const [schools, grades] = await Promise.all([
    membershipApi.school.get(),
    attendanceStudentApi.gradeList.get()
  ])
  schoolRecords.value = schools
  gradeStrings.value = Array.isArray(grades) ? grades : []
}

loadOpts()

const tableEmpty = useListTableEmpty(filters, { tableRef, afterLoadSuccess: handleLoadSuccess })

const exportData = async () => {
  const raw: Record<string, unknown> = { ...filters.value }
  delete raw.size
  delete raw.current
  try {
    const blob = await attendanceStudentApi.studentExport.get(raw)
    downloadBlob(blob, 'student-attendance-export.xlsx')
    ElMessage.success(t('attendance.exportStarted'))
  } catch {
    /* request 层已提示 */
  }
}
</script>
