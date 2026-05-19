<template>
  <section class="activity-vote-info-tab">
    <UniSearchForm
      v-model="queryModel"
      :config="searchCfg"
      :collapsed="true"
      :collapsed-rows="1"
      :action-min-span="0"
      :submit-text="$t('activity.search')"
      :reset-text="$t('activity.reset')"
      @search="search"
      @reset="reset"
    />
    <UniDataTable
      ref="tableRef"
      row-key="id"
      :selection="readOnly || !canDelete ? false : 'multiple'"
      :columns="columns"
      :request="loadData"
      :filters="filters"
      :pagination="{ pageSize: 10, pageSizes: [10, 20, 50, 100] }"
      :toolbar="{ refresh: true, columnSetting: true }"
      :actions="[]"
      @load-success="handleLoadSuccess"
      @selection-change="onSelectionChange"
    >
      <template v-if="!readOnly && canDelete" #toolbar>
        <el-button
          type="danger"
          plain
          :disabled="!selectedIds.length"
          @click="deleteSelected"
        >
          {{ $t('activity.delBatch') }}
        </el-button>
      </template>
    </UniDataTable>

    <el-dialog
      v-model="dialogVisible"
      :title="$t('activity.voteRecordAddTitle')"
      width="560px"
      append-to-body
      destroy-on-close
      :close-on-click-modal="false"
      @closed="resetDialog"
    >
      <UniForm ref="formRef" v-model="formModel" mode="edit" :config="formCfg" />
      <template #footer>
        <el-button @click="dialogVisible = false">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" :loading="saving" @click="submit">
          {{ $t('common.submit') }}
        </el-button>
      </template>
    </el-dialog>
  </section>
</template>

<script setup lang="ts">
import type { UniFormConfig, UniOption, UniTableColumn, UniTableRequest } from 'uni-ui-lib'
import { UniDataTable, UniForm, UniSearchForm, useUniI18n, useUniListState, useUniPermission } from 'uni-ui-lib'
import dayjs from 'dayjs'
import { ElMessage, ElMessageBox } from 'element-plus'
import { computed, reactive, ref } from 'vue'

import { activityApi, activityVoteProgramApi } from '@/api'
import type { Translate } from '@/types/i18n'
import { normalizeArray, normalizePaged } from '@/utils/api-response-normalize'

type Row = Record<string, unknown>

const props = defineProps<{
  activityId: string | number
  readOnly?: boolean
  showExportEnded?: boolean
}>()

const { t } = useUniI18n()
const tr = t as Translate
const { hasPermission } = useUniPermission()
const tableRef = ref<InstanceType<typeof UniDataTable> | null>(null)
const formRef = ref<InstanceType<typeof UniForm> | null>(null)
const selectedRows = ref<Row[]>([])
const dialogVisible = ref(false)
const saving = ref(false)
const exporting = ref(false)
const checkinOptions = ref<UniOption[]>([])
const voteProgramOptions = ref<UniOption[]>([])
const form = reactive<Row>({})
const formModel = computed({
  get: () => form,
  set: (value: Row) => Object.assign(form, value)
})

const searchCfg = computed<UniFormConfig>(() => ({
  schema: [
    {
      field: 'keyword',
      component: 'ElInput',
      label: '',
      componentProps: { placeholder: tr('activity.voteRecordKeyword'), clearable: true },
      colProps: { span: 6 }
    }
  ],
  rowProps: { gutter: 8 },
  colProps: { span: 6 }
}))

const columns = computed<UniTableColumn[]>(() => [
  { prop: '_seq', label: '#', width: 72 },
  { prop: 'voter', label: tr('activity.voteRecordVoter'), minWidth: 120 },
  { prop: 'phone', label: tr('activity.registrationPhone'), minWidth: 120 },
  { prop: 'programName', label: tr('activity.voteProgramProject'), minWidth: 150 },
  { prop: 'voteName', label: tr('activity.voteProgramTitle'), minWidth: 150 },
  { prop: 'createTimeLabel', label: tr('activity.colCreateTime'), minWidth: 156 }
])

const formCfg = computed<UniFormConfig>(() => ({
  formProps: { labelPosition: 'top' },
  colProps: { span: 24 },
  schema: [
    {
      field: 'codeId',
      label: tr('activity.voteRecordCheckin'),
      component: 'ElSelect',
      options: checkinOptions.value,
      componentProps: { filterable: true, style: { width: '100%' } }
    },
    {
      field: 'voteId',
      label: tr('activity.voteRecordProgram'),
      component: 'ElSelect',
      options: voteProgramOptions.value,
      required: true,
      componentProps: { filterable: true, style: { width: '100%' } }
    },
    { field: 'voter', label: tr('activity.voteRecordVoter'), component: 'ElInput' },
    { field: 'phone', label: tr('activity.registrationPhone'), component: 'ElInput' }
  ]
}))

const { queryModel, filters, handleLoadSuccess, reset, search } = useUniListState({
  initialFilters: { keyword: '' }
})

const selectedIds = computed(
  () => selectedRows.value.map((row) => row.id).filter((id) => id != null) as Array<string | number>
)
const canDelete = computed(() => hasPermission('busdriver_del') || hasPermission('activity_ticket_del'))

