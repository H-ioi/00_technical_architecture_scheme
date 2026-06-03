<template>
  <section class="uni-list-page" :class="{ 'uni-list-page--embedded': embedded }">
    <div v-if="!embedded" class="uni-list-page__header">
      <div>
        <h1>{{ $t('activity.questionnaireTitle') }}</h1>
        <p class="uni-list-page__description">{{ $t('activity.questionnaireDesc') }}</p>
      </div>
      <div v-uni-permission="'busdriver_edit'" class="uni-list-page__header-actions">
        <el-button type="primary" @click="metaDlg?.open('add')">{{ $t('activity.add') }}</el-button>
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
      :action-column="{ width: 140, fixed: 'right' }"
      @load-success="handleLoadSuccess"
      @selection-change="onSelectionChange">
      <template #toolbar>
        <el-button
          v-uni-permission="'busdriver_edit'"
          plain
          :disabled="!selectedIds.length"
          @click="openBatchStatus">
          {{ $t('activity.qBatchChangeStatus') }}
        </el-button>
        <el-button
          v-uni-permission="'busdriver_edit'"
          plain
          :disabled="!selectedIds.length"
          @click="batchDlg?.open('frozen', selectedIds)">
          {{ $t('activity.qBatchChangeFrozen') }}
        </el-button>
        <el-button
          v-uni-permission="'busdriver_del'"
          type="danger"
          plain
          :disabled="!selectedIds.length"
          @click="deleteSelected">
          {{ $t('activity.delBatch') }}
        </el-button>
      </template>
    </UniDataTable>

    <MetaFormDialog ref="metaDlg" @saved="refreshTable" />
    <QuestionnaireCopyDialog ref="copyDlg" @saved="refreshTable" />
    <BatchFlagDialog ref="batchDlg" @saved="refreshTable" />
  </section>
</template>

<script setup lang="ts">
import { searchForm, tableCols } from './list.config'
import { activityApi, activityQuestionnaireApi } from '@/api'
import { useActivityYesNoOptions } from '@/composables/use-activity-yes-no-options'
import { useMembershipSchoolOptions } from '@/composables/use-membership-school-options'
import type { Translate } from '@/types/i18n'
import { normalizeArray, normalizePaged } from '@/utils/api-response-normalize'
import { buildQuestionnaireSignupUrl } from '@/utils/questionnaire-url'
import { dateFormat } from '@/utils/tool'
import BatchFlagDialog from '@/views/activity/questionnaire/components/batch-flag-dialog.vue'
import QuestionnaireCopyDialog from '@/views/activity/questionnaire/components/copy-dialog.vue'
import MetaFormDialog from '@/views/activity/questionnaire/components/meta-form-dialog.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { UniDataTable, UniSearchForm, useUniI18n, useUniListState } from 'uni-ui-lib'
import type { UniOption, UniTableAction, UniTableRequest } from 'uni-ui-lib'
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const props = withDefaults(
  defineProps<{
    embedded?: boolean
    activityId?: string | number
  }>(),
  {
    embedded: false,
    activityId: undefined
  }
)

const metaDlg = ref<InstanceType<typeof MetaFormDialog> | null>(null)
const copyDlg = ref<InstanceType<typeof QuestionnaireCopyDialog> | null>(null)
const batchDlg = ref<InstanceType<typeof BatchFlagDialog> | null>(null)

type QuestionnaireListRow = Record<string, unknown>

const { locale, t } = useUniI18n()
const tr = t as Translate
const route = useRoute()
const router = useRouter()

const { schoolOptions, loadSchoolOptions } = useMembershipSchoolOptions()
const activityOptions = ref<UniOption[]>([])

const ynDispOptions = useActivityYesNoOptions()

const loadOpts = async () => {
  try {
    const raw = await activityApi.listBrief.get({ questionnaireFlag: 1 })
    const rows = normalizeArray(raw) as Record<string, unknown>[]
    activityOptions.value = rows.map((row) => ({
      label: String(
        locale.value === 'en'
          ? (row.activityEnName ??
              row.activityCnName ??
              row.activityName ??
              row.name ??
              row.id ??
              '')
          : (row.activityCnName ??
              row.activityEnName ??
              row.activityName ??
              row.name ??
              row.id ??
              '')
      ),
      value: row.id as string | number
    }))
  } catch {
    activityOptions.value = []
  }
}

onMounted(async () => {
  await loadSchoolOptions()
  await loadOpts()
})

const initialFilters = {
  name: '',
  schoolIds: undefined,
  activityId:
    props.activityId != null && props.activityId !== ''
      ? String(props.activityId)
      : route.query.activityId != null && route.query.activityId !== ''
        ? String(route.query.activityId)
        : undefined,
  status: undefined,
  createStartTime: undefined,
  createEndTime: undefined
} as Record<string, unknown>

