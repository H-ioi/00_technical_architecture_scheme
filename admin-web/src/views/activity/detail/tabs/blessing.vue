<template>
  <section class="activity-blessing-tab">
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
      :actions="actions"
      :action-column="{ width: 120, fixed: 'right' }"
      @load-success="handleLoadSuccess"
      @selection-change="onSelectionChange"
    >
      <template #toolbar>
        <template v-if="!readOnly">
          <el-button
            v-if="canDelete"
            type="danger"
            plain
            :disabled="!selectedIds.length"
            @click="deleteSelected"
          >
            {{ $t('activity.delBatch') }}
          </el-button>
          <el-button
            v-uni-permission="'busdriver_edit'"
            plain
            :disabled="!selectedIds.length"
            @click="batchVisible(1)"
          >
            {{ $t('activity.visibleYes') }}
          </el-button>
          <el-button
            v-uni-permission="'busdriver_edit'"
            plain
            :disabled="!selectedIds.length"
            @click="batchVisible(0)"
          >
            {{ $t('activity.visibleNo') }}
          </el-button>
        </template>
      </template>
    </UniDataTable>

    <el-dialog
      v-model="detailVisible"
      :title="$t('activity.blessingDetailTitle')"
      width="560px"
      append-to-body
    >
      <el-descriptions :column="1" border>
        <el-descriptions-item :label="$t('activity.blessingTicketIdLabel')">
          {{ detail.ticketIdLabel || '-' }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('activity.blessingContent')">
          {{ detail.content || '-' }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('activity.visibleStatus')">
          {{ detail.visibleLabel || '-' }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('activity.colCreateTime')">
          {{ detail.createTimeLabel || '-' }}
        </el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <el-button type="primary" @click="detailVisible = false">
          {{ $t('common.close') }}
        </el-button>
      </template>
    </el-dialog>

    <el-dialog
      v-model="editVisible"
      :title="
        editMode === 'add' ? $t('activity.blessingAddTitle') : $t('activity.blessingEditTitle')
      "
      width="560px"
      append-to-body
      destroy-on-close
      :close-on-click-modal="false"
      @closed="resetEdit"
    >
      <UniForm ref="formRef" v-model="formModel" mode="edit" :config="formCfg" />
      <template #footer>
        <el-button @click="editVisible = false">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" :loading="saving" @click="submit">
          {{ $t('common.submit') }}
        </el-button>
      </template>
    </el-dialog>
  </section>
</template>

<script setup lang="ts">
import type {
  UniFormConfig,
  UniOption,
  UniTableAction,
  UniTableColumn,
  UniTableRequest
} from 'uni-ui-lib'
import {
  UniDataTable,
  UniForm,
  UniSearchForm,
  useUniI18n,
  useUniListState,
  useUniPermission
} from 'uni-ui-lib'
import dayjs from 'dayjs'
import { ElMessage, ElMessageBox } from 'element-plus'
import { computed, reactive, ref } from 'vue'

import { activityApi, activityProgramApi } from '@/api'
import type { Translate } from '@/types/i18n'
import { normalizeArray, normalizeEnvelope, normalizePaged } from '@/utils/api-response-normalize'
import { formatCsvRow } from '@/utils/csv'

type Row = Record<string, unknown>
type EditMode = 'add' | 'edit'

const props = defineProps<{
  activityId: string | number
  readOnly?: boolean
  showExportEnded?: boolean
}>()

const { t, locale } = useUniI18n()
const tr = t as Translate
const { hasPermission } = useUniPermission()
const tableRef = ref<InstanceType<typeof UniDataTable> | null>(null)
const formRef = ref<InstanceType<typeof UniForm> | null>(null)
const selectedRows = ref<Row[]>([])
const detailVisible = ref(false)
const editVisible = ref(false)
const saving = ref(false)
const exporting = ref(false)
const editMode = ref<EditMode>('add')
const programOptions = ref<UniOption[]>([])
const ticketOptions = ref<UniOption[]>([])
const detail = reactive<Row>({})
const form = reactive<Row>({})
const formModel = computed({
  get: () => form,
  set: (value: Row) => Object.assign(form, value)
})

const yesNoOptions = computed(() => [
  { label: tr('activity.yes'), value: 1 },
  { label: tr('activity.no'), value: 0 }
])

const searchCfg = computed<UniFormConfig>(() => ({
  schema: [
    {
      field: 'keyword',
      component: 'ElInput',
      label: '',
      componentProps: { placeholder: tr('activity.blessingKeyword'), clearable: true },
      colProps: { span: 6 }
    },
    {
      field: 'visible',
      component: 'ElSelect',
      label: '',
      options: yesNoOptions.value,
      componentProps: { placeholder: tr('activity.visibleStatus'), clearable: true },
      colProps: { span: 6 }
    }
  ],
  rowProps: { gutter: 8 },
  colProps: { span: 6 }
}))

const columns = computed<UniTableColumn[]>(() => [
  { prop: '_seq', label: '#', width: 72 },
  { prop: 'ticketIdLabel', label: tr('activity.blessingTicketIdLabel'), minWidth: 120 },
  {
    prop: 'content',
    label: tr('activity.blessingContent'),
    minWidth: 240,
    showOverflowTooltip: true
  },
  { prop: 'visibleLabel', label: tr('activity.visibleStatus'), minWidth: 100 },
  { prop: 'createTimeLabel', label: tr('activity.colCreateTime'), minWidth: 156 }
])

const formCfg = computed<UniFormConfig>(() => {
  const schema: UniFormConfig['schema'] = []
  if (editMode.value === 'add') {
    schema.push(
      {
        field: 'programId',
        label: tr('activity.programListTitle'),
        component: 'ElSelect',
        options: programOptions.value,
        required: true,
        componentProps: { filterable: true, style: { width: '100%' } }
      },
      {
        field: 'ticketId',
        label: tr('activity.blessingTicketIdLabel'),
        component: 'ElSelect',
        options: ticketOptions.value,
        required: true,
        componentProps: {
          filterable: true,
          remote: true,
          reserveKeyword: true,
          remoteMethod: searchTickets,
          style: { width: '100%' }
        }
      }
    )
  }
  schema.push(
    {
      field: 'content',
      label: tr('activity.blessingContent'),
      component: 'ElInput',
      required: true,
      componentProps: { type: 'textarea', rows: 4, maxlength: 2000, showWordLimit: true }
    },
    {
      field: 'visible',
      label: tr('activity.visibleStatus'),
      component: 'ElRadioGroup',
      options: yesNoOptions.value,
      required: true
    }
  )
  return { formProps: { labelPosition: 'top' }, colProps: { span: 24 }, schema }
})

const { queryModel, filters, handleLoadSuccess, reset, search } = useUniListState({
  initialFilters: { keyword: '', visible: undefined }
})

const selectedIds = computed(
  () => selectedRows.value.map((row) => row.id).filter((id) => id != null) as Array<string | number>
)
const canDelete = computed(() => hasPermission('busdriver_del'))

const decorateRows = (list: Row[], pageNo: number, pageSize: number) => {
  list.forEach((row, index) => {
    const ticketId = row.ticketId ?? row.ticket_id
    row._seq = (pageNo - 1) * pageSize + index + 1
    row.ticketIdLabel = ticketId == null || ticketId === '' ? '-' : String(ticketId)
    row.content = row.content == null || row.content === '' ? '-' : String(row.content)
    if (row.visible == null || row.visible === '') {
      row.visibleLabel = '-'
    } else {
      row.visibleLabel =
        String(row.visible) === '1' || row.visible === true ? tr('activity.yes') : tr('activity.no')
    }
    const timeRaw = row.createTime ?? row.create_time
    if (timeRaw == null || timeRaw === '') {
      row.createTimeLabel = ''
    } else {
      const d = dayjs(String(timeRaw))
      row.createTimeLabel = d.isValid() ? d.format('YYYY-MM-DD HH:mm') : String(timeRaw)
    }
  })
}

const loadData: UniTableRequest = async ({
  pageNo: current,
  pageSize: size,
  filters: filterModel
}) => {
  const f = filterModel as Row
  const raw = await activityApi.blessingPage.get({
    activityId: props.activityId,
    current,
    size,
    pageNum: current,
    pageSize: size,
    keyword: f.keyword || undefined,
    visible: f.visible ?? undefined
  })
  const { list, total } = normalizePaged<Row>(raw)
  decorateRows(list, current, size)
  return { data: list, total }
}

const onSelectionChange = (rows: Record<string, unknown>[]) => {
  selectedRows.value = rows as Row[]
}

const loadPrograms = async () => {
  const raw = await activityProgramApi.listBrief.get({ activityId: props.activityId })
  const rows = normalizeArray(raw) as Row[]
  programOptions.value = rows.map((row) => ({
    label: String(
      locale.value === 'en'
        ? (row.enName ?? row.cnName ?? row.name ?? '')
        : (row.cnName ?? row.enName ?? row.name ?? '')
    ),
    value: row.id as string | number
  }))
}

async function searchTickets(query = '') {
  const raw = await activityApi.ticketPage.get({
    activityId: props.activityId,
    current: 1,
    size: 100,
    pageNum: 1,
    pageSize: 100,
    keyword: query || undefined
  })
  const rows = normalizePaged<Row>(raw).list
  ticketOptions.value = rows.map((row) => ({
    label: [row.id, row.phone, row.name].filter((item) => item != null && item !== '').join(' · '),
    value: row.id as string | number
  }))
}

const openDetail = async (row: Row) => {
  const raw = await activityApi.blessingDetail.get(row.id as string | number)
  const data = normalizeEnvelope(raw)
  Object.assign(detail, { ...row, ...data })
  const ticketId = detail.ticketId ?? detail.ticket_id
  detail.ticketIdLabel = ticketId == null || ticketId === '' ? '-' : String(ticketId)
  if (detail.visible == null || detail.visible === '') {
    detail.visibleLabel = '-'
  } else {
    detail.visibleLabel =
      String(detail.visible) === '1' || detail.visible === true
        ? tr('activity.yes')
        : tr('activity.no')
  }
  const timeRaw = detail.createTime ?? detail.create_time
  if (timeRaw == null || timeRaw === '') {
    detail.createTimeLabel = ''
  } else {
    const d = dayjs(String(timeRaw))
    detail.createTimeLabel = d.isValid() ? d.format('YYYY-MM-DD HH:mm') : String(timeRaw)
  }
  detailVisible.value = true
}

const openAdd = () => {
  editMode.value = 'add'
  Object.assign(form, { programId: undefined, ticketId: undefined, content: '', visible: 1 })
  void loadPrograms()
  void searchTickets()
  editVisible.value = true
}

const openEdit = async (row: Row) => {
  const raw = await activityApi.blessingDetail.get(row.id as string | number)
  const data = normalizeEnvelope(raw)
  editMode.value = 'edit'
  Object.assign(form, {
    id: data.id,
    programId: data.programId,
    content: data.content ?? '',
    visible: String(data.visible) === '0' ? 0 : 1
  })
  editVisible.value = true
}

const actions = computed<UniTableAction[]>(() => {
  const base: UniTableAction[] = [
    {
      label: tr('activity.lookDetail'),
      code: 'busdriver_edit',
      onClick: (row) => void openDetail(row as Row)
    }
  ]
  if (!props.readOnly) {
    base.push({
      label: tr('activity.entryEdit'),
      code: 'busdriver_edit',
      onClick: (row) => void openEdit(row as Row)
    })
  }
  return base
})

const deleteSelected = async () => {
  if (!selectedIds.value.length) return
  await ElMessageBox.confirm(tr('activity.confirmDeleteBlessing'), tr('common.tip'), {
    type: 'warning'
  })
  await activityApi.blessingRemove.delete(selectedIds.value)
  ElMessage.success(tr('activity.deleteOk'))
  selectedRows.value = []
  tableRef.value?.refresh()
}

const batchVisible = async (visible: 0 | 1) => {
  if (!selectedIds.value.length) return
  await ElMessageBox.confirm(tr('activity.confirmBatchVisible'), tr('common.tip'), {
    type: 'warning'
  })
  await Promise.all(selectedIds.value.map((id) => activityApi.blessingEdit.post({ id, visible })))
  ElMessage.success(tr('activity.saveOk'))
  selectedRows.value = []
  tableRef.value?.refresh()
}

const resetEdit = () => {
  Object.keys(form).forEach((key) => delete form[key])
  formRef.value?.clearValidate?.()
}

const submit = async () => {
  const ok = await formRef.value?.validate().catch(() => false)
  if (!ok) return
  saving.value = true
  try {
    if (editMode.value === 'add') {
      await activityApi.blessingAdd.post({ ...form })
    } else {
      await activityApi.blessingEdit.post({
        id: form.id,
        programId: form.programId,
        content: form.content,
        visible: form.visible
      })
    }
    ElMessage.success(tr('activity.saveOk'))
    editVisible.value = false
    tableRef.value?.refresh()
  } finally {
    saving.value = false
  }
}

const exportCsv = async () => {
  exporting.value = true
  try {
    const pageSize = 200
    let current = 1
    const rows: Row[] = []
    while (current < 600) {
      const f = filters.value as Row
      const raw = await activityApi.blessingPage.get({
        activityId: props.activityId,
        current,
        size: pageSize,
        pageNum: current,
        pageSize,
        keyword: f.keyword || undefined,
        visible: f.visible ?? undefined
      })
      const page = normalizePaged<Row>(raw)
      decorateRows(page.list, current, pageSize)
      rows.push(...page.list)
      if (!page.list.length || page.list.length < pageSize || rows.length >= page.total) break
      current += 1
    }
    const csv = [
      [
        '#',
        tr('activity.blessingTicketIdLabel'),
        tr('activity.blessingContent'),
        tr('activity.visibleStatus'),
        tr('activity.colCreateTime')
      ],
      ...rows.map((row) => [
        row._seq,
        row.ticketIdLabel,
        row.content,
        row.visibleLabel,
        row.createTimeLabel
      ])
    ]
      .map((line) => formatCsvRow(line))
      .join('\n')
    const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `activity-blessing-${props.activityId}.csv`
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
