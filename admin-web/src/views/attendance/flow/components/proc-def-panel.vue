<template>
  <div class="holiday-proc-def">
    <UniDataTable
      ref="tableRef"
      row-key="id"
      :columns="columns"
      :request="loadData"
      :filters="filters"
      :pagination="{ pageSize: 10, pageSizes: [10, 20, 50, 100] }"
      :toolbar="{ refresh: true, density: true, columnSetting: true }"
      :actions="actions"
      :action-column="{ width: 240, fixed: 'right' }"
      @load-success="handleLoadSuccess" />

    <el-dialog v-model="imgVisible" :title="$t('attendance.holidayTask.flowChart')" width="80%" destroy-on-close>
      <img v-if="flowImg" :src="flowImg" alt="" style="max-width: 100%; height: auto" />
    </el-dialog>

    <el-dialog v-model="assignVisible" :title="$t('attendance.holidayFlow.procDef.setAssignee')" width="520px" destroy-on-close>
      <el-form label-width="120px">
        <el-form-item v-for="item in assignFields" :key="item.key" :label="item.name">
          <el-select
            v-if="item.type === 'assignee'"
            v-model="item.value"
            filterable
            clearable
            style="width: 100%">
            <el-option v-for="u in assignUsers" :key="u.username" :label="u.username" :value="u.username" />
          </el-select>
          <el-select
            v-else-if="item.type === 'candidateUsers'"
            v-model="item.value"
            filterable
            clearable
            style="width: 100%">
            <el-option
              v-for="u in assignUsers"
              :key="u.userId"
              :label="`${u.nickname}[${u.username}]`"
              :value="u.userId" />
          </el-select>
          <el-select
            v-else-if="item.type === 'group'"
            v-model="item.value"
            multiple
            filterable
            clearable
            style="width: 100%">
            <el-option v-for="u in assignUsers" :key="u.username" :label="u.username" :value="u.username" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="submitAssign">{{ $t('common.submit') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import type { UniTableAction, UniTableColumn, UniTableRequest } from 'uni-ui-lib'
import { UniDataTable, useUniI18n, useUniListState } from 'uni-ui-lib'
import { ElMessage, ElMessageBox } from 'element-plus'
import { computed, ref } from 'vue'

import { attendanceHolidayApi } from '@/api'
import { normalizeEnvelope, normalizePaged } from '@/utils/api-response-normalize'

type Loose = Record<string, unknown>

type AssignField = { name: string; key: string; type: string; value: unknown }

const { t } = useUniI18n()

const { filters, tableRef, handleLoadSuccess } = useUniListState({
  initialFilters: {}
})

const imgVisible = ref(false)
const flowImg = ref('')
const assignVisible = ref(false)
const assignFields = ref<AssignField[]>([])
const assignUsers = ref<Loose[]>([])
const currentFlowId = ref<string | number>('')
const currentTenantId = ref('')

const columns = computed<UniTableColumn[]>(() => [
  { prop: 'id', label: t('attendance.holidayFlow.procDef.colDefId'), type: 'text', width: 100 },
  {
    prop: 'deploymentName',
    label: t('attendance.holidayFlow.flowDef.colName'),
    type: 'text',
    minWidth: 140,
    showOverflowTooltip: true
  },
  { prop: 'flowKey', label: t('attendance.holidayFlow.flowDef.colKey'), type: 'text', minWidth: 120 },
  {
    prop: 'tenantSchool',
    label: t('attendance.holiday.columns.school'),
    type: 'text',
    minWidth: 120,
    formatter: (row) => {
      const tid = String((row as Loose).tenantId ?? '')
      const p = tid.split('#')
      return p[0] || tid || '—'
    }
  },
  {
    prop: 'tenantType',
    label: t('attendance.holidayFlow.procDef.colType'),
    type: 'text',
    width: 88,
    formatter: (row) => {
      const tid = String((row as Loose).tenantId ?? '')
      const p = tid.split('#')
      const code = p[1]
      if (code === '101') {
        return t('attendance.holiday.options.leavePersonal')
      }
      if (code === '102') {
        return t('attendance.holiday.options.leaveSick')
      }
      return code || '—'
    }
  },
  {
    prop: 'tenantLeave',
    label: t('attendance.holidayFlow.procDef.colLeaveLabel'),
    type: 'text',
    minWidth: 80,
    formatter: (row) => {
      const tid = String((row as Loose).tenantId ?? '')
      const p = tid.split('#')
      return p[2] || '—'
    }
  },
  { prop: 'deploymentId', label: t('attendance.holidayFlow.procDef.colDeploymentId'), type: 'text', minWidth: 120 },
  { prop: 'deploymentDate', label: t('attendance.holidayFlow.procDef.colDeployedAt'), type: 'datetime', minWidth: 160 },
  { prop: 'version', label: t('attendance.holidayFlow.procDef.colVersion'), type: 'text', width: 88 }
])

const loadData: UniTableRequest = async ({ pageNo, pageSize }) => {
  const raw = await attendanceHolidayApi.procDefList.get({
    page: pageNo,
    limit: pageSize
  })
  const { list, total } = normalizePaged<Loose>(raw)
  return { data: list, total }
}

const showFlowImg = async (id: string | number) => {
  const blob = await attendanceHolidayApi.flowProcessImgDownload.getBlob(id)
  flowImg.value = URL.createObjectURL(blob)
  imgVisible.value = true
}

const openAssign = async (id: string | number, tenantId: string) => {
  currentFlowId.value = id
  currentTenantId.value = tenantId
  const raw = await attendanceHolidayApi.flowDeployDefGet.get(id)
  const body = normalizeEnvelope(raw)
  const fields = (body.data ?? body.form ?? []) as AssignField[]
  assignFields.value = Array.isArray(fields)
    ? fields.map((f) => ({ ...f, value: f.value ?? (f.type === 'group' ? [] : '') }))
    : []
  assignUsers.value = (body.users as Loose[]) ?? []
  assignVisible.value = true
}

const submitAssign = async () => {
  const variable: Loose = {}
  for (const item of assignFields.value) {
    variable[item.key] = item.value
  }
  variable.id = currentFlowId.value
  await attendanceHolidayApi.flowVariableSet.post({
    id: currentFlowId.value,
    school: currentTenantId.value,
    variable
  })
  ElMessage.success(t('attendance.holidayFlow.procDef.assignOk'))
  assignVisible.value = false
}

const deleteRow = (row: Loose) => {
  const deploymentId = row.deploymentId
  if (deploymentId == null || deploymentId === '') {
    return
  }
  ElMessageBox.confirm(t('attendance.holidayFlow.procDef.deleteConfirm'), t('attendance.holiday.messages.withdrawPrompt'), {
    type: 'warning',
    confirmButtonText: t('common.submit'),
    cancelButtonText: t('common.cancel')
  })
    .then(async () => {
      await attendanceHolidayApi.flowDeployDelete.remove(deploymentId as string | number)
      ElMessage.success(t('attendance.holiday.messages.deleteSuccess'))
      tableRef.value?.refresh()
    })
    .catch(() => {})
}

const actions = computed<UniTableAction[]>(() => [
  {
    label: t('attendance.holidayFlow.procDef.viewImg'),
    onClick: (row) => showFlowImg((row as Loose).id as string | number)
  },
  {
    label: t('attendance.holidayFlow.procDef.setAssignee'),
    onClick: (row) =>
      openAssign((row as Loose).id as string | number, String((row as Loose).tenantId ?? ''))
  },
  {
    label: t('attendance.holiday.actions.delete'),
    onClick: (row) => deleteRow(row as Loose)
  }
])
</script>

<style scoped lang="scss">
.holiday-proc-def {
  margin-top: 8px;
}
</style>
