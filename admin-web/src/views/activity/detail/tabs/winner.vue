<template>
  <section class="activity-winner-tab">
    <el-radio-group
      v-model="winnerKind"
      class="activity-winner-tab__kind"
      @change="
        () => {
          selectedRows = []
          tableRef?.refresh?.()
        }
      ">
      <el-radio-button label="lottery">{{ $t('activity.winnerLottery') }}</el-radio-button>
      <el-radio-button label="competition">{{ $t('activity.winnerCompetition') }}</el-radio-button>
    </el-radio-group>

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
      :action-column="{ width: 100, fixed: 'right' }"
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
      :title="dialogMode === 'add' ? $t('activity.winnerAddTitle') : $t('activity.winnerEditTitle')"
      width="720px"
      append-to-body
      destroy-on-close
      :close-on-click-modal="false"
      @closed="resetDialog"
    >
      <UniForm ref="formRef" v-model="formModel" mode="edit" :config="formCfg" />
      <p class="activity-winner-tab__hint">{{ $t('activity.winnerTicketHint') }}</p>
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
import type { UniFormConfig, UniOption, UniTableAction, UniTableColumn, UniTableRequest } from 'uni-ui-lib'
import { UniDataTable, UniForm, UniSearchForm, useUniI18n, useUniListState, useUniPermission } from 'uni-ui-lib'
import dayjs from 'dayjs'
import { ElMessage, ElMessageBox } from 'element-plus'
import { computed, nextTick, reactive, ref } from 'vue'

import { activityApi, activityProgramApi } from '@/api'
import type { Translate } from '@/types/i18n'
import { normalizeArray, normalizeEnvelope, normalizePaged, normalizePayload } from '@/utils/api-response-normalize'
import { downloadResponseBlob } from '@/utils/download'

type Row = Record<string, unknown>
type WinnerKind = 'lottery' | 'competition'
type DialogMode = 'add' | 'edit'

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
const winnerKind = ref<WinnerKind>('lottery')
const selectedRows = ref<Row[]>([])
const programOptions = ref<UniOption[]>([])
const dialogVisible = ref(false)
const dialogMode = ref<DialogMode>('add')
const saving = ref(false)
const exporting = ref(false)
const form = reactive<Row>({})
const formModel = computed({
  get: () => form,
  set: (value: Row) => Object.assign(form, value)
})

const selectedIds = computed(
  () => selectedRows.value.map((row) => row.id).filter((id) => id != null) as Array<string | number>
)
const canDelete = computed(() => hasPermission('busdriver_del') || hasPermission('activity_ticket_del'))

const searchCfg = computed<UniFormConfig>(() => ({
  schema: [
    {
      field: 'keyword',
      component: 'ElInput',
      label: '',
      componentProps: {
        placeholder:
          winnerKind.value === 'competition'
            ? tr('activity.winnerKeywordCompetition')
            : tr('activity.winnerKeywordLottery'),
        clearable: true
      },
      colProps: { span: 8 }
    }
  ],
  rowProps: { gutter: 8 },
  colProps: { span: 6 }
}))

const columns = computed<UniTableColumn[]>(() =>
  winnerKind.value === 'competition'
    ? [
        { prop: 'id', label: 'ID', minWidth: 72 },
        { prop: 'programName', label: tr('activity.voteProgramProject'), minWidth: 140 },
        { prop: 'voteName', label: tr('activity.winnerVoteName'), minWidth: 140 },
        { prop: 'awardRank', label: tr('activity.winnerAwardRank'), minWidth: 90 },
        { prop: 'performer', label: tr('activity.votePerformer'), minWidth: 120 }
      ]
    : [
        { prop: 'id', label: 'ID', minWidth: 72 },
        { prop: 'programName', label: tr('activity.voteProgramProject'), minWidth: 140 },
        { prop: 'ticketCode', label: tr('activity.winnerTicketCode'), minWidth: 140 },
        { prop: 'name', label: tr('activity.registrationName'), minWidth: 110 },
        { prop: 'phone', label: tr('activity.registrationPhone'), minWidth: 120 },
        { prop: 'createTimeLabel', label: tr('activity.colCreateTime'), minWidth: 156 }
      ]
)

