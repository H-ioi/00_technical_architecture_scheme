<template>
  <section class="uni-list-page" :class="{ 'uni-list-page--embedded': embedded }">
    <div v-if="!embedded" class="uni-list-page__header">
      <div>
        <h1>{{ $t('activity.programListTitle') }}</h1>
        <p class="uni-list-page__description">{{ $t('activity.programListDesc') }}</p>
      </div>
      <div v-uni-permission="'busdriver_edit'" class="uni-list-page__header-actions">
        <el-button type="primary" @click="goProgramCreate">{{ $t('activity.add') }}</el-button>
      </div>
    </div>
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
        selection="multiple"
        :columns="columns"
        :request="loadData"
        :filters="filters"
        :pagination="{ pageSize: 10, pageSizes: [10, 20, 50, 100] }"
        :toolbar="{ refresh: true, columnSetting: true }"
        :actions="actions"
        :action-column="{ width: 180, fixed: 'right' }"
        @load-success="handleLoadSuccess"
        @selection-change="onSelectionChange">
        <template #toolbar>
          <el-button
            v-uni-permission="'busdriver_edit'"
            plain
            :disabled="!selectedIds.length"
            @click="openCopy">
            {{ $t('activity.programCopy') }}
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
    </div>
    <ProgramCopyDialog v-model="copyOpen" :program-ids="selectedIds" @success="onCopySuccess" />
  </section>
</template>

<script setup lang="ts">
import ProgramCopyDialog from './components/program-copy-dialog.vue'
import {
  canEditProgramRow,
  programStatusOptionsForRow,
  programTypeOptionsForRow
} from './edit/program-edit-helpers'
import { programStatusOptions, programTypeOptions, searchForm, tableCols } from './list.config'
import { activityApi, activityProgramApi } from '@/api'
import { useMembershipSchoolOptions } from '@/composables/use-membership-school-options'
import type { Translate } from '@/types/i18n'
import { normalizeEnvelope, normalizePaged } from '@/utils/api-response-normalize'
import { formatOptionLabels } from '@/utils/form-display'
import { dateFormat } from '@/utils/tool'
import { ElMessage, ElMessageBox } from 'element-plus'
import { UniDataTable, UniSearchForm, useUniI18n, useUniListState } from 'uni-ui-lib'
import type { UniTableAction, UniTableRequest } from 'uni-ui-lib'
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const { t } = useUniI18n()

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

const router = useRouter()

const goProgramCreate = () => {
  void router.push({
    name: 'ActivityProgramDetail',
    query: {
      mode: 'edit',
      ...(props.activityId != null && props.activityId !== ''
        ? { activityId: String(props.activityId) }
        : {})
    }
  })
}

const copyOpen = ref(false)

type Row = Record<string, unknown>

const tr = t as Translate
const route = useRoute()

const { schoolOptions, loadSchoolOptions } = useMembershipSchoolOptions()
const lockedSchoolId = ref<string | number | undefined>(undefined)

const statusOpts = computed(() => programStatusOptions(tr))
const typeOpts = computed(() => programTypeOptions(tr))
const statusOptsRow = computed(() => programStatusOptionsForRow(tr))
const typeOptsRow = computed(() => programTypeOptionsForRow(tr))
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
  activityId:
    props.activityId != null && props.activityId !== ''
      ? String(props.activityId)
      : route.query.activityId != null && route.query.activityId !== ''
        ? String(route.query.activityId)
        : undefined,
  activityKeyword: '',
  programKeyword: '',
  schoolIds: undefined,
  programStatus: undefined,
  programType: undefined
} as Record<string, unknown>

const { queryModel, filters, handleLoadSuccess, reset, search, tableRef } = useUniListState({
  initialFilters
})

const searchCfg = computed(() =>
  searchForm(tr, schoolOptions.value, statusOpts.value, typeOpts.value, showSchoolFilter.value)
)

const columns = computed(() => tableCols(tr))

const selectedRows = ref<Row[]>([])
const selectedIds = computed(
  () => selectedRows.value.map((row) => row.id).filter((id) => id != null) as Array<string | number>
)

const decorateRows = (list: Row[]) => {
  for (const row of list) {
    row.programStatus = row.programStatus == null ? '' : String(row.programStatus)
    row.programType = row.programType == null ? '' : String(row.programType)
    row.programStatusLabel = formatOptionLabels(statusOptsRow.value, row.programStatus) || '—'
    row.programTypeLabel = formatOptionLabels(typeOptsRow.value, row.programType) || '—'
    row.operateTime = row.operateTime
      ? dateFormat(String(row.operateTime), 'yyyy-MM-dd hh:mm')
      : '—'
  }
}