const decorateRows = (list: Row[], pageNo: number, pageSize: number) => {
  list.forEach((row, index) => {
    row._seq = (pageNo - 1) * pageSize + index + 1
    row.voter = row.voter == null || row.voter === '' ? '-' : String(row.voter)
    row.phone = row.phone == null || row.phone === '' ? '-' : String(row.phone)
    row.programName = row.programName == null || row.programName === '' ? '-' : String(row.programName)
    row.voteName = row.voteName == null || row.voteName === '' ? '-' : String(row.voteName)
    const timeRaw = row.createTime ?? row.create_time
    if (timeRaw == null || timeRaw === '') {
      row.createTimeLabel = ''
    } else {
      const d = dayjs(String(timeRaw))
      row.createTimeLabel = d.isValid() ? d.format('YYYY-MM-DD HH:mm') : String(timeRaw)
    }
  })
}

const loadData: UniTableRequest = async ({ pageNo: current, pageSize: size, filters: filterModel }) => {
  const f = filterModel as Row
  const raw = await activityVoteProgramApi.recordPage.get({
    activityId: props.activityId,
    current,
    size,
    pageNum: current,
    pageSize: size,
    keyword: f.keyword || undefined
  })
  const { list, total } = normalizePaged<Row>(raw)
  decorateRows(list, current, size)
  return { data: list, total }
}

const onSelectionChange = (rows: Record<string, unknown>[]) => {
  selectedRows.value = rows as Row[]
}

const loadCheckinOptions = async () => {
  const raw = await activityApi.checkinPage.get({
    activityId: props.activityId,
    current: 1,
    size: 500,
    pageNum: 1,
    pageSize: 500
  })
  const rows = normalizePaged<Row>(raw).list
  checkinOptions.value = rows.map((row) => {
    const parts = [row.name, row.phone, row.code].filter((item) => item != null && item !== '')
    return {
      label: parts.length ? `#${String(row.id)} · ${parts.join(' · ')}` : `#${String(row.id)}`,
      value: row.id as string | number
    }
  })
}

const loadVotePrograms = async () => {
  const raw = await activityVoteProgramApi.list.get({ activityId: props.activityId })
  const rows = normalizeArray(raw) as Row[]
  voteProgramOptions.value = rows.map((row) => {
    const name = row.cnName ?? row.voteName ?? row.name ?? ''
    const project = row.programName ?? ''
    return {
      label: name && project ? `${String(name)} · ${String(project)}` : String(name || project || row.id),
      value: row.id as string | number
    }
  })
}

const openAdd = () => {
  Object.assign(form, { codeId: undefined, voteId: undefined, voter: '', phone: '' })
  void loadCheckinOptions()
  void loadVotePrograms()
  dialogVisible.value = true
}

const resetDialog = () => {
  Object.keys(form).forEach((key) => delete form[key])
  formRef.value?.clearValidate?.()
}

const submit = async () => {
  const ok = await formRef.value?.validate().catch(() => false)
  if (!ok) return
  saving.value = true
  try {
    await activityVoteProgramApi.recordAdd.post({
      activityId: Number.isFinite(Number(props.activityId)) ? Number(props.activityId) : props.activityId,
      codeId: form.codeId == null || form.codeId === '' ? 0 : Number(form.codeId),
      voteId: Number(form.voteId),
      voter: form.voter,
      phone: form.phone
    })
    ElMessage.success(tr('activity.saveOk'))
    dialogVisible.value = false
    tableRef.value?.refresh()
  } finally {
    saving.value = false
  }
}

const deleteSelected = async () => {
  if (!selectedIds.value.length) return
  await ElMessageBox.confirm(tr('activity.confirmDeleteVoteRecords'), tr('common.tip'), { type: 'warning' })
  await activityVoteProgramApi.recordRemove.delete(selectedIds.value)
  ElMessage.success(tr('activity.deleteOk'))
  selectedRows.value = []
  tableRef.value?.refresh()
}

const exportCsv = async () => {
  exporting.value = true
  try {
    const pageSize = 200
    let current = 1
    const rows: Row[] = []
    while (current < 600) {
      const f = filters.value as Row
      const raw = await activityVoteProgramApi.recordPage.get({
        activityId: props.activityId,
        current,
        size: pageSize,
        pageNum: current,
        pageSize,
        keyword: f.keyword || undefined
      })
      const page = normalizePaged<Row>(raw)
      decorateRows(page.list, current, pageSize)
      rows.push(...page.list)
      if (!page.list.length || page.list.length < pageSize || rows.length >= page.total) break
      current += 1
    }
    const csv = [
      ['#', tr('activity.voteRecordVoter'), tr('activity.registrationPhone'), tr('activity.voteProgramProject'), tr('activity.voteProgramTitle'), tr('activity.colCreateTime')],
      ...rows.map((row) => [row._seq, row.voter, row.phone, row.programName, row.voteName, row.createTimeLabel])
    ]
      .map((line) => line.map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(','))
      .join('\n')
    const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `activity-vote-records-${props.activityId}.csv`
    link.click()
    URL.revokeObjectURL(url)
  } finally {
    exporting.value = false
  }
}

defineExpose({
  exportCsv,
  openAdd
})
</script>
