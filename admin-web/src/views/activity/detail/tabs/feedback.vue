<template>
  <section class="activity-feedback-tab">
    <div class="uni-list-page__body">
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
        :selection="readOnly || !canDelete ? false : 'multiple'"
        :columns="columns"
        :request="loadData"
        :filters="filters"
        :pagination="{ pageSize: 10, pageSizes: [10, 20, 50, 100] }"
        :toolbar="{ refresh: true, columnSetting: true }"
        :actions="actions"
        :action-column="{ width: 120, fixed: 'right' }"
        @load-success="handleLoadSuccess"
        @selection-change="onSelectionChange">
        <template #toolbar>
          <template v-if="!readOnly">
            <el-button
              v-if="canDelete"
              type="danger"
              plain
              :disabled="!selectedIds.length"
              @click="deleteSelected">
              {{ $t('activity.delBatch') }}
            </el-button>
            <el-button
              v-uni-permission="'busdriver_edit'"
              plain
              :disabled="!selectedIds.length"
              @click="batchVisible(1)">
              {{ $t('activity.visibleYes') }}
            </el-button>
            <el-button
              v-uni-permission="'busdriver_edit'"
              plain
              :disabled="!selectedIds.length"
              @click="batchVisible(0)">
              {{ $t('activity.visibleNo') }}
            </el-button>
          </template>
        </template>
      </UniDataTable>
    </div>
    <el-dialog
      v-model="detailVisible"
      :title="$t('activity.feedbackDetailTitle')"
      width="560px"
      append-to-body>
      <el-descriptions :column="1" border>
        <el-descriptions-item :label="$t('activity.feedbackContent')">
          {{ detail.content || '-' }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('activity.feedbackSatisfaction')">
          {{ detail.satisfactionLabel || '-' }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('activity.registrationPhone')">
          {{ detail.phone || '-' }}
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
      :title="$t('activity.feedbackEditTitle')"
      width="560px"
      append-to-body
      destroy-on-close
      :close-on-click-modal="false"
      @closed="resetEdit">
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
import type { UniFormConfig, UniTableAction, UniTableColumn, UniTableRequest } from 'uni-ui-lib'
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

import { activityApi } from '@/api'
import type { Translate } from '@/types/i18n'
import { normalizeEnvelope, normalizePaged } from '@/utils/api-response-normalize'
import { downloadResponseBlob } from '@/utils/download'

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
const detailVisible = ref(false)
const editVisible = ref(false)
const saving = ref(false)
const exporting = ref(false)
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
const satisfactionOptions = computed(() => [
  { label: tr('activity.feedbackUnsatisfied'), value: 1 },
  { label: tr('activity.feedbackNormal'), value: 2 },
  { label: tr('activity.feedbackSatisfied'), value: 3 }
])

const searchCfg = computed<UniFormConfig>(() => ({
  schema: [
    {
      field: 'keyword',
      component: 'ElInput',
      label: '',
      componentProps: { placeholder: tr('activity.feedbackKeyword'), clearable: true },
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
  {
    prop: 'content',
    label: tr('activity.feedbackContent'),
    minWidth: 220,
    showOverflowTooltip: true
  },
  { prop: 'satisfactionLabel', label: tr('activity.feedbackSatisfaction'), minWidth: 110 },
  { prop: 'phone', label: tr('activity.registrationPhone'), minWidth: 120 },
  { prop: 'visibleLabel', label: tr('activity.visibleStatus'), minWidth: 100 },
  { prop: 'createTimeLabel', label: tr('activity.colCreateTime'), minWidth: 156 }
])

const formCfg = computed<UniFormConfig>(() => ({
  formProps: { labelPosition: 'top' },
  colProps: { span: 24 },
  schema: [
    {
      field: 'content',
      label: tr('activity.feedbackContent'),
      component: 'ElInput',
      required: true,
      componentProps: { type: 'textarea', rows: 4, maxlength: 2000, showWordLimit: true }
    },
    {
      field: 'satisfactionRate',
      label: tr('activity.feedbackSatisfaction'),
      component: 'ElRadioGroup',
      options: satisfactionOptions.value,
      required: true
    },
    { field: 'phone', label: tr('activity.registrationPhone'), component: 'ElInput' },
    {
      field: 'visible',
      label: tr('activity.visibleStatus'),
      component: 'ElRadioGroup',
      options: yesNoOptions.value,
      required: true
    },
    { field: 'parentId', label: tr('activity.registrationParentId'), component: 'ElInput' }
  ]
}))

const { queryModel, filters, handleLoadSuccess, reset, search } = useUniListState({
  initialFilters: { keyword: '', visible: undefined }
})

const selectedIds = computed(
  () => selectedRows.value.map((row) => row.id).filter((id) => id != null) as Array<string | number>
)
const canDelete = computed(() => hasPermission('busdriver_del'))

const decorateRows = (list: Row[], pageNo: number, pageSize: number) => {
  list.forEach((row, index) => {
    row._seq = (pageNo - 1) * pageSize + index + 1
    const satHit = satisfactionOptions.value.find(
      (item) => String(item.value) === String(row.satisfactionRate)
    )
    row.satisfactionLabel = satHit?.label ?? ''
    row.visibleLabel =
      String(row.visible) === '1' || row.visible === true ? tr('activity.yes') : tr('activity.no')
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
  const raw = await activityApi.feedbackPage.get({
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

const openDetail = async (row: Row) => {
  const raw = await activityApi.feedbackDetail.get(row.id as string | number)
  const data = normalizeEnvelope(raw)
  Object.assign(detail, { ...row, ...data })
  const satHit = satisfactionOptions.value.find(
    (item) => String(item.value) === String(detail.satisfactionRate)
  )
  detail.satisfactionLabel = satHit?.label ?? ''
  detail.visibleLabel =
    String(detail.visible) === '1' || detail.visible === true
      ? tr('activity.yes')
      : tr('activity.no')
  const timeRaw = detail.createTime ?? detail.create_time
  if (timeRaw == null || timeRaw === '') {
    detail.createTimeLabel = ''
  } else {
    const d = dayjs(String(timeRaw))
    detail.createTimeLabel = d.isValid() ? d.format('YYYY-MM-DD HH:mm') : String(timeRaw)
  }
  detailVisible.value = true
}

const openEdit = async (row: Row) => {
  const raw = await activityApi.feedbackDetail.get(row.id as string | number)
  Object.assign(form, row, normalizeEnvelope(raw))
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
  await ElMessageBox.confirm(tr('activity.confirmDeleteFeedback'), tr('common.tip'), {
    type: 'warning'
  })
  await activityApi.feedbackRemove.delete(selectedIds.value)
  ElMessage.success(tr('activity.deleteOk'))
  selectedRows.value = []
  tableRef.value?.refresh()
}

const batchVisible = async (visible: 0 | 1) => {
  if (!selectedRows.value.length) return
  await ElMessageBox.confirm(tr('activity.confirmBatchVisible'), tr('common.tip'), {
    type: 'warning'
  })
  await Promise.all(
    selectedRows.value.map((row) => activityApi.feedbackEdit.post({ id: row.id, visible }))
  )
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
    await activityApi.feedbackEdit.post({ ...form })
    ElMessage.success(tr('activity.saveOk'))
    editVisible.value = false
    tableRef.value?.refresh()
  } finally {
    saving.value = false
  }
}

const exportFeedback = async () => {
  exporting.value = true
  try {
    const response = await activityApi.feedbackExport.get(props.activityId)
    downloadResponseBlob(response, `activity-feedback-${props.activityId}.xlsx`)
  } finally {
    exporting.value = false
  }
}

defineExpose({
  exportFeedback
})
</script>
