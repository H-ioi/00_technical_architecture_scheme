<template>
  <section class="uni-list-page">
    <div class="uni-list-page__header">
      <div>
        <h1>{{ $t('schoolBus.car.pageTitle') }}</h1>
        <p>{{ $t('schoolBus.car.pageDesc') }}</p>
      </div>
      <div class="uni-list-page__header-actions">
        <el-button v-uni-permission="'buscarinfo_download'" @click="downloadTemplate">
          {{ $t('schoolBus.downloadTemplate') }}
        </el-button>
        <el-button v-uni-permission="'buscarinfo_import'" @click="fileRef?.click()">
          {{ $t('schoolBus.import') }}
        </el-button>
        <el-button v-uni-permission="'buscarinfo_add'" type="primary" @click="openForm('add')">
          {{ $t('schoolBus.add') }}
        </el-button>
      </div>
    </div>

    <input
      ref="fileRef"
      type="file"
      accept=".xlsx,.xls"
      class="school-bus-car-page__file"
      @change="onImportFile" />

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
          v-uni-permission="'buscarinfo_del'"
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

    <CarForm
      v-model:visible="formVisible"
      :mode="formMode"
      :source="activeRow"
      :default-school-id="defaultSchoolId"
      :school-options="schoolOptions"
      :status-options="statusOptions"
      :multi-school="multiSchool"
      @saved="refreshTable" />
  </section>
</template>

<script setup lang="ts">
import CarForm from './components/form.vue'
import { searchForm, tableCols, carStatusOpts } from './list.config'
import { schoolBusCarApi, membershipApi } from '@/api'
import ListTableEmpty from '@/components/list-table-empty/index.vue'
import { useListTableEmpty } from '@/composables/use-list-table-empty'
import type { SchoolOptionRecord } from '@/types/modules/membership'
import type { CarRecord, CarListParams } from '@/types/modules/school-bus-car'
import { normalizeArray, normalizePaged } from '@/utils/api-response-normalize'
import { membershipSchoolLabelsJoined, membershipSchoolToOptions } from '@/utils/membership-school'
import dayjs from 'dayjs'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUniI18n, useUniListState } from 'uni-ui-lib'
import type { UniTableAction, UniTableRequest } from 'uni-ui-lib'
import { computed, ref, nextTick, onMounted, watch } from 'vue'

const { locale, t } = useUniI18n()

const fileRef = ref<HTMLInputElement | null>(null)

const initialFilters: Record<string, unknown> = {
  schoolIds: undefined,
  carNumber: '',
  driver: '',
  carTeacher: '',
  status: undefined
}
const { queryModel, filters, tableRef, search, reset, handleLoadSuccess, refreshTable } =
  useUniListState({
    initialFilters
  })
const schoolRecords = ref<SchoolOptionRecord[]>([])
const schoolOptions = computed(() => membershipSchoolToOptions(schoolRecords.value, locale()))
const multiSchool = computed(() => schoolRecords.value.length > 1)
const defaultSchoolId = computed(() =>
  schoolRecords.value.length === 1 ? schoolRecords.value[0].id : null
)

const statusOptions = computed(() => carStatusOpts(t))
const searchCfg = computed(() =>
  searchForm(t, schoolOptions.value, statusOptions.value, multiSchool.value)
)
const columns = computed(() => tableCols(t, statusOptions.value))

const formVisible = ref(false)
const formMode = ref<'add' | 'edit' | 'look'>('add')
const activeRow = ref<CarRecord | null>(null)

const decorate = (row: CarRecord): CarRecord => {
  const loc = locale()
  const showSchoolNames = membershipSchoolLabelsJoined(
    schoolRecords.value,
    row.schoolIds,
    loc,
    row.schoolEnNames != null ? String(row.schoolEnNames) : undefined
  )
  return {
    ...row,
    showSchoolNames,
    driverName:
      row.driverInfo && typeof row.driverInfo === 'object'
        ? (row.driverInfo as { name?: string }).name
        : row.driverName,
    createTime: row.createTime ? dayjs(String(row.createTime)).format('YYYY-MM-DD HH:mm') : '',
    updateTime: row.updateTime ? dayjs(String(row.updateTime)).format('YYYY-MM-DD HH:mm') : ''
  }
}

const loadData: UniTableRequest = async ({ pageNo: current, pageSize: size, filters: f }) => {
  const raw: CarListParams = { current, size, ...f } as CarListParams
  if (!multiSchool.value && defaultSchoolId.value != null && raw.schoolIds == null) {
    raw.schoolIds = defaultSchoolId.value
  }
  const result = await schoolBusCarApi.page.get(raw)
  const { list, total } = normalizePaged<CarRecord>(result)
  return { data: list.map(decorate), total }
}

const openForm = (mode: 'add' | 'edit' | 'look', row?: CarRecord) => {
  formMode.value = mode
  activeRow.value = row ?? null
  formVisible.value = true
}

const actions = computed<UniTableAction[]>(() => [
  {
    label: t('schoolBus.look'),
    onClick: (row) => openForm('look', row as CarRecord)
  },
  {
    label: t('schoolBus.edit'),
    code: 'buscarinfo_edit',
    onClick: (row) => openForm('edit', row as CarRecord)
  }
])

onMounted(async () => {
  const raw = await membershipApi.school.get()
  schoolRecords.value = normalizeArray(raw) as SchoolOptionRecord[]
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

const IMPORT_MAX_BYTES = 10 * 1024 * 1024
const selection = ref<CarRecord[]>([])
const ids = computed(() => selection.value.map((r) => r.id))

const onSelectionChange = (rows: CarRecord[]) => {
  selection.value = rows
}

const downloadTemplate = async () => {
  try {
    await schoolBusCarApi.template.download()
  } catch {
    /* request 层已提示 */
  }
}

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
    await schoolBusCarApi.import.post(file)
    ElMessage.success(t('schoolBus.importSuccess'))
    void refreshTable()
  } catch {
    /* request 层已提示 */
  }
}

const del = async () => {
  if (ids.value.length === 0) {
    return
  }
  try {
    await ElMessageBox.confirm(t('schoolBus.car.msgConfirmDelete'), t('schoolBus.delete'), {
      type: 'warning'
    })
  } catch {
    return
  }
  try {
    await schoolBusCarApi.delete.delete(ids.value)
    ElMessage.success(t('schoolBus.deleteSuccess'))
    selection.value = []
    void refreshTable()
  } catch {
    /* request 层已提示 */
  }
}
</script>

<style scoped lang="scss">
.school-bus-car-page {
  &__file {
    position: absolute;
    width: 0;
    height: 0;
    opacity: 0;
    pointer-events: none;
  }
}
</style>
