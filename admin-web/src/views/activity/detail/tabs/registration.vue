<template>
  <section class="activity-registration-tab">
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
      :selection="readOnly || !canDeleteRegistration ? false : 'multiple'"
      :columns="columns"
      :request="loadData"
      :filters="filters"
      :pagination="{ pageSize: 10, pageSizes: [10, 20, 50, 100] }"
      :toolbar="{ refresh: true, columnSetting: true }"
      :actions="actions"
      :action-column="{ width: 100, fixed: 'right' }"
      @load-success="handleLoadSuccess"
      @selection-change="onSelectionChange"
    >
      <template v-if="!readOnly || showExportEnded" #toolbar>
        <template v-if="!readOnly">
          <el-upload
            v-uni-permission="'busdriver_edit'"
            accept=".xlsx,.xls"
            :show-file-list="false"
            :before-upload="importTickets"
          >
            <el-button type="primary" :loading="importing">
              {{ $t('activity.import') }}
            </el-button>
          </el-upload>
          <el-button
            v-uni-permission="'busdriver_edit'"
            type="primary"
            plain
            :disabled="!activityId"
            @click="downloadTemplate"
          >
            {{ $t('activity.downloadTemplate') }}
          </el-button>
        </template>
        <el-button
          v-if="!readOnly && canDeleteRegistration"
          type="danger"
          plain
          :disabled="!selectedIds.length"
          @click="deleteSelected"
        >
          {{ $t('activity.delBatch') }}
        </el-button>
        <el-button
          v-if="showExportEnded"
          v-uni-permission="'busdriver_edit'"
          type="primary"
          plain
          :disabled="!activityId"
          :loading="exporting"
          @click="exportCsv"
        >
          {{ $t('activity.export') }}
        </el-button>
      </template>
    </UniDataTable>

    <el-dialog
      v-model="dialogVisible"
      :title="$t('activity.registrationEditTitle')"
      width="720px"
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
import type { UniFormConfig, UniTableAction, UniTableColumn, UniTableRequest } from 'uni-ui-lib'
import { UniDataTable, UniForm, UniSearchForm, useUniI18n, useUniListState, useUniPermission } from 'uni-ui-lib'
import dayjs from 'dayjs'
import { ElMessage, ElMessageBox } from 'element-plus'
import { computed, reactive, ref } from 'vue'

import { activityApi } from '@/api'
import type { Translate } from '@/types/i18n'
import { normalizePaged } from '@/utils/api-response-normalize'
import { downloadBlob, downloadResponseBlob } from '@/utils/download'

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
const dialogVisible = ref(false)
const saving = ref(false)
const importing = ref(false)
const exporting = ref(false)
const selectedRows = ref<Row[]>([])
const editingRow = ref<Row | null>(null)
const form = reactive<Row>({})
const formModel = computed({
  get: () => form,
  set: (value: Row) => Object.assign(form, value)
})

const paidOptions = computed(() => [
  { label: tr('activity.paidYes'), value: 1 },
  { label: tr('activity.paidNo'), value: 0 }
])

const searchCfg = computed<UniFormConfig>(() => ({
  schema: [
    {
      field: 'keyword',
      component: 'ElInput',
      label: '',
      componentProps: { placeholder: tr('activity.registrationKeyword'), clearable: true },
      colProps: { span: 6 }
    },
    {
      field: 'paid',
      component: 'ElSelect',
      label: '',
      options: paidOptions.value,
      componentProps: { placeholder: tr('activity.paidStatus'), clearable: true },
      colProps: { span: 6 }
    },
    {
      field: 'registerTimeRange',
      component: 'ElDatePicker',
      label: '',
      componentProps: {
        type: 'datetimerange',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
        startPlaceholder: tr('activity.timeStart'),
        endPlaceholder: tr('activity.timeEnd'),
        clearable: true,
        style: { width: '100%' }
      },
      colProps: { span: 8 }
    }
  ],
  rowProps: { gutter: 8 },
  colProps: { span: 6 }
}))

