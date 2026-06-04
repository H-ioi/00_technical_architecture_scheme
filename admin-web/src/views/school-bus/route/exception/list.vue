<template>
  <section class="uni-list-page">
    <ExceptionPageHeader
      @export="exportData"
      @download-template="downloadImportTemplate"
      @add="openForm('add')"
      @import-file="onImportFile" />

    <UniSearchForm
      v-model="queryModel"
      :config="searchCfg"
      :collapsed="true"
      :collapsed-rows="1"
      :action-min-span="0"
      :submit-text="$t('schoolBus.search')"
      :reset-text="$t('schoolBus.reset')"
      @search="search"
      @reset="reset" />

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
      @request-error="tableEmpty.onRequestError">
      <template #toolbar>
        <el-button
          v-uni-permission="'busexception_del'"
          type="danger"
          :disabled="ids.length === 0"
          @click="del">
          {{ $t('schoolBus.delete') }}
        </el-button>
      </template>
      <template #empty>
        <ListTableEmpty :kind="tableEmpty.kind" @reset="reset" @retry="tableEmpty.retry" />
      </template>
    </UniDataTable>

    <ExceptionForm
      v-model:visible="formVisible"
      :mode="formMode"
      :source="activeRow"
      :default-school-id="defaultSchoolId"
      :school-records="schoolRecords"
      @saved="refreshTable" />

    <ExceptionDetailDialog ref="detailDialogRef" :columns="columns" />
  </section>
</template>

<script setup lang="ts">
import ExceptionDetailDialog from './components/detail-dialog.vue'
import ExceptionForm from './components/form.vue'
import {
  buildExceptionSearchForm,
  exceptionMetaOptions,
  formatExceptionRow
} from './components/exception-list-helpers'
import ExceptionPageHeader from './components/page-header.vue'
import { exceptionTypeMeta, tableCols, yesNoMeta } from './list.config'
import { schoolBusExceptionApi, membershipApi, schoolBusCommonApi } from '@/api'
import ListTableEmpty from '@/components/list-table-empty/index.vue'
import { useListTableEmpty } from '@/composables/use-list-table-empty'
import type { SchoolOptionRecord } from '@/types/modules/membership'
import type { ExceptionRecord, ExceptionListParams } from '@/types/modules/school-bus-exception'
import { normalizeArray, normalizePaged } from '@/utils/api-response-normalize'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { UniTableAction, UniTableRequest } from 'uni-ui-lib'
import { useUniI18n, toUniOptions, useUniListState } from 'uni-ui-lib'
import { computed, ref, nextTick, onMounted, watch } from 'vue'

const { locale, t } = useUniI18n()

interface NamedEntity {
  id: string | number
  cnName?: string
  enName?: string
  schoolIds?: number[] | number | string
}
interface CarEntity {
  id: string | number
  carNumber?: string
}

const initialFilters: Record<string, unknown> = {
  schoolIds: undefined,
  sectionId: undefined,
  lineIds: undefined,
  carId: undefined,
  exceptionType: undefined,
  needDispatch: undefined,
  exceptionDateStart: undefined,
  exceptionDateEnd: undefined
}

const { queryModel, filters, tableRef, search, reset, handleLoadSuccess, refreshTable } =
  useUniListState({
    initialFilters
  })

const schoolRecords = ref<SchoolOptionRecord[]>([])
const sectionSource = ref<NamedEntity[]>([])
const lineSource = ref<NamedEntity[]>([])
const carSource = ref<CarEntity[]>([])

const formVisible = ref(false)
const formMode = ref<'add' | 'edit' | 'look'>('add')
const activeRow = ref<ExceptionRecord | null>(null)
const detailDialogRef = ref<InstanceType<typeof ExceptionDetailDialog> | null>(null)

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

const sectionOptions = computed(() =>
  toUniOptions(filterBySchools(sectionSource.value), {
    labelKeys: locale() === 'en' ? ['enName', 'cnName'] : ['cnName', 'enName'],
    valueKey: 'id'
  })
)

