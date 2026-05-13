<template>
  <div>
    <UniDataTable
      ref="tableRef"
      row-key="taskId"
      :columns="columns"
      :request="loadData"
      :filters="filters"
      :pagination="{ pageSize: 10, pageSizes: [10, 20, 50, 100] }"
      :toolbar="{ refresh: true, density: true, columnSetting: true }"
      :actions="actions"
      :action-column="{ width: 200, fixed: 'right' }"
      @load-success="handleLoadSuccess" />

    <el-dialog v-model="approveVisible" :title="$t('attendance.holidayTask.approveTitle')" width="640px" destroy-on-close>
      <div class="holiday-task-approve__grid">
        <p><strong>{{ $t('attendance.holiday.columns.studentName') }}：</strong>{{ formData.studentName || formData.name || '—' }}</p>
        <p><strong>{{ $t('attendance.holiday.columns.admissionNo') }}：</strong>{{ formData.admissonNo || '—' }}</p>
        <p><strong>{{ $t('attendance.holiday.columns.school') }}：</strong>{{ formData.studentSchool || '—' }}</p>
        <p><strong>{{ $t('attendance.holiday.columns.grade') }}：</strong>{{ formData.studentGrade || '—' }}</p>
        <p><strong>{{ $t('attendance.holiday.columns.className') }}：</strong>{{ formData.studentClass || '—' }}</p>
        <p>
          <strong>{{ $t('attendance.holiday.detail.beginTime') }}：</strong
          >{{ formData.beginTime ? `${formData.beginTime} ${$t('attendance.holidayTask.to')} ${formData.endTime}` : '—' }}
        </p>
        <p class="holiday-task-approve__full"><strong>{{ $t('attendance.holiday.columns.reason') }}：</strong>{{ formData.reason || '—' }}</p>
        <div v-if="taskName === '护士审批'" class="holiday-task-approve__full">
          <span class="required">{{ $t('attendance.holiday.columns.infectious') }}</span>
          <el-radio-group v-model="formData.isInfectious">
            <el-radio label="101">{{ $t('attendance.holiday.options.yes') }}</el-radio>
            <el-radio label="102">{{ $t('attendance.holiday.options.no') }}</el-radio>
          </el-radio-group>
        </div>
        <div v-if="taskName === '护士审批' && formData.isInfectious === '101'" class="holiday-task-approve__full">
          <span>{{ $t('attendance.holidayTask.extendTime') }}</span>
          <el-date-picker
            v-model="formData.dateRange"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm"
            format="YYYY-MM-DD HH:mm"
            style="width: 100%" />
        </div>
        <el-input v-model="formData.remark" type="textarea" :rows="3" :placeholder="$t('attendance.holiday.detail.beginTime')" />
      </div>
      <template #footer>
        <el-button @click="approveVisible = false">{{ $t('common.cancel') }}</el-button>
        <el-button type="danger" :loading="submitting" @click="reject">{{ $t('attendance.holidayTask.reject') }}</el-button>
        <el-button type="primary" :loading="submitting" @click="approve">{{ $t('attendance.holidayTask.approve') }}</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="traceVisible" :title="$t('attendance.holidayTask.flowChart')" width="80%" destroy-on-close>
      <img v-if="flowImg" :src="flowImg" alt="" style="max-width: 100%" />
      <el-steps direction="vertical" style="margin-top: 16px">
        <el-step
          v-for="item in hiTasks"
          :key="item.id"
          :title="`${item.taskNodeName} ${item.assigneeName ?? ''} ${item.startTime ?? ''}`"
          :description="item.remark"
          :status="item.status" />
      </el-steps>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import type { UniTableAction, UniTableColumn, UniTableRequest } from 'uni-ui-lib'
import { UniDataTable, useUniI18n, useUniListState } from 'uni-ui-lib'
import { ElMessage } from 'element-plus'
import { computed, reactive, ref } from 'vue'

import { attendanceHolidayApi } from '@/api'

type Loose = Record<string, unknown>

const unwrapTaskPage = (payload: unknown): { list: Loose[]; total: number } => {
  if (!payload || typeof payload !== 'object') {
    return { list: [], total: 0 }
  }
  const r = payload as Loose
  if (Array.isArray(r.list)) {
    return { list: r.list as Loose[], total: Number(r.totalCount) || 0 }
  }
  const inner = r.data as Loose
  if (inner && typeof inner === 'object' && Array.isArray(inner.list)) {
    return { list: inner.list as Loose[], total: Number(inner.totalCount ?? r.totalCount) || 0 }
  }
  return { list: [], total: 0 }
}

const unwrapForm = (raw: unknown): Loose => {
  if (!raw || typeof raw !== 'object') {
    return {}
  }
  const r = raw as Loose
  const inner = r.data
  return inner && typeof inner === 'object' && !Array.isArray(inner) ? (inner as Loose) : r
}