const onSelectionChange = (rows: Record<string, unknown>[]) => {
  selectedRows.value = rows as Row[]
}

const loadData: UniTableRequest = async ({
  pageNo: current,
  pageSize: size,
  filters: filterModel
}) => {
  const f = filterModel as Row
  const raw = await activityProgramApi.page.get({
    current,
    size,
    activityId: f.activityId as string | number | undefined,
    schoolIds: lockedSchoolId.value ?? f.schoolIds ?? undefined,
    activityKeyword: (f.activityKeyword as string) || undefined,
    programKeyword: (f.programKeyword as string) || undefined,
    programStatus: f.programStatus || undefined,
    programType: f.programType || undefined
  })
  const { list, total } = normalizePaged<Row>(raw)
  decorateRows(list)
  return { data: list, total }
}

const goDetail = (row: Row, mode: 'view' | 'edit') => {
  if (row.id == null) {
    return
  }
  router.push({ name: 'ActivityProgramDetail', query: { id: String(row.id), mode } })
}

const isActivityEnded = async (row: Row) => {
  if (row.activityStatus != null && row.activityStatus !== '') {
    return String(row.activityStatus) === '3'
  }
  if (row.activityId == null || row.activityId === '') {
    return false
  }
  try {
    const raw = await activityApi.detail.get(row.activityId as string | number)
    const detail = normalizeEnvelope(raw) as Row

    return String(detail.activityStatus ?? '') === '3'
  } catch {
    ElMessage.error(tr('activity.loadDetailFail'))
    return true
  }
}

const changeProgramStatus = async (row: Row, startFlag: boolean) => {
  if (row.id == null) {
    return
  }
  if (await isActivityEnded(row)) {
    ElMessage.warning(tr('activity.programActivityEndedNoStatus'))
    return
  }
  try {
    await ElMessageBox.confirm(
      startFlag ? tr('activity.confirmStartProgram') : tr('activity.confirmEndProgram'),
      tr('common.tip'),
      { type: 'warning' }
    )
  } catch {
    return
  }
  try {
    await activityProgramApi.editStatus.post({
      id: row.id as string | number,
      startFlag
    })
    ElMessage.success(tr('activity.saveOk'))
    tableRef.value?.refresh()
  } catch {
    ElMessage.error(tr('activity.saveFail'))
  }
}

const actions = computed<UniTableAction[]>(() => [
  { label: tr('activity.lookDetail'), onClick: (row) => goDetail(row as Row, 'view') },
  {
    label: tr('activity.entryEdit'),
    code: 'busdriver_edit',
    visible: (row) => canEditProgramRow(row as Row),
    onClick: (row) => {
      const r = row as Row
      if (!canEditProgramRow(r)) {
        ElMessage.warning(tr('activity.programEditLimited'))
        return
      }
      goDetail(r, 'edit')
    }
  },
  {
    label: tr('activity.programStart'),
    code: 'busdriver_edit',
    visible: (row) => String((row as Row).programStatus ?? '') === '0',
    onClick: (row) => void changeProgramStatus(row as Row, true)
  },
  {
    label: tr('activity.programEnd'),
    code: 'busdriver_edit',
    visible: (row) => String((row as Row).programStatus ?? '') === '1',
    onClick: (row) => void changeProgramStatus(row as Row, false)
  }
])

const deleteBatch = async () => {
  if (!selectedIds.value.length) {
    ElMessage.warning(tr('activity.programSelRows'))
    return
  }
  try {
    await ElMessageBox.confirm(tr('activity.confirmDeletePrograms'), tr('common.tip'), {
      type: 'warning'
    })
  } catch {
    return
  }
  try {
    await activityProgramApi.remove.delete(selectedIds.value)
    ElMessage.success(tr('activity.deleteOk'))
    tableRef.value?.refresh()
  } catch {
    ElMessage.error(tr('activity.saveFail'))
  }
}

const openCopy = () => {
  if (!selectedIds.value.length) {
    ElMessage.warning(tr('activity.programSelRows'))
    return
  }
  copyOpen.value = true
}

const onCopySuccess = () => {
  tableRef.value?.refresh()
}
</script>
