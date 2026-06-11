<template>
  <section class="uni-list-page">
    <div class="uni-list-page__header">
      <div>
        <h1>{{ $t('schoolDoctor.medicalInfo.pageTitle') }}</h1>
        <p>{{ $t('schoolDoctor.medicalInfo.pageDesc') }}</p>
      </div>
      <div class="uni-list-page__header-actions">
        <el-upload
          v-if="canImport"
          ref="uploadRef"
          action="#"
          :show-file-list="false"
          :auto-upload="false"
          accept=".xlsx,.xls"
          :on-change="onImportFile">
          <el-button :loading="importing">{{ $t('schoolDoctor.common.import') }}</el-button>
        </el-upload>
        <el-button v-if="canExport" @click="handleExport">{{
          $t('schoolDoctor.common.export')
        }}</el-button>
        <el-button v-uni-permission="'medicalinfo_add'" type="primary" @click="openDrawer('add')">
          {{ $t('schoolDoctor.common.add') }}
        </el-button>
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
            {{ $t('schoolDoctor.medicalInfo.batchDelete') }}
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
      :school-records="schoolRecords"
      @saved="onDrawerSaved" />
  </section>
</template>

<script setup lang="ts">
import type { UploadFile, UploadInstance } from 'element-plus'
import type { UniTableAction, UniTableRequest } from 'uni-ui-lib'
import {
  UniDataTable,
  UniSearchForm,
  toUniOptions,
  useUniI18n,
  useUniListState,
  useUniPermission
} from 'uni-ui-lib'
import { ElMessage, ElMessageBox } from 'element-plus'
import { computed, nextTick, onMounted, ref, watch } from 'vue'

import { medicalInfoApi, membershipApi } from '@/api'
import ListTableEmpty from '@/components/list-table-empty/index.vue'
import { useListTableEmpty } from '@/composables/use-list-table-empty'
import type { MedicalInfoListRow, MedicalInfoPageParams } from '@/types/modules/medical-info'
import type { SchoolOptionRecord } from '@/types/modules/membership'
import { downloadBlob } from '@/utils/download'
import { normalizePaged } from '@/utils/api-response-normalize'

import DetailDrawer from './components/detail-drawer.vue'
import { searchForm, tableCols } from './list.config'

type Row = MedicalInfoListRow & {
  dormitoryStatusText?: string
  hasAllergenText?: string
  regularMedicationText?: string
  hasDiseaseText?: string
}

const { t } = useUniI18n()
const { hasPermission } = useUniPermission()
const canImport = computed(() => hasPermission('medicalinfo_import'))
const canExport = computed(() => hasPermission('medicalinfo_export'))

const initialFilters = {
  schoolId: undefined as string | number | undefined,
  keyword: undefined as string | undefined,
  hasAllergen: undefined as number | undefined,
  regularMedication: undefined as number | undefined,
  hasDisease: undefined as number | undefined
}

const { queryModel, filters, tableRef, search, reset, handleLoadSuccess, refreshTable } =
  useUniListState({ initialFilters })

const schoolRecords = ref<SchoolOptionRecord[]>([])
const selectedIds = ref<Array<string | number>>([])
const drawerVisible = ref(false)
const drawerMode = ref<'add' | 'view' | 'edit'>('view')
const activeRecordId = ref<string | number | undefined>()
const importing = ref(false)
const uploadRef = ref<UploadInstance | null>(null)

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

function buildPageParams(
  fv: typeof initialFilters,
  pageNo: number,
  pageSize: number
): MedicalInfoPageParams {
  const params: MedicalInfoPageParams = {
    current: pageNo,
    size: pageSize,
    keyword: fv.keyword,
    hasAllergen: fv.hasAllergen,
    regularMedication: fv.regularMedication,
    hasDisease: fv.hasDisease
  }
  if (fv.schoolId != null && fv.schoolId !== '') {
    params.schoolIds = [fv.schoolId]
  }
  return params
}

/** 操作者：小程序来源显示家长，后台新增显示操作账号 */
function formatOperator(row: MedicalInfoListRow) {
  const source = [row.source, row.sourceType, row.applicantType].find(
    (value) => value !== null && value !== undefined
  )
  if (
    source === 1 ||
    source === '1' ||
    source === 'mini' ||
    /mini|小程序|家长/i.test(String(row.operator || ''))
  ) {
    return t('schoolDoctor.medicalInfo.operatorParent')
  }
  return row.operator || row.creator || '--'
}

function formatRow(row: MedicalInfoListRow): Row {
  const yesText = t('schoolDoctor.common.yes')
  const noText = t('schoolDoctor.common.no')
  return {
    ...row,
    operator: formatOperator(row),
    dormitoryStatusText:
      row.dormitoryStatus === 1 ? yesText : row.dormitoryStatus === 0 ? noText : '--',
    hasAllergenText: row.hasAllergen === 1 ? yesText : row.hasAllergen === 0 ? noText : '--',
    regularMedicationText:
      row.regularMedication === 1 ? yesText : row.regularMedication === 0 ? noText : '--',
    hasDiseaseText: row.hasDisease === 1 ? yesText : row.hasDisease === 0 ? noText : '--'
  }
}

const loadData: UniTableRequest = async ({ pageNo, pageSize, filters: f }) => {
  const fv = f as typeof initialFilters
  const result = await medicalInfoApi.page.get(buildPageParams(fv, pageNo, pageSize))
  const { list, total } = normalizePaged<MedicalInfoListRow>(result)
  return { data: list.map((row) => formatRow(row)), total }
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

function openDrawer(mode: 'add' | 'view' | 'edit', row?: Row) {
  drawerMode.value = mode
  activeRecordId.value = mode === 'add' ? undefined : row?.id
  drawerVisible.value = true
}

async function batchDelete() {
  if (selectedIds.value.length === 0) {
    return
  }
  try {
    await ElMessageBox.confirm(
      t('schoolDoctor.medicalInfo.confirmBatchDelete'),
      t('schoolDoctor.common.confirmTitle'),
      { type: 'warning' }
    )
  } catch {
    return
  }
  await medicalInfoApi.deleteBatch.delete(selectedIds.value.join(','))
  ElMessage.success(t('schoolDoctor.common.deleteSuccess'))
  selectedIds.value = []
  void refreshTable()
}

async function onImportFile(file: UploadFile) {
  if (!file.raw) {
    return
  }
  importing.value = true
  try {
    await medicalInfoApi.import.post(file.raw)
    ElMessage.success(t('schoolDoctor.common.importSuccess'))
    void refreshTable()
  } catch {
    ElMessage.error(t('schoolDoctor.common.importFailed'))
  } finally {
    importing.value = false
    uploadRef.value?.clearFiles()
  }
}

async function handleExport() {
  try {
    await ElMessageBox.confirm(
      t('schoolDoctor.medicalInfo.confirmExport'),
      t('schoolDoctor.common.confirmTitle'),
      { type: 'warning' }
    )
  } catch {
    return
  }
  const fv = filters.value as typeof initialFilters
  const blob = await medicalInfoApi.export.get(buildPageParams(fv, 1, 10000))
  downloadBlob(blob, t('schoolDoctor.medicalInfo.exportFileName'))
  ElMessage.success(t('schoolDoctor.common.exportSuccess'))
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
    code: 'medicalinfo_edit',
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
