<template>
  <div>
    <UniDataTable
      ref="tableRef"
      row-key="flowProceId"
      :columns="columns"
      :request="loadData"
      :filters="filters"
      :pagination="{ pageSize: 10, pageSizes: [10, 20, 50, 100] }"
      :toolbar="{ refresh: true, density: true, columnSetting: true }"
      :actions="actions"
      :action-column="{ width: 110, fixed: 'right' }"
      @load-success="tableEmpty.onLoadSuccess"
      @request-error="tableEmpty.onRequestError">
      <template #empty>
        <ListTableEmpty
          :kind="tableEmpty.kind"
          @reset="tableEmpty.retry"
          @retry="tableEmpty.retry" />
      </template>
    </UniDataTable>

    <el-dialog
      v-model="traceVisible"
      :title="$t('attendance.holidayTask.flowChart')"
      width="80%"
      destroy-on-close>
      <img v-if="flowImg" :src="flowImg" alt="" style="max-width: 100%" />
      <el-steps direction="vertical" style="margin-top: 16px">
        <el-step
          v-for="item in hiTasks"
          :key="String(item.id)"
          :title="`${item.taskNodeName ?? ''} ${item.assigneeName ?? ''} ${item.startTime ?? ''}`"
          :description="String(item.remark ?? '')" />
      </el-steps>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import type {
  UniTableAction,
  UniTableColumn,
  UniTableRequest,
  UniTableRequestResult
} from 'uni-ui-lib'
import { UniDataTable, useUniI18n, useUniListState } from 'uni-ui-lib'
import { computed, ref } from 'vue'

import ListTableEmpty from '@/components/list-table-empty.vue'
import { useListTableEmpty } from '@/composables/use-list-table-empty'
import { attendanceHolidayApi } from '@/api'
import { normalizePaged } from '@/utils/api-response-normalize'

type Loose = Record<string, unknown>

const props = defineProps<{
  variant: 'done' | 'instance'
}>()

const { t } = useUniI18n()

const { filters, tableRef, handleLoadSuccess } = useUniListState({ initialFilters: {} })

const tableEmpty = useListTableEmpty(filters, { tableRef, afterLoadSuccess: handleLoadSuccess })

const traceVisible = ref(false)
const flowImg = ref('')
const hiTasks = ref<Loose[]>([])

const columns = computed<UniTableColumn[]>(() => {
  const base: UniTableColumn[] = [
    {
      prop: 'flowDefId',
      label: t('attendance.holidayTask.colFlowDefId'),
      type: 'text',
      minWidth: 120
    },
    {
      prop: 'flowDefName',
      label: t('attendance.holidayTask.colProcName'),
      type: 'text',
      minWidth: 120,
      showOverflowTooltip: true
    }
  ]
  if (props.variant === 'done') {
    base.push({
      prop: 'userName',
      label: t('attendance.holidayTask.colStarter'),
      type: 'text',
      minWidth: 100
    })
  }
  base.push(
    { prop: 'studentSchool', label: t('attendance.school'), type: 'text', minWidth: 120 },
    { prop: 'studentName', label: t('attendance.studentName'), type: 'text', minWidth: 100 },
    {
      prop: 'startDate',
      label: t('attendance.holidayTask.colStartTime'),
      type: 'text',
      minWidth: 140
    },
    { prop: 'endDate', label: t('attendance.holidayTask.colEndTime'), type: 'text', minWidth: 140 },
    {
      prop: 'flowProceId',
      label: t('attendance.holidayTask.colInstanceId'),
      type: 'text',
      minWidth: 140
    }
  )
  return base
})

const loadData: UniTableRequest = async ({ pageNo, pageSize }) => {
  const api =
    props.variant === 'done'
      ? attendanceHolidayApi.flowMyComplete
      : attendanceHolidayApi.flowMyStart
  const raw = await api.get({ page: pageNo, limit: pageSize })
  const { list, total } = normalizePaged<Loose>(raw)
  return { data: list, total }
}

const openTrace = async (row: Loose) => {
  const pid = String(row.flowProceId ?? '')
  if (!pid) {
    return
  }
  const rawList = await attendanceHolidayApi.flowHiTaskInstance.get(pid)
  hiTasks.value = Array.isArray(rawList)
    ? (rawList as Loose[])
    : Array.isArray((rawList as Loose).data)
      ? ((rawList as Loose).data as Loose[])
      : []
  const blob = await attendanceHolidayApi.flowActiveImgDownload.getBlob(pid)
  flowImg.value = URL.createObjectURL(blob)
  traceVisible.value = true
}

const actions = computed<UniTableAction[]>(() => [
  { label: t('attendance.holidayTask.trace'), onClick: (row) => openTrace(row as Loose) }
])
</script>