const lineOptions = computed(() =>
  toUniOptions(filterBySchools(lineSource.value), {
    labelKeys: locale() === 'en' ? ['enName', 'cnName'] : ['cnName', 'enName'],
    valueKey: 'id'
  })
)

const carOptions = computed(() =>
  carSource.value.map((c) => ({
    label: String(c.carNumber ?? c.id),
    value: c.id
  }))
)

const exceptionTypeOptions = computed(() => exceptionTypeMeta(t))
const yesNoOptions = computed(() => yesNoMeta(t))

const searchCfg = computed(() =>
  buildExceptionSearchForm({
    t,
    multiSchool: multiSchool.value,
    schoolOptions: schoolOptions.value,
    sectionOptions: sectionOptions.value,
    lineOptions: lineOptions.value,
    carOptions: carOptions.value,
    exceptionTypeOptions: exceptionTypeOptions.value,
    yesNoOptions: yesNoOptions.value
  })
)

const columns = computed(() => tableCols(t, schoolOptions.value))

const loadData: UniTableRequest = async ({ pageNo, pageSize, filters: f }) => {
  const params: ExceptionListParams = {
    current: pageNo,
    size: pageSize,
    ...(f as ExceptionListParams)
  }

  if (!multiSchool.value && defaultSchoolId.value != null && params.schoolIds == null) {
    params.schoolIds = defaultSchoolId.value
  }

  const result = await schoolBusExceptionApi.page.get(params)
  const { list, total } = normalizePaged<ExceptionRecord>(result)
  const meta = exceptionMetaOptions(t)

  return {
    data: list.map((row) => formatExceptionRow(row, locale(), meta.exception, meta.yesNo)),
    total
  }
}

const openForm = (mode: 'add' | 'edit' | 'look', row?: ExceptionRecord) => {
  formMode.value = mode
  activeRow.value = row ?? null
  formVisible.value = true
}

const actions = computed<UniTableAction[]>(() => [
  {
    label: t('schoolBus.look'),
    onClick: (row) => detailDialogRef.value?.open(row as ExceptionRecord)
  },
  {
    label: t('schoolBus.edit'),
    code: 'busexception_edit',
    onClick: (row) => openForm('edit', row as ExceptionRecord)
  }
])

onMounted(async () => {
  const rawSchools = await membershipApi.school.get()
  schoolRecords.value = normalizeArray(rawSchools) as SchoolOptionRecord[]

  const [sectionsRaw, linesRaw, carsRaw] = await Promise.all([
    schoolBusCommonApi.sectionList.get(),
    schoolBusCommonApi.lineList.get(),
    schoolBusCommonApi.carinfoList.get()
  ])

  sectionSource.value = normalizeArray(sectionsRaw) as NamedEntity[]
  lineSource.value = normalizeArray(linesRaw) as NamedEntity[]
  carSource.value = normalizeArray(carsRaw) as CarEntity[]
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

const selection = ref<ExceptionRecord[]>([])
const ids = computed(() => selection.value.map((item) => item.id))

const onSelectionChange = (rows: ExceptionRecord[]) => {
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
    await schoolBusExceptionApi.import.post(file)
    ElMessage.success(t('schoolBus.importSuccess'))
    void refreshTable()
  } catch {
    /* request 层已提示 */
  }
}

const downloadImportTemplate = async () => {
  await schoolBusExceptionApi.template.download()
}

const exportData = async () => {
  const raw: Record<string, unknown> = { ...filters.value }

  if (!multiSchool.value && defaultSchoolId.value != null && raw.schoolIds == null) {
    raw.schoolIds = defaultSchoolId.value
  }

  delete raw.size
  delete raw.current

  try {
    const blob = await schoolBusExceptionApi.export.get(raw)
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'exception-export.xlsx'
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
      t('schoolBus.routeException.msgConfirmDelete'),
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

  await schoolBusExceptionApi.delete.delete(ids.value)
  ElMessage.success(t('schoolBus.deleteSuccess'))
  selection.value = []
  void refreshTable()
}
</script>