const { queryModel, filters, handleLoadSuccess, refreshTable, reset, search, tableRef } =
  useUniListState({
    initialFilters
  })

const searchCfg = computed(() =>
  searchForm(tr, schoolOptions.value, activityOptions.value, ynDispOptions.value)
)

const columns = computed(() => tableCols(tr, schoolOptions.value, ynDispOptions.value))

const selectedRows = ref<QuestionnaireListRow[]>([])
const selectedIds = computed(
  () => selectedRows.value.map((row) => row.id).filter((id) => id != null) as Array<string | number>
)

const applyRowDisplayFormat = (list: QuestionnaireListRow[]) => {
  for (const row of list) {
    const rawSchoolIds = row.schoolIds
    if (Array.isArray(rawSchoolIds)) {
      row.schoolIds = rawSchoolIds
    } else if (rawSchoolIds == null || rawSchoolIds === '') {
      row.schoolIds = []
    } else if (typeof rawSchoolIds === 'string') {
      row.schoolIds = rawSchoolIds
        .split(/[,;\s]+/)
        .map((segment) => segment.trim())
        .filter(Boolean)
    } else {
      row.schoolIds = [rawSchoolIds]
    }
    row.status = row.status == null ? '' : String(row.status)
    row.frozen = row.frozen == null ? '' : String(row.frozen)
    row.needStudentInfo = row.needStudentInfo == null ? '' : String(row.needStudentInfo)
    row.createTime = row.createTime ? dateFormat(String(row.createTime), 'yyyy-MM-dd hh:mm') : '—'
    row.updateTime = row.updateTime ? dateFormat(String(row.updateTime), 'yyyy-MM-dd hh:mm') : '—'
  }
}

const onSelectionChange = (rows: Record<string, unknown>[]) => {
  selectedRows.value = rows as QuestionnaireListRow[]
}

const loadData: UniTableRequest = async ({
  pageNo: current,
  pageSize: size,
  filters: filterModel
}) => {
  const f = filterModel as QuestionnaireListRow
  const raw = await activityQuestionnaireApi.page.get({
    current,
    size,
    name: f.name || undefined,
    schoolIds: f.schoolIds || undefined,
    activityId: f.activityId || undefined,
    status: f.status || undefined,
    createStartTime: f.createStartTime || undefined,
    createEndTime: f.createEndTime || undefined
  })
  const { list, total } = normalizePaged<QuestionnaireListRow>(raw)
  applyRowDisplayFormat(list)
  return { data: list, total }
}

const copySignupLink = async (row: QuestionnaireListRow) => {
  if (row.id == null) {
    return
  }
  const url = buildQuestionnaireSignupUrl(row.id as string | number)
  if (!url) {
    ElMessage.warning(tr('activity.signupLinkUnavailable'))
    return
  }
  try {
    await navigator.clipboard.writeText(url)
    ElMessage.success(tr('activity.signupLinkCopied'))
  } catch {
    ElMessage.error(tr('activity.signupLinkCopyFail'))
  }
}

const actions = computed<UniTableAction[]>(() => [
  {
    label: tr('activity.questionnaireRowData'),
    onClick: (row) => {
      const id = (row as QuestionnaireListRow).id
      if (id != null) {
        void router.push({ name: 'ActivityQuestionnaireSubmissions', params: { id: String(id) } })
      }
    }
  },
  {
    label: tr('activity.entryEdit'),
    code: 'busdriver_edit',
    onClick: (row) => void metaDlg.value?.open('edit', row as QuestionnaireListRow)
  },
  {
    label: tr('activity.questionnaireDesigner'),
    code: 'busdriver_edit',
    onClick: (row) => {
      const id = (row as QuestionnaireListRow).id
      if (id != null) {
        void router.push({ name: 'ActivityQuestionnaireEdit', params: { id: String(id) } })
      }
    }
  },
  {
    label: tr('activity.actionCopyQuestionnaire'),
    code: 'busdriver_edit',
    onClick: (row) => void copyDlg.value?.open(row as QuestionnaireListRow)
  },
  {
    label: tr('activity.copySignupLink'),
    onClick: (row) => void copySignupLink(row as QuestionnaireListRow)
  }
])

const deleteSelected = async () => {
  if (!selectedIds.value.length) {
    return
  }
  await ElMessageBox.confirm(tr('activity.confirmDeleteQuestionnaire'), tr('common.tip'), {
    type: 'warning'
  })
  await activityQuestionnaireApi.remove.delete(selectedIds.value)
  ElMessage.success(tr('activity.deleteOk'))
  selectedRows.value = []
  tableRef.value?.refresh()
}
</script>