const { t } = useUniI18n()

const { filters, tableRef, handleLoadSuccess } = useUniListState({ initialFilters: {} })

const approveVisible = ref(false)
const traceVisible = ref(false)
const flowImg = ref('')
const hiTasks = ref<Loose[]>([])
const submitting = ref(false)
const taskName = ref('')
const procInsId = ref('')
const taskId = ref('')

const formData = reactive<Loose>({
  remark: '',
  isInfectious: '102',
  dateRange: ''
})

const columns = computed<UniTableColumn[]>(() => [
  { prop: 'taskId', label: t('attendance.holidayTask.colTaskId'), type: 'text', minWidth: 120 },
  { prop: 'taskName', label: t('attendance.holidayTask.colTaskName'), type: 'text', minWidth: 120, showOverflowTooltip: true },
  { prop: 'procDefName', label: t('attendance.holidayTask.colProcName'), type: 'text', minWidth: 120, showOverflowTooltip: true },
  { prop: 'startUserName', label: t('attendance.holidayTask.colStarter'), type: 'text', minWidth: 100 },
  { prop: 'studentSchool', label: t('attendance.holiday.columns.school'), type: 'text', minWidth: 120 },
  { prop: 'studentName', label: t('attendance.holiday.columns.studentName'), type: 'text', minWidth: 100 },
  { prop: 'startTime', label: t('attendance.holidayTask.colStartTime'), type: 'datetime', minWidth: 160 },
  { prop: 'assigneeName', label: t('attendance.holidayTask.colAssignee'), type: 'text', minWidth: 100 }
])

const loadData: UniTableRequest = async ({ pageNo, pageSize }) => {
  const raw = await attendanceHolidayApi.flowMyTodo.get({ page: pageNo, limit: pageSize })
  const { list, total } = unwrapTaskPage(raw)
  return { data: list, total }
}

const openApprove = async (row: Loose) => {
  procInsId.value = String(row.procInsId ?? '')
  taskId.value = String(row.taskId ?? '')
  taskName.value = String(row.taskName ?? '')
  const raw = await attendanceHolidayApi.flowFormByProcess.get({ processId: procInsId.value })
  const data = unwrapForm(raw)
  Object.keys(formData).forEach((k) => delete (formData as Loose)[k])
  Object.assign(formData, data)
  formData.remark = ''
  formData.isInfectious = taskName.value === '护士审批' ? '102' : formData.isInfectious
  formData.dateRange = ''
  approveVisible.value = true
}

const approve = async () => {
  submitting.value = true
  try {
    const body: Loose = {
      id: taskId.value,
      procInsId: procInsId.value,
      processId: procInsId.value,
      remark: formData.remark || t('attendance.holidayTask.defaultApproveRemark'),
      isInfectious: formData.isInfectious
    }
    if (formData.dateRange && formData.isInfectious === '101') {
      body.endTime = formData.dateRange
    }
    await attendanceHolidayApi.flowCompleteTask.post(body)
    ElMessage.success(t('attendance.holiday.messages.withdrawSuccess'))
    approveVisible.value = false
    tableRef.value?.refresh()
  } finally {
    submitting.value = false
  }
}

const reject = async () => {
  submitting.value = true
  try {
    await attendanceHolidayApi.flowRejectTask.post({ processInstanceId: procInsId.value })
    ElMessage.success(t('attendance.holidayTask.rejectOk'))
    approveVisible.value = false
    tableRef.value?.refresh()
  } finally {
    submitting.value = false
  }
}

const openTrace = async (row: Loose) => {
  const pid = String(row.procInsId ?? row.flowProceId ?? '')
  if (!pid) {
    return
  }
  const rawList = await attendanceHolidayApi.flowHiTaskInstance.get(pid)
  if (Array.isArray(rawList)) {
    hiTasks.value = rawList as Loose[]
  } else if (rawList && typeof rawList === 'object') {
    const inner = (rawList as Loose).data
    hiTasks.value = Array.isArray(inner) ? (inner as Loose[]) : []
  } else {
    hiTasks.value = []
  }
  const blob = await attendanceHolidayApi.flowActiveImgDownload.getBlob(pid)
  flowImg.value = URL.createObjectURL(blob)
  traceVisible.value = true
}

const actions = computed<UniTableAction[]>(() => [
  {
    label: t('attendance.holidayTask.approve'),
    visible: (row) => (row as Loose).assigneeName != null,
    onClick: (row) => openApprove(row as Loose)
  },
  { label: t('attendance.holidayTask.trace'), onClick: (row) => openTrace(row as Loose) }
])
</script>

<style scoped lang="scss">
.holiday-task-approve__grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 14px;
}
.holiday-task-approve__full {
  width: 100%;
}
.required::before {
  content: '*';
  color: var(--el-color-danger);
  margin-right: 4px;
}
</style>
