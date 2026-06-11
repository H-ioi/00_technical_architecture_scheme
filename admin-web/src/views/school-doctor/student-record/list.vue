<template>
  <section class="uni-list-page">
    <div class="uni-list-page__header">
      <div>
        <h1>{{ $t('schoolDoctor.studentRecord.pageTitle') }}</h1>
        <p>{{ $t('schoolDoctor.studentRecord.pageDesc') }}</p>
      </div>
    </div>
    <div class="uni-list-page__body">
      <UniSearchForm
        v-model="queryModel"
        :config="searchCfg"
        :collapsed="true"
        :collapsed-rows="1"
        :action-min-span="0"
        :submit-text="$t('schoolDoctor.common.search')"
        :reset-text="$t('schoolDoctor.common.reset')"
        @search="search"
        @reset="onReset" />

      <UniDataTable
        ref="tableRef"
        row-key="id"
        selection
        :columns="columns"
        :request="loadData"
        :filters="filters"
        :pagination="{ pageSize: 10, pageSizes: [10, 20, 50, 100] }"
        :toolbar="{ refresh: true, density: true, columnSetting: true }"
        :actions="actions"
        :action-column="{ width: 120, fixed: 'right' }"
        @selection-change="onSelectionChange"
        @load-success="tableEmpty.onLoadSuccess"
        @request-error="tableEmpty.onRequestError">
        <template #toolbar>
          <el-button type="danger" :disabled="selectedIds.length === 0" @click="batchDelete">
            {{ $t('schoolDoctor.studentRecord.batchDelete') }}
          </el-button>
        </template>
        <template #empty>
          <ListTableEmpty :kind="tableEmpty.kind" @reset="onReset" @retry="tableEmpty.retry" />
        </template>
      </UniDataTable>
    </div>
    <DetailDrawer
      v-model:visible="drawerVisible"
      :mode="drawerMode"
      :record-id="activeRecordId"
      @saved="onDrawerSaved" />
  </section>
</template>

<script setup lang="ts">
import type { UniTableAction, UniTableRequest } from 'uni-ui-lib'
import { UniDataTable, UniSearchForm, toUniOptions, useUniI18n, useUniListState } from 'uni-ui-lib'
import { ElMessage, ElMessageBox } from 'element-plus'
import { computed, nextTick, onMounted, ref, watch } from 'vue'

import { medicalArchiveApi, membershipApi } from '@/api'
import ListTableEmpty from '@/components/list-table-empty/index.vue'
import { useListTableEmpty } from '@/composables/use-list-table-empty'
import type { MedicalArchiveListRow } from '@/types/modules/medical-archive'
import type { SchoolOptionRecord } from '@/types/modules/membership'
import { normalizePaged } from '@/utils/api-response-normalize'

import DetailDrawer from './components/detail-drawer.vue'
import { searchForm, tableCols } from './list.config'

type Row = MedicalArchiveListRow & {
  dormitoryStatusText?: string
  hasAllergenText?: string
  regularMedicationText?: string
  hasDiseaseText?: string
  statusText?: string
}

const { t } = useUniI18n()

const initialFilters = {
  schoolId: undefined as string | number | undefined,
  keyword: undefined as string | undefined,
  hasAllergen: undefined as number | undefined,
  regularMedication: undefined as number | undefined,
  hasDisease: undefined as number | undefined,
  status: undefined as number | undefined
}

const { queryModel, filters, tableRef, search, reset, handleLoadSuccess, refreshTable } =
  useUniListState({ initialFilters })

const schoolRecords = ref<SchoolOptionRecord[]>([])
const selectedIds = ref<Array<string | number>>([])
const drawerVisible = ref(false)
const drawerMode = ref<'view' | 'edit'>('view')
const activeRecordId = ref<string | number | undefined>()

const schoolOptions = computed(() =>
  toUniOptions(schoolRecords.value, {
    labelKeys: ['enName', 'cnName', 'name'],
    valueKey: 'id'
  })
)

const defaultSchoolId = computed(() => {
  if (schoolRecords.value.length !== 1) {
    return null
  }
  return schoolRecords.value[0]?.id
})

