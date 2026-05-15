<template>
  <section class="uni-list-page">
    <div class="uni-list-page__header">
      <div>
        <h1>{{ $t('activity.questionnaireTitle') }}</h1>
        <p class="uni-list-page__description">{{ $t('activity.questionnaireDesc') }}</p>
      </div>
      <div v-uni-permission="'busdriver_edit'" class="uni-list-page__header-actions">
        <el-button type="primary" @click="openMetaAdd">{{ $t('activity.add') }}</el-button>
      </div>
    </div>
    <UniSearchForm
      v-model="qm"
      :config="sch"
      :collapsed="true"
      :collapsed-rows="1"
      :action-min-span="0"
      :submit-text="$t('activity.search')"
      :reset-text="$t('activity.reset')"
      @search="sea"
      @reset="rst" />
    <UniDataTable
      ref="tb"
      row-key="id"
      selection="multiple"
      :columns="cols"
      :request="lod"
      :filters="filt"
      :pagination="{ pageSize: 10, pageSizes: [10, 20, 50, 100] }"
      :toolbar="{ refresh: true, columnSetting: true }"
      :actions="acts"
      :action-column="{ width: 140, fixed: 'right' }"
      @load-success="hdl"
      @selection-change="onSel">
      <template #toolbar>
        <el-button
          v-uni-permission="'busdriver_edit'"
          plain
          :disabled="!selIds.length"
          @click="openBatchStatus">
          {{ $t('activity.qBatchChangeStatus') }}
        </el-button>
        <el-button
          v-uni-permission="'busdriver_edit'"
          plain
          :disabled="!selIds.length"
          @click="openBatchFrozen">
          {{ $t('activity.qBatchChangeFrozen') }}
        </el-button>
        <el-button
          v-uni-permission="'busdriver_del'"
          type="danger"
          plain
          :disabled="!selIds.length"
          @click="del">
          {{ $t('activity.delBatch') }}
        </el-button>
      </template>
    </UniDataTable>

    <MetaFormDialog ref="metaDlg" @saved="onDlgSaved" />
    <QuestionnaireCopyDialog ref="copyDlg" @saved="onDlgSaved" />
    <BatchFlagDialog ref="batchDlg" @saved="onDlgSaved" />
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
import { UniDataTable, UniSearchForm, useUniI18n, useUniListState } from 'uni-ui-lib'

import { activityApi, activityQuestionnaireApi } from '@/api'

import type { Translate } from '@/types/i18n'

import { normalizeArray, normalizePaged } from '@/utils/api-response-normalize'

import { computed, onMounted, ref } from 'vue'

import { useRouter } from 'vue-router'

import { ElMessage, ElMessageBox } from 'element-plus'

import BatchFlagDialog from '@/views/activity/questionnaire/components/batch-flag-dialog.vue'
import QuestionnaireCopyDialog from '@/views/activity/questionnaire/components/copy-dialog.vue'
import MetaFormDialog from '@/views/activity/questionnaire/components/meta-form-dialog.vue'
import {
  buildQuestionnaireSignupUrl,
  fmtTs,
  useMembershipSchoolOptions,
  yesNoOptions
} from '@/views/activity/questionnaire/utils/questionnaire-utils'

type L = Record<string, unknown>

const { t, locale } = useUniI18n()
const tr = t as Translate

const router = useRouter()

const { schoolOptions, loadSchoolOptions, schoolIdsCsv } = useMembershipSchoolOptions()

const activityOpts = ref<UniOption[]>([])

const yn = () => yesNoOptions(tr)

const loadActs = async () => {
  try {
    const raw = await activityApi.listBrief.get({ questionnaireFlag: 1 })

    const rows = normalizeArray(raw) as Record<string, unknown>[]

    activityOpts.value = rows.map((x) => ({
      label: String(
        locale.value === 'en'
          ? (x.activityEnName ?? x.activityCnName ?? x.activityName ?? x.name ?? x.id ?? '')
          : (x.activityCnName ?? x.activityEnName ?? x.activityName ?? x.name ?? x.id ?? '')
      ),
      value: x.id as string | number
    }))
  } catch {
    activityOpts.value = []
  }
}

onMounted(async () => {
  await loadSchoolOptions()

  await loadActs()
})

const {
  queryModel: qm,
  filters: filt,
  handleLoadSuccess: hdl,
  reset: rst,
  search: sea,
  tableRef: tb
} = useUniListState({
  initialFilters: {
    name: '',
    schoolIds: undefined,
    activityId: undefined,
    status: undefined,
    createStartTime: undefined,

    createEndTime: undefined
  } as Record<string, unknown>
})

