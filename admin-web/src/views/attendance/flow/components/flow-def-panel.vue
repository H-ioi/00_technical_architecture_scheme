<template>
  <div>
    <UniSearchForm
      v-model="queryModel"
      :config="searchCfg"
      :collapsed="true"
      :collapsed-rows="1"
      :action-min-span="0"
      :submit-text="$t('member.actions.search')"
      :reset-text="$t('member.actions.reset')"
      @search="search"
      @reset="reset" />
    <UniDataTable
      ref="tableRef"
      row-key="id"
      :columns="columns"
      :request="loadData"
      :filters="filters"
      :pagination="{ pageSize: 10, pageSizes: [10, 20, 50, 100] }"
      :toolbar="{ refresh: true, density: true, columnSetting: true }"
      :actions="actions"
      :action-column="{ width: 160, fixed: 'right' }"
      @load-success="handleLoadSuccess" />
  </div>
</template>

<script setup lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus'
import type { UniFormConfig, UniTableAction, UniTableColumn, UniTableRequest } from 'uni-ui-lib'
import { UniDataTable, UniSearchForm, useUniI18n, useUniListState } from 'uni-ui-lib'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

import { attendanceHolidayApi } from '@/api'
import { normalizePaged } from '@/utils/api-response-normalize'

type Loose = Record<string, unknown>

const { t } = useUniI18n()
const router = useRouter()

const { queryModel, filters, tableRef, handleLoadSuccess, reset, search } = useUniListState({
  initialFilters: { key: '' }
})

const searchCfg = computed<UniFormConfig>(() => ({
  schema: [
    {
      field: 'key',
      label: '',
      component: 'ElInput',
      componentProps: {
        clearable: true,
        placeholder: t('attendance.holidayFlow.flowDef.searchKey')
      },
      colProps: { span: 8 }
    }
  ]
}))

const columns = computed<UniTableColumn[]>(() => [
  {
    prop: 'id',
    label: t('attendance.holidayFlow.flowDef.colId'),
    type: 'text',
    width: 72,
    fixed: 'left'
  },
  {
    prop: 'name',
    label: t('attendance.holidayFlow.flowDef.colName'),
    type: 'text',
    minWidth: 130,
    showOverflowTooltip: true
  },
  {
    prop: 'modelKey',
    label: t('attendance.holidayFlow.flowDef.colKey'),
    type: 'text',
    minWidth: 180
  },
  {
    prop: 'leaveType',
    label: t('attendance.holidayFlow.flowDef.colLeaveType'),
    type: 'text',
    minWidth: 100,
    formatter: (row) => {
      const v = String((row as Loose).leaveType ?? '')
      if (v === '101') {
        return t('attendance.holiday.options.leavePersonal')
      }
      if (v === '102') {
        return t('attendance.holiday.options.leaveSick')
      }
      return v || '—'
    }
  },
  { prop: 'school', label: t('attendance.holiday.columns.school'), type: 'text', minWidth: 220 },
  {
    prop: 'needApproval',
    label: t('attendance.holidayFlow.flowDef.needApproval'),
    type: 'text',
    minWidth: 100,
    options: [
      { label: t('attendance.holiday.options.yes'), value: '101' },
      { label: t('attendance.holiday.options.no'), value: '102' }
    ]
  },
  {
    prop: 'createdBy',
    label: t('attendance.holidayFlow.flowDef.creator'),
    type: 'text',
    minWidth: 128
  },
  {
    prop: 'created',
    label: t('attendance.holiday.columns.createdAt'),
    type: 'datetime',
    minWidth: 160
  }
])

const loadData: UniTableRequest = async ({ pageNo, pageSize, filters: f }) => {
  const raw = await attendanceHolidayApi.flowDefList.get({
    page: pageNo,
    limit: pageSize,
    key: String((f as Loose).key ?? '')
  })
  const { list, total } = normalizePaged<Loose>(raw)
  return { data: list, total }
}

const goDesign = (id?: string | number) => {
  if (id == null || id === '') {
    void router.push({ name: 'AttendanceHolidayFlowDesignCreate' })
  } else {
    void router.push({ name: 'AttendanceHolidayFlowDesignEdit', params: { id: String(id) } })
  }
}

const deploy = (row: Loose) => {
  const id = row.id
  if (id == null || id === '') {
    return
  }
  ElMessageBox.confirm(
    t('attendance.holidayFlow.flowDef.deployConfirm', { id: String(id) }),
    t('attendance.holiday.messages.withdrawPrompt'),
    {
      type: 'warning',
      confirmButtonText: t('common.submit'),
      cancelButtonText: t('common.cancel')
    }
  )
    .then(async () => {
      await attendanceHolidayApi.flowDeploy.get(id)
      ElMessage.success(t('attendance.holidayFlow.flowDef.deployOk'))
      tableRef.value?.refresh()
    })
    .catch(() => {})
}

const removeRow = (row: Loose) => {
  const id = row.id
  if (id == null || id === '') {
    return
  }
  ElMessageBox.confirm(
    t('attendance.holidayFlow.flowDef.deleteConfirm', { id: String(id) }),
    t('attendance.holiday.messages.withdrawPrompt'),
    {
      type: 'warning',
      confirmButtonText: t('common.submit'),
      cancelButtonText: t('common.cancel')
    }
  )
    .then(async () => {
      await attendanceHolidayApi.flowDefDelete.remove(id)
      ElMessage.success(t('attendance.holiday.messages.deleteSuccess'))
      tableRef.value?.refresh()
    })
    .catch(() => {})
}

const actions = computed<UniTableAction[]>(() => [
  {
    label: t('attendance.holidayConfig.actions.edit'),
    onClick: (row) => goDesign((row as Loose).id)
  },
  { label: t('attendance.holiday.actions.delete'), onClick: (row) => removeRow(row as Loose) },
  { label: t('attendance.holidayFlow.flowDef.deploy'), onClick: (row) => deploy(row as Loose) }
])
</script>
