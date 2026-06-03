<template>
  <section class="uni-list-page">
    <div class="uni-list-page__header">
      <div>
        <h1>{{ $t('activity.eventListTitle') }}</h1>
        <p class="uni-list-page__description">{{ $t('activity.eventListDesc') }}</p>
      </div>
      <div v-uni-permission="'busdriver_edit'" class="uni-list-page__header-actions">
        <el-button
          type="primary"
          @click="router.push({ name: 'ActivityEventDetail', query: { mode: 'edit' } })">
          {{ $t('activity.add') }}
        </el-button>
      </div>
    </div>
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
      selection="multiple"
      :columns="columns"
      :request="loadData"
      :filters="filters"
      :pagination="{ pageSize: 10, pageSizes: [10, 20, 50, 100] }"
      :toolbar="{ refresh: true, columnSetting: true }"
      :actions="actions"
      :action-column="{ width: 110, fixed: 'right' }"
      @load-success="handleLoadSuccess"
      @selection-change="onSelectionChange">
      <template #toolbar>
        <el-button
          v-uni-permission="'busdriver_edit'"
          plain
          :disabled="!selectedIds.length"
          @click="handleSendWechat(selectedRows, false)">
          {{ $t('activity.sendWechat') }}
        </el-button>
        <el-button
          v-uni-permission="'busdriver_edit'"
          plain
          :disabled="!selectedIds.length"
          @click="handleSendWechat(selectedRows, true)">
          {{ $t('activity.sendWechatTest') }}
        </el-button>
        <el-button
          v-uni-permission="'busdriver_edit'"
          plain
          :disabled="!selectedIds.length"
          @click="exportFeedbackBatch">
          {{ $t('activity.exportFeedback') }}
        </el-button>
        <el-button
          v-uni-permission="'busdriver_edit'"
          plain
          :disabled="!selectedIds.length"
          @click="exportQuestionnaireByActivityBatch">
          {{ $t('activity.exportQuestionnaireByActivity') }}
        </el-button>
        <el-button
          v-uni-permission="'busdriver_edit'"
          plain
          :disabled="!selectedIds.length"
          @click="publishBatch">
          {{ $t('activity.publishBatch') }}
        </el-button>
        <el-button
          v-uni-permission="'busdriver_del'"
          type="danger"
          plain
          :disabled="!selectedIds.length"
          @click="deleteBatch">
          {{ $t('activity.delBatch') }}
        </el-button>
      </template>
    </UniDataTable>
  </section>
</template>

<script setup lang="ts">
import { activityStatusOptions, checkinMethodOptions, searchForm, tableCols } from './list.config'
import { activityApi, activityQuestionnaireApi } from '@/api'
import { useActivityYesNoOptions } from '@/composables/use-activity-yes-no-options'
import { useMembershipSchoolOptions } from '@/composables/use-membership-school-options'
import type { Translate } from '@/types/i18n'
import { normalizePaged } from '@/utils/api-response-normalize'
import { downloadBlob, downloadResponseBlob } from '@/utils/download'
import { dateFormat } from '@/utils/tool'
import { ElMessage, ElMessageBox } from 'element-plus'
import { UniDataTable, UniSearchForm, useUniI18n, useUniListState } from 'uni-ui-lib'
import type { UniTableAction, UniTableRequest } from 'uni-ui-lib'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const { t } = useUniI18n()

const router = useRouter()

type ActivityRow = Record<string, unknown>

const tr = t as Translate

const { schoolOptions, loadSchoolOptions } = useMembershipSchoolOptions()
const lockedSchoolId = ref<string | number | undefined>(undefined)

const statusOpts = computed(() => activityStatusOptions(tr))
const checkinOpts = computed(() => checkinMethodOptions(tr))
const ynOpts = useActivityYesNoOptions()
const showSchoolFilter = computed(() => schoolOptions.value.length > 1)

