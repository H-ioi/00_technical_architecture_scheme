<template>
  <section class="activity-checkin-tab">
    <UniSearchForm
      v-model="queryModel"
      :config="searchCfg"
      :collapsed="true"
      :collapsed-rows="1"
      :action-min-span="0"
      :submit-text="$t('activity.search')"
      :reset-text="$t('activity.reset')"
      @search="search"
      @reset="reset" />
    <UniDataTable
      ref="tableRef"
      row-key="id"
      :columns="columns"
      :request="loadData"
      :filters="filters"
      :pagination="{ pageSize: 10, pageSizes: [10, 20, 50, 100] }"
      :toolbar="{ refresh: true, columnSetting: true }"
      :actions="actions"
      :action-column="{ width: 100, fixed: 'right' }"
      @load-success="handleLoadSuccess" />

    <el-dialog
      v-model="dialogVisible"
      :title="$t('activity.checkinEditTitle')"
      width="520px"
      append-to-body
      destroy-on-close
      :close-on-click-modal="false"
      @closed="resetDialog">
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
import dayjs from 'dayjs'
import { ElMessage } from 'element-plus'
import type { UniFormConfig, UniTableAction, UniTableColumn, UniTableRequest } from 'uni-ui-lib'
import { UniDataTable, UniForm, UniSearchForm, useUniI18n, useUniListState } from 'uni-ui-lib'
import { computed, reactive, ref } from 'vue'

import { activityApi } from '@/api'
import type { Translate } from '@/types/i18n'
import { normalizePaged } from '@/utils/api-response-normalize'
import { formatCsvRow } from '@/utils/csv'
import { downloadBlob } from '@/utils/download'

type Row = Record<string, unknown>

const props = defineProps<{
  activityId: string | number
  readOnly?: boolean
  showExportEnded?: boolean
}>()

const { t } = useUniI18n()
const tr = t as Translate
const tableRef = ref<InstanceType<typeof UniDataTable> | null>(null)
const formRef = ref<InstanceType<typeof UniForm> | null>(null)
const dialogVisible = ref(false)
const saving = ref(false)
const exporting = ref(false)
const snapshot = ref<Row>({})
const form = reactive<Row>({})
const formModel = computed({
  get: () => form,
  set: (value: Row) => Object.assign(form, value)
})

const yesNoOptions = computed(() => [
  { label: tr('activity.yes'), value: 1 },
  { label: tr('activity.no'), value: 0 }
])
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
      componentProps: { placeholder: tr('activity.checkinKeyword'), clearable: true },
      colProps: { span: 5 }
    },
    {
      field: 'paid',
      component: 'ElSelect',
      label: '',
      options: paidOptions.value,
      componentProps: { placeholder: tr('activity.paidStatus'), clearable: true },
      colProps: { span: 4 }
    },
    {
      field: 'checkinTimeRange',
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
      colProps: { span: 7 }
    },
    {
      field: 'participateLottery',
      component: 'ElSelect',
      label: '',
      options: yesNoOptions.value,
      componentProps: { placeholder: tr('activity.participateLottery'), clearable: true },
      colProps: { span: 4 }
    },
    {
      field: 'lottery_validate',
      component: 'ElSelect',
      label: '',
      options: yesNoOptions.value,
      componentProps: { placeholder: tr('activity.lotteryValidate'), clearable: true },
      colProps: { span: 4 }
    },
    {
      field: 'checkin',
      component: 'ElSelect',
      label: '',
      options: yesNoOptions.value,
      componentProps: { placeholder: tr('activity.checkinStatus'), clearable: true },
      colProps: { span: 4 }
    }
  ],
  rowProps: { gutter: 8 },
  colProps: { span: 6 }
}))

const columns = computed<UniTableColumn[]>(() => [
  { prop: 'codeStr', label: tr('activity.checkinCode'), minWidth: 110 },
  { prop: 'phone', label: tr('activity.registrationPhone'), minWidth: 120 },
  { prop: 'name', label: tr('activity.registrationName'), minWidth: 120 },
  { prop: 'email', label: tr('activity.registrationEmail'), minWidth: 160 },
  { prop: 'ticketIdStr', label: tr('activity.registrationTicketId'), minWidth: 120 },
  { prop: 'paidLabel', label: tr('activity.paidStatus'), minWidth: 100 },
  { prop: 'checkinLabel', label: tr('activity.checkinStatus'), minWidth: 100 },
  { prop: 'participateLotteryLabel', label: tr('activity.participateLottery'), minWidth: 120 },
  { prop: 'lotteryValidateLabel', label: tr('activity.lotteryValidate'), minWidth: 130 },
  { prop: 'checkinTimeLabel', label: tr('activity.checkinTime'), minWidth: 156 },
  { prop: 'createdAtLabel', label: tr('activity.colCreateTime'), minWidth: 156 }
])

