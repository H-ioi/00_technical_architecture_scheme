<template>
  <section class="uni-list-page">
    <div class="uni-list-page__header">
      <div>
        <h1>{{ $t('schoolBus.routeOperation.pageTitle') }}</h1>
        <p>{{ $t('schoolBus.routeOperation.pageDesc') }}</p>
      </div>
      <div class="uni-list-page__header-actions">
        <el-button v-uni-permission="'busoperation_export'" @click="exportData">
          {{ $t('schoolBus.export') }}
        </el-button>
        <el-button v-uni-permission="'busoperation_import'" @click="downloadImportTemplate">
          {{ $t('schoolBus.downloadTemplate') }}
        </el-button>
        <el-button v-uni-permission="'busoperation_import'" @click="fileRef?.click()">
          {{ $t('schoolBus.import') }}
        </el-button>
        <el-button v-uni-permission="'busoperation_add'" type="primary" @click="openForm('add')">
          {{ $t('schoolBus.add') }}
        </el-button>
      </div>
    </div>

    <input
      ref="fileRef"
      type="file"
      accept=".xlsx,.xls"
      class="school-bus-route-operation__file"
      @change="onImportFile"
    >

    <UniSearchForm
      v-model="queryModel"
      :config="searchCfg"
      :collapsed="true"
      :collapsed-rows="1"
      :action-min-span="0"
      :submit-text="$t('schoolBus.search')"
      :reset-text="$t('schoolBus.reset')"
      @search="search"
      @reset="reset"
    />

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
      :action-column="{ width: 110, fixed: 'right' }"
      @selection-change="onSelectionChange"
      @load-success="tableEmpty.onLoadSuccess"
      @request-error="tableEmpty.onRequestError"
    >
      <template #toolbar>
        <el-button
          v-uni-permission="'busoperation_del'"
          type="danger"
          :disabled="ids.length === 0"
          @click="del"
        >
          {{ $t('schoolBus.delete') }}
        </el-button>
      </template>
      <template #empty>
        <ListTableEmpty :kind="tableEmpty.kind" @reset="reset" @retry="tableEmpty.retry" />
      </template>
    </UniDataTable>

    <OperationForm
      v-model:visible="formVisible"
      :mode="formMode"
      :source="activeRow"
      :default-school-id="defaultSchoolId"
      :school-records="schoolRecords"
      :line-source="lineSource"
      :station-source="stationSource"
      @saved="refreshTable"
    />

    <el-dialog v-model="detailVisible" width="900px" :title="$t('schoolBus.look')">
      <el-descriptions v-if="detailRecord" :column="2" border>
        <el-descriptions-item v-for="col in columns" :key="String(col.prop)" :label="col.label">
          {{ detailCellText(detailRecord, col.prop) }}
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </section>
</template>

<script setup lang="ts">
import OperationForm from './components/form.vue'
import { operationStatusMeta, tableCols } from './list.config'
import { schoolBusOperationApi, membershipApi, schoolBusCommonApi } from '@/api'
import ListTableEmpty from '@/components/list-table-empty/index.vue'
import { useListTableEmpty } from '@/composables/use-list-table-empty'
import type { SchoolOptionRecord } from '@/types/modules/membership'
import type { OperationRecord, OperationListParams } from '@/types/modules/school-bus-operation'
import { normalizeArray, normalizePaged } from '@/utils/api-response-normalize'
import { normalizeSchoolIdsOnRow } from '@/utils/school-bus'
import dayjs from 'dayjs'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { UniFormConfig, UniTableAction, UniTableRequest } from 'uni-ui-lib'
import { UniDataTable, UniSearchForm, useUniI18n, toUniOptions, useUniListState } from 'uni-ui-lib'
import { computed, ref, nextTick, onMounted, watch } from 'vue'

const { locale, t } = useUniI18n()

const fileRef = ref<HTMLInputElement | null>(null)

type Loose = Record<string, unknown>
/** 详情 descriptions 空值显示 -- */
const detailCellText = (record: Loose | null | undefined, prop: unknown) => {
  if (!record || prop == null) return ''
  const val = record[String(prop)]
  return val == null || val === '' ? '--' : String(val)
}

interface NamedEntity {
  id: string | number
  cnName?: string
  enName?: string
  lineName?: string
  stationName?: string
  schoolIds?: number[] | number | string
  name?: string
}
const formatOperationRow = (
  row: OperationRecord,
  locale: string,
  statusOptions: { value: string; label: string }[]
): OperationRecord => {
  const sectionName =
    locale === 'en'
      ? String(row.sectionEnName ?? row.sectionName ?? '')
      : String(row.sectionCnName ?? row.sectionName ?? '')
  const next: OperationRecord = { ...row }
  normalizeSchoolIdsOnRow(next as Loose)
  next.sectionName = sectionName || '--'
  next.statusLabel =
    statusOptions.find((x) => String(x.value) === String(row.status))?.label ??
    String(row.status ?? '--')
  next.arrivalStatusLabel =
    statusOptions.find((x) => String(x.value) === String(row.arrivalStatus))?.label ??
    String(row.arrivalStatus ?? '--')
  next.rideDate = row.rideDate ? dayjs(String(row.rideDate)).format('YYYY-MM-DD') : '--'
  next.arrivalTime = row.arrivalTime
    ? dayjs(String(row.arrivalTime)).format('YYYY-MM-DD HH:mm')
    : '--'
  next.createTime = row.createTime ? dayjs(String(row.createTime)).format('YYYY-MM-DD HH:mm') : '--'
  next.updateTime = row.updateTime ? dayjs(String(row.updateTime)).format('YYYY-MM-DD HH:mm') : '--'
  return next
}