const formCfg = computed<UniFormConfig>(() => {
  const schema: UniFormConfig['schema'] = [
    {
      field: 'programId',
      label: tr('activity.programListTitle'),
      component: 'ElSelect',
      options: programOptions.value,
      required: true,
      componentProps: {
        filterable: true,
        style: { width: '100%' },
        onChange: (value: string | number) => {
          const found = programOptions.value.find((item) => String(item.value) === String(value))
          form.programName = found?.label
        }
      },
      colProps: { xs: 24, sm: 12 }
    }
  ]
  if (winnerKind.value === 'competition') {
    schema.push({
      field: 'awardRank',
      label: tr('activity.winnerAwardRank'),
      component: 'ElInput',
      required: true,
      colProps: { xs: 24, sm: 12 }
    })
  }
  schema.push(
    {
      field: 'ticketCode',
      label: tr('activity.winnerTicketCode'),
      component: 'ElInput',
      required: true,
      componentProps: { onBlur: fetchByTicketCode },
      colProps: { span: 24 }
    },
    {
      field: 'name',
      label: tr('activity.registrationName'),
      component: 'ElInput',
      required: true,
      componentProps: { disabled: true },
      colProps: { xs: 24, sm: 12 }
    },
    {
      field: 'phone',
      label: tr('activity.registrationPhone'),
      component: 'ElInput',
      required: true,
      componentProps: { disabled: true },
      colProps: { xs: 24, sm: 12 }
    },
    {
      field: 'email',
      label: tr('activity.registrationEmail'),
      component: 'ElInput',
      componentProps: { disabled: true },
      colProps: { xs: 24, sm: 12 }
    }
  )
  return { formProps: { labelPosition: 'top' }, rowProps: { gutter: 16 }, colProps: { span: 12 }, schema }
})

const { queryModel, filters, handleLoadSuccess, reset, search } = useUniListState({
  initialFilters: { keyword: '' }
})

const decorateRows = (list: Row[]) => {
  for (const row of list) {
    row.programName = row.programName == null || row.programName === '' ? '-' : String(row.programName)
    row.ticketCode = row.ticketCode == null || row.ticketCode === '' ? '-' : String(row.ticketCode)
    row.name = row.name == null || row.name === '' ? '-' : String(row.name)
    row.phone = row.phone == null || row.phone === '' ? '-' : String(row.phone)
    const timeRaw = row.createTime ?? row.create_time
    if (timeRaw == null || timeRaw === '') {
      row.createTimeLabel = ''
    } else {
      const d = dayjs(String(timeRaw))
      row.createTimeLabel = d.isValid() ? d.format('YYYY-MM-DD HH:mm') : String(timeRaw)
    }
    if (winnerKind.value === 'competition') {
      row.voteName = row.voteName == null || row.voteName === '' ? '-' : String(row.voteName)
      row.awardRank = row.awardRank == null || row.awardRank === '' ? '-' : String(row.awardRank)
      row.performer =
        row.performer == null || row.performer === ''
          ? row.name == null || row.name === ''
            ? '-'
            : String(row.name)
          : String(row.performer)
    }
  }
}

const loadData: UniTableRequest = async ({ pageNo: current, pageSize: size, filters: filterModel }) => {
  const f = filterModel as Row
  const params = {
    activityId: props.activityId,
    current,
    size,
    pageNum: current,
    pageSize: size,
    keyword: f.keyword || undefined
  }
  const raw =
    winnerKind.value === 'competition'
      ? await activityApi.prizeAwardCompetitionPage.get(params)
      : await activityApi.prizeAwardLotteryPage.get(params)
  const { list, total } = normalizePaged<Row>(raw)
  decorateRows(list)
  return { data: list, total }
}

const onSelectionChange = (rows: Record<string, unknown>[]) => {
  selectedRows.value = rows as Row[]
}

const loadPrograms = async () => {
  const pt = winnerKind.value === 'competition' ? 2 : 1
  const raw = await activityProgramApi.listBrief.get({
    activityId: props.activityId,
    programTypes: [String(pt)]
  })
  const rows = (normalizeArray(raw) as Row[]).filter((row) => row.id != null)
  const detailRows = await Promise.all(
    rows.map(async (row) => normalizeEnvelope(await activityProgramApi.detail.get(row.id as string | number)))
  )
  programOptions.value = detailRows
    .filter((row) => Number(row.programStatus) === 1 && Number(row.programType) === pt)
    .map((row) => ({
      label: String(locale.value === 'en' ? (row.enName ?? row.cnName ?? '') : (row.cnName ?? row.enName ?? '')),
      value: row.id as string | number
    }))
}

const openAdd = () => {
  dialogMode.value = 'add'
  Object.assign(form, {
    id: undefined,
    programId: undefined,
    programName: '',
    ticketCode: '',
    checkinId: undefined,
    name: '',
    phone: '',
    email: '',
    awardRank: ''
  })
  void loadPrograms()
  dialogVisible.value = true
}