const formCfg = computed<UniFormConfig>(() => ({
  formProps: { labelPosition: 'top' },
  colProps: { span: 24 },
  schema: [
    {
      field: 'checkin',
      label: tr('activity.checkinStatus'),
      component: 'ElSelect',
      options: yesNoOptions.value,
      componentProps: { style: { width: '100%' } }
    },
    {
      field: 'participateLottery',
      label: tr('activity.participateLottery'),
      component: 'ElSelect',
      options: yesNoOptions.value,
      componentProps: { style: { width: '100%' } }
    },
    {
      field: 'lottery_validate',
      label: tr('activity.lotteryValidate'),
      component: 'ElSelect',
      options: yesNoOptions.value,
      componentProps: { style: { width: '100%' } }
    },
    {
      field: 'allow_lottery',
      label: tr('activity.allowLottery'),
      component: 'ElSelect',
      options: yesNoOptions.value,
      componentProps: { style: { width: '100%' } }
    }
  ]
}))

const { queryModel, filters, handleLoadSuccess, reset, search } = useUniListState({
  initialFilters: {
    keyword: '',
    paid: undefined,
    participateLottery: undefined,
    lottery_validate: undefined,
    checkin: undefined,
    checkinTimeRange: []
  }
})

const decorateRows = (list: Row[]) => {
  for (const row of list) {
    row.codeStr = row.code == null ? '' : String(row.code)
    const ticketId = row.ticketId ?? row.ticket_id
    row.ticketIdStr = ticketId == null ? '' : String(ticketId)
    row.paidLabel =
      String(row.paid) === '1' || row.paid === true ? tr('activity.paidYes') : tr('activity.paidNo')
    const checkinVal = row.checkin ?? row.checked_in
    row.checkinLabel =
      checkinVal === true || checkinVal === 1 || checkinVal === '1'
        ? tr('activity.yes')
        : tr('activity.no')
    const participateVal = row.participateLottery ?? row.participate_lottery
    row.participateLotteryLabel =
      participateVal === true || participateVal === 1 || participateVal === '1'
        ? tr('activity.yes')
        : tr('activity.no')
    row.lotteryValidateLabel =
      row.lottery_validate === true || row.lottery_validate === 1 || row.lottery_validate === '1'
        ? tr('activity.yes')
        : tr('activity.no')
    const allowVal = row.allowLottery ?? row.allow_lottery
    row.allowLotteryLabel =
      allowVal === true || allowVal === 1 || allowVal === '1'
        ? tr('activity.yes')
        : tr('activity.no')
    const checkinRaw = row.checkinTime ?? row.checkin_time
    if (checkinRaw == null || checkinRaw === '') {
      row.checkinTimeLabel = ''
    } else {
      const checkinDay = dayjs(String(checkinRaw))
      row.checkinTimeLabel = checkinDay.isValid()
        ? checkinDay.format('YYYY-MM-DD HH:mm')
        : String(checkinRaw)
    }
    const createdRaw = row.createdAt ?? row.created_at
    if (createdRaw == null || createdRaw === '') {
      row.createdAtLabel = ''
    } else {
      const createdDay = dayjs(String(createdRaw))
      row.createdAtLabel = createdDay.isValid()
        ? createdDay.format('YYYY-MM-DD HH:mm')
        : String(createdRaw)
    }
  }
}

const loadData: UniTableRequest = async ({
  pageNo: current,
  pageSize: size,
  filters: filterModel
}) => {
  const f = filterModel as Row
  const range = Array.isArray(f.checkinTimeRange) ? f.checkinTimeRange : []
  const raw = await activityApi.checkinPage.get({
    activityId: props.activityId,
    current,
    size,
    pageNum: current,
    pageSize: size,
    keyword: f.keyword || undefined,
    paid: f.paid ?? undefined,
    participateLottery: f.participateLottery ?? undefined,
    lottery_validate: f.lottery_validate ?? undefined,
    checkin: f.checkin ?? undefined,
    checkinTimeStart: range[0] || undefined,
    checkinTimeEnd: range[1] || undefined
  })
  const { list, total } = normalizePaged<Row>(raw)
  decorateRows(list)
  return { data: list, total }
}