onMounted(async () => {
  await loadSchoolOptions()
  if (schoolOptions.value.length === 1) {
    const v = schoolOptions.value[0]?.value
    if (v != null) {
      lockedSchoolId.value = v as string | number
    }
  }
})

const initialFilters = {
  activityCnName: '',
  activityEnName: '',
  schoolIds: undefined,
  activityStatus: undefined,
  isBanner: undefined,
  recommended: undefined,
  activityStartTime: undefined,
  activityEndTime: undefined
} as Record<string, unknown>

const { queryModel, filters, handleLoadSuccess, reset, search, tableRef } = useUniListState({
  initialFilters
})

const searchCfg = computed(() =>
  searchForm(tr, schoolOptions.value, ynOpts.value, statusOpts.value, showSchoolFilter.value)
)

const columns = computed(() =>
  tableCols(tr, schoolOptions.value, ynOpts.value, statusOpts.value, checkinOpts.value)
)

const selectedRows = ref<ActivityRow[]>([])
const selectedIds = computed(
  () => selectedRows.value.map((row) => row.id).filter((id) => id != null) as Array<string | number>
)

const formatRows = (list: ActivityRow[]) => {
  for (const row of list) {
    const schoolIdsRaw = row.schoolIds
    if (!Array.isArray(schoolIdsRaw)) {
      if (schoolIdsRaw == null || schoolIdsRaw === '') {
        row.schoolIds = []
      } else if (typeof schoolIdsRaw === 'string') {
        row.schoolIds = schoolIdsRaw
          .split(/[,;\s]+/)
          .map((segment) => segment.trim())
          .filter(Boolean)
      } else {
        row.schoolIds = [schoolIdsRaw]
      }
    }
    row.activityStatus = row.activityStatus == null ? '' : String(row.activityStatus)
    row.recommended = row.recommended == null ? '' : String(row.recommended)
    const bannerRaw = row.banner ?? row.isBanner
    row.banner = bannerRaw == null ? '' : String(bannerRaw)
    row.checkinMethod = row.checkinMethod == null ? '' : String(row.checkinMethod)
    row.createTime = row.createTime ? dateFormat(String(row.createTime), 'yyyy-MM-dd hh:mm') : '—'
    row.activityStartTime = row.activityStartTime
      ? dateFormat(String(row.activityStartTime), 'yyyy-MM-dd hh:mm')
      : '—'
    row.activityEndTime = row.activityEndTime
      ? dateFormat(String(row.activityEndTime), 'yyyy-MM-dd hh:mm')
      : '—'
  }
}

const onSelectionChange = (rows: Record<string, unknown>[]) => {
  selectedRows.value = rows as ActivityRow[]
}

const loadData: UniTableRequest = async ({
  pageNo: current,
  pageSize: size,
  filters: filterModel
}) => {
  const f = filterModel as ActivityRow
  const raw = await activityApi.page.get({
    current,
    size,
    activityCnName: (f.activityCnName as string) || undefined,
    activityEnName: (f.activityEnName as string) || undefined,
    schoolIds: lockedSchoolId.value ?? f.schoolIds ?? undefined,
    activityStatus: f.activityStatus || undefined,
    isBanner: f.isBanner || undefined,
    recommended: f.recommended || undefined,
    activityStartTime: (f.activityStartTime as string) || undefined,
    activityEndTime: (f.activityEndTime as string) || undefined
  })
  const { list, total } = normalizePaged<ActivityRow>(raw)
  formatRows(list)
  return { data: list, total }
}

const goDetail = (row: ActivityRow, mode: 'view' | 'edit') => {
  if (row.id == null) {
    return
  }
  router.push({ name: 'ActivityEventDetail', query: { id: String(row.id), mode } })
}