const initialFilters: Record<string, unknown> = {
  schoolIds: undefined,
  lineIds: undefined,
  stationId: undefined,
  status: undefined,
  rideDateStart: undefined,
  rideDateEnd: undefined
}

const { queryModel, filters, tableRef, search, reset, handleLoadSuccess, refreshTable } =
  useUniListState({
    initialFilters
  })

const schoolRecords = ref<SchoolOptionRecord[]>([])
const lineSource = ref<NamedEntity[]>([])
const stationSource = ref<NamedEntity[]>([])
const formVisible = ref(false)
const formMode = ref<'add' | 'edit' | 'look'>('add')
const activeRow = ref<OperationRecord | null>(null)
const detailVisible = ref(false)
const detailRecord = ref<OperationRecord | null>(null)

const schoolOptions = computed(() =>
  toUniOptions(schoolRecords.value, {
    labelKeys: locale() === 'en' ? ['enName', 'name'] : ['name', 'cnName', 'enName'],
    valueKey: 'id'
  })
)

const multiSchool = computed(() => schoolRecords.value.length > 1)
const defaultSchoolId = computed(() =>
  schoolRecords.value.length === 1 ? schoolRecords.value[0].id : null
)

const selectedSchoolSet = computed(() => {
  const raw = queryModel.schoolIds as unknown

  if (raw == null || raw === '') {
    return new Set<string | number>()
  }

  const arr = Array.isArray(raw) ? raw : [raw]

  return new Set(arr.filter((x) => x !== '' && x != null))
})

const filterBySchools = (list: NamedEntity[]) => {
  if (!selectedSchoolSet.value.size) {
    return list
  }

  return list.filter((item) => {
    const sid = item.schoolIds

    if (Array.isArray(sid)) {
      return sid.some((id) => selectedSchoolSet.value.has(id))
    }

    return selectedSchoolSet.value.has(sid as string | number)
  })
}

const lineOptions = computed(() =>
  toUniOptions(filterBySchools(lineSource.value), {
    labelKeys: locale() === 'en' ? ['enName', 'lineName', 'name'] : ['cnName', 'lineName', 'name'],
    valueKey: 'id'
  })
)

const stationOptions = computed(() =>
  toUniOptions(filterBySchools(stationSource.value), {
    labelKeys:
      locale() === 'en' ? ['enName', 'stationName', 'name'] : ['cnName', 'stationName', 'name'],
    valueKey: 'id'
  })
)

const statusOptions = computed(() => operationStatusMeta(t))

const searchCfg = computed<UniFormConfig>(() => {
  const schoolSchema = multiSchool.value
    ? [
        {
          field: 'schoolIds',
          label: '',
          component: 'ElSelect' as const,
          options: schoolOptions.value,
          componentProps: {
            placeholder: t('schoolBus.routeOperation.phSchool'),
            clearable: true,
            filterable: true,
            multiple: true,
            collapseTags: true,
            collapseTagsTooltip: true
          },
          colProps: { span: 6 }
        }
      ]
    : []

  return {
    schema: [
      ...schoolSchema,
      {
        field: 'lineIds',
        label: '',
        component: 'ElSelect',
        options: lineOptions.value,
        componentProps: {
          placeholder: t('schoolBus.routeOperation.phLine'),
          clearable: true,
          filterable: true,
          multiple: true,
          collapseTags: true,
          collapseTagsTooltip: true
        },
        colProps: { span: 6 }
      },
      {
        field: 'stationId',
        label: '',
        component: 'ElSelect',
        options: stationOptions.value,
        componentProps: {
          placeholder: t('schoolBus.routeOperation.phStation'),
          clearable: true,
          filterable: true
        },
        colProps: { span: 6 }
      },
      {
        field: 'status',
        label: '',
        component: 'ElSelect',
        options: statusOptions.value,
        componentProps: {
          placeholder: t('schoolBus.routeOperation.phStatus'),
          clearable: true
        },
        colProps: { span: 6 }
      },
      {
        field: 'rideDateStart',
        label: '',
        component: 'ElDatePicker',
        componentProps: {
          type: 'date',
          placeholder: t('schoolBus.routeOperation.phRideDateStart'),
          valueFormat: 'YYYY-MM-DD',
          clearable: true
        },
        colProps: { span: 6 }
      },
      {
        field: 'rideDateEnd',
        label: '',
        component: 'ElDatePicker',
        componentProps: {
          type: 'date',
          placeholder: t('schoolBus.routeOperation.phRideDateEnd'),
          valueFormat: 'YYYY-MM-DD',
          clearable: true
        },
        colProps: { span: 6 }
      }
    ],
    rowProps: { gutter: 8 },
    colProps: { span: 6 }
  }
})