const openEdit = async (row: Row) => {
  dialogMode.value = 'edit'
  const data = normalizeEnvelope(await activityApi.prizeAwardDetail.get(row.id as string | number))
  Object.assign(form, {
    id: undefined,
    programId: undefined,
    programName: '',
    ticketCode: '',
    checkinId: undefined,
    name: '',
    phone: '',
    email: '',
    awardRank: ''
  })
  Object.assign(form, {
    id: data.id,
    programId: data.programId ?? data.program_id,
    programName: data.programName ?? '',
    ticketCode: data.ticketCode ?? '',
    checkinId: data.checkinId ?? data.checkin_id,
    name: data.name ?? '',
    phone: data.phone ?? '',
    email: data.email ?? '',
    awardRank: data.awardRank ?? ''
  })
  await loadPrograms()
  if (form.programId != null) {
    const found = programOptions.value.find(
      (item) => String(item.value) === String(form.programId)
    )
    form.programName = found?.label
  }
  dialogVisible.value = true
}

const actions = computed<UniTableAction[]>(() =>
  props.readOnly
    ? []
    : [{ label: tr('activity.entryEdit'), code: 'busdriver_edit', onClick: (row) => void openEdit(row as Row) }]
)

const fetchByTicketCode = async () => {
  const code = String(form.ticketCode ?? '').trim()
  if (!code) return
  const raw = normalizePayload(await activityApi.prizeAwardByTicketCode.get(code))
  const row = Array.isArray(raw) ? (raw[0] as Row | undefined) : (raw as Row)
  if (!row || typeof row !== 'object') {
    ElMessage.info(tr('activity.winnerTicketNotFound'))
    return
  }
  form.name = row.name ?? form.name
  form.phone = row.phone == null ? form.phone : String(row.phone)
  form.email = row.email ?? form.email
  form.checkinId = row.id ?? form.checkinId
  const pid = row.programId ?? row.program_id
  if (pid != null) {
    form.programId = pid
    const found = programOptions.value.find((item) => String(item.value) === String(pid))
    form.programName = found?.label
  }
}

const resetDialog = () => {
  Object.keys(form).forEach((key) => delete form[key])
  formRef.value?.clearValidate?.()
}

const buildPayload = () => {
  const payload: Row = {
    activityId: Number.isFinite(Number(props.activityId)) ? Number(props.activityId) : props.activityId,
    programId: form.programId,
    programName: form.programName || undefined,
    ticketCode: form.ticketCode || undefined,
    name: form.name || undefined,
    phone: form.phone || undefined,
    email: form.email || undefined
  }
  if (form.checkinId != null && form.checkinId !== '') {
    payload.checkinId = Number(form.checkinId)
  }
  if (winnerKind.value === 'competition') {
    payload.awardRank = form.awardRank || undefined
  }
  if (dialogMode.value === 'edit') {
    payload.id = form.id
  }
  return payload
}

const submit = async () => {
  const ok = await formRef.value?.validate().catch(() => false)
  if (!ok) return
  saving.value = true
  try {
    const payload = buildPayload()
    if (dialogMode.value === 'add') {
      await activityApi.prizeAwardAdd.post(payload)
    } else {
      await activityApi.prizeAwardEdit.post(payload)
    }
    ElMessage.success(tr('activity.saveOk'))
    dialogVisible.value = false
    tableRef.value?.refresh()
  } finally {
    saving.value = false
  }
}

const deleteSelected = async () => {
  if (!selectedIds.value.length) return
  await ElMessageBox.confirm(tr('activity.confirmDeleteWinners'), tr('common.tip'), { type: 'warning' })
  await activityApi.prizeAwardRemove.delete(selectedIds.value)
  ElMessage.success(tr('activity.deleteOk'))
  selectedRows.value = []
  tableRef.value?.refresh()
}

const exportWinners = async () => {
  exporting.value = true
  try {
    const f = filters.value as Row
    const params = { activityId: props.activityId, keyword: f.keyword || undefined }
    const response =
      winnerKind.value === 'competition'
        ? await activityApi.prizeAwardCompetitionExport.get(params)
        : await activityApi.prizeAwardLotteryExport.get(params)
    downloadResponseBlob(response, `activity-winners-${winnerKind.value}-${props.activityId}.xlsx`)
  } finally {
    exporting.value = false
  }
}

defineExpose({
  exportWinners,
  openAdd
})

void nextTick(() => {
  tableRef.value?.refresh()
})
</script>

<style scoped lang="scss">
.activity-winner-tab {
  &__kind {
    margin-bottom: 12px;
  }

  &__hint {
    margin: 8px 0 0;
    color: var(--el-text-color-secondary);
    font-size: 13px;
  }
}
</style>