const actions = computed<UniTableAction[]>(() => [
  { label: tr('activity.lookDetail'), onClick: (row) => goDetail(row as ActivityRow, 'view') },
  {
    label: tr('activity.entryEdit'),
    code: 'busdriver_edit',
    visible: (row) => ['0', '1'].includes(String((row as ActivityRow).activityStatus)),
    onClick: (row) => {
      if (!['0', '1'].includes(String((row as ActivityRow).activityStatus))) {
        ElMessage.warning(tr('activity.eventEndedNoEdit'))
        return
      }
      goDetail(row as ActivityRow, 'edit')
    }
  }
])

const handleSendWechat = async (items: ActivityRow[], isTest: boolean) => {
  const list = items.length ? items : []
  if (!list.length) {
    ElMessage.warning(tr('activity.eventSelFirst'))
    return
  }
  const title = isTest ? tr('activity.sendWechatTest') : tr('activity.sendWechat')
  try {
    await ElMessageBox.confirm(tr('activity.confirmSendWechat', { title }), tr('common.tip'), {
      type: 'warning'
    })
  } catch {
    return
  }
  const req = isTest ? activityApi.sendWechatTest.post : activityApi.sendWechat.post
  const results = await Promise.all(
    list.map(async (item) => {
      try {
        await req(item.id as string | number)
        return true
      } catch {
        return false
      }
    })
  )
  if (results.length && results.every(Boolean)) {
    ElMessage.success(tr('activity.saveOk'))
  } else {
    ElMessage.warning(tr('activity.partialWechatFail'))
  }
}

const exportFeedbackBatch = async () => {
  if (!selectedIds.value.length) {
    ElMessage.warning(tr('activity.eventSelFirst'))
    return
  }
  try {
    for (const id of selectedIds.value) {
      const response = await activityApi.feedbackExport.get(id)
      downloadResponseBlob(response, `activity-feedback-${id}.xlsx`)
    }
    ElMessage.success(tr('activity.saveOk'))
  } catch {
    ElMessage.error(tr('activity.exportFail'))
  }
}

const exportQuestionnaireByActivityBatch = async () => {
  if (!selectedIds.value.length) {
    ElMessage.warning(tr('activity.eventSelFirst'))
    return
  }
  try {
    for (const id of selectedIds.value) {
      const blob = await activityQuestionnaireApi.exportByActivityBlob.get(id)
      downloadBlob(blob as Blob, `questionnaire-answers-${id}.xlsx`)
    }
    ElMessage.success(tr('activity.saveOk'))
  } catch {
    ElMessage.error(tr('activity.exportQuestionnaireFail'))
  }
}

const publishBatch = async () => {
  if (!selectedIds.value.length) {
    ElMessage.warning(tr('activity.eventSelFirst'))
    return
  }
  const idSet = new Set(selectedIds.value.map((id) => String(id)))
  const pendingRows = selectedRows.value.filter(
    (row) => idSet.has(String(row.id)) && String(row.activityStatus) === '0'
  )
  const ids = pendingRows.map((row) => row.id).filter((id) => id != null) as Array<string | number>
  if (!ids.length) {
    ElMessage.warning(tr('activity.noPendingInSelection'))
    return
  }
  const skipped = selectedIds.value.length - pendingRows.length
  const tip =
    skipped > 0
      ? tr('activity.batchPublishSkip', { n: ids.length, m: skipped })
      : tr('activity.batchPublishConfirm', { n: ids.length })
  try {
    await ElMessageBox.confirm(tip, tr('common.tip'), { type: 'warning' })
  } catch {
    return
  }
  await activityApi.batchPublish.post(ids)
  ElMessage.success(tr('activity.saveOk'))
  selectedRows.value = []
  tableRef.value?.refresh()
}

const deleteBatch = async () => {
  if (!selectedIds.value.length) {
    ElMessage.warning(tr('activity.eventSelFirst'))
    return
  }
  await ElMessageBox.confirm(tr('activity.confirmDeleteEvents'), tr('common.tip'), {
    type: 'warning'
  })
  await activityApi.remove.delete(selectedIds.value)
  ElMessage.success(tr('activity.saveOk'))
  selectedRows.value = []
  tableRef.value?.refresh()
}
</script>
