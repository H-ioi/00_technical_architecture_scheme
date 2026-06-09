<template>
  <section class="uni-list-page">
    <div class="uni-list-page__header">
      <div>
        <h1>{{ $t('dorm.attribute.pageTitle') }}</h1>
        <p>{{ $t('dorm.attribute.pageDesc') }}</p>
      </div>
      <div class="uni-list-page__header-actions">
        <el-button v-uni-permission="'attribute-add'" type="primary" @click="openForm('add')">
          {{ $t('dorm.attribute.add') }}
        </el-button>
      </div>
    </div>

    <UniSearchForm
      v-model="queryModel"
      :config="searchCfg"
      :collapsed="false"
      :action-min-span="0"
      :submit-text="$t('dorm.common.search')"
      :reset-text="$t('dorm.common.reset')"
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
      :action-column="{ width: 100, fixed: 'right' }"
      @selection-change="onSelectionChange"
      @load-success="tableEmpty.onLoadSuccess"
      @request-error="tableEmpty.onRequestError">
      <template #toolbar>
        <el-button
          v-uni-permission="'attribute-delete'"
          type="danger"
          :disabled="selectedIds.length === 0"
          @click="removeBatch">
          {{ $t('dorm.common.delete') }}
        </el-button>
      </template>
      <template #empty>
        <ListTableEmpty :kind="tableEmpty.kind" @reset="onReset" @retry="tableEmpty.retry" />
      </template>
    </UniDataTable>

    <AttributeFormDialog
      v-model:visible="formVisible"
      :mode="formMode"
      :record-id="activeId"
      :school-options="schoolOptions"
      :default-school-id="defaultSchoolId ?? undefined"
      @saved="refreshTable" />
  </section>
</template>

<script setup lang="ts">
import AttributeFormDialog from './components/form-dialog.vue'
import { searchForm, tableCols } from './list.config'
import { dormProjectApi, membershipApi } from '@/api'
import ListTableEmpty from '@/components/list-table-empty/index.vue'
import { useListTableEmpty } from '@/composables/use-list-table-empty'
import type { SchoolOptionRecord } from '@/types/modules/membership'
import type { DormProjectRecord as Row } from '@/types/modules/dorm-project'
import { normalizeArray, normalizePaged } from '@/utils/api-response-normalize'
import { ElMessage, ElMessageBox } from 'element-plus'
import { UniDataTable, UniSearchForm, useUniI18n, toUniOptions, useUniListState } from 'uni-ui-lib'
import type { UniTableAction, UniTableRequest } from 'uni-ui-lib'
import { computed, nextTick, onMounted, ref, watch } from 'vue'

const { t } = useUniI18n()

const initialFilters = {
  schoolId: undefined as string | number | undefined
}
const { queryModel, filters, tableRef, search, reset, handleLoadSuccess, refreshTable } =
  useUniListState({ initialFilters })

const schoolRecords = ref<SchoolOptionRecord[]>([])
const selection = ref<Row[]>([])

const schoolOptions = computed(() =>
  toUniOptions(schoolRecords.value, {
    labelKeys: ['enName', 'cnName', 'name'],
    valueKey: 'externId'
  }).map((item, index) => ({
    ...item,
    value: item.value ?? schoolRecords.value[index]?.id
  }))
)

const defaultSchoolId = computed(() => {
  if (schoolRecords.value.length !== 1) {
    return null
  }
  const school = schoolRecords.value[0]
  return school.externId ?? school.id
})

const searchCfg = computed(() =>
  searchForm(t, schoolOptions.value, defaultSchoolId.value ?? undefined)
)
const columns = computed(() => tableCols(t))
const selectedIds = computed(() => selection.value.map((item) => item.id))

const formVisible = ref(false)
const formMode = ref<'add' | 'edit'>('add')
const activeId = ref<string | number | null>(null)

const loadData: UniTableRequest = async ({ pageNo: current, pageSize: size, filters: f }) => {
  const result = await dormProjectApi.page.get({
    current,
    size,
    schoolId: f?.schoolId as string | number | undefined
  })
  const { list, total: pageTotal } = normalizePaged<Row>(result)

  return {
    data: list.map((row) => ({
      ...row,
      schoolName: row.school?.en_name || row.school?.cn_name || '—',
      statusLabel:
        String(row.is_active) === '1'
          ? t('dorm.building.statusActive')
          : t('dorm.building.statusInactive')
    })),
    total: pageTotal
  }
}

const onSelectionChange = (rows: Row[]) => {
  selection.value = rows
}

const onReset = () => {
  reset()
  if (defaultSchoolId.value != null) {
    queryModel.value.schoolId = defaultSchoolId.value
    filters.value.schoolId = defaultSchoolId.value
  }
  selection.value = []
  void nextTick(() => search())
}

const openForm = (mode: 'add' | 'edit', row?: Row) => {
  formMode.value = mode
  activeId.value = row?.id ?? null
  formVisible.value = true
}

const removeBatch = async () => {
  if (selectedIds.value.length === 0) {
    ElMessage.warning(t('dorm.attribute.selectRows'))
    return
  }

  try {
    await ElMessageBox.confirm(t('dorm.attribute.confirmBatchDelete'), t('dorm.attribute.confirmTitle'), {
      confirmButtonText: t('dorm.common.delete'),
      cancelButtonText: t('dorm.common.cancel'),
      type: 'warning'
    })
  } catch {
    return
  }

  await dormProjectApi.deleteBatch.post({ ids: selectedIds.value.join(',') })
  ElMessage.success(t('dorm.common.deleteSuccess'))
  selection.value = []
  void refreshTable()
}

const actions = computed<UniTableAction[]>(() => [
  {
    label: t('dorm.common.edit'),
    code: 'attribute-edit',
    onClick: (row) => openForm('edit', row as Row)
  }
])

const tableEmpty = useListTableEmpty(ref({}), { tableRef, afterLoadSuccess: handleLoadSuccess })

watch(defaultSchoolId, (schoolId) => {
  if (schoolId != null && queryModel.value.schoolId == null) {
    queryModel.value.schoolId = schoolId
    filters.value.schoolId = schoolId
  }
})

onMounted(async () => {
  const raw = await membershipApi.school.get()
  schoolRecords.value = normalizeArray<SchoolOptionRecord>(raw)

  if (defaultSchoolId.value != null) {
    queryModel.value.schoolId = defaultSchoolId.value
    filters.value.schoolId = defaultSchoolId.value
  }
})
</script>
