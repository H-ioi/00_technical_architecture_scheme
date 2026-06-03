<template>
  <section class="uni-list-page">
    <div class="uni-list-page__header">
      <div>
        <h1>{{ $t('schoolBus.driver.pageTitle') }}</h1>
        <p>{{ $t('schoolBus.driver.pageDesc') }}</p>
      </div>
      <div class="uni-list-page__header-actions">
        <el-button v-uni-permission="'busdriver_download'" @click="downloadImportTemplate">
          {{ $t('schoolBus.downloadTemplate') }}
        </el-button>
        <el-button v-uni-permission="'busdriver_import'" @click="fileRef?.click()">
          {{ $t('schoolBus.import') }}
        </el-button>
        <el-button v-uni-permission="'busdriver_add'" type="primary" @click="openForm('add')">
          {{ $t('schoolBus.add') }}
        </el-button>
      </div>
    </div>

    <input
      ref="fileRef"
      type="file"
      accept=".xlsx,.xls"
      class="school-bus-driver-page__file"
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
          v-uni-permission="'busdriver_del'"
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

    <DriverForm
      v-model:visible="formVisible"
      :mode="formMode"
      :source="activeRow"
      :default-school-id="defaultSchoolId"
      :school-options="schoolOptions"
      :status-options="statusOptions"
      @saved="refreshTable" />
  </section>
</template>

<script setup lang="ts">
import DriverForm from './components/form.vue'
import { searchForm, statusOpts, tableCols } from './list.config'
import { schoolBusDriverApi, membershipApi } from '@/api'
import ListTableEmpty from '@/components/list-table-empty.vue'
import { useListTableEmpty } from '@/composables/use-list-table-empty'
import type { SchoolOptionRecord } from '@/types/modules/membership'
import type {
  DriverRecord as DriverRow,
  DriverRecord as Row
} from '@/types/modules/school-bus-driver'
import { normalizeArray, normalizePaged } from '@/utils/api-response-normalize'
import { isSpreadsheetFilename } from '@/utils/school-bus'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUniI18n, toUniOptions, useUniListState } from 'uni-ui-lib'
import type { UniTableAction, UniTableRequest } from 'uni-ui-lib'
import { computed, ref, nextTick, onMounted, watch } from 'vue'

const { locale, t } = useUniI18n()

const fileRef = ref<HTMLInputElement | null>(null)

const initialFilters = {
  schoolIds: undefined as string | number | undefined,
  keyword: '',
  status: undefined as string | number | undefined
}
const { queryModel, filters, tableRef, search, reset, handleLoadSuccess, refreshTable } =
  useUniListState({
    initialFilters
  })
const schoolRecords = ref<SchoolOptionRecord[]>([])
const schoolOptions = computed(() =>
  toUniOptions(schoolRecords.value, {
    labelKeys: locale() === 'en' ? ['enName', 'name'] : ['name', 'cnName', 'enName'],
    valueKey: 'id'
  })
)
const formVisible = ref(false)
const formMode = ref<'add' | 'edit' | 'look'>('add')
const activeRow = ref<Row | null>(null)

/** 与旧系统一致：仅一所学校时列表默认带 schoolIds，新增表单默认勾选该校 */
const defaultSchoolId = computed(() =>
  schoolRecords.value.length === 1 ? schoolRecords.value[0].id : null
)

const statusOptions = computed(() => statusOpts(t))
const searchCfg = computed(() =>
  searchForm(t, schoolOptions.value, statusOptions.value, defaultSchoolId.value ?? undefined)
)
const columns = computed(() => tableCols(t, schoolOptions.value, statusOptions.value))

const loadData: UniTableRequest = async ({ pageNo: current, pageSize: size, filters: f }) => {
  const result = await schoolBusDriverApi.page.get({ current, size, ...f })
  const { list, total: pageTotal } = normalizePaged<Row>(result)

  return {
    data: list,
    total: pageTotal
  }
}

const openForm = (mode: 'add' | 'edit' | 'look', row?: Row) => {
  formMode.value = mode
  activeRow.value = row ?? null
  formVisible.value = true
}

const actions = computed<UniTableAction[]>(() => [
  {
    label: t('schoolBus.look'),
    onClick: (row) => openForm('look', row as Row)
  },
  {
    label: t('schoolBus.edit'),
    code: 'busdriver_edit',
    onClick: (row) => openForm('edit', row as Row)
  }
])

const downloadImportTemplate = async () => {
  await schoolBusDriverApi.template.download()
}

onMounted(async () => {
  const raw = await membershipApi.school.get()
  schoolRecords.value = normalizeArray(raw) as SchoolOptionRecord[]
})

/** 校区加载后：单校默认带 schoolIds；刷新表格以应用列 options */
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

const selection = ref<DriverRow[]>([])
const ids = computed(() => selection.value.map((item) => item.id))

const onSelectionChange = (rows: DriverRow[]) => {
  selection.value = rows
}

const onImportFile = async (e: Event) => {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]

  input.value = ''

  if (!file) {
    return
  }

  if (!isSpreadsheetFilename(file.name)) {
    ElMessage.warning(t('schoolBus.importInvalidType'))
    return
  }

  if (file.size > IMPORT_MAX_BYTES) {
    ElMessage.warning(t('schoolBus.importTooLarge'))
    return
  }

  try {
    await schoolBusDriverApi.import.post(file)
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
    await ElMessageBox.confirm(t('schoolBus.confirmDeleteDriver'), t('schoolBus.delete'), {
      confirmButtonText: t('schoolBus.submit'),
      cancelButtonText: t('schoolBus.cancel'),
      type: 'warning'
    })
  } catch {
    return
  }

  await schoolBusDriverApi.delete.delete(ids.value)
  ElMessage.success(t('schoolBus.deleteSuccess'))
  selection.value = []
  void refreshTable()
}
</script>

<style scoped lang="scss">
.school-bus-driver-page {
  &__file {
    position: absolute;
    width: 0;
    height: 0;
    opacity: 0;
    pointer-events: none;
  }
}
</style>
