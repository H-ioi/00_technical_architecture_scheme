<template>
  <section class="uni-list-page">
    <div class="uni-list-page__header">
      <div>
        <h1>{{ $t('content.schoolLife.pageTitle') }}</h1>
        <p>{{ $t('content.schoolLife.pageDesc') }}</p>
      </div>
      <div class="uni-list-page__header-actions">
        <el-button v-uni-permission="'schoollife_add'" type="primary" @click="openForm('add')">
          {{ $t('content.add') }}
        </el-button>
      </div>
    </div>

    <UniSearchForm
      v-model="queryModel"
      :config="searchCfg"
      :collapsed="true"
      :collapsed-rows="1"
      :action-min-span="0"
      :submit-text="$t('content.search')"
      :reset-text="$t('content.reset')"
      @search="search"
      @reset="onReset"
    />

    <UniDataTable
      ref="tableRef"
      row-key="id"
      :columns="columns"
      :request="loadData"
      :filters="filters"
      :pagination="{ pageSize: 10, pageSizes: [10, 20, 50, 100] }"
      :toolbar="{ refresh: true, density: true, columnSetting: true }"
      :actions="actions"
      :action-column="{ width: 120, fixed: 'right' }"
      @load-success="tableEmpty.onLoadSuccess"
      @request-error="tableEmpty.onRequestError"
    >
      <template #empty>
        <ListTableEmpty :kind="tableEmpty.kind" @reset="onReset" @retry="tableEmpty.retry" />
      </template>
    </UniDataTable>

    <SchoolLifeFormDialog
      v-model:visible="formVisible"
      :mode="formMode"
      :record-id="activeId"
      :school-options="schoolOptions"
      :type-options="typeOptions"
      @saved="refreshTable"
    />
  </section>
</template>

<script setup lang="ts">
import SchoolLifeFormDialog from './components/form-dialog.vue'
import { boolFilterOpts, boolTagOpts, searchForm, tableCols } from './list.config'
import { contentCommonApi, contentMomentApi } from '@/api'
import ListTableEmpty from '@/components/list-table-empty/index.vue'
import { useListTableEmpty } from '@/composables/use-list-table-empty'
import type { SchoolOptionRecord } from '@/types/modules/membership'
import type { MomentTypeRecord } from '@/types/modules/content-moment'
import type { ContentMomentRecord as Row } from '@/types/modules/content-moment'
import { normalizeArray, normalizePaged } from '@/utils/api-response-normalize'
import { ElMessage, ElMessageBox } from 'element-plus'
import dayjs from 'dayjs'
import { useUniI18n, toUniOptions, useUniListState } from 'uni-ui-lib'
import type { UniTableAction, UniTableRequest } from 'uni-ui-lib'
import { computed, nextTick, onMounted, ref, watch } from 'vue'

const { locale, t } = useUniI18n()

const initialFilters = {
  title: '',
  schoolId: undefined as string | number | undefined,
  type: undefined as string | number | undefined,
  visible: undefined as boolean | undefined
}
const { queryModel, filters, tableRef, search, reset, handleLoadSuccess, refreshTable } =
  useUniListState({ initialFilters })

const schoolRecords = ref<SchoolOptionRecord[]>([])
const typeRecords = ref<MomentTypeRecord[]>([])

const schoolOptions = computed(() =>
  toUniOptions(schoolRecords.value, {
    labelKeys: locale() === 'en' ? ['enName', 'cnName'] : ['cnName', 'enName', 'name'],
    valueKey: 'id'
  })
)
const typeOptions = computed(() =>
  toUniOptions(typeRecords.value, {
    labelKeys: locale() === 'en' ? ['enName', 'name'] : ['name', 'enName'],
    valueKey: 'type'
  })
)

const defaultSchoolId = computed(() =>
  schoolRecords.value.length === 1 ? schoolRecords.value[0].id : null
)

const boolOptions = computed(() => boolTagOpts(t))
const boolFilterOptions = computed(() => boolFilterOpts(t))

const searchCfg = computed(() =>
  searchForm(
    t,
    schoolOptions.value,
    typeOptions.value,
    boolFilterOptions.value,
    defaultSchoolId.value ?? undefined
  )
)
const columns = computed(() => tableCols(t, boolOptions.value))

const formVisible = ref(false)
const formMode = ref<'add' | 'edit'>('add')
const activeId = ref<string | number | null>(null)

function formatRow(row: Row): Row {
  const next = { ...row }
  if (next.createdAt) {
    next.createdAt = dayjs(next.createdAt).format('YYYY-MM-DD HH:mm')
  }
  if (next.updatedAt) {
    next.updatedAt = dayjs(next.updatedAt).format('YYYY-MM-DD HH:mm')
  }
  return next
}

const loadData: UniTableRequest = async ({ pageNo: current, pageSize: size, filters: f }) => {
  const result = await contentMomentApi.page.get({ current, size, ...f })
  const { list, total: pageTotal } = normalizePaged<Row>(result)

  return {
    data: list.map(formatRow),
    total: pageTotal
  }
}

const openForm = (mode: 'add' | 'edit', row?: Row) => {
  formMode.value = mode
  activeId.value = row?.id ?? null
  formVisible.value = true
}

const removeRow = async (row: Row) => {
  try {
    await ElMessageBox.confirm(t('content.schoolLife.confirmDelete'), t('content.delete'), {
      confirmButtonText: t('content.submit'),
      cancelButtonText: t('content.cancel'),
      type: 'warning'
    })
  } catch {
    return
  }

  await contentMomentApi.delete.post({ id: row.id })
  ElMessage.success(t('content.deleteSuccess'))
  void refreshTable()
}

const actions = computed<UniTableAction[]>(() => [
  {
    label: t('content.edit'),
    code: 'schoollife_edit',
    onClick: (row) => openForm('edit', row as Row)
  },
  {
    label: t('content.delete'),
    code: 'schoollife_del',
    onClick: (row) => void removeRow(row as Row)
  }
])

const onReset = () => {
  reset()
  if (defaultSchoolId.value != null) {
    queryModel.schoolId = defaultSchoolId.value
  }
}

onMounted(async () => {
  const [schoolRaw, typeRaw] = await Promise.all([
    contentCommonApi.schoolList.get(),
    contentCommonApi.momentTypeList.get()
  ])
  schoolRecords.value = normalizeArray(schoolRaw) as SchoolOptionRecord[]
  typeRecords.value = normalizeArray(typeRaw) as MomentTypeRecord[]
})

watch(
  () => schoolRecords.value,
  (records) => {
    if (records.length === 1) {
      queryModel.schoolId = records[0].id
    }
    if (records.length > 0) {
      nextTick(() => tableRef.value?.refresh())
    }
  }
)

const tableEmpty = useListTableEmpty(filters, { tableRef, afterLoadSuccess: handleLoadSuccess })
</script>