const openEdit = (row: Row) => {
  const checkinVal = row.checkin ?? row.checked_in
  const participateVal = row.participateLottery ?? row.participate_lottery
  const allowVal = row.allowLottery ?? row.allow_lottery
  snapshot.value = {
    id: row.id,
    code: row.code,
    email: row.email,
    name: row.name,
    phone: row.phone,
    paid: row.paid !== undefined && row.paid !== null ? Number(row.paid) : undefined,
    ticketId: row.ticketId ?? row.ticket_id,
    checkin_time: row.checkinTime ?? row.checkin_time,
    created_at: row.createdAt ?? row.created_at,
    win_item: row.winItem ?? row.win_item
  }
  Object.assign(form, {
    id: row.id,
    checkin: checkinVal === true || checkinVal === 1 || checkinVal === '1' ? 1 : 0,
    participateLottery:
      participateVal === true || participateVal === 1 || participateVal === '1' ? 1 : 0,
    lottery_validate:
      row.lottery_validate === true || row.lottery_validate === 1 || row.lottery_validate === '1'
        ? 1
        : 0,
    allow_lottery: allowVal === true || allowVal === 1 || allowVal === '1' ? 1 : 0
  })
  dialogVisible.value = true
}

const actions = computed<UniTableAction[]>(() =>
  props.readOnly
    ? []
    : [
        {
          label: tr('activity.entryEdit'),
          code: 'busdriver_edit',
          onClick: (row) => openEdit(row as Row)
        }
      ]
)

const resetDialog = () => {
  snapshot.value = {}
  Object.keys(form).forEach((key) => delete form[key])
  formRef.value?.clearValidate?.()
}

const exportCsv = async () => {
  if (exporting.value) return
  exporting.value = true
  try {
    const rows: Row[] = []
    const pageSize = 200
    let current = 1
    while (current < 600) {
      const f = filters.value as Row
      const range = Array.isArray(f.checkinTimeRange) ? f.checkinTimeRange : []
      const raw = await activityApi.checkinPage.get({
        activityId: props.activityId,
        current,
        size: pageSize,
        pageNum: current,
        pageSize,
        keyword: f.keyword || undefined,
        paid: f.paid ?? undefined,
        participateLottery: f.participateLottery ?? undefined,
        lottery_validate: f.lottery_validate ?? undefined,
        checkin: f.checkin ?? undefined,
        checkinTimeStart: range[0] || undefined,
        checkinTimeEnd: range[1] || undefined
      })
      const { list, total } = normalizePaged<Row>(raw)
      rows.push(...list)
      if (!list.length || list.length < pageSize || (total && rows.length >= total)) break
      current += 1
    }
    decorateRows(rows)
    const csv = [
      formatCsvRow([
        '#',
        tr('activity.checkinCode'),
        tr('activity.registrationPhone'),
        tr('activity.registrationName'),
        tr('activity.registrationEmail'),
        tr('activity.registrationTicketId'),
        tr('activity.paidStatus'),
        tr('activity.checkinStatus'),
        tr('activity.participateLottery'),
        tr('activity.lotteryValidate'),
        tr('activity.checkinTime'),
        tr('activity.colCreateTime')
      ]),
      ...rows.map((row, index) =>
        formatCsvRow([
          index + 1,
          row.codeStr,
          row.phone,
          row.name,
          row.email,
          row.ticketIdStr,
          row.paidLabel,
          row.checkinLabel,
          row.participateLotteryLabel,
          row.lotteryValidateLabel,
          row.checkinTimeLabel,
          row.createdAtLabel
        ])
      )
    ].join('\n')
    downloadBlob(
      new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' }),
      `activity-checkin-${props.activityId}.csv`
    )
  } finally {
    exporting.value = false
  }
}

const submit = async () => {
  const ok = await formRef.value?.validate().catch(() => false)
  if (!ok) return
  saving.value = true
  try {
    const row = snapshot.value
    await activityApi.checkinEdit.post({
      id: row.id,
      checkin: form.checkin === 1 || form.checkin === true,
      participateLottery: form.participateLottery,
      lottery_validate: form.lottery_validate,
      allow_lottery: form.allow_lottery,
      code: row.code != null && row.code !== '' ? String(row.code) : undefined,
      email: row.email != null && row.email !== '' ? String(row.email) : undefined,
      name: row.name != null && row.name !== '' ? String(row.name) : undefined,
      phone: row.phone != null && row.phone !== '' ? String(row.phone) : undefined,
      paid: row.paid,
      ticketId: row.ticketId,
      checkin_time: row.checkin_time,
      created_at: row.created_at,
      win_item: row.win_item
    })
    ElMessage.success(tr('activity.saveOk'))
    dialogVisible.value = false
    tableRef.value?.refresh()
  } finally {
    saving.value = false
  }
}

defineExpose({
  exportCsv
})
</script>