const columns = computed<UniTableColumn[]>(() => [
  { prop: '_seq', label: '#', width: 72 },
  { prop: 'activityName', label: tr('activity.colActivityName'), minWidth: 160, showOverflowTooltip: true },
  { prop: 'phone', label: tr('activity.registrationPhone'), minWidth: 120 },
  { prop: 'email', label: tr('activity.registrationEmail'), minWidth: 160 },
  { prop: 'name', label: tr('activity.registrationName'), minWidth: 120 },
  { prop: 'ticketPrice', label: tr('activity.colTicketPrice'), minWidth: 100 },
  { prop: 'paidAmount', label: tr('activity.registrationPaidAmount'), minWidth: 110 },
  { prop: 'peopleCount', label: tr('activity.registrationPeopleCount'), minWidth: 100 },
  { prop: 'id', label: tr('activity.registrationId'), minWidth: 120 },
  { prop: 'paidLabel', label: tr('activity.paidStatus'), minWidth: 100 },
  { prop: 'registerTime', label: tr('activity.registrationTime'), minWidth: 156 }
])

const formCfg = computed<UniFormConfig>(() => ({
  formProps: { labelPosition: 'top' },
  colProps: { xs: 24, sm: 12 },
  schema: [
    { field: 'phone', label: tr('activity.registrationPhone'), component: 'ElInput' },
    { field: 'name', label: tr('activity.registrationName'), component: 'ElInput' },
    { field: 'email', label: tr('activity.registrationEmail'), component: 'ElInput' },
    { field: 'parentId', label: tr('activity.registrationParentId'), component: 'ElInput' },
    {
      field: 'peopleCount',
      label: tr('activity.registrationPeopleCount'),
      component: 'ElInputNumber',
      componentProps: { min: 1, precision: 0, controlsPosition: 'right', style: { width: '100%' } }
    },
    {
      field: 'ticketPrice',
      label: tr('activity.colTicketPrice'),
      component: 'ElInputNumber',
      componentProps: { min: 0, precision: 2, controlsPosition: 'right', style: { width: '100%' } }
    },
    {
      field: 'paidAmount',
      label: tr('activity.registrationPaidAmount'),
      component: 'ElInputNumber',
      componentProps: { min: 0, precision: 2, controlsPosition: 'right', style: { width: '100%' } }
    },
    {
      field: 'paid',
      label: tr('activity.paidStatus'),
      component: 'ElSelect',
      options: paidOptions.value,
      componentProps: { style: { width: '100%' } }
    },
    { field: 'orderNo', label: tr('activity.registrationOrderNo'), component: 'ElInput', colProps: { span: 24 } }
  ]
}))

const { queryModel, filters, handleLoadSuccess, reset, search } = useUniListState({
  initialFilters: { keyword: '', paid: undefined, registerTimeRange: [] }
})

const selectedIds = computed(
  () => selectedRows.value.map((row) => row.id).filter((id) => id != null) as Array<string | number>
)
const canDeleteRegistration = computed(
  () => hasPermission('busdriver_del') || hasPermission('activity_ticket_del')
)

const normalizeTime = (value: unknown) => {
  if (value == null || value === '') return ''
  const d = dayjs(String(value))
  return d.isValid() ? d.format('YYYY-MM-DD HH:mm') : String(value)
}

const decorateRows = (list: Row[], pageNo = 1, pageSize = list.length || 1) => {
  list.forEach((row, index) => {
    row._seq = (pageNo - 1) * pageSize + index + 1
    row.paidLabel = String(row.paid) === '1' || row.paid === true ? tr('activity.paidYes') : tr('activity.paidNo')
    row.registerTime = normalizeTime(row.registerTime)
  })
}

const buildListParams = (current: number, size: number, filterModel: Row) => {
  const f = filterModel as Row
  const range = Array.isArray(f.registerTimeRange) ? f.registerTimeRange : []
  return {
    activityId: props.activityId,
    current,
    size,
    pageNum: current,
    pageSize: size,
    keyword: f.keyword || undefined,
    paid: f.paid ?? undefined,
    registerStartTime: range[0] || undefined,
    registerEndTime: range[1] || undefined
  }
}