const searchCfg = computed(() =>
  searchForm(t, schoolOptions.value, defaultSchoolId.value ?? undefined)
)
const columns = computed(() => tableCols(t))

function formatRow(row: MedicalArchiveListRow): Row {
  const statusMap: Record<number, string> = {
    0: t('schoolDoctor.studentRecord.statusPending'),
    1: t('schoolDoctor.studentRecord.statusActive'),
    2: t('schoolDoctor.studentRecord.statusCancelled')
  }
  const yesText = t('schoolDoctor.common.yes')
  const noText = t('schoolDoctor.common.no')

  return {
    ...row,
    statusText: row.statusName || statusMap[Number(row.status)] || '--',
    dormitoryStatusText:
      row.dormitoryStatus === 1 ? yesText : row.dormitoryStatus === 0 ? noText : '--',
    hasAllergenText:
      row.hasAllergen === 1
        ? t('schoolDoctor.studentRecord.hasAllergenYes')
        : row.hasAllergen === 0
          ? noText
          : '--',
    regularMedicationText:
      row.regularMedication === 1
        ? t('schoolDoctor.studentRecord.hasMedicationYes')
        : row.regularMedication === 0
          ? noText
          : '--',
    hasDiseaseText: row.hasDisease === 1 ? yesText : row.hasDisease === 0 ? noText : '--'
  }
}

const loadData: UniTableRequest = async ({ pageNo, pageSize, filters: f }) => {
  const fv = f as typeof initialFilters
  const result = await medicalArchiveApi.page.get({
    current: pageNo,
    size: pageSize,
    schoolId: fv.schoolId,
    keyword: fv.keyword,
    hasAllergen: fv.hasAllergen,
    regularMedication: fv.regularMedication,
    hasDisease: fv.hasDisease,
    status: fv.status
  })
  const { list, total } = normalizePaged<MedicalArchiveListRow>(result)
  return {
    data: list.map((row) => formatRow(row)),
    total
  }
}

const onSelectionChange = (rows: Row[]) => {
  selectedIds.value = rows.map((row) => row.id).filter((id) => id != null) as Array<string | number>
}

const onReset = () => {
  reset()
  if (defaultSchoolId.value != null) {
    queryModel.value.schoolId = defaultSchoolId.value
    filters.value.schoolId = defaultSchoolId.value
  }
  selectedIds.value = []
  void nextTick(() => search())
}

function openDrawer(mode: 'view' | 'edit', row: Row) {
  if (row.id == null) {
    return
  }
  drawerMode.value = mode
  activeRecordId.value = row.id
  drawerVisible.value = true
}

async function batchDelete() {
  if (selectedIds.value.length === 0) {
    return
  }
  try {
    await ElMessageBox.confirm(
      t('schoolDoctor.studentRecord.confirmBatchDelete'),
      t('schoolDoctor.common.confirmTitle'),
      { type: 'warning' }
    )
  } catch {
    return
  }
  await medicalArchiveApi.deleteBatch.delete(selectedIds.value.join(','))
  ElMessage.success(t('schoolDoctor.common.deleteSuccess'))
  selectedIds.value = []
  void refreshTable()
}

function onDrawerSaved() {
  void refreshTable()
}

const actions = computed<UniTableAction[]>(() => [
  {
    label: t('schoolDoctor.studentRecord.view'),
    onClick: (row) => openDrawer('view', row as Row)
  },
  {
    label: t('schoolDoctor.studentRecord.edit'),
    code: 'medicalarchive_edit',
    onClick: (row) => openDrawer('edit', row as Row)
  }
])

const tableEmpty = useListTableEmpty(filters, {
  tableRef,
  afterLoadSuccess: handleLoadSuccess
})

watch(defaultSchoolId, (schoolId) => {
  if (schoolId != null && queryModel.value.schoolId == null) {
    queryModel.value.schoolId = schoolId
    filters.value.schoolId = schoolId
  }
})

onMounted(async () => {
  schoolRecords.value = await membershipApi.school.get()
  if (defaultSchoolId.value != null) {
    queryModel.value.schoolId = defaultSchoolId.value
    filters.value.schoolId = defaultSchoolId.value
  }
  await nextTick(() => tableRef.value?.refresh())
})
</script>