const sch = computed(
  (): UniFormConfig => ({
    schema: [
      {
        field: 'name',
        component: 'ElInput',

        label: '',
        componentProps: { placeholder: tr('activity.questionnaireName'), clearable: true },

        colProps: { span: 5 }
      },
      {
        field: 'schoolIds',
        component: 'ElSelect',
        label: '',
        options: schoolOptions.value,
        componentProps: {
          placeholder: tr('activity.selSchool'),

          clearable: true,

          filterable: true
        },
        colProps: { span: 5 }
      },
      {
        field: 'activityId',

        component: 'ElSelect',

        label: '',

        options: activityOpts.value,

        componentProps: {
          placeholder: tr('activity.questionnaireActivity'),
          clearable: true,
          filterable: true
        },
        colProps: { span: 6 }
      },
      {
        field: 'status',

        component: 'ElSelect',

        label: '',
        options: yn(),

        componentProps: { placeholder: tr('activity.questionnaireValid'), clearable: true },
        colProps: { span: 4 }
      },
      {
        field: 'createStartTime',
        component: 'ElDatePicker',

        label: '',
        componentProps: {
          type: 'datetime',
          placeholder: tr('activity.timeStart'),

          clearable: true,
          valueFormat: 'YYYY-MM-DD HH:mm:ss'
        },
        colProps: { span: 7 }
      },
      {
        field: 'createEndTime',
        component: 'ElDatePicker',
        label: '',
        componentProps: {
          type: 'datetime',

          placeholder: tr('activity.timeEnd'),
          clearable: true,
          valueFormat: 'YYYY-MM-DD HH:mm:ss'
        },
        colProps: { span: 7 }
      }
    ],
    rowProps: { gutter: 8 }
  })
)

const cols = computed((): UniTableColumn[] => [
  { prop: 'id', label: 'ID', width: 100 },
  { prop: 'name', label: tr('activity.questionnaireName'), minWidth: 140 },

  { prop: '_schoolLbl', label: tr('activity.colSchool'), minWidth: 160 },

  { prop: 'activityName', label: tr('activity.colActivityName'), minWidth: 120 },

  {
    prop: 'status',
    label: tr('activity.questionnaireValid'),
    type: 'tag',
    options: yn(),
    width: 100
  },
  {
    prop: 'frozen',
    label: tr('activity.questionnaireFrozen'),
    type: 'tag',
    options: yn(),
    width: 100
  },
  {
    prop: 'needStudentInfo',
    label: tr('activity.questionnaireNeedStudent'),
    type: 'tag',
    options: yn(),
    width: 130
  },
  { prop: 'instructions', label: tr('activity.colInstructions'), minWidth: 160 },

  { prop: 'updateTime', label: tr('activity.colUpdated'), width: 168 },
  { prop: 'createTime', label: tr('activity.colCreated'), width: 168 }
])

const metaDlg = ref<InstanceType<typeof MetaFormDialog> | null>(null)
const copyDlg = ref<InstanceType<typeof QuestionnaireCopyDialog> | null>(null)
const batchDlg = ref<InstanceType<typeof BatchFlagDialog> | null>(null)

const openMetaAdd = () => metaDlg.value?.open('add')

const onDlgSaved = () => tb.value?.refresh()

const openBatchStatus = () => batchDlg.value?.open('status', selIds.value)

const openBatchFrozen = () => batchDlg.value?.open('frozen', selIds.value)

const selRows = ref<L[]>([])

const selIds = computed(
  () => selRows.value.map((r) => r.id).filter((x) => x != null) as Array<string | number>
)

const fmt = (list: L[]) => {
  for (const row of list) {
    row._schoolLbl = schoolIdsCsv(row.schoolIds)
    row.status = row.status == null ? '' : String(row.status)

    row.frozen = row.frozen == null ? '' : String(row.frozen)
    row.needStudentInfo = row.needStudentInfo == null ? '' : String(row.needStudentInfo)
    row.createTime = fmtTs(row.createTime)
    row.updateTime = fmtTs(row.updateTime)
  }
}

const onSel = (rows: Record<string, unknown>[]) => {
  selRows.value = rows as L[]
}

const lod: UniTableRequest = async ({ pageNo, pageSize, filters: f }) => {
  const fl = f as L
  const raw = await activityQuestionnaireApi.page.get({
    current: pageNo,
    size: pageSize,
    name: fl.name || undefined,
    schoolIds: fl.schoolIds || undefined,

    activityId: fl.activityId || undefined,
    status: fl.status || undefined,
    createStartTime: fl.createStartTime || undefined,
    createEndTime: fl.createEndTime || undefined
  })
  const { list, total } = normalizePaged<L>(raw)
  fmt(list)
  return { data: list, total }
}

const copySignup = async (row: L) => {
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

const openDesignerEdit = (row: L) => {
  if (row.id == null) {
    return
  }

  router.push({
    name: 'ActivityQuestionnaireDesign',
    params: { id: String(row.id) }
  })
}

const acts = computed<UniTableAction[]>(() => [
  { label: tr('activity.lookDetail'), onClick: (row) => open(row as L) },
  {
    label: tr('activity.entryEdit'),
    code: 'busdriver_edit',
    onClick: (row) => metaDlg.value?.open('edit', row as L)
  },
  {
    label: tr('activity.questionnaireDesigner'),
    code: 'busdriver_edit',
    onClick: (row) => openDesignerEdit(row as L)
  },
  {
    label: tr('activity.actionCopyQuestionnaire'),
    code: 'busdriver_edit',
    onClick: (row) => copyDlg.value?.open(row as L)
  },
  { label: tr('activity.copySignupLink'), onClick: (row) => void copySignup(row as L) }
])

const open = (row: L) => {
  router.push({ name: 'ActivityQuestionnaireDetail', params: { id: String(row.id) } })
}

const del = async () => {
  if (!selIds.value.length) {
    return
  }
  await ElMessageBox.confirm(tr('activity.confirmDeleteQuestionnaire'), tr('common.tip'), {
    type: 'warning'
  })
  await activityQuestionnaireApi.remove.delete(selIds.value)
  ElMessage.success(tr('activity.deleteOk'))
  selRows.value = []
  tb.value?.refresh()
}
</script>