const loadData: UniTableRequest = async ({ pageNo: current, pageSize: size, filters: filterModel }) => {
  const raw = await activityApi.ticketPage.get(buildListParams(current, size, filterModel as Row))
  const { list, total } = normalizePaged<Row>(raw)
  decorateRows(list, current, size)
  return { data: list, total }
}

const onSelectionChange = (rows: Record<string, unknown>[]) => {
  selectedRows.value = rows as Row[]
}

const openEdit = (row: Row) => {
  editingRow.value = row
  Object.assign(form, row)
  dialogVisible.value = true
}

const actions = computed<UniTableAction[]>(() =>
  props.readOnly
    ? []
    : [{ label: tr('activity.entryEdit'), code: 'busdriver_edit', onClick: (row) => openEdit(row as Row) }]
)

const deleteSelected = async () => {
  if (!selectedIds.value.length) return
  await ElMessageBox.confirm(tr('activity.confirmDeleteRegistration'), tr('common.tip'), { type: 'warning' })
  await activityApi.ticketRemove.delete(selectedIds.value)
  ElMessage.success(tr('activity.deleteOk'))
  selectedRows.value = []
  tableRef.value?.refresh()
}

const downloadTemplate = async () => {
  try {
    const response = await activityApi.ticketTemplate.get()
    downloadResponseBlob(response, 'ticket-import-template.xlsx')
  } catch {
    ElMessage.error(tr('activity.exportFail'))
  }
}

const importTickets = (file: File) => {
  void (async () => {
    importing.value = true
    try {
      await activityApi.ticketImport.post(file)
      ElMessage.success(tr('activity.saveOk'))
      tableRef.value?.refresh()
    } catch {
      ElMessage.error(tr('activity.uploadFail'))
    } finally {
      importing.value = false
    }
  })()
  return false
}

const csvLine = (cells: unknown[]) =>
  cells.map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(',')

const exportCsv = async () => {
  if (exporting.value) return
  exporting.value = true
  try {
    const rows: Row[] = []
    const pageSize = 200
    let current = 1
    while (current < 600) {
      const raw = await activityApi.ticketPage.get(buildListParams(current, pageSize, filters.value as Row))
      const { list, total } = normalizePaged<Row>(raw)
      rows.push(...list)
      if (!list.length || list.length < pageSize || (total && rows.length >= total)) break
      current += 1
    }
    decorateRows(rows)
    const csv = [
      csvLine(['#', tr('activity.colActivityName'), tr('activity.registrationPhone'), tr('activity.registrationEmail'), tr('activity.registrationName'), tr('activity.colTicketPrice'), tr('activity.registrationPaidAmount'), tr('activity.registrationPeopleCount'), tr('activity.registrationId'), tr('activity.paidStatus'), tr('activity.registrationTime')]),
      ...rows.map((row) =>
        csvLine([
          row._seq,
          row.activityName,
          row.phone,
          row.email,
          row.name,
          row.ticketPrice,
          row.paidAmount,
          row.peopleCount,
          row.id,
          row.paidLabel,
          row.registerTime
        ])
      )
    ].join('\n')
    downloadBlob(new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' }), `activity-tickets-${props.activityId}.csv`)
  } finally {
    exporting.value = false
  }
}

const resetDialog = () => {
  editingRow.value = null
  Object.keys(form).forEach((key) => delete form[key])
  formRef.value?.clearValidate?.()
}

const submit = async () => {
  const ok = await formRef.value?.validate().catch(() => false)
  if (!ok) return
  saving.value = true
  try {
    await activityApi.ticketEdit.post({ ...form, activityId: props.activityId })
    ElMessage.success(tr('activity.saveOk'))
    dialogVisible.value = false
    tableRef.value?.refresh()
  } finally {
    saving.value = false
  }
}
</script>