const columns = computed(() => tableCols(t, schoolOptions.value))

const loadData: UniTableRequest = async ({ pageNo, pageSize, filters: f }) => {
  const params: OperationListParams = {
    current: pageNo,
    size: pageSize,
    ...(f as OperationListParams)
  }

  if (!multiSchool.value && defaultSchoolId.value != null && params.schoolIds == null) {
    params.schoolIds = defaultSchoolId.value
  }

  const result = await schoolBusOperationApi.page.get(params)
  const { list, total } = normalizePaged<OperationRecord>(result)
  const opts = operationStatusMeta(t).map((x) => ({ value: String(x.value), label: x.label }))

  return {
    data: list.map((row) => formatOperationRow(row, locale(), opts)),
    total
  }
}

const openForm = (mode: 'add' | 'edit' | 'look', row?: OperationRecord) => {
  formMode.value = mode
  activeRow.value = row ?? null
  formVisible.value = true
}

const actions = computed<UniTableAction[]>(() => [
  {
    label: t('schoolBus.look'),
    onClick: (row) => {
      detailRecord.value = row as OperationRecord
      detailVisible.value = true
    }
  },
  {
    label: t('schoolBus.edit'),
    code: 'busoperation_edit',
    onClick: (row) => openForm('edit', row as OperationRecord)
  }
])

onMounted(async () => {
  const rawSchools = await membershipApi.school.get()
  schoolRecords.value = normalizeArray(rawSchools) as SchoolOptionRecord[]

  const [linesRaw, stationsRaw] = await Promise.all([
    schoolBusCommonApi.lineList.get(),
    schoolBusCommonApi.stationList.get()
  ])

  lineSource.value = normalizeArray(linesRaw) as NamedEntity[]
  stationSource.value = normalizeArray(stationsRaw) as NamedEntity[]
})

watch(
  () => schoolRecords.value,
  (records) => {
    if (records.length === 1) {
      queryModel.schoolIds = records[0].id
    }

    if (records.length > 0) {
      nextTick(() => tableRef.value?.refresh())
    }
  }
)

const tableEmpty = useListTableEmpty(filters, { tableRef, afterLoadSuccess: handleLoadSuccess })

const selection = ref<OperationRecord[]>([])
const ids = computed(() => selection.value.map((item) => item.id))

const onSelectionChange = (rows: OperationRecord[]) => {
  selection.value = rows
}

const IMPORT_MAX_BYTES = 10 * 1024 * 1024

const onImportFile = async (e: Event) => {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]

  input.value = ''

  if (!file) {
    return
  }

  const importExt = file.name.toLowerCase()
  if (!importExt.endsWith('.xls') && !importExt.endsWith('.xlsx')) {
    ElMessage.warning(t('schoolBus.importInvalidType'))
    return
  }

  if (file.size > IMPORT_MAX_BYTES) {
    ElMessage.warning(t('schoolBus.importTooLarge'))
    return
  }

  try {
    await schoolBusOperationApi.import.post(file)
    ElMessage.success(t('schoolBus.importSuccess'))
    void refreshTable()
  } catch {
    /* request 层已提示 */
  }
}

const downloadImportTemplate = async () => {
  await schoolBusOperationApi.template.download()
}

const exportData = async () => {
  const raw: Record<string, unknown> = { ...filters.value }

  if (!multiSchool.value && defaultSchoolId.value != null && raw.schoolIds == null) {
    raw.schoolIds = defaultSchoolId.value
  }

  delete raw.size
  delete raw.current

  try {
    const blob = await schoolBusOperationApi.export.get(raw)
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'operation-export.xlsx'
    link.click()
    URL.revokeObjectURL(url)
    ElMessage.success(t('schoolBus.exportSuccess'))
  } catch {
    /* request 层已提示 */
  }
}

const del = async () => {
  if (ids.value.length === 0) {
    return
  }

  try {
    await ElMessageBox.confirm(
      t('schoolBus.routeOperation.msgConfirmDelete'),
      t('schoolBus.delete'),
      {
        confirmButtonText: t('schoolBus.submit'),
        cancelButtonText: t('schoolBus.cancel'),
        type: 'warning'
      }
    )
  } catch {
    return
  }

  await schoolBusOperationApi.delete.delete(ids.value)
  ElMessage.success(t('schoolBus.deleteSuccess'))
  selection.value = []
  void refreshTable()
}
</script>

<style scoped lang="scss">
.school-bus-route-operation {
  &__file {
    position: absolute;
    width: 0;
    height: 0;
    opacity: 0;
    pointer-events: none;
  }
}
</style>
